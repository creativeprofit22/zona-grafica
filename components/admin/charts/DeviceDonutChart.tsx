"use client";
export default function DeviceDonutChart({ data }: { data: unknown[] }) {
  return <div>Device chart ({Array.isArray(data) ? data.length : 0} entries)</div>;
}
