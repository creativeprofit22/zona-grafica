"use client";
export default function ViewsLineChart({ data }: { data: unknown[] }) {
  return (
    <div>Views chart ({Array.isArray(data) ? data.length : 0} entries)</div>
  );
}
