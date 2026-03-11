import { mkdir } from "node:fs/promises";
import { join } from "node:path";
/**
 * Generate gradient placeholder images for portfolio projects.
 * Each image uses SMA-inspired color gradients with project initials.
 * Run: bun scripts/generate-portfolio-placeholders.ts
 */
import sharp from "sharp";

const OUTPUT_DIR = join(
  new URL(".", import.meta.url).pathname,
  "../public/images/portfolio",
);

// SMA palette gradients - each project gets a unique combo
const GRADIENTS: [string, string][] = [
  ["#C45D3E", "#D4893F"], // terracotta → ochre
  ["#2A3F5F", "#1A1714"], // ink-blue → ink
  ["#D4893F", "#C4B9A8"], // ochre → stone
  ["#1A1714", "#2A3F5F"], // ink → ink-blue
  ["#C45D3E", "#1A1714"], // terracotta → ink
  ["#C4B9A8", "#D4893F"], // stone → ochre
  ["#2A3F5F", "#C45D3E"], // ink-blue → terracotta
  ["#D4893F", "#1A1714"], // ochre → ink
  ["#1A1714", "#C45D3E"], // ink → terracotta
  ["#C4B9A8", "#2A3F5F"], // stone → ink-blue
  ["#C45D3E", "#2A3F5F"], // terracotta → ink-blue
  ["#D4893F", "#C45D3E"], // ochre → terracotta
];

interface ImageSpec {
  filename: string;
  initials: string;
  width: number;
  height: number;
  gradientIndex: number;
}

const images: ImageSpec[] = [
  // ─── Portfolio Thumbnails (800×600) ───────────────────────
  {
    filename: "giff-thumb.jpg",
    initials: "GF",
    width: 800,
    height: 600,
    gradientIndex: 0,
  },
  {
    filename: "cervantino-thumb.jpg",
    initials: "FC",
    width: 800,
    height: 600,
    gradientIndex: 1,
  },
  {
    filename: "cardo-cafe-thumb.jpg",
    initials: "CC",
    width: 800,
    height: 600,
    gradientIndex: 2,
  },
  {
    filename: "lobby-thumb.jpg",
    initials: "LB",
    width: 800,
    height: 600,
    gradientIndex: 3,
  },
  {
    filename: "duncan-thumb.jpg",
    initials: "DG",
    width: 800,
    height: 600,
    gradientIndex: 4,
  },
  {
    filename: "zeferino-thumb.jpg",
    initials: "ZM",
    width: 800,
    height: 600,
    gradientIndex: 5,
  },
  {
    filename: "sma-475-thumb.jpg",
    initials: "475",
    width: 800,
    height: 600,
    gradientIndex: 6,
  },
  {
    filename: "guanajuato-patrimonio-thumb.jpg",
    initials: "GP",
    width: 800,
    height: 600,
    gradientIndex: 7,
  },
  {
    filename: "consejo-turistico-thumb.jpg",
    initials: "CT",
    width: 800,
    height: 600,
    gradientIndex: 8,
  },
  {
    filename: "prospecta-thumb.jpg",
    initials: "PR",
    width: 800,
    height: 600,
    gradientIndex: 9,
  },
  {
    filename: "casa-misha-thumb.jpg",
    initials: "CM",
    width: 800,
    height: 600,
    gradientIndex: 10,
  },
  {
    filename: "geek-thumb.jpg",
    initials: "GK",
    width: 800,
    height: 600,
    gradientIndex: 11,
  },
  {
    filename: "cpi-thumb.jpg",
    initials: "CPI",
    width: 800,
    height: 600,
    gradientIndex: 0,
  },
  {
    filename: "giff-retratos-thumb.jpg",
    initials: "GR",
    width: 800,
    height: 600,
    gradientIndex: 1,
  },
  {
    filename: "artes-mexico-thumb.jpg",
    initials: "AM",
    width: 800,
    height: 600,
    gradientIndex: 2,
  },
  {
    filename: "cervantino-carteles-thumb.jpg",
    initials: "CC",
    width: 800,
    height: 600,
    gradientIndex: 3,
  },
  {
    filename: "personajes-thumb.jpg",
    initials: "PJ",
    width: 800,
    height: 600,
    gradientIndex: 4,
  },
  {
    filename: "giff-web-thumb.jpg",
    initials: "GW",
    width: 800,
    height: 600,
    gradientIndex: 5,
  },
  {
    filename: "duncan-web-thumb.jpg",
    initials: "DW",
    width: 800,
    height: 600,
    gradientIndex: 6,
  },

  // ─── Case Study Hero (1600×900) ───────────────────────────
  {
    filename: "cardo-cafe-hero.jpg",
    initials: "CC",
    width: 1600,
    height: 900,
    gradientIndex: 2,
  },

  // ─── Case Study Gallery (1200×800 full, 600×800 half) ─────
  {
    filename: "cardo-cafe-01.jpg",
    initials: "CC¹",
    width: 1200,
    height: 800,
    gradientIndex: 2,
  },
  {
    filename: "cardo-cafe-02.jpg",
    initials: "CC²",
    width: 600,
    height: 800,
    gradientIndex: 5,
  },
  {
    filename: "cardo-cafe-03.jpg",
    initials: "CC³",
    width: 600,
    height: 800,
    gradientIndex: 7,
  },
  {
    filename: "cardo-cafe-04.jpg",
    initials: "CC⁴",
    width: 1200,
    height: 800,
    gradientIndex: 10,
  },

  // ─── Service Hero Images (1200×800) ───────────────────────
  {
    filename: "branding-hero.jpg",
    initials: "BR",
    width: 1200,
    height: 800,
    gradientIndex: 0,
  },
  {
    filename: "editorial-hero.jpg",
    initials: "ED",
    width: 1200,
    height: 800,
    gradientIndex: 7,
  },
  {
    filename: "web-hero.jpg",
    initials: "WB",
    width: 1200,
    height: 800,
    gradientIndex: 1,
  },
  {
    filename: "foto-hero.jpg",
    initials: "FT",
    width: 1200,
    height: 800,
    gradientIndex: 4,
  },
  {
    filename: "ilustracion-hero.jpg",
    initials: "IL",
    width: 1200,
    height: 800,
    gradientIndex: 6,
  },
  {
    filename: "carteleria-hero.jpg",
    initials: "CT",
    width: 1200,
    height: 800,
    gradientIndex: 8,
  },
];

function createSVG(spec: ImageSpec): string {
  const [color1, color2] = GRADIENTS[spec.gradientIndex % GRADIENTS.length]!;
  const { width, height, initials } = spec;

  // Calculate font size based on image dimensions and initials length
  const baseFontSize = Math.min(width, height) * 0.25;
  const fontSize = initials.length > 2 ? baseFontSize * 0.7 : baseFontSize;

  // Subtle diagonal line pattern for texture
  const lineSpacing = Math.min(width, height) * 0.06;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
    <pattern id="lines" patternUnits="userSpaceOnUse" width="${lineSpacing}" height="${lineSpacing}" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="${lineSpacing}" style="stroke:rgba(255,255,255,0.04);stroke-width:1" />
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <rect width="${width}" height="${height}" fill="url(#lines)" />
  <text
    x="${width / 2}"
    y="${height / 2}"
    font-family="sans-serif"
    font-weight="200"
    font-size="${fontSize}"
    fill="rgba(255,255,255,0.15)"
    text-anchor="middle"
    dominant-baseline="central"
    letter-spacing="${fontSize * 0.15}"
  >${initials}</text>
  <text
    x="${width - 24}"
    y="${height - 16}"
    font-family="monospace"
    font-size="11"
    fill="rgba(255,255,255,0.12)"
    text-anchor="end"
  >zona gráfica</text>
</svg>`;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  let generated = 0;
  const errors: string[] = [];

  for (const spec of images) {
    const outPath = join(OUTPUT_DIR, spec.filename);
    const svg = createSVG(spec);

    try {
      await sharp(Buffer.from(svg))
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(outPath);
      generated++;
      console.log(`  ✓ ${spec.filename} (${spec.width}×${spec.height})`);
    } catch (err) {
      const msg = `  ✗ ${spec.filename}: ${err}`;
      errors.push(msg);
      console.error(msg);
    }
  }

  console.log(
    `\n${generated}/${images.length} images generated in public/images/portfolio/`,
  );
  if (errors.length) {
    console.error(`${errors.length} error(s)`);
    process.exit(1);
  }
}

main();
