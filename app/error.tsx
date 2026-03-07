"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Something went wrong</h1>
        <p style={{ color: "var(--muted)", marginBottom: 24 }}>
          An error occurred while loading this page.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "var(--fg)",
            color: "var(--bg)",
            border: "none",
            padding: "10px 24px",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
