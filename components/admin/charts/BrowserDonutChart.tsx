"use client";
export default function BrowserDonutChart({ data }: { data: unknown[] }) {
  return <div>Browser chart ({Array.isArray(data) ? data.length : 0} entries)</div>;
}
