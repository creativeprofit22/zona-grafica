import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockValues, mockInsert } = vi.hoisted(() => {
  const mockValues = vi.fn().mockResolvedValue(undefined);
  const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
  return { mockValues, mockInsert };
});

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockReturnValue(true),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

vi.mock("@/lib/db", () => ({
  db: { insert: mockInsert },
}));

vi.mock("@/lib/schema", () => ({
  pageViews: Symbol("pageViews"),
}));

import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { POST } from "../route";

function makeRequest(
  body: unknown,
  opts?: { userAgent?: string; country?: string },
): NextRequest {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (opts?.userAgent !== undefined) headers["user-agent"] = opts.userAgent;
  if (opts?.country) headers["x-vercel-ip-country"] = opts.country;

  return new Request("http://localhost/api/track", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe("POST /api/track", () => {
  const originalEnv = process.env.DATABASE_URL;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockReturnValue(true);
    mockInsert.mockReturnValue({ values: mockValues });
    mockValues.mockResolvedValue(undefined);
    process.env.DATABASE_URL = "postgres://localhost/test";
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.DATABASE_URL = originalEnv;
    } else {
      delete process.env.DATABASE_URL;
    }
  });

  it("returns 200 for valid tracking data", async () => {
    const res = await POST(makeRequest({ path: "/servicios" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });

  it("returns 400 when path is missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("path");
  });

  it("returns 400 when path exceeds 2048 chars", async () => {
    const res = await POST(makeRequest({ path: "x".repeat(2049) }));
    expect(res.status).toBe(400);
  });

  it("returns 429 when rate limited", async () => {
    vi.mocked(checkRateLimit).mockReturnValue(false);
    const res = await POST(makeRequest({ path: "/" }));
    expect(res.status).toBe(429);
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("http://localhost/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "broken",
    }) as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("skips DB insert when DATABASE_URL is not set", async () => {
    delete process.env.DATABASE_URL;
    const res = await POST(makeRequest({ path: "/" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, skipped: true });
  });

  it("parses mobile user agent correctly", async () => {
    const res = await POST(
      makeRequest({ path: "/" }, { userAgent: "Mozilla/5.0 (iPhone; CPU)" }),
    );
    expect(res.status).toBe(200);
    // Verify the values call included device: mobile
    const valuesArg = mockValues.mock.calls[0]?.[0];
    expect(valuesArg?.device).toBe("mobile");
  });

  it("parses tablet user agent correctly", async () => {
    const res = await POST(
      makeRequest({ path: "/" }, { userAgent: "Mozilla/5.0 (iPad; CPU)" }),
    );
    expect(res.status).toBe(200);
    const valuesArg = mockValues.mock.calls[0]?.[0];
    expect(valuesArg?.device).toBe("tablet");
  });

  it("parses desktop user agent as default", async () => {
    const res = await POST(
      makeRequest({ path: "/" }, { userAgent: "Mozilla/5.0 (Windows NT 10)" }),
    );
    expect(res.status).toBe(200);
    const valuesArg = mockValues.mock.calls[0]?.[0];
    expect(valuesArg?.device).toBe("desktop");
  });

  it("detects Chrome browser", async () => {
    await POST(
      makeRequest({ path: "/" }, { userAgent: "Mozilla/5.0 Chrome/120.0" }),
    );
    const valuesArg = mockValues.mock.calls[0]?.[0];
    expect(valuesArg?.browser).toBe("Chrome");
  });

  it("detects Firefox browser", async () => {
    await POST(
      makeRequest({ path: "/" }, { userAgent: "Mozilla/5.0 Firefox/120.0" }),
    );
    const valuesArg = mockValues.mock.calls[0]?.[0];
    expect(valuesArg?.browser).toBe("Firefox");
  });

  it("detects Safari browser", async () => {
    await POST(
      makeRequest({ path: "/" }, { userAgent: "Mozilla/5.0 Safari/537.36" }),
    );
    const valuesArg = mockValues.mock.calls[0]?.[0];
    expect(valuesArg?.browser).toBe("Safari");
  });

  it("detects Edge browser", async () => {
    await POST(
      makeRequest({ path: "/" }, { userAgent: "Mozilla/5.0 Edg/120.0" }),
    );
    const valuesArg = mockValues.mock.calls[0]?.[0];
    expect(valuesArg?.browser).toBe("Edge");
  });

  it("handles missing user-agent header", async () => {
    // Request without user-agent header explicitly set
    const req = new Request("http://localhost/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/" }),
    }) as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("passes optional UTM and referrer fields", async () => {
    await POST(
      makeRequest({
        path: "/",
        referrer: "https://google.com",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "spring",
      }),
    );
    const valuesArg = mockValues.mock.calls[0]?.[0];
    expect(valuesArg?.referrer).toBe("https://google.com");
    expect(valuesArg?.utmSource).toBe("google");
    expect(valuesArg?.utmMedium).toBe("cpc");
    expect(valuesArg?.utmCampaign).toBe("spring");
  });
});
