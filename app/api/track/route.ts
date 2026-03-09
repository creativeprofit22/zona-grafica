import { type NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

function parseUserAgent(ua: string) {
  let device = "desktop";
  if (/mobile|android|iphone|ipod/i.test(ua)) device = "mobile";
  else if (/tablet|ipad/i.test(ua)) device = "tablet";

  let browser = "other";
  if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua)) browser = "Safari";

  return { device, browser };
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    if (!checkRateLimit(`track:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
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
    const { path, referrer, utmSource, utmMedium, utmCampaign } =
      body as Record<string, unknown>;

    if (!path || typeof path !== "string" || path.length > 2048) {
      return NextResponse.json({ error: "path required" }, { status: 400 });
    }

    const ua = request.headers.get("user-agent") || "";
    const { device, browser } = parseUserAgent(ua);
    const country = request.headers.get("x-vercel-ip-country") || null;

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const { db } = await import("@/lib/db");
    const { pageViews } = await import("@/lib/schema");

    await db.insert(pageViews).values({
      path: path.slice(0, 2048),
      referrer: typeof referrer === "string" ? referrer.slice(0, 2048) : null,
      utmSource: typeof utmSource === "string" ? utmSource.slice(0, 256) : null,
      utmMedium: typeof utmMedium === "string" ? utmMedium.slice(0, 256) : null,
      utmCampaign:
        typeof utmCampaign === "string" ? utmCampaign.slice(0, 256) : null,
      country,
      device,
      browser,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const cause = (err as { cause?: { code?: string } })?.cause;
    if (cause?.code === "ECONNREFUSED" || cause?.code === "ENOTFOUND") {
      return NextResponse.json({ ok: true, skipped: true });
    }
    console.error("Tracking error:", err);
    return NextResponse.json({ error: "tracking failed" }, { status: 500 });
  }
}
