import type { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let getClientIp: typeof import("../rate-limit").getClientIp;
let checkRateLimit: typeof import("../rate-limit").checkRateLimit;

function makeRequest(headers: Record<string, string> = {}): NextRequest {
  return new Request("http://localhost", {
    headers: new Headers(headers),
  }) as unknown as NextRequest;
}

describe("rate-limit", () => {
  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("../rate-limit");
    getClientIp = mod.getClientIp;
    checkRateLimit = mod.checkRateLimit;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    delete process.env.VERCEL;
    delete process.env.TRUSTED_PROXY_IPS;
  });

  describe("getClientIp", () => {
    it("extracts first IP from x-forwarded-for on Vercel", () => {
      process.env.VERCEL = "1";
      const req = makeRequest({
        "x-forwarded-for": "1.2.3.4, 5.6.7.8",
      });
      expect(getClientIp(req)).toBe("1.2.3.4");
    });

    it("extracts from x-forwarded-for when TRUSTED_PROXY_IPS is set", () => {
      process.env.TRUSTED_PROXY_IPS = "10.0.0.1";
      const req = makeRequest({
        "x-forwarded-for": "9.8.7.6",
      });
      expect(getClientIp(req)).toBe("9.8.7.6");
    });

    it("ignores x-forwarded-for without Vercel or trusted proxies", () => {
      const req = makeRequest({
        "x-forwarded-for": "1.2.3.4",
        "x-real-ip": "10.0.0.5",
      });
      expect(getClientIp(req)).toBe("10.0.0.5");
    });

    it("falls back to x-real-ip", () => {
      const req = makeRequest({ "x-real-ip": "192.168.1.1" });
      expect(getClientIp(req)).toBe("192.168.1.1");
    });

    it('falls back to "unknown" when no headers present', () => {
      const req = makeRequest({});
      expect(getClientIp(req)).toBe("unknown");
    });
  });

  describe("checkRateLimit", () => {
    it("allows requests within limit", () => {
      expect(checkRateLimit("test-key", 3, 60_000)).toBe(true);
      expect(checkRateLimit("test-key", 3, 60_000)).toBe(true);
      expect(checkRateLimit("test-key", 3, 60_000)).toBe(true);
    });

    it("blocks requests exceeding limit", () => {
      expect(checkRateLimit("block-key", 2, 60_000)).toBe(true);
      expect(checkRateLimit("block-key", 2, 60_000)).toBe(true);
      expect(checkRateLimit("block-key", 2, 60_000)).toBe(false);
    });

    it("resets after window expires", () => {
      vi.useFakeTimers();

      expect(checkRateLimit("expire-key", 1, 1_000)).toBe(true);
      expect(checkRateLimit("expire-key", 1, 1_000)).toBe(false);

      vi.advanceTimersByTime(1_001);

      expect(checkRateLimit("expire-key", 1, 1_000)).toBe(true);
    });

    it("tracks different keys independently", () => {
      expect(checkRateLimit("key-a", 1, 60_000)).toBe(true);
      expect(checkRateLimit("key-b", 1, 60_000)).toBe(true);
      expect(checkRateLimit("key-a", 1, 60_000)).toBe(false);
      expect(checkRateLimit("key-b", 1, 60_000)).toBe(false);
    });

    it("cleans up old entries after CLEANUP_INTERVAL", () => {
      vi.useFakeTimers();

      checkRateLimit("old-key", 5, 1_000);

      vi.advanceTimersByTime(61_000);

      checkRateLimit("new-key", 5, 1_000);

      expect(checkRateLimit("old-key", 1, 1_000)).toBe(true);
    });
  });
});
