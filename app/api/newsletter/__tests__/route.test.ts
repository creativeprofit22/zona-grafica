import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockOnConflictDoNothing, mockValues, mockInsert } = vi.hoisted(() => {
  const mockOnConflictDoNothing = vi.fn().mockResolvedValue(undefined);
  const mockValues = vi
    .fn()
    .mockReturnValue({ onConflictDoNothing: mockOnConflictDoNothing });
  const mockInsert = vi.fn().mockReturnValue({ values: mockValues });
  return { mockOnConflictDoNothing, mockValues, mockInsert };
});

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockReturnValue(true),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

vi.mock("@/lib/db", () => ({
  db: { insert: mockInsert },
}));

vi.mock("@/lib/schema", () => ({
  newsletterSubscribers: { email: Symbol("email") },
}));

import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { POST } from "../route";

function makeRequest(body: unknown): NextRequest {
  return new Request("http://localhost/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe("POST /api/newsletter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockReturnValue(true);
    mockInsert.mockReturnValue({ values: mockValues });
    mockValues.mockReturnValue({
      onConflictDoNothing: mockOnConflictDoNothing,
    });
    mockOnConflictDoNothing.mockResolvedValue(undefined);
  });

  it("returns 200 for valid email", async () => {
    const res = await POST(makeRequest({ email: "test@example.com" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Email");
  });

  it("returns 400 for invalid email format", async () => {
    const res = await POST(makeRequest({ email: "notanemail" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Invalid email");
  });

  it("returns 400 for email without domain", async () => {
    const res = await POST(makeRequest({ email: "user@" }));
    expect(res.status).toBe(400);
  });

  it("returns 429 when rate limited", async () => {
    vi.mocked(checkRateLimit).mockReturnValue(false);
    const res = await POST(makeRequest({ email: "test@example.com" }));
    expect(res.status).toBe(429);
  });

  it("handles duplicate email gracefully via onConflictDoNothing", async () => {
    // onConflictDoNothing means no error even for duplicates
    const res = await POST(makeRequest({ email: "dup@example.com" }));
    expect(res.status).toBe(200);
    expect(mockOnConflictDoNothing).toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("http://localhost/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "broken",
    }) as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 when DB fails", async () => {
    mockOnConflictDoNothing.mockRejectedValue(new Error("DB error"));
    const res = await POST(makeRequest({ email: "test@example.com" }));
    expect(res.status).toBe(500);
  });

  it("lowercases email before insert", async () => {
    await POST(makeRequest({ email: "Test@Example.COM" }));
    expect(mockValues).toHaveBeenCalledWith({ email: "test@example.com" });
  });
});
