import { beforeEach, describe, expect, it, vi } from "vitest";

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
  contactSubmissions: Symbol("contactSubmissions"),
}));

import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { POST } from "../route";

function makeRequest(body: unknown): NextRequest {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockReturnValue(true);
    mockInsert.mockReturnValue({ values: mockValues });
    mockValues.mockResolvedValue(undefined);
  });

  const validBody = {
    name: "Juan",
    projectType: "Branding",
    contact: "juan@example.com",
    message: "Necesito un logo",
  };

  it("returns 200 for valid submission", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
    expect(mockInsert).toHaveBeenCalled();
  });

  it("returns 400 when name is missing", async () => {
    const { name: _, ...body } = validBody;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("nombre");
  });

  it("returns 400 when name is empty string", async () => {
    const res = await POST(makeRequest({ ...validBody, name: "   " }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when projectType is missing", async () => {
    const { projectType: _, ...body } = validBody;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("proyecto");
  });

  it("returns 400 when contact is missing", async () => {
    const { contact: _, ...body } = validBody;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("correo");
  });

  it("returns 400 when contact is empty string", async () => {
    const res = await POST(makeRequest({ ...validBody, contact: "   " }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when message is missing", async () => {
    const { message: _, ...body } = validBody;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("proyecto");
  });

  it("returns 400 when message is empty string", async () => {
    const res = await POST(makeRequest({ ...validBody, message: "   " }));
    expect(res.status).toBe(400);
  });

  it("returns 429 when rate limited", async () => {
    vi.mocked(checkRateLimit).mockReturnValue(false);
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toBeTruthy();
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    }) as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 when DB insert fails", async () => {
    mockValues.mockRejectedValue(new Error("DB error"));
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
  });
});
