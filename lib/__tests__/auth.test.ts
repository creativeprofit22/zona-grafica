import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => mockCookieStore),
}));

import { login, logout, verifySession } from "../auth";

describe("auth", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SESSION_SECRET = "test-secret-key-for-signing";
    process.env.ADMIN_PASSWORD = "correct-password";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe("verifySession", () => {
    it("returns false when no session cookie exists", async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      expect(await verifySession()).toBe(false);
    });

    it("returns false when cookie value has no dot separator", async () => {
      mockCookieStore.get.mockReturnValue({ value: "nodot" });
      expect(await verifySession()).toBe(false);
    });

    it("returns false when SESSION_SECRET is missing", async () => {
      delete process.env.SESSION_SECRET;
      mockCookieStore.get.mockReturnValue({ value: "payload.signature" });
      expect(await verifySession()).toBe(false);
    });

    it("returns false for invalid signature", async () => {
      mockCookieStore.get.mockReturnValue({
        value: "payload.invalidsignature",
      });
      expect(await verifySession()).toBe(false);
    });
  });

  describe("login", () => {
    it("returns false when ADMIN_PASSWORD is not set", async () => {
      delete process.env.ADMIN_PASSWORD;
      expect(await login("anything")).toBe(false);
    });

    it("returns false with wrong password", async () => {
      expect(await login("wrong-password")).toBe(false);
      expect(mockCookieStore.set).not.toHaveBeenCalled();
    });

    it("returns true and sets cookie with correct password", async () => {
      expect(await login("correct-password")).toBe(true);
      expect(mockCookieStore.set).toHaveBeenCalledTimes(1);
      const [cookieName, cookieValue, options] =
        mockCookieStore.set.mock.calls[0];
      expect(cookieName).toBe("dd_admin_session");
      expect(cookieValue).toContain(".");
      expect(options.httpOnly).toBe(true);
      expect(options.sameSite).toBe("lax");
      expect(options.path).toBe("/");
    });

    it("verifies session after successful login", async () => {
      await login("correct-password");
      const [, cookieValue] = mockCookieStore.set.mock.calls[0];
      mockCookieStore.get.mockReturnValue({ value: cookieValue });
      expect(await verifySession()).toBe(true);
    });
  });

  describe("logout", () => {
    it("deletes the session cookie", async () => {
      await logout();
      expect(mockCookieStore.delete).toHaveBeenCalledWith("dd_admin_session");
    });
  });
});
