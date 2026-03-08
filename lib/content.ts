import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/schema";

export async function getContent<T = unknown>(key: string): Promise<T | null> {
  const [row] = await db
    .select({ value: contentBlocks.value })
    .from(contentBlocks)
    .where(eq(contentBlocks.key, key))
    .limit(1);
  return (row?.value as T) ?? null;
}

export async function setContent(key: string, value: unknown) {
  const [row] = await db
    .insert(contentBlocks)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: contentBlocks.key,
      set: { value, updatedAt: new Date() },
    })
    .returning();
  return row;
}

export async function listContent() {
  return db.select().from(contentBlocks).orderBy(contentBlocks.key);
}
