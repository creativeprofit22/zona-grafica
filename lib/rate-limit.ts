const rateLimit = new Map<string, number[]>();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60_000; // prune stale keys every 60s

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, timestamps] of rateLimit) {
    const valid = timestamps.filter((t) => now - t < windowMs);
    if (valid.length === 0) {
      rateLimit.delete(key);
    } else {
      rateLimit.set(key, valid);
    }
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  cleanup(windowMs);
  const now = Date.now();
  const timestamps = rateLimit.get(key) ?? [];
  const valid = timestamps.filter((t) => now - t < windowMs);

  if (valid.length >= limit) {
    rateLimit.set(key, valid);
    return false;
  }

  valid.push(now);
  rateLimit.set(key, valid);
  return true;
}
