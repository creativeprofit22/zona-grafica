import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div>
        <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 8 }}>404</h1>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>
          This page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          style={{ color: "var(--accent)", textDecoration: "underline" }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
