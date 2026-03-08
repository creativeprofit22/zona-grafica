# Zona Gráfica

Creative agency website for Jesús Herrera (San Miguel de Allende, Mexico). Portfolio, services, blog, and admin CMS.

**Stack**: Next.js 16, React 19, TypeScript 5.9, GSAP, Drizzle ORM, MDX, Biome, Playwright, Bun

## Commands

```bash
bun run dev          # Dev server (port 3000)
npx tsc --noEmit     # Type check
npx next build       # Production build
bun run lint         # Biome lint + format
```

## Structure

```
app/
  (site)/            # Public pages: home, portafolio, servicios, nosotros, contacto, blog
  (admin)/admin/     # Admin panel (CMS, analytics)
  api/               # Route handlers: contact, content, newsletter, track
components/
  home/              # Hero, stats, testimonials, CTA
  portfolio/         # Gallery & filtering
  services/          # Accordion & offerings
  about/             # Team, story, values
  blog/              # Post cards, headers, grids
  case-study/        # Case study narrative & gallery
  contact/           # Form & info
  animations/        # ImageReveal, ParallaxDrift, MotionSection, TextReveal
  effects/           # CustomCursor, SmoothScroll, PageTransition, ScrollProgress
  layout/            # Navbar, Footer
  ui/                # MagneticButton, generic UI
  admin/             # Admin charts
data/                # Static content (home, work, services, about, site, clients, blog, faq)
lib/                 # Auth, db, blog, content adapter, jsonld, rate-limit, schema
types/               # TypeScript type definitions
content/             # MDX blog posts
public/fonts/        # Clash Display + Satoshi
e2e/                 # Playwright tests
```

## Organization Rules

- Pages → `app/` with route groups `(site)` and `(admin)`
- Components → `components/` by domain, one per file
- Static content → `data/*.ts`, blog → `content/*.mdx`
- Utilities → `lib/`, types → `types/`
- CSS Modules per component, globals in `app/globals.css`
- Path alias: `@/*` maps to project root

## Design Tokens

```
--bg-paper: #FAF9F6   --bg-cream: #F2EDE7   --bg-ink: #1A1714
--accent: #2AA876     --accent-hover: #34B67A --ochre: #F5A623
--fg-dark: #1A1714    --fg-light: #FAF9F6
--muted: #7A756E      --muted-light: #B0A99F
```

Light default. `data-theme="dark"` for ink sections. `data-theme="cream"` for alternating.

## Principles

1. Light dominant — paper/cream default, dark is exception
2. Typography IS the design — mixed sizes, editorial rhythm
3. Every section different — no cookie-cutter layouts
4. Real content only — no placeholders
5. Spanish with personality — conversational, not corporate

## Animation Patterns

Follow established GSAP patterns — don't invent new ones:

- **useGSAP scope**: `components/home/HeroSection.tsx` — sectionRef + timeline, `.animItem` for staggers
- **ScrollTrigger counters**: `components/home/StatsStrip.tsx` — textContent tween with snap
- **ImageReveal**: `components/animations/ImageReveal.tsx` — clip-path wipe
- **ParallaxDrift**: `components/animations/ParallaxDrift.tsx` — scroll-linked parallax
- **MotionSection**: `components/animations/MotionSection.tsx` — scroll reveal wrapper
- **Effects**: `components/effects/` — CustomCursor, PageTransition, SmoothScroll (Lenis)
- **MagneticButton**: `components/ui/MagneticButton.tsx` — hover-magnetic interaction

CSS convention: `.animItem { opacity: 0; }` as initial state, GSAP sets final values.

## Current Phase

v2 visual upgrade complete — all 16 chunks implemented. Editorial typography, GSAP animations, vertical timelines, portfolio grid with Flip transitions, and per-service visual themes are all in place.

## Code Quality — Zero Tolerance

After editing ANY file, run:

```bash
npx tsc --noEmit && bun run lint
```

Fix ALL errors/warnings before continuing.
