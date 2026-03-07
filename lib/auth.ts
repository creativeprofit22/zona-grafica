import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "dd_admin_session";

function signToken(payload: string): string {
  const secret = process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD!;
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return false;

  const dotIdx = session.value.indexOf(".");
  if (dotIdx === -1) return false;

  const payload = session.value.slice(0, dotIdx);
  const sig = session.value.slice(dotIdx + 1);
  if (!payload || !sig) return false;

  const secret = process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const expected = signToken(payload);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

export async function login(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  // Constant-time comparison via hashing (handles different lengths safely)
  const pwHash = crypto.createHash("sha256").update(password).digest();
  const adminHash = crypto.createHash("sha256").update(adminPassword).digest();
  if (!crypto.timingSafeEqual(pwHash, adminHash)) return false;

  const payload = Date.now().toString();
  const sig = signToken(payload);
  const token = `${payload}.${sig}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return true;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
