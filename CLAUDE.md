# Zona Gráfica

Creative agency website for Jesús Herrera (San Miguel de Allende, Mexico). Portfolio, services, blog, and admin CMS.

**Stack**: Next.js 16, React 19, TypeScript 5.9, GSAP, Drizzle ORM (PostgreSQL), MDX, Biome, Playwright, Bun

## Commands

```bash
bun run dev          # Dev server (port 3000)
npx tsc --noEmit     # Type check
bun run lint         # Biome lint + format (biome check .)
npx next build       # Production build
```

## Structure

```
app/
  (site)/            # Public pages: home, portafolio, servicios, nosotros, contacto, blog
  (admin)/admin/     # Admin panel (CMS, analytics)
  api/               # Route handlers: contact, content, newsletter, track
components/
  home/              # Hero, stats, testimonials, CTA, accordion, marquee
  portfolio/         # Gallery, filtering, video embeds
  services/          # Hero, list, cards, process
  about/             # Hero, story, team, values
  blog/              # Cards, headers, grids, MDX components (mdx/)
  case-study/        # Narrative, gallery, testimonial, related
  contact/           # Form, info, hero
  animations/        # ImageReveal, ParallaxDrift, MotionSection
  effects/           # CustomCursor, SmoothScroll, PageTransition, ScrollProgress
  layout/            # Navbar, Footer, NewsletterForm
  ui/                # MagneticButton, PullQuote, SectionNumber
  admin/             # Charts
data/                # Static content (home, work, services, about, site, clients, blog, faq)
lib/                 # Auth, db, blog, content adapter, jsonld, rate-limit, schema
types/               # TypeScript type definitions
content/blog/        # MDX blog posts
public/fonts/        # Clash Display + Satoshi
e2e/                 # Playwright tests
```

## Organization Rules

- Pages in `app/` with route groups `(site)` and `(admin)`
- Components in `components/` by domain, one per file
- CSS Modules per component, globals in `app/globals.css`
- Static content in `data/*.ts`, blog in `content/*.mdx`
- Utilities in `lib/`, types in `types/`
- Path alias: `@/*` maps to project root

## Design Tokens

```
--bg-paper: #FAF9F6   --bg-cream: #F2EDE7   --bg-ink: #1A1714
--accent: #2AA876     --accent-hover: #34B67A --ochre: #F5A623
--fg-dark: #1A1714    --fg-light: #FAF9F6
--muted: #7A756E      --muted-light: #B0A99F
```

Light default. `data-theme="dark"` for ink sections. `data-theme="cream"` for alternating.

## Design Principles

1. Light dominant — paper/cream default, dark is exception
2. Typography IS the design — mixed sizes, editorial rhythm
3. Every section different — no cookie-cutter layouts
4. Real content only — no placeholders
5. Spanish with personality — conversational, not corporate

## Animation Patterns

Follow established GSAP patterns — don't invent new ones:

- **useGSAP scope**: `components/home/HeroSection.tsx` — sectionRef + timeline, `.animItem` for staggers
- **ScrollTrigger counters**: `components/home/StatsStrip.tsx` — textContent tween with snap
- **Reusable wrappers**: `components/animations/` — ImageReveal, ParallaxDrift, MotionSection
- **Effects**: `components/effects/` — CustomCursor, PageTransition, SmoothScroll (Lenis)
- **MagneticButton**: `components/ui/MagneticButton.tsx`

CSS convention: `.animItem { opacity: 0; }` as initial state, GSAP sets final values.

## Code Quality — Zero Tolerance

After editing ANY file, run:

```bash
npx tsc --noEmit && bun run lint
```

Fix ALL errors/warnings before continuing.
