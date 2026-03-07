import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Zona Gráfica — Estudio Creativo en San Miguel de Allende";

export default async function Image() {
  const clashData = await fetch(
    new URL("../../public/fonts/clash-display.woff2", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#1A1714",
        padding: "60px 80px",
        fontFamily: "Clash Display",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grain dots decoration */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.04,
          display: "flex",
          background:
            "radial-gradient(circle at 20% 30%, #FAF9F6 1px, transparent 1px), radial-gradient(circle at 80% 70%, #FAF9F6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Terracotta accent bar top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          backgroundColor: "#C45D3E",
          display: "flex",
        }}
      />

      {/* Poster-composition typography */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {/* "zona" — medium, offset right */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            paddingLeft: "200px",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 600,
              color: "#FAF9F6",
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}
          >
            zona
          </span>
        </div>

        {/* "GRÁFICA" — massive, dominant */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            paddingLeft: "40px",
            marginTop: -8,
          }}
        >
          <span
            style={{
              fontSize: 160,
              fontWeight: 700,
              color: "#FAF9F6",
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
              textTransform: "uppercase",
            }}
          >
            GRÁFICA
          </span>
        </div>

        {/* "(estudio creativo)" — annotation */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "120px",
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: "#C45D3E",
              fontStyle: "italic",
              letterSpacing: "0.05em",
              lineHeight: 1,
            }}
          >
            (estudio creativo)
          </span>
        </div>

        {/* "diseño que habla →" — medium */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            paddingLeft: "80px",
            marginTop: 20,
            gap: 24,
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 500,
              color: "#D4893F",
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}
          >
            diseño que
          </span>
          <span
            style={{
              fontSize: 52,
              fontWeight: 600,
              color: "#FAF9F6",
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}
          >
            habla →
          </span>
        </div>
      </div>

      {/* Footnotes at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", gap: 40 }}>
          <span
            style={{
              fontSize: 15,
              color: "#7A756E",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            ✦ San Miguel de Allende, GTO
          </span>
          <span
            style={{
              fontSize: 15,
              color: "#7A756E",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            ✦ Desde 1993
          </span>
        </div>
        <span
          style={{
            fontSize: 14,
            color: "#B0A99F",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          zonagrafica.com.mx
        </span>
      </div>

      {/* Terracotta accent bar bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 5,
          backgroundColor: "#C45D3E",
          display: "flex",
        }}
      />
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Clash Display",
          data: clashData,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
