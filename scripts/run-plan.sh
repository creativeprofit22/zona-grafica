#!/bin/bash
set -eo pipefail

PROJECT_DIR="/mnt/e/Projects/zona-grafica"
LOG_DIR="$PROJECT_DIR/.claude/logs"
CHECK_CMD="npx tsc --noEmit"
FEATURE_NAME="Site Refresh v2 — Full Creative Overhaul"
TOTAL_CHUNKS=16

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

START_CHUNK=1
SKIP_FINAL_CHECK=false
CLEANUP_EVERY=0

while [[ $# -gt 0 ]]; do
  case $1 in
    --start) START_CHUNK="$2"; shift 2 ;;
    --skip-final-check) SKIP_FINAL_CHECK=true; shift ;;
    --cleanup-every) CLEANUP_EVERY="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

mkdir -p "$LOG_DIR"

echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Plan Executor - $FEATURE_NAME${NC}"
echo -e "${BLUE}  $TOTAL_CHUNKS chunks, starting from $START_CHUNK${NC}"
[[ "$CLEANUP_EVERY" -gt 0 ]] && echo -e "${BLUE}  CLAUDE.md cleanup every $CLEANUP_EVERY chunks${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
echo ""

PREV_CONTEXT=""
CHUNKS_SINCE_CLEANUP=0

capture_context() {
  cd "$PROJECT_DIR"
  PREV_CONTEXT=$(git diff --stat HEAD 2>/dev/null || echo "")
}

run_quality_gate() {
  local num=$1
  local gate_log="$LOG_DIR/gate-${num}.log"

  echo -e "${CYAN}  Running quality gate...${NC}"
  cd "$PROJECT_DIR"

  if eval "$CHECK_CMD" > "$gate_log" 2>&1; then
    echo -e "${GREEN}  ✓ Quality gate passed${NC}"
    return 0
  else
    echo -e "${YELLOW}  ⚠ Quality gate failed — spawning fix pass...${NC}"
    local errors
    errors=$(cat "$gate_log")
    local fix_log="$LOG_DIR/fix-${num}.log"

    claude --dangerously-skip-permissions --max-turns 20 \
      -p "$(cat <<FIXPROMPT
Fix quality check errors in zona-grafica at $PROJECT_DIR

Errors:
\`\`\`
$errors
\`\`\`

Rules:
- Read each file mentioned in the errors
- Fix errors with minimal changes — do NOT refactor or improve surrounding code
- Re-run: $CHECK_CMD
- Loop until clean
- Do NOT ask questions
FIXPROMPT
)" < /dev/null 2>&1 | tee "$fix_log"

    if eval "$CHECK_CMD" > "$gate_log" 2>&1; then
      echo -e "${GREEN}  ✓ Fix pass succeeded${NC}"
      return 0
    else
      echo -e "${RED}  ✗ Still failing — continuing anyway${NC}"
      return 1
    fi
  fi
}

run_cleanup() {
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}Running CLAUDE.md cleanup...${NC}"
  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 10 \
    -p "Run /minimal-claude:setup-claude-md to clean up CLAUDE.md at $PROJECT_DIR. Keep it minimal and under 150 lines. Do NOT ask questions." \
    < /dev/null 2>&1 | tee "$LOG_DIR/cleanup.log"
  echo -e "${CYAN}✓ Cleanup done${NC}"
}

# ══════════════════════════════════════════════════════
# CHUNK FUNCTIONS — one per chunk, prompt baked in
# ══════════════════════════════════════════════════════

run_chunk_1() {
  local log="$LOG_DIR/chunk-1.log"
  echo -e "${YELLOW}▶ Chunk 1/$TOTAL_CHUNKS: Chameleon Gradient Typography${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_1_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Research Findings

### Gradient Text (CSS)
```css
.gradientText {
  background: linear-gradient(135deg, var(--accent) 0%, var(--ochre) 50%, var(--purple) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```
Source: Angular, ToolJet, Stripe patterns. Pure CSS, no JS needed.

## Chunk 1/16: Chameleon Gradient Typography

**Read these files first** (do NOT explore beyond this list):
- `components/home/HeroSection.tsx` — find `.grafica` class and how headline[1] renders
- `components/home/HeroSection.module.css` — current `.grafica` styles (72-260px, weight 700, uppercase)
- `components/services/ServicesHero.tsx` — find `.titleAccent` ("hacemos")
- `components/services/ServicesHero.module.css` — current accent styling
- `components/home/ServiceAccordion.tsx` — find `.title` ("Lo que hacemos")
- `components/home/ServiceAccordion.module.css` — current title styles
- `app/globals.css` — verify `--purple` exists, confirm gradient tokens don't exist yet

**Create:** (none)

**Modify:**
- `app/globals.css` — add `--gradient-chameleon`, `--gradient-teal-ochre`, `--gradient-ochre-purple` custom properties
- `components/home/HeroSection.module.css` — add gradient to `.grafica`
- `components/services/ServicesHero.module.css` — add gradient to `.titleAccent`
- `components/home/ServiceAccordion.module.css` — add gradient to `.title`

**What to Build:**
Add chameleon gradient CSS custom properties to globals.css. Apply full 3-color gradient (teal→ochre→purple) to "GRÁFICA" in hero. Apply 2-color gradient (teal→ochre) to "hacemos" in ServicesHero and "Lo que hacemos" in ServiceAccordion title. No JS needed — pure CSS `background-clip: text`.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. "GRÁFICA" shows teal-to-ochre-to-purple gradient. "hacemos" shows teal-to-ochre. No gradient on body text.
CHUNK_1_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_2() {
  local log="$LOG_DIR/chunk-2.log"
  echo -e "${YELLOW}▶ Chunk 2/$TOTAL_CHUNKS: ServiceAccordion Dark Background + Adjusted Styles${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_2_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Chunk 2/16: ServiceAccordion Dark Background + Adjusted Styles

**Read these files first** (do NOT explore beyond this list):
- `components/home/ServiceAccordion.tsx` — current section wrapper, no data-theme
- `components/home/ServiceAccordion.module.css` — border colors, text colors, number opacity
- `app/(site)/page.tsx` — section order on home page
- `app/globals.css` — `[data-theme="dark"]` token overrides

**Create:** (none)

**Modify:**
- `components/home/ServiceAccordion.tsx` — add `data-theme="dark"` to section element
- `components/home/ServiceAccordion.module.css` — adjust `.item` border to `var(--border-dark)`, `.number` color to `var(--fg-light)`, `.name`/`.oneliner` to light text, `.cursorImage` box-shadow for dark bg, `.mobileImage` border treatment

**What to Build:**
Flip ServiceAccordion to dark background. Homepage flow becomes: light hero → cream manifesto → DARK services → light portfolio → cream stats. Adjust all text/border colors for dark context. The cursor-following image should pop with a subtle glow shadow against dark.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. ServiceAccordion renders on dark background. All text legible. Cursor image visible and dramatic against dark. Mobile image cards visible.
CHUNK_2_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_3() {
  local log="$LOG_DIR/chunk-3.log"
  echo -e "${YELLOW}▶ Chunk 3/$TOTAL_CHUNKS: Section-Specific Accent Colors${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_3_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Research Findings

### Section Accent Color Pattern
```css
.servicesSection { --section-accent: var(--accent); }
.portfolioSection { --section-accent: var(--ochre); }
/* Then use var(--section-accent) instead of var(--accent) within section CSS */
```
Source: Obys Agency — accent appears only in typography per page.

## Chunk 3/16: Section-Specific Accent Colors (CSS Custom Properties)

**Read these files first** (do NOT explore beyond this list):
- `app/globals.css` — current `--accent` usage in theme variants
- `components/home/ServiceAccordion.module.css` — all `var(--accent)` references
- `components/home/FeaturedShowcase.module.css` — all `var(--accent)` and `var(--ochre)` references
- `components/home/StatsStrip.module.css` — position-based color assignments
- `components/home/CTASection.module.css` — accent usage

**Create:** (none)

**Modify:**
- `app/globals.css` — add `--section-accent` property defaulting to `var(--accent)`
- `components/home/ServiceAccordion.module.css` — set `--section-accent: var(--accent)` on `.section`, replace `var(--accent)` with `var(--section-accent)`
- `components/home/FeaturedShowcase.module.css` — set `--section-accent: var(--ochre)` on `.section`, replace accent refs
- `components/home/StatsStrip.module.css` — set `--section-accent: var(--purple)` on `.section`
- `components/home/CTASection.module.css` — set `--section-accent: var(--accent)` on `.section`

**What to Build:**
Each home page section gets its own accent color via CSS custom property `--section-accent`. Services = teal, Portfolio showcase = ochre, Stats = purple, CTA = teal. Replace hardcoded `var(--accent)` within each section's CSS module with `var(--section-accent)`. The chameleon palette shifts as user scrolls.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. Services section uses teal accents. Featured showcase uses ochre accents. Stats section uses purple accents. CTA remains teal.
CHUNK_3_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_4() {
  local log="$LOG_DIR/chunk-4.log"
  echo -e "${YELLOW}▶ Chunk 4/$TOTAL_CHUNKS: Purple Gets a Home${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_4_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Chunk 4/16: Purple Gets a Home

**Read these files first** (do NOT explore beyond this list):
- `components/home/StatsStrip.module.css` — `.pos0`-`.pos5` value color assignments
- `components/home/ManifestoSection.module.css` — `.quoteMark` color (currently ochre)
- `components/home/FeaturedShowcase.module.css` — `.projectIndex` last slide
- `components/layout/Footer.module.css` — `.social` links hover
- `components/portfolio/ProjectFilter.module.css` — active filter styling

**Create:** (none)

**Modify:**
- `components/home/StatsStrip.module.css` — change `.pos4 .value` to `var(--purple)` (was no color override)
- `components/home/ManifestoSection.module.css` — change `.quoteMark` from ochre to purple
- `components/layout/Footer.module.css` — add `.social a:hover { color: var(--purple) }` for social links
- `components/portfolio/ProjectFilter.module.css` — add category-specific active colors for poster filter

**What to Build:**
Purple (#7B2FBE) currently appears zero times in component CSS. Place it in 4 strategic locations: stats "5" value, manifesto quote mark, footer social hover, and poster category filter. These are small, high-visibility touchpoints that complete the chameleon palette.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. Purple visible in stats, manifesto quote mark, footer social hover. Palette feels complete across all three chameleon colors.
CHUNK_4_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_5() {
  local log="$LOG_DIR/chunk-5.log"
  echo -e "${YELLOW}▶ Chunk 5/$TOTAL_CHUNKS: Portfolio Bento Grid Layout${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_5_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Research Findings

### Bento Grid (CSS Grid + nth-child)
```css
.grid { grid-template-columns: repeat(12, 1fr); }
.cardFeatured { grid-column: span 8; }
.cardStandard { grid-column: span 4; }
```
Source: react-bits MagicBento, Shopify Dawn collage, kevin-powell portfolio.

## Chunk 5/16: Portfolio Bento Grid Layout

**Read these files first** (do NOT explore beyond this list):
- `components/portfolio/ProjectGrid.tsx` — current 2-col grid, card structure, ImageReveal usage, VideoCard
- `components/portfolio/ProjectGrid.module.css` — `.grid` (repeat(2, 1fr)), `.card`, `.imageWrap` (aspect 4/3)
- `data/work.ts` — projects array, `featured` field on each project
- `types/content.ts` — Project interface (has `featured` boolean)

**Create:** (none)

**Modify:**
- `components/portfolio/ProjectGrid.module.css` — change to 12-col grid, add `.cardFeatured` (span 8) and `.cardStandard` (span 4), alternate featured position via nth-of-type, responsive fallback to 1-col
- `components/portfolio/ProjectGrid.tsx` — conditionally apply featured/standard class based on `project.featured`, add `data-category={project.category}` to each card

**What to Build:**
Replace equal 2-column grid with asymmetric 12-column bento layout. Featured projects (project.featured=true) span 8 columns with landscape aspect ratio. Standard projects span 4 columns with portrait 3:4 ratio. Alternate featured alignment: first featured starts at col 1, second at col 5. Mobile: single column. Add `data-category` attribute to each card for future category-specific styling.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. Featured projects visually larger (2/3 width). Standard projects 1/3 width. Grid feels asymmetric and editorial. Mobile stacks to 1-col.
CHUNK_5_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_6() {
  local log="$LOG_DIR/chunk-6.log"
  echo -e "${YELLOW}▶ Chunk 6/$TOTAL_CHUNKS: Category-Specific Aspect Ratios + Color Badges${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_6_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Research Findings

### Per-Category Hover States
```css
.card[data-category="fotografia"]:hover .image { filter: grayscale(0.6) contrast(1.1); }
.card[data-category="poster"]:hover .image { transform: scale(1.08) rotate(-1deg); }
.card[data-category="web"]:hover .image { transform: perspective(800px) rotateY(-3deg); }
```

## Chunk 6/16: Category-Specific Aspect Ratios + Color Badges

**Read these files first** (do NOT explore beyond this list):
- `components/portfolio/ProjectGrid.tsx` — current card markup, `.category` element
- `components/portfolio/ProjectGrid.module.css` — current `.imageWrap`, `.category`, `.meta`
- `data/work.ts` — project categories (branding, editorial, web, fotografia, ilustracion, poster, video)

**Create:** (none)

**Modify:**
- `components/portfolio/ProjectGrid.module.css` — add `[data-category]` rules for aspect ratios (photography 4:5, web 16:9, branding 1:1, editorial 3:4, poster 2:3, video 16:9). Add `.category::before` colored dot per category. Add category-specific hover states (photo→grayscale, poster→tilt, web→perspective, branding→saturate, editorial→sepia, video→brightness).
- `components/portfolio/ProjectGrid.tsx` — ensure `data-category` is set on the card wrapper (from chunk 5)

**What to Build:**
Each portfolio category gets its own thumbnail aspect ratio reflecting the medium (photography=portrait, web=landscape, branding=square, etc). Add colored dot before category text using `::before` pseudo-element with category-specific colors (branding=teal, foto=ochre, poster=purple, etc). Add category-specific hover states: photography goes monochrome, posters tilt, web gets 3D perspective.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. Different categories show different thumbnail shapes. Category dots are colored. Hover effects vary by category.
CHUNK_6_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_7() {
  local log="$LOG_DIR/chunk-7.log"
  echo -e "${YELLOW}▶ Chunk 7/$TOTAL_CHUNKS: Per-Service Visual Themes${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_7_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Chunk 7/16: Per-Service Visual Themes (ServiceCard Overhaul)

**Read these files first** (do NOT explore beyond this list):
- `components/services/ServiceCard.tsx` — current 3-col grid, reversed prop, ImageReveal usage
- `components/services/ServiceCard.module.css` — grid template, imageCol, number, process pills
- `data/services.ts` — all 7 services with slug, number, title, description, process[], image

**Create:** (none)

**Modify:**
- `components/services/ServiceCard.tsx` — add `data-service={service.slug}` to card div, render different image treatments per slug (web gets browser chrome bar, video gets play overlay)
- `components/services/ServiceCard.module.css` — add per-service rules via `[data-service]`: branding (4px left border), editorial (3:4 aspect), web (12px radius + chrome bar), fotografia (no radius, white inner outline), ilustracion (cream bg, dashed borders), poster (2:3 aspect), video (16:9 + play icon)

**What to Build:**
Each of the 7 services gets a unique visual signature reflecting its medium. Web cards show a faux browser chrome bar above the image. Photography cards have no border-radius with a white inner-border like a photo print mat. Poster cards get 2:3 aspect ratio. Video gets 16:9 with play overlay. Each card's image treatment signals what kind of work this service produces.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. Each service card looks visually distinct. Web has browser chrome. Photo has print mat. Poster is tall. Video is wide with play icon.
CHUNK_7_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_8() {
  local log="$LOG_DIR/chunk-8.log"
  echo -e "${YELLOW}▶ Chunk 8/$TOTAL_CHUNKS: Service Card Layout Breaking${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_8_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Chunk 8/16: Service Card Layout Breaking (Varied Grid Patterns)

**Read these files first** (do NOT explore beyond this list):
- `components/services/ServicesList.tsx` — maps services to ServiceCard with alternating reversed
- `components/services/ServiceCard.tsx` — current grid template (80px 1fr 1fr)
- `components/services/ServiceCard.module.css` — current responsive rules
- `data/services.ts` — service order (7 services)

**Create:** (none)

**Modify:**
- `components/services/ServicesList.tsx` — pass `layout` prop to each ServiceCard based on index (0-1: "wide", 2-3: "compact", 4: "centered", 5-6: "wide")
- `components/services/ServiceCard.tsx` — accept `layout` prop, render different grid structures per layout type
- `components/services/ServiceCard.module.css` — add `.cardWide` (80px 3fr 2fr), `.cardCompact` (single-col vertical stack for 2-up), `.cardCentered` (max-width 700px, margin auto, vertical stack). Responsive: all collapse to single column on mobile.

**What to Build:**
Break the alternating left-right pattern. Cards 1-2 (Branding, Editorial): full-width hero rows with wider image. Cards 3-4 (Web, Foto): side-by-side 2-up layout with vertical stacks. Card 5 (Ilustracion): centered narrow column. Cards 6-7 (Carteleria, Video): full-width rows reversed. ServicesList passes a `layout` prop based on index.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. Services page shows 3 distinct layout patterns across 7 cards. No two consecutive cards look identical. Mobile collapses cleanly.
CHUNK_8_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_9() {
  local log="$LOG_DIR/chunk-9.log"
  echo -e "${YELLOW}▶ Chunk 9/$TOTAL_CHUNKS: Dramatic Service Numbers${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_9_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Chunk 9/16: Dramatic Service Numbers (Watermark Effect)

**Read these files first** (do NOT explore beyond this list):
- `components/services/ServiceCard.tsx` — current `.number` element in `.numberCol`
- `components/services/ServiceCard.module.css` — current number styling (32-48px, ochre, opacity 0.6)

**Create:** (none)

**Modify:**
- `components/services/ServiceCard.module.css` — change `.number` to absolute positioning, `font-size: clamp(120px, 20vw, 300px)`, `opacity: 0.04`, right-aligned, bleeding off card edge. Add `.card:hover .number` transition to `opacity: 0.12` and `translateX(-20px)`.
- `components/services/ServiceCard.tsx` — ensure `.card` has `position: relative; overflow: hidden` for absolute number positioning

**What to Build:**
Transform service numbers from small inline elements to dramatic full-bleed watermarks. Each number (01-07) renders at massive scale (120-300px), nearly invisible (opacity 0.04), positioned absolute behind the card content. On hover, the number drifts left and becomes slightly more visible (opacity 0.12). Creates editorial poster energy.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. Service numbers visible as large watermarks behind content. Hover reveals them slightly with drift. Numbers don't interfere with content readability.
CHUNK_9_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_10() {
  local log="$LOG_DIR/chunk-10.log"
  echo -e "${YELLOW}▶ Chunk 10/$TOTAL_CHUNKS: Editorial Rhythm — Pull Quotes + Section Numbers${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_10_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Chunk 10/16: Editorial Rhythm — Pull Quotes + Section Numbers + Transitions

**Read these files first** (do NOT explore beyond this list):
- `app/(site)/page.tsx` — home page section order and composition
- `components/home/HeroSection.module.css` — bottom edge for clip transition
- `data/home.ts` — check for existing pull quote data structure

**Create:**
- `components/ui/PullQuote.tsx` — full-width dark strip with display-font italic quote, accent phrase
- `components/ui/PullQuote.module.css` — width 100vw, margin-left calc(-50vw + 50%), bg-ink, padding, display font italic, accent phrase in `var(--section-accent)`
- `components/ui/SectionNumber.tsx` — large knockout numeral (01-06) for section margins
- `components/ui/SectionNumber.module.css` — absolute positioned, 80-180px, opacity 0.06, display font

**Modify:**
- `app/(site)/page.tsx` — insert PullQuote between ServiceAccordion and FeaturedShowcase, add SectionNumber to each major section
- `data/home.ts` — add `pullQuotes` array with text and accent phrase

**What to Build:**
Three editorial devices: (1) PullQuote component — full-width dark strips between sections with display-font italic quotes, one accent phrase highlighted. (2) SectionNumber component — large knockout numerals (01, 02, 03...) at low opacity in section margins. (3) Home page composition adds a pull quote between services and portfolio showcase. Section numbers on major sections.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. Pull quote visible between services and portfolio as a dark strip. Section numbers faintly visible in margins. Editorial rhythm breaks the monotony of stacked sections.
CHUNK_10_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_11() {
  local log="$LOG_DIR/chunk-11.log"
  echo -e "${YELLOW}▶ Chunk 11/$TOTAL_CHUNKS: ServiceAccordion Choreography${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_11_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Chunk 11/16: Section-Specific Motion — ServiceAccordion Choreography

**Read these files first** (do NOT explore beyond this list):
- `components/home/ServiceAccordion.tsx` — current GSAP animation (clipPath reveal, stagger 0.06)
- `components/home/ServiceAccordion.module.css` — current `.item` clip-path initial state

**Create:** (none)

**Modify:**
- `components/home/ServiceAccordion.tsx` — replace uniform clipPath reveal with choreographed entrance: number fades in with scale 0.8→1, name slides in with `skewX: -3`→0, oneliner fades last. The accent slash (::before) flashes full height then settles to 0. Each row still uses clipPath but adds secondary animations for child elements.
- `components/home/ServiceAccordion.module.css` — add `.name` transform-origin left for skew, `.oneliner` initial opacity 0

**What to Build:**
Replace generic clipPath reveal with "being designed in real-time" choreography. When each service row enters viewport: the clip-path opens, then the name slides in with a slight skew (like type being placed on a page), the number scales in, and the oneliner fades in last. The accent slash flashes briefly. Each element has its own timing within the row's reveal.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. Service rows reveal with varied sub-element timing. Name has skew entrance. Number scales. Oneliner fades last. Feels like a poster being assembled.
CHUNK_11_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_12() {
  local log="$LOG_DIR/chunk-12.log"
  echo -e "${YELLOW}▶ Chunk 12/$TOTAL_CHUNKS: Portfolio Category Reveals${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_12_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Chunk 12/16: Section-Specific Motion — Portfolio Category Reveals

**Read these files first** (do NOT explore beyond this list):
- `components/portfolio/ProjectGrid.tsx` — current ImageReveal usage (direction "left"/"bottom" alternating)
- `components/animations/ImageReveal.tsx` — current props (direction, delay, duration, scaleReveal)
- `data/work.ts` — project categories

**Create:** (none)

**Modify:**
- `components/portfolio/ProjectGrid.tsx` — map ImageReveal direction based on `project.category`: branding→"left", fotografia→custom "develop" effect, web→custom "center" reveal, poster→"bottom", editorial→custom diagonal, video→"left". For categories needing custom reveals (foto develop, web center), use inline GSAP instead of ImageReveal.
- `components/portfolio/ProjectGrid.module.css` — add `.developReveal` initial state (`filter: brightness(3) contrast(0.3) sepia(1)`) for photography cards

**What to Build:**
Each portfolio category gets its own reveal animation. Photography cards "develop" like film (bright/washed-out → normal over 1.2s). Web cards reveal from center outward (clipPath inset 50%→0). Posters wipe from bottom. Branding wipes from left. Editorial gets a diagonal wipe. The portfolio grid becomes a showcase of motion variety instead of uniform reveals.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. Different categories animate differently on scroll. Photography has the "developing" film effect. Web expands from center. Variety visible when scrolling through mixed categories.
CHUNK_12_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_13() {
  local log="$LOG_DIR/chunk-13.log"
  echo -e "${YELLOW}▶ Chunk 13/$TOTAL_CHUNKS: Kinetic GRAFICA — SplitText Animation${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_13_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Research Findings

### SplitText + useGSAP (already in gsap bundle)
```tsx
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);
// Inside useGSAP:
const split = new SplitText(ref, { type: "chars" });
gsap.from(split.chars, { opacity: 0, y: 40, stagger: 0.05 });
```
Source: react-bits, Pixel-Perfect repos. Compatible with existing useGSAP scope pattern.

## Chunk 13/16: Kinetic "GRAFICA" — SplitText Per-Character Animation + Color

**Read these files first** (do NOT explore beyond this list):
- `components/home/HeroSection.tsx` — current hero timeline, `.grafica` element, how headline[1] renders
- `components/home/HeroSection.module.css` — `.grafica` styles, `.animItem` initial state

**Create:** (none)

**Modify:**
- `components/home/HeroSection.tsx` — import SplitText from gsap, register plugin. In useGSAP, create SplitText on `.grafica` element, split into chars. Replace the simple stagger with per-character animation: each char enters with `opacity: 0, y: 40, rotationX: 90`, stagger 0.05s. After entrance completes, apply chameleon colors via nth-child cycling (teal, ochre, purple). Use onComplete callback to add color classes.
- `components/home/HeroSection.module.css` — add `.graficaChar` styles for SplitText-generated spans. Add nth-child color rules cycling through accent/ochre/purple. Remove gradient from `.grafica` (chunk 1 added it — replace with per-char colors since this is more impactful).

**What to Build:**
The word "GRÁFICA" becomes kinetic. SplitText splits it into individual characters. Each character enters with a 3D rotation (rotationX: 90→0) and vertical slide, staggered at 0.05s. After the entrance animation completes, each character gets its chameleon color via nth-child cycling (G=teal, R=ochre, Á=purple, F=teal, I=ochre, C=purple, A=teal). The hero becomes a memorable, brand-defining moment.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. "GRÁFICA" characters enter one by one with 3D rotation. After animation, characters show cycling chameleon colors. SplitText cleans up properly.
CHUNK_13_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_14() {
  local log="$LOG_DIR/chunk-14.log"
  echo -e "${YELLOW}▶ Chunk 14/$TOTAL_CHUNKS: Apple-Style Text Illuminate on About Page${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_14_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Chunk 14/16: Apple-Style Text Illuminate on About Page

**Read these files first** (do NOT explore beyond this list):
- `components/about/AboutStory.tsx` — current body text rendering, pull quote, milestones
- `components/about/AboutStory.module.css` — `.body`, `.quote`, `.text` styles
- `components/home/ManifestoSection.tsx` — reference for word-by-word scroll reveal pattern (segments, word spans, GSAP scrub)
- `data/about.ts` — `story.body` string content

**Create:** (none)

**Modify:**
- `data/about.ts` — convert `story.body` from plain string to segments array (like manifesto) with optional style markers for accent/ochre words
- `components/about/AboutStory.tsx` — split body text into word spans (same pattern as ManifestoSection). Add useGSAP with ScrollTrigger scrub: words start at `color: var(--muted-light)` and illuminate to `color: var(--fg-dark)` on scroll. Words marked as accent illuminate to `var(--accent)`, ochre words to `var(--ochre)`.
- `components/about/AboutStory.module.css` — add `.storyWord` base styles (color: muted-light, transition), `.storyWord.accent`, `.storyWord.ochre` for final colors

**What to Build:**
Jesús's story text illuminates word-by-word as the user scrolls (Apple-style). Words start dim (muted-light) and transition to full color. Key phrases light up in chameleon colors: mentions of photography in ochre, design references in teal. Uses the same GSAP scrub pattern already proven in ManifestoSection. The "color flows through text" effect embodies the chameleon metaphor.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. About page body text starts dim and illuminates on scroll. Key phrases light up in accent colors. Scroll speed feels natural (not too fast, not too slow).
CHUNK_14_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_15() {
  local log="$LOG_DIR/chunk-15.log"
  echo -e "${YELLOW}▶ Chunk 15/$TOTAL_CHUNKS: Section-Specific Cursor Labels${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_15_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Chunk 15/16: Section-Specific Cursor Labels

**Read these files first** (do NOT explore beyond this list):
- `components/effects/CustomCursor.tsx` — current state machine (default/hover/project), GSAP ticker, data-cursor-project detection
- `components/effects/CustomCursor.module.css` — `.cursor`, `.label` states
- `components/home/ServiceAccordion.tsx` — section element structure
- `components/portfolio/ProjectGrid.tsx` — grid wrapper structure
- `components/contact/ContactHero.tsx` — section structure (read to confirm)

**Create:** (none)

**Modify:**
- `components/effects/CustomCursor.tsx` — add detection for `[data-cursor-label]` attribute on sections. When cursor enters a section with `data-cursor-label="Ver"`, show that label instead of default "Ver →". Add section detection: portfolio sections get "Ver", services get "→", contact gets "Hola".
- `components/effects/CustomCursor.module.css` — add label variants for different text content, adjust label positioning
- `components/home/ServiceAccordion.tsx` — add `data-cursor-label="→"` to section
- `components/portfolio/ProjectGrid.tsx` — add `data-cursor-label="Ver"` to grid wrapper
- `components/contact/ContactHero.tsx` — add `data-cursor-label="Hola"` to section

**What to Build:**
Extend CustomCursor to read `data-cursor-label` attributes from sections. Each major section gets a cursor personality: portfolio shows "Ver", services shows "→", contact shows "Hola". The cursor label updates as the user scrolls between sections. Desktop only (mobile already hidden).

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. Cursor label changes when hovering over different sections. Portfolio = "Ver", Services = "→", Contact = "Hola". No jank during transitions.
CHUNK_15_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_16() {
  local log="$LOG_DIR/chunk-16.log"
  echo -e "${YELLOW}▶ Chunk 16/$TOTAL_CHUNKS: Process Steps Timeline + Final Polish${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="

### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they are in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_16_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16.1 · React 19.2 · TypeScript 5.9 · Bun · CSS Modules · GSAP 3 + ScrollTrigger + SplitText + Flip
Check: `npx tsc --noEmit`

## Chunk 16/16: Process Steps Timeline + Final Polish

**Read these files first** (do NOT explore beyond this list):
- `components/services/ServicesProcess.tsx` — current step rendering (grid 2-col, numbered list)
- `components/services/ServicesProcess.module.css` — `.step`, `.stepNumber`, `.stepTitle`, `.stepDescription`
- `components/services/ServiceCard.tsx` — process pills (`.process`, `.step`)
- `components/services/ServiceCard.module.css` — pill styling

**Create:** (none)

**Modify:**
- `components/services/ServicesProcess.module.css` — redesign `.list` as vertical timeline with `::before` line connecting steps. Each `.step` gets a `::before` dot on the timeline. Line animates scaleY 0→1 on scroll.
- `components/services/ServicesProcess.tsx` — add useGSAP for timeline line animation (scaleY) and sequential dot reveals
- `components/services/ServiceCard.module.css` — convert `.process` pills to a compact inline timeline style (dots + small text) instead of bordered pills
- `CLAUDE.md` — update Current Phase to reflect v2 completion

**What to Build:**
Two process step upgrades: (1) ServicesProcess (the "Así trabajamos" section) becomes a vertical timeline with a connecting line and dots that animate on scroll. The line draws itself (scaleY 0→1), dots appear sequentially. (2) ServiceCard process pills become a minimal inline timeline (small dots + text). Update CLAUDE.md phase status.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit` passes. ServicesProcess shows vertical timeline with animated line. ServiceCard process steps feel like a minimal timeline. CLAUDE.md updated.
CHUNK_16_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

# ══════════════════════════════════════════════════════
# MAIN LOOP
# ══════════════════════════════════════════════════════

CHUNK_FUNCTIONS=(
  run_chunk_1
  run_chunk_2
  run_chunk_3
  run_chunk_4
  run_chunk_5
  run_chunk_6
  run_chunk_7
  run_chunk_8
  run_chunk_9
  run_chunk_10
  run_chunk_11
  run_chunk_12
  run_chunk_13
  run_chunk_14
  run_chunk_15
  run_chunk_16
)
CHUNK_NAMES=(
  "Chameleon Gradient Typography"
  "ServiceAccordion Dark Background + Adjusted Styles"
  "Section-Specific Accent Colors"
  "Purple Gets a Home"
  "Portfolio Bento Grid Layout"
  "Category-Specific Aspect Ratios + Color Badges"
  "Per-Service Visual Themes"
  "Service Card Layout Breaking"
  "Dramatic Service Numbers"
  "Editorial Rhythm — Pull Quotes + Section Numbers"
  "ServiceAccordion Choreography"
  "Portfolio Category Reveals"
  "Kinetic GRAFICA — SplitText Animation"
  "Apple-Style Text Illuminate on About Page"
  "Section-Specific Cursor Labels"
  "Process Steps Timeline + Final Polish"
)

for i in "${!CHUNK_FUNCTIONS[@]}"; do
  num=$((i + 1))

  if [[ "$num" -lt "$START_CHUNK" ]]; then
    echo -e "${YELLOW}  Skipping chunk $num${NC}"
    continue
  fi

  ${CHUNK_FUNCTIONS[$i]}
  run_quality_gate "$num"
  capture_context

  ((CHUNKS_SINCE_CLEANUP++)) || true
  if [[ "$CLEANUP_EVERY" -gt 0 && "$CHUNKS_SINCE_CLEANUP" -ge "$CLEANUP_EVERY" ]]; then
    run_cleanup
    CHUNKS_SINCE_CLEANUP=0
  fi

  echo ""
done

echo -e "${GREEN}══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  All chunks complete!${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════════${NC}"

if [[ "$SKIP_FINAL_CHECK" != "true" ]]; then
  echo -e "${BLUE}Running final quality checks...${NC}"
  cd "$PROJECT_DIR"
  if eval "$CHECK_CMD"; then
    echo -e "${GREEN}✓ All checks passed${NC}"
  else
    echo -e "${RED}✗ Final checks failed — fix before committing${NC}"
    exit 1
  fi
fi

echo -e "${GREEN}Done! Review changes: git diff${NC}"
