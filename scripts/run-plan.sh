#!/bin/bash
set -eo pipefail

PROJECT_DIR="/mnt/e/Projects/zona-grafica"
LOG_DIR="$PROJECT_DIR/.claude/logs"
CHECK_CMD="npx tsc --noEmit && bun run lint"
FEATURE_NAME="ServiceAccordion Editorial Upgrade"
TOTAL_CHUNKS=5

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Defaults
START_CHUNK=1
SKIP_FINAL_CHECK=false

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --start) START_CHUNK="$2"; shift 2 ;;
    --skip-final-check) SKIP_FINAL_CHECK=true; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

mkdir -p "$LOG_DIR"

echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Plan Executor - $FEATURE_NAME${NC}"
echo -e "${BLUE}  $TOTAL_CHUNKS chunks, starting from $START_CHUNK${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
echo ""

# Context bridge — captures what previous chunk produced
PREV_CONTEXT=""

capture_context() {
  cd "$PROJECT_DIR"
  PREV_CONTEXT=$(git diff --stat HEAD 2>/dev/null || echo "")
}

# Quality gate — typecheck + lint between chunks
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

# ══════════════════════════════════════════════════════
# CHUNK PROMPTS — baked in from plan file
# ══════════════════════════════════════════════════════

run_chunk_1() {
  local log="$LOG_DIR/chunk-1.log"
  echo -e "${YELLOW}▶ Chunk 1/$TOTAL_CHUNKS: Oversized Knockout Numbers + Vertical Accent Slash${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="
### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they're in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_1_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: npx tsc --noEmit && bun run lint

## Chunk 1/5: Oversized Knockout Numbers + Vertical Accent Slash

**Read these files first** (do NOT explore beyond this list):
- `components/home/ServiceAccordion.module.css` — current styles, class names, responsive breakpoints
- `components/home/ServiceAccordion.tsx` — current markup structure for `.number`, `.rowLeft`, `.item`
- `app/globals.css` — design tokens: `--accent`, `--ochre`, `--stone`, `--border`, `--font-display`, spacing vars

**Modify:**
- `components/home/ServiceAccordion.module.css` — restyle `.number` to oversized knockout (48-80px, display font, low opacity, absolute positioned behind title), replace `.item` horizontal borders with left-edge vertical accent slash via `::before` pseudo-element, adjust `.rowLeft` to relative positioning with padding clearance

**What to Build:**
Scale service numbers from 13px to clamp(48px, 6vw, 80px) in Clash Display at 0.18 opacity, absolutely positioned behind the title. On row hover, numbers brighten to 0.35 opacity and shift to accent color. Replace top/bottom border separators with a vertical accent bar (3px, --accent) on the left that grows from 0% to 60% height on hover. Keep subtle 1px bottom border between items using --stone at 30% opacity.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: npx tsc --noEmit && bun run lint
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** npx tsc --noEmit && bun run lint passes. Numbers visually layer behind titles. Vertical slash appears on hover. No layout shift on hover.
CHUNK_1_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_2() {
  local log="$LOG_DIR/chunk-2.log"
  echo -e "${YELLOW}▶ Chunk 2/$TOTAL_CHUNKS: Description Reveal Accordion + Letter-Spacing Animation${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="
### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they're in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_2_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: npx tsc --noEmit && bun run lint

## Chunk 2/5: Description Reveal Accordion + Letter-Spacing Animation

**Read these files first** (do NOT explore beyond this list):
- `components/home/ServiceAccordion.module.css` — current `.oneliner`, `.name`, `.row` styles and responsive rules
- `components/home/ServiceAccordion.tsx` — current `.oneliner` markup position and content rendering

**Modify:**
- `components/home/ServiceAccordion.module.css` — move `.oneliner` below title (full width), hide by default with `max-height: 0; opacity: 0; overflow: hidden`, reveal on `.row:hover` with `max-height: 80px; opacity: 1` transition (300ms). Add letter-spacing transition to `.name` from -0.02em to 0.01em on hover. Make `.row` wrap with `flex-wrap: wrap`. Align `.oneliner` padding-left with title position.
- `components/home/ServiceAccordion.tsx` — move `.oneliner` span inside `.rowLeft` div (after `.name`) so it sits below the title, not floating right. Remove the `display: -webkit-box` line clamping since the reveal handles visibility.

**What to Build:**
Hide service descriptions by default. On hover, smoothly expand them below the title (300ms, ease-out). The title's letter-spacing animates from -0.02em to 0.01em on hover — text "opens up" as the description reveals. On mobile (<=768px), descriptions stay hidden (tap-to-expand image behavior unchanged).

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: npx tsc --noEmit && bun run lint
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** npx tsc --noEmit && bun run lint passes. Descriptions hidden by default, reveal smoothly on hover. Letter-spacing shift visible on title hover. Mobile behavior unchanged.
CHUNK_2_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_3() {
  local log="$LOG_DIR/chunk-3.log"
  echo -e "${YELLOW}▶ Chunk 3/$TOTAL_CHUNKS: Arrow Diagonal Rotation + Brand-Hued Shadow + OpenType${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="
### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they're in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_3_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: npx tsc --noEmit && bun run lint

## Chunk 3/5: Arrow Diagonal Rotation + Brand-Hued Shadow + OpenType

**Read these files first** (do NOT explore beyond this list):
- `components/home/ServiceAccordion.module.css` — current `.arrow`, `.cursorImage` styles
- `app/globals.css` — current font-feature-settings, any existing OpenType rules

**Modify:**
- `components/home/ServiceAccordion.module.css` — change `.arrow` hover from `translateX(6px)` to `translate(4px, -2px) rotate(-45deg)` with spring easing `cubic-bezier(0.34, 1.2, 0.64, 1)`. Replace `.cursorImage` box-shadow from `rgba(0,0,0,0.15)` to warm hue-tinted multi-layer shadow: `0 8px 20px oklch(0.3 0.01 60 / 0.12), 0 3px 6px oklch(0.3 0.01 60 / 0.06)`. Add `font-variant-ligatures: common-ligatures contextual` and `font-feature-settings: "calt" 1, "liga" 1` to `.name`. Add `font-variant-numeric: oldstyle-nums` to `.number`.
- `components/home/ServiceAccordion.tsx` — ensure `.arrow` span has `display: inline-block` (needed for transform on inline elements), or handle via CSS

**What to Build:**
Three quick polish wins: (1) Arrow rotates to 45-degree diagonal on hover with spring easing overshoot instead of sliding right. (2) Cursor-following image preview gets warm brand-hued shadows from editorial-spa elevation system instead of generic gray rgba. (3) OpenType features enabled — contextual ligatures on display titles, oldstyle numerals on service numbers.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: npx tsc --noEmit && bun run lint
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** npx tsc --noEmit && bun run lint passes. Arrow rotates diagonally on hover. Cursor image shadow feels warmer. OpenType features render if font supports them.
CHUNK_3_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_4() {
  local log="$LOG_DIR/chunk-4.log"
  echo -e "${YELLOW}▶ Chunk 4/$TOTAL_CHUNKS: GSAP ScrollTrigger Clip-Path Entrance${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="
### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they're in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_4_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: npx tsc --noEmit && bun run lint

## Chunk 4/5: GSAP ScrollTrigger Clip-Path Entrance

**Read these files first** (do NOT explore beyond this list):
- `components/home/ServiceAccordion.tsx` — full component, need to add useGSAP hook + ScrollTrigger
- `components/home/ServiceAccordion.module.css` — `.item` class for clip-path initial state
- `components/home/FeaturedShowcase.tsx` — reference for useGSAP + ScrollTrigger pattern used in this project (lines 34-115)
- `components/home/StatsStrip.tsx` — another reference for GSAP scroll animation pattern

**Modify:**
- `components/home/ServiceAccordion.tsx` — import `useGSAP` from `@gsap/react`, `gsap` and `ScrollTrigger`. Add `gsap.registerPlugin(ScrollTrigger)`. Add `useGSAP` hook that: queries all `.item` elements within the section ref, applies `gsap.from()` with `clipPath: "inset(0 100% 0 0)"` to `"inset(0 0 0 0)"`, staggered at 60ms per item, triggered when section enters viewport at `top 85%`.
- `components/home/ServiceAccordion.module.css` — add `will-change: clip-path` to `.item` for performance hint. Add `.item { clip-path: inset(0 100% 0 0); }` as initial state (GSAP will animate from this).

**What to Build:**
Add a scroll-triggered entrance animation: service rows wipe in from left-to-right using clip-path, staggered at 60ms per item (total cascade ~360ms for 6 items). Uses the same `useGSAP` + ScrollTrigger pattern as FeaturedShowcase and StatsStrip. Easing: `power2.out`. Duration: 0.6s per item. Trigger: section top at 85% viewport.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: npx tsc --noEmit && bun run lint
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** npx tsc --noEmit && bun run lint passes. Service rows are invisible until scrolled into view, then wipe in left-to-right with stagger. No flash of unstyled content.
CHUNK_4_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_5() {
  local log="$LOG_DIR/chunk-5.log"
  echo -e "${YELLOW}▶ Chunk 5/$TOTAL_CHUNKS: Text-Wrap Balance + Staggered Row Padding + Playwright Test${NC}"

  local context_section=""
  if [[ -n "$PREV_CONTEXT" ]]; then
    context_section="
### Previous Chunk Changes
\`\`\`
$PREV_CONTEXT
\`\`\`
Do NOT modify these files unless they're in YOUR file lists."
  fi

  cd "$PROJECT_DIR"
  claude --dangerously-skip-permissions --max-turns 50 \
    -p "$(cat <<'CHUNK_5_PROMPT'
[Project] zona-grafica at /mnt/e/Projects/zona-grafica
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: npx tsc --noEmit && bun run lint

## Chunk 5/5: Text-Wrap Balance + Staggered Row Padding + Playwright Test

**Read these files first** (do NOT explore beyond this list):
- `components/home/ServiceAccordion.module.css` — `.title`, `.item .row` padding values
- `e2e/pages.spec.ts` — existing test patterns for consistency

**Modify:**
- `components/home/ServiceAccordion.module.css` — add `text-wrap: balance` to `.title`. Apply staggered vertical padding via `:nth-child`: items 1,4 get 32px, items 2,3 get 24px, items 5,6 get 22px. This breaks metronomic rhythm and weights "hero" services.
- `e2e/pages.spec.ts` — add a test: navigate to `/`, scroll to "Lo que hacemos" section, verify all 6 service titles are visible (Branding, Editorial, Web, Fotografía, Ilustración, Cartelería).

**What to Build:**
Final polish: (1) `text-wrap: balance` on section heading prevents awkward line breaks at mid-widths. (2) Staggered row padding creates editorial rhythm — weighted services get more breathing room. (3) Playwright test ensures all 6 services render correctly on the homepage.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: npx tsc --noEmit && bun run lint
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** npx tsc --noEmit && bun run lint passes. bunx playwright test e2e/pages.spec.ts passes including new service accordion test. Heading wraps balanced. Row padding varies visually.
CHUNK_5_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

# ══════════════════════════════════════════════════════
# MAIN LOOP
# ══════════════════════════════════════════════════════

CHUNK_FUNCTIONS=( run_chunk_1 run_chunk_2 run_chunk_3 run_chunk_4 run_chunk_5 )
CHUNK_NAMES=(
  "Oversized Knockout Numbers + Vertical Accent Slash"
  "Description Reveal Accordion + Letter-Spacing Animation"
  "Arrow Diagonal Rotation + Brand-Hued Shadow + OpenType"
  "GSAP ScrollTrigger Clip-Path Entrance"
  "Text-Wrap Balance + Staggered Row Padding + Playwright Test"
)

for i in "${!CHUNK_FUNCTIONS[@]}"; do
  num=$((i + 1))

  if [[ "$num" -lt "$START_CHUNK" ]]; then
    echo -e "${YELLOW}  Skipping chunk $num${NC}"
    continue
  fi

  # Run the chunk
  ${CHUNK_FUNCTIONS[$i]}

  # Quality gate
  run_quality_gate "$num"

  # Capture context for next chunk
  capture_context

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

echo ""
echo -e "${GREEN}Done! Review changes: git diff${NC}"
