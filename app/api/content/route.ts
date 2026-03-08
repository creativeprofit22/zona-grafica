import { type NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { setContent } from "@/lib/content";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  const ip = getClientIp(request);

  if (!checkRateLimit(`content:${ip}`, 20, 60_000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const authenticated = await verifySession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { key, value } = body;

  if (!key || typeof key !== "string") {
    return NextResponse.json({ error: "Key is required" }, { status: 400 });
  }

  const block = await setContent(key, value);
  return NextResponse.json(block);
}
