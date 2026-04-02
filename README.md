# Zona Gráfica

Creative agency website for a design studio based in San Miguel de Allende, Mexico. Portfolio, services, blog, contact — plus an admin CMS to manage everything.

Bilingual (Spanish/English) out of the box. Every page works in both languages with zero duplication.

## What's Built

- **Home** — Hero with GSAP animations, client marquee, stats counter, testimonials, FAQ accordion
- **Portfolio** — Filterable project gallery with case study pages, video embeds, and image reveals
- **Services** — Service cards with process timeline and call-to-action sections
- **About** — Studio story, team section, values grid with parallax effects
- **Blog** — MDX-powered posts with syntax highlighting, pull quotes, and SEO metadata
- **Contact** — Form with rate limiting, business info, and Google Maps integration
- **Admin Panel** — Content CMS, analytics dashboard with charts, session-based auth

## Design

Custom visual identity — no component libraries, no templates:

- **Fonts**: Clash Display (headings) + Satoshi (body)
- **Palette**: Paper whites, ink blacks, green accent (`#2AA876`), ochre highlights
- **Effects**: Custom cursor, smooth scroll, page transitions, scroll progress, magnetic buttons, parallax drift, image reveal animations

## Tech

| Layer | Stack |
|-------|-------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, CSS Modules, GSAP |
| Language | TypeScript 5.9 (strict) |
| Database | PostgreSQL via Drizzle ORM |
| Blog | MDX with custom components |
| i18n | next-intl (ES/EN) |
| Testing | Playwright E2E |
| Linting | Biome |
| Runtime | Bun |

## Structure

```
app/
  [locale]/(site)/     # Public pages — home, portfolio, services, about, blog, contact
  (admin)/admin/       # CMS and analytics
  api/                 # Contact form, content, newsletter, tracking
components/            # 62 components organized by page and function
content/blog/          # MDX blog posts
data/                  # Static content (home, work, services, about, clients, FAQ)
lib/                   # Auth, database, blog engine, rate limiting, JSON-LD
messages/              # i18n translation files
```

## Run Locally

```bash
bun install
bun run dev
```

Open http://localhost:3000.

## Built By

[Douro Digital](https://wearedouro.agency)
