# Zona Gráfica

Creative agency website for Jesús Herrera. San Miguel de Allende, Mexico. Sales demo.

## Stack

Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger · Lenis · Drizzle + PostgreSQL · MDX · Playwright

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
components/        — by domain: home/, portfolio/, services/, about/, contact/, blog/,
                     case-study/, layout/, animations/, effects/, ui/, admin/ (charts/)
data/              — static content (home, work, services, about, site, clients, blog, faq)
lib/               — utils, db, auth, blog, content adapter, jsonld, rate-limit, schema
types/             — content.ts, webkit-fullscreen.d.ts
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

## Animation Patterns

The codebase already has established GSAP patterns — follow these, don't invent new ones:

- **useGSAP scope pattern**: `components/home/HeroSection.tsx` — sectionRef + useGSAP with timeline, `.animItem` class for stagger targets
- **ScrollTrigger counters**: `components/home/StatsStrip.tsx` — GSAP textContent tween with snap for integer counting
- **ImageReveal**: `components/animations/ImageReveal.tsx` — clip-path wipe with direction, delay, duration, scaleReveal props
- **ParallaxDrift**: `components/animations/ParallaxDrift.tsx` — scroll-linked parallax via GSAP scrub
- **MotionSection**: `components/animations/MotionSection.tsx` — simple scroll reveal wrapper
- **Effects layer**: `components/effects/` — CustomCursor, PageTransition, RouteProgress, ScrollColorTransition, ScrollProgress, SmoothScroll (Lenis)
- **MagneticButton**: `components/ui/MagneticButton.tsx` — hover-magnetic interaction

CSS convention: `.animItem { opacity: 0; }` as initial state, GSAP sets final values.

## Current Phase

Site-Wide Animation & Visual Upgrade — 10 chunks, executed via `scripts/run-plan.sh`
