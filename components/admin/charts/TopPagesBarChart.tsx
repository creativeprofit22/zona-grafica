"use client";
export default function TopPagesBarChart({ data, title }: { data: unknown[]; title?: string }) {
  return <div>Top pages ({Array.isArray(data) ? data.length : 0} entries)</div>;
}
