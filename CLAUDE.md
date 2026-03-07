# Zona Gráfica

Creative agency website for Jesús Herrera. San Miguel de Allende, Mexico. Sales demo.

## Stack

Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger · Lenis · Drizzle + PostgreSQL · MDX

## Commands

```bash
bun run dev          # Dev server
npx tsc --noEmit     # Type check
npx next build       # Build
bun run lint         # Biome
```

## Structure

```
app/(site)/        — pages: home, portafolio, servicios, nosotros, contacto, blog
app/(admin)/admin/ — admin panel (CMS, analytics)
app/api/           — endpoints (content, newsletter, track)
components/        — by domain (home/, portfolio/, layout/, about/, contact/, etc.)
data/              — static content (home.ts, work.ts, services.ts, about.ts, site.ts, clients.ts)
lib/               — utils, db, auth, blog, content adapter
types/content.ts   — content interfaces
public/fonts/      — Clash Display + Satoshi
```

## Design Tokens

```
--bg-paper: #FAF9F6    --bg-cream: #F2EDE7    --bg-ink: #1A1714
--accent: #C45D3E      --accent-hover: #D4714F --ochre: #D4893F
--ink-blue: #2A3F5F    --stone: #C4B9A8
--fg-dark: #1A1714     --fg-light: #FAF9F6
--muted: #7A756E       --muted-light: #B0A99F
```

Light default. `data-theme="dark"` for ink sections. `data-theme="cream"` for alternating.

## Principles

1. Light dominant — paper/cream default, dark is exception
2. Typography IS the design — mixed sizes, annotations, editorial rhythm
3. Every section different — no cookie-cutter layouts
4. Real content only — no placeholders
5. Spanish with personality — conversational, not corporate
6. Rooted in SMA — Jesús's real story, cultural references
