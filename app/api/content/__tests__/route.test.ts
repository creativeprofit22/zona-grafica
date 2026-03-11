import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockReturnValue(true),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

vi.mock("@/lib/auth", () => ({
  verifySession: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/lib/content", () => ({
  setContent: vi.fn().mockResolvedValue({
    key: "hero.title",
    value: "Hola",
    updatedAt: new Date(),
  }),
}));

import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";
import { setContent } from "@/lib/content";
import { checkRateLimit } from "@/lib/rate-limit";
import { PUT } from "../route";

function makeRequest(body: unknown): NextRequest {
  return new Request("http://localhost/api/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe("PUT /api/content", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockReturnValue(true);
    vi.mocked(verifySession).mockResolvedValue(true);
    vi.mocked(setContent).mockResolvedValue({
      key: "hero.title",
      value: "Hola",
      updatedAt: new Date(),
    } as never);
  });

  it("returns 200 for valid authenticated update", async () => {
    const res = await PUT(
      makeRequest({ key: "hero.title", value: "Nuevo título" }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.key).toBe("hero.title");
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(verifySession).mockResolvedValue(false);
    const res = await PUT(makeRequest({ key: "hero.title", value: "test" }));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 400 when key is missing", async () => {
    const res = await PUT(makeRequest({ value: "test" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Key");
  });

  it("returns 400 when key is empty string", async () => {
    const res = await PUT(makeRequest({ key: "", value: "test" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when key is not a string", async () => {
    const res = await PUT(makeRequest({ key: 123, value: "test" }));
    expect(res.status).toBe(400);
  });

  it("returns 413 when payload exceeds 50KB", async () => {
    const largeValue = "x".repeat(60_000);
    const res = await PUT(makeRequest({ key: "test", value: largeValue }));
    expect(res.status).toBe(413);
    const json = await res.json();
    expect(json.error).toContain("50KB");
  });

  it("returns 429 when rate limited", async () => {
    vi.mocked(checkRateLimit).mockReturnValue(false);
    const res = await PUT(makeRequest({ key: "hero.title", value: "test" }));
    expect(res.status).toBe(429);
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("http://localhost/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    }) as unknown as NextRequest;
    const res = await PUT(req);
    expect(res.status).toBe(400);
  });

  it("calls setContent with correct arguments", async () => {
    await PUT(
      makeRequest({ key: "footer.text", value: { html: "<p>Hi</p>" } }),
    );
    expect(setContent).toHaveBeenCalledWith("footer.text", {
      html: "<p>Hi</p>",
    });
  });

  it("checks auth before rate limit (401 before 429)", async () => {
    vi.mocked(verifySession).mockResolvedValue(false);
    vi.mocked(checkRateLimit).mockReturnValue(false);
    const res = await PUT(makeRequest({ key: "test", value: "x" }));
    // Auth is checked first in the route
    expect(res.status).toBe(401);
  });
});
