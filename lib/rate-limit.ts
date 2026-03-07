const rateLimit = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
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
