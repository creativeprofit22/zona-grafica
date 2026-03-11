import { type NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { setContent } from "@/lib/content";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  try {
    const authenticated = await verifySession();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ip = getClientIp(request);

    if (!checkRateLimit(`content:${ip}`, 20, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const raw = JSON.stringify(body);
    if (raw.length > 50_000) {
      return NextResponse.json(
        { error: "Payload too large (max 50KB)" },
        { status: 413 },
      );
    }

    const { key, value } = body as { key: unknown; value: unknown };

    if (!key || typeof key !== "string") {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const block = await setContent(key, value);
    return NextResponse.json(block);
  } catch (err) {
    console.error("Content update error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
