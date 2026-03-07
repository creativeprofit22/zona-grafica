import { verifySession } from "@/lib/auth";
import { listContent, setContent } from "@/lib/content";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await verifySession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const blocks = await listContent();
  return NextResponse.json(blocks);
}

export async function PUT(request: NextRequest) {
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
