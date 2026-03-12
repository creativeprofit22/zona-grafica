/**
 * Generate the OG image for Zona Gráfica.
 *
 * Layout (1200×630):
 * Left side: Editorial typography (Clash Display) on ink background
 * Right side: Angled grid of 6 portfolio thumbnails
 * Top/bottom: Terracotta accent bars
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

const INK = "#1A1714";
const PAPER = "#FAF9F6";
const ACCENT = "#C45D3E";
const MUTED = "#7A756E";
const OCHRE = "#D4893F";

const portfolioImages = [
  "cervantino-carteles-thumb.jpg",
  "cardo-cafe-thumb.jpg",
  "giff-thumb.jpg",
  "casa-misha-thumb.jpg",
  "foto-san-miguel-thumb.jpg",
  "artes-mexico-thumb.jpg",
];

async function generateOG() {
  const root = join(import.meta.dir, "..");

  // Load Clash Display as base64 for SVG embedding
  const clashFontBuf = readFileSync(
    join(root, "public/fonts/clash-display.ttf"),
  );
  const clashB64 = clashFontBuf.toString("base64");

  // Load and resize portfolio thumbnails
  const thumbW = 210;
  const thumbH = 158;
  const thumbs = await Promise.all(
    portfolioImages.map(async (filename) => {
      const buf = await sharp(join(root, "public/images/portfolio", filename))
        .resize(thumbW, thumbH, { fit: "cover" })
        .png()
        .toBuffer();
      return buf;
    }),
  );

  // Create base canvas
  const canvas = sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: INK,
    },
  });

  const composites: sharp.OverlayOptions[] = [];

  // --- Top accent bar ---
  const accentBar = await sharp({
    create: { width: WIDTH, height: 5, channels: 4, background: ACCENT },
  })
    .png()
    .toBuffer();
  composites.push({ input: accentBar, top: 0, left: 0 });
  composites.push({ input: accentBar, top: HEIGHT - 5, left: 0 });

  // --- Portfolio grid (right side, slightly offset with subtle border) ---
  const gridLeft = 720;
  const gridTop = 45;
  const gap = 14;
  const cols = 2;

  for (let i = 0; i < thumbs.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = gridLeft + col * (thumbW + gap);
    const y = gridTop + row * (thumbH + gap);

    // Create thumbnail with rounded corners and subtle border
    const roundedThumb = await sharp(thumbs[i])
      .composite([
        {
          input: Buffer.from(
            `<svg width="${thumbW}" height="${thumbH}">
              <rect x="0" y="0" width="${thumbW}" height="${thumbH}" rx="8" ry="8" fill="white"/>
            </svg>`,
          ),
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer();

    // Create a container with border
    const borderW = thumbW + 4;
    const borderH = thumbH + 4;
    const withBorder = await sharp({
      create: {
        width: borderW,
        height: borderH,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      },
    })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${borderW}" height="${borderH}">
              <rect x="0" y="0" width="${borderW}" height="${borderH}" rx="9" ry="9"
                    fill="none" stroke="rgba(250,249,246,0.12)" stroke-width="1.5"/>
            </svg>`,
          ),
          top: 0,
          left: 0,
        },
        { input: roundedThumb, top: 2, left: 2 },
      ])
      .png()
      .toBuffer();

    composites.push({ input: withBorder, top: y, left: x });
  }

  // --- Left-side gradient fade to blend into grid ---
  const gradientSvg = `<svg width="180" height="${HEIGHT}">
    <defs>
      <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${INK}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${INK}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="180" height="${HEIGHT}" fill="url(#fade)"/>
  </svg>`;
  const gradient = await sharp(Buffer.from(gradientSvg)).png().toBuffer();
  composites.push({ input: gradient, top: 0, left: 620 });

  // --- Main typography (SVG with embedded Clash Display font) ---
  const textSvg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @font-face {
            font-family: 'Clash';
            src: url('data:font/truetype;base64,${clashB64}') format('truetype');
            font-weight: 600;
          }
        </style>
      </defs>

      <!-- "zona" — lighter, tracked out -->
      <text x="80" y="185"
            font-family="Clash, sans-serif" font-size="58" font-weight="600"
            fill="${PAPER}" letter-spacing="10" opacity="0.6">zona</text>

      <!-- "GRÁFICA" — massive hero text -->
      <text x="73" y="290"
            font-family="Clash, sans-serif" font-size="136" font-weight="600"
            fill="${PAPER}" letter-spacing="-3">GRÁFICA</text>

      <!-- Terracotta rule -->
      <line x1="80" y1="320" x2="360" y2="320"
            stroke="${ACCENT}" stroke-width="3" stroke-linecap="round"/>

      <!-- "(estudio creativo)" annotation -->
      <text x="380" y="317"
            font-family="Georgia, serif" font-size="17" font-style="italic"
            fill="${ACCENT}" letter-spacing="1.5" opacity="0.9">(estudio creativo)</text>

      <!-- Location + year -->
      <text x="80" y="380"
            font-family="Clash, sans-serif" font-size="19" font-weight="600"
            fill="${MUTED}" letter-spacing="2">San Miguel de Allende  ·  Desde 1993</text>

      <!-- Services -->
      <text x="80" y="430"
            font-family="Clash, sans-serif" font-size="14" font-weight="600"
            fill="${OCHRE}" letter-spacing="4">BRANDING  ·  EDITORIAL  ·  WEB  ·  FOTOGRAFÍA</text>

      <!-- Bottom URL -->
      <text x="80" y="${HEIGHT - 30}"
            font-family="Clash, sans-serif" font-size="12" font-weight="600"
            fill="${MUTED}" letter-spacing="3" opacity="0.5">ZONAGRAFICA.COM.MX</text>

      <!-- Decorative diamond -->
      <text x="330" y="${HEIGHT - 28}"
            font-family="sans-serif" font-size="10"
            fill="${ACCENT}" opacity="0.4">◆</text>
    </svg>
  `;

  composites.push({ input: Buffer.from(textSvg), top: 0, left: 0 });

  // --- Generate final ---
  const output = await canvas
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toBuffer();

  const outputPath = join(root, "public/og-image.png");
  await Bun.write(outputPath, output);

  console.log(
    `✅ OG image generated: ${outputPath} (${(output.length / 1024).toFixed(1)} KB)`,
  );
}

generateOG().catch(console.error);
