#!/bin/bash
set -eo pipefail

PROJECT_DIR="/mnt/e/Projects/zona-grafica"
LOG_DIR="$PROJECT_DIR/.claude/logs"
CHECK_CMD="npx tsc --noEmit && bun run lint"
FEATURE_NAME="Site-Wide Animation & Visual Upgrade"
TOTAL_CHUNKS=10

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

START_CHUNK=1
SKIP_FINAL_CHECK=false

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

PREV_CONTEXT=""

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

refresh_claude_md() {
  local refresh_log="$LOG_DIR/refresh-claude-md.log"
  echo -e "${CYAN}  Refreshing CLAUDE.md...${NC}"
  cd "$PROJECT_DIR"

  claude --dangerously-skip-permissions --max-turns 30 \
    -p "$(cat <<'REFRESHPROMPT'
Update CLAUDE.md for zona-grafica at /mnt/e/Projects/zona-grafica

Steps:
1. Read the current CLAUDE.md
2. Read package.json for current scripts/deps
3. Glob the top-level directory structure (components/*, app/*, lib/*, data/*, types/*)
4. Check if any new directories, components, or patterns were added recently (git diff --stat HEAD~5 to see what changed)
5. Update CLAUDE.md:
   - Keep all custom sections (Design Tokens, Principles, Animation Patterns, Current Phase)
   - Update the Structure section if new folders appeared
   - Update Animation Patterns if new pattern files were created or existing ones changed
   - Keep it under 100 lines total
   - Do NOT remove any section — only update or add

Rules:
- Do NOT refactor or modify any code files
- ONLY update CLAUDE.md
- Do NOT ask questions
REFRESHPROMPT
)" < /dev/null 2>&1 | tee "$refresh_log"

  echo -e "${GREEN}  ✓ CLAUDE.md refreshed${NC}"
}

REFRESH_INTERVAL=4

# ══════════════════════════════════════════════════════
# CHUNK FUNCTIONS
# ══════════════════════════════════════════════════════

run_chunk_1() {
  local log="$LOG_DIR/chunk-1.log"
  echo -e "${YELLOW}▶ Chunk 1/$TOTAL_CHUNKS: Portfolio Hero — GSAP Split-Line Text Reveal${NC}"

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
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: `npx tsc --noEmit && bun run lint`

## Chunk 1/10: Portfolio Hero — GSAP Split-Line Text Reveal

**Read these files first** (do NOT explore beyond this list):
- `components/portfolio/PortfolioHero.tsx` — current markup, MotionSection wrapper, props
- `components/portfolio/PortfolioHero.module.css` — current styles, breakpoints
- `components/home/HeroSection.tsx` — reference for useGSAP timeline + animItem stagger pattern

**Create:** (none)

**Modify:**
- `components/portfolio/PortfolioHero.tsx` — convert to client component, replace MotionSection with useGSAP timeline. Wrap annotation, title, and description in animItem spans. Stagger each element in with y:40→0 + opacity, 0.15s stagger. Use sectionRef + useGSAP scope pattern from HeroSection.
- `components/portfolio/PortfolioHero.module.css` — add `.animItem` class with initial `opacity: 0`. Remove any MotionSection dependency.

**What to Build:**
Replace generic MotionSection fade+slide with a choreographed GSAP timeline: annotation slides in first, then title (heavier, y:60), then description (lighter, y:30). Each element staggers at 0.15s. Triggered on page load (no ScrollTrigger — it's the hero, above the fold). Match the HeroSection pattern.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Portfolio hero elements animate in sequentially on page load. No flash of unstyled content.
CHUNK_1_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_2() {
  local log="$LOG_DIR/chunk-2.log"
  echo -e "${YELLOW}▶ Chunk 2/$TOTAL_CHUNKS: Servicios Hero — GSAP Split-Line + Accent Word Reveal${NC}"

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
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: `npx tsc --noEmit && bun run lint`

## Chunk 2/10: Servicios Hero — GSAP Split-Line + Accent Word Reveal

**Read these files first** (do NOT explore beyond this list):
- `components/services/ServicesHero.tsx` — current markup (topRow, title with accent span, subtitle)
- `components/services/ServicesHero.module.css` — current styles
- `components/home/HeroSection.tsx` — reference for useGSAP timeline pattern

**Create:** (none)

**Modify:**
- `components/services/ServicesHero.tsx` — convert to client component, replace MotionSection with useGSAP timeline. Wrap count, annotation, "Lo que", accent "hacemos", and subtitle each in animItem spans. Stagger in with y:40→0 at 0.12s intervals. The accent word "hacemos" gets a slight x:-20→0 in addition to y movement for diagonal entrance.
- `components/services/ServicesHero.module.css` — add `.animItem` with initial `opacity: 0`.

**What to Build:**
Choreographed hero entrance: count and annotation fade in together, then "Lo que" slides up, then "hacemos" enters diagonally (x+y), then subtitle fades. Total sequence ~0.7s. Page-load trigger (above the fold).

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Services hero animates in with staggered timing. Accent word has distinct diagonal entrance.
CHUNK_2_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_3() {
  local log="$LOG_DIR/chunk-3.log"
  echo -e "${YELLOW}▶ Chunk 3/$TOTAL_CHUNKS: About Hero — GSAP Split-Line + Sector List Stagger${NC}"

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
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: `npx tsc --noEmit && bun run lint`

## Chunk 3/10: About Hero — GSAP Split-Line + Sector List Stagger

**Read these files first** (do NOT explore beyond this list):
- `components/about/AboutHero.tsx` — current markup (topRow, split headline, introWrap with sectors)
- `components/about/AboutHero.module.css` — current styles, responsive rules
- `components/home/HeroSection.tsx` — reference for useGSAP timeline

**Create:** (none)

**Modify:**
- `components/about/AboutHero.tsx` — convert to client component, replace MotionSection with useGSAP timeline. Wrap annotation, since, mainLine, locationLine, intro, sectorsLabel, and each sector in animItem spans. Timeline: annotations first, then mainLine (y:60), locationLine (y:40, slight delay), intro (y:30), then sectors stagger in (y:20, 0.08s each).
- `components/about/AboutHero.module.css` — add `.animItem` with initial `opacity: 0`.

**What to Build:**
Most complex hero entrance: 7+ elements stagger in with varied y-offsets reflecting visual weight. Main headline enters heaviest (y:60), location line lighter (y:40, italic accent color already styled). Sector pills stagger in rapidly at 0.08s intervals, creating a quick cascade effect.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. About hero elements animate sequentially with varied offsets. Sectors cascade in.
CHUNK_3_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_4() {
  local log="$LOG_DIR/chunk-4.log"
  echo -e "${YELLOW}▶ Chunk 4/$TOTAL_CHUNKS: Contact Hero + Blog Hero — GSAP Text Reveals${NC}"

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
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: `npx tsc --noEmit && bun run lint`

## Chunk 4/10: Contact Hero + Blog Hero — GSAP Text Reveals

**Read these files first** (do NOT explore beyond this list):
- `components/contact/ContactHero.tsx` — current markup (label, title with line1/line2, subtitle, WhatsApp button)
- `components/contact/ContactHero.module.css` — current styles
- `components/blog/BlogHero.tsx` — current markup (annotation, title, subtitle, rule)
- `components/blog/BlogHero.module.css` — current styles
- `components/home/HeroSection.tsx` — reference for useGSAP pattern

**Create:** (none)

**Modify:**
- `components/contact/ContactHero.tsx` — convert to client component, replace MotionSection with useGSAP. Stagger: label, line1, line2 (with em), subtitle, WhatsApp button. WhatsApp button enters with y:20 + opacity last.
- `components/contact/ContactHero.module.css` — add `.animItem` with initial `opacity: 0`.
- `components/blog/BlogHero.tsx` — convert to client component, add useGSAP. Stagger: annotation, title, subtitle, rule. Rule element draws from width:0 to width:100% via GSAP.
- `components/blog/BlogHero.module.css` — add `.animItem` with initial `opacity: 0`. Add rule initial state `transform: scaleX(0); transform-origin: left`.

**What to Build:**
Two simpler hero animations. Contact: "Platiquemos" enters with y:50 (big, bold), "sobre tu proyecto" follows. WhatsApp CTA enters last as a call-to-action reveal. Blog: annotation, title, subtitle stagger, then the horizontal rule draws itself from left to right (scaleX 0→1, 0.6s).

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Contact hero elements stagger in. Blog hero rule draws on load. Both pages have unique entrance choreography.
CHUNK_4_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_5() {
  local log="$LOG_DIR/chunk-5.log"
  echo -e "${YELLOW}▶ Chunk 5/$TOTAL_CHUNKS: About Milestones — GSAP Counter Animation${NC}"

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
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: `npx tsc --noEmit && bun run lint`

## Chunk 5/10: About Milestones — GSAP Counter Animation

**Read these files first** (do NOT explore beyond this list):
- `components/about/AboutStory.tsx` — current markup for milestones section (values: 22, 33, 475, 5)
- `components/about/AboutStory.module.css` — milestone styles
- `components/home/StatsStrip.tsx` — reference for GSAP number counter pattern in this project

**Create:** (none)

**Modify:**
- `components/about/AboutStory.tsx` — convert to client component. Add useGSAP hook with ScrollTrigger targeting the milestones container. For each `.milestoneValue` element, use `gsap.from()` with a textContent tween (snap to integers) counting from 0 to final value. Parse innerText as number. Stagger 0.1s per milestone. Trigger: milestones enter viewport at `top 80%`.
- `components/about/AboutStory.module.css` — add `font-variant-numeric: tabular-nums` to `.milestoneValue` to prevent layout shift during counting.

**What to Build:**
Milestone numbers (22, 33, 475, 5) count up from 0 when scrolled into view. Uses GSAP's `snap` to keep integers. Each counter starts 0.1s after the previous. Duration 1.2s with `power2.out` easing (fast start, slow finish). Trigger once on scroll entry.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Milestone numbers count up from 0 on scroll. No layout shift during animation. Numbers are final values after animation completes.
CHUNK_5_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_6() {
  local log="$LOG_DIR/chunk-6.log"
  echo -e "${YELLOW}▶ Chunk 6/$TOTAL_CHUNKS: Service Cards — Image Panels with ImageReveal${NC}"

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
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: `npx tsc --noEmit && bun run lint`

## Chunk 6/10: Service Cards — Image Panels with ImageReveal

**Read these files first** (do NOT explore beyond this list):
- `components/services/ServiceCard.tsx` — current text-only card markup, props (service.image exists)
- `components/services/ServiceCard.module.css` — current grid layout (80px | 1fr), responsive rules
- `components/services/ServicesList.tsx` — parent wrapper, reversed prop logic
- `components/animations/ImageReveal.tsx` — API: direction, delay, duration, scaleReveal props
- `data/services.ts` — confirms image field exists for all 6 services

**Create:** (none)

**Modify:**
- `components/services/ServiceCard.tsx` — add Image import from next/image. Add ImageReveal wrapper. Render service.image as a panel after the numberCol and before content. Grid becomes 3-column: `80px 1fr 1fr` on desktop. Image uses `aspect-ratio: 4/5`, fill, cover. ImageReveal direction alternates based on reversed prop. On mobile, image stacks above content.
- `components/services/ServiceCard.module.css` — update grid to 3-column desktop layout. Add `.imageCol` with aspect-ratio 4/5, overflow hidden, border-radius 6px. Reversed: swap image column order via `order` property. Mobile: image spans full width, grid becomes single column.

**What to Build:**
Add the service hero images (already defined in data but never rendered) to each service card. Desktop: number | image | text in a 3-column grid. Reversed cards flip image to the right. Each image reveals via ImageReveal clip-path wipe. Mobile: image stacks between number and text.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. All 6 service cards show images. Images reveal with clip-path on scroll. Reversed layout alternates image position. Mobile layout stacks cleanly.
CHUNK_6_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_7() {
  local log="$LOG_DIR/chunk-7.log"
  echo -e "${YELLOW}▶ Chunk 7/$TOTAL_CHUNKS: Portfolio Grid — GSAP Flip on Filter Change${NC}"

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
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: `npx tsc --noEmit && bun run lint`

## Chunk 7/10: Portfolio Grid — GSAP Flip on Filter Change

**Read these files first** (do NOT explore beyond this list):
- `components/portfolio/PortfolioClient.tsx` — state management, filter + grid composition
- `components/portfolio/ProjectGrid.tsx` — current grid rendering, ImageReveal usage
- `components/portfolio/ProjectGrid.module.css` — grid layout, card styles
- `components/portfolio/ProjectFilter.tsx` — filter buttons, onSelect handler

**Create:** (none)

**Modify:**
- `components/portfolio/PortfolioClient.tsx` — add `useRef` for grid container. Import `gsap`, `Flip` from gsap. Register Flip plugin. On filter change: capture Flip state before setActive, then after React renders, run `Flip.from()` with stagger 0.05s, duration 0.5s, ease `power2.inOut`, absolute positioning during animation. Use `useLayoutEffect` or `flushSync` to capture state correctly.
- `components/portfolio/ProjectGrid.tsx` — accept `gridRef` prop (forwarded ref) and attach to grid div. Add `data-flip-id={project.id}` to each card for Flip tracking.

**Research Before Building:**
Before implementing, search the codebase for any existing GSAP Flip usage. Then search GitHub for `"Flip.from" "gsap" "react" "useState"` to learn correct React state + GSAP Flip integration pattern (timing of state capture vs render). Also search for `"gsap.registerPlugin" "Flip" "next"` to verify Flip plugin import path and SSR compatibility with Next.js.

**What to Build:**
When user clicks a filter category, cards animate to their new positions using GSAP Flip instead of instant swap. Cards leaving fade out, remaining cards reflow smoothly, new cards fade in. Staggered at 0.05s. This is the highest-visibility UX improvement on the portfolio page.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase beyond what's listed (except for research queries).
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Clicking filter categories causes smooth card reflow animation. Cards don't jump. Exiting cards fade out, entering cards fade in.
CHUNK_7_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_8() {
  local log="$LOG_DIR/chunk-8.log"
  echo -e "${YELLOW}▶ Chunk 8/$TOTAL_CHUNKS: Case Study Hero — Parallax Background Image${NC}"

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
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: `npx tsc --noEmit && bun run lint`

## Chunk 8/10: Case Study Hero — Parallax Background Image

**Read these files first** (do NOT explore beyond this list):
- `components/case-study/CaseStudyHero.tsx` — current markup (imageWrap with Image + overlay, content block)
- `components/case-study/CaseStudyHero.module.css` — current styles (90vh hero, absolute image, gradient overlay)
- `components/animations/ParallaxDrift.tsx` — reference for GSAP scroll-linked parallax pattern

**Create:** (none)

**Modify:**
- `components/case-study/CaseStudyHero.tsx` — convert to client component. Add useGSAP + ScrollTrigger. Apply parallax to `.imageWrap`: `y: -60` over full scroll through the section, `scrub: true`. Apply stagger entrance to content elements (backLink, title, annotation, description, tags) with y+opacity timeline triggered on load. Tags stagger at 0.05s each.
- `components/case-study/CaseStudyHero.module.css` — add `will-change: transform` to `.imageWrap`. Add `.animItem` with initial `opacity: 0`.

**What to Build:**
Two effects: (1) Hero background image scrolls at 0.7x speed (parallax via GSAP scrub), creating depth. Image shifts y:-60px over the section scroll. (2) Content elements (title, annotation, description, tags) stagger in on page load like other heroes. Tags cascade in quickly. Desktop-only parallax (disable on <=768px via matchMedia).

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Case study hero image scrolls slower than content (parallax). Content elements stagger in on load. Mobile has no parallax jank.
CHUNK_8_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_9() {
  local log="$LOG_DIR/chunk-9.log"
  echo -e "${YELLOW}▶ Chunk 9/$TOTAL_CHUNKS: Case Study Narrative — Scroll-Triggered Block Stagger${NC}"

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
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: `npx tsc --noEmit && bun run lint`

## Chunk 9/10: Case Study Narrative — Scroll-Triggered Block Stagger

**Read these files first** (do NOT explore beyond this list):
- `components/case-study/CaseStudyNarrative.tsx` — current markup (3 blocks: El reto, El enfoque, El resultado + optional stats)
- `components/case-study/CaseStudyNarrative.module.css` — current styles, 3-column grid
- `components/home/CTASection.tsx` — reference for useGSAP + ScrollTrigger line stagger pattern

**Create:** (none)

**Modify:**
- `components/case-study/CaseStudyNarrative.tsx` — convert to client component. Replace MotionSection with native section + useGSAP. Add ScrollTrigger: each `.block` enters with clipPath `inset(0 0 100% 0)` → `inset(0 0 0 0)` (wipe from top), staggered 0.15s, triggered at `top 80%`. Stats section: each `.statValue` counts from 0 (same pattern as AboutStory milestones).
- `components/case-study/CaseStudyNarrative.module.css` — add `will-change: clip-path` to `.block`. Add `clip-path: inset(0 0 100% 0)` initial state. Add `font-variant-numeric: tabular-nums` to `.statValue`.

**What to Build:**
Narrative blocks (El reto, El enfoque, El resultado) wipe in from bottom via clip-path, staggered at 0.15s. Creates a "revealing the story" effect. Stats section numbers count up from 0 on scroll entry (same counter pattern as milestones). Both triggered by ScrollTrigger.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Narrative blocks wipe in sequentially on scroll. Stat numbers count up. No flash of unstyled content.
CHUNK_9_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_10() {
  local log="$LOG_DIR/chunk-10.log"
  echo -e "${YELLOW}▶ Chunk 10/$TOTAL_CHUNKS: Blog Cards Scroll Reveal + OpenType Polish${NC}"

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
Stack: Next.js 16 · React 19 · TypeScript · Bun · CSS Modules · GSAP + ScrollTrigger
Check: `npx tsc --noEmit && bun run lint`

## Chunk 10/10: Blog Cards Scroll Reveal + OpenType Polish

**Read these files first** (do NOT explore beyond this list):
- `components/blog/PostGrid.tsx` — current grid wrapper, maps PostCard
- `components/blog/PostCard.tsx` — current card markup
- `components/blog/PostCard.module.css` — current card styles, hover effects
- `components/animations/MotionSection.tsx` — wrapper API for scroll reveal

**Create:** (none)

**Modify:**
- `components/blog/PostGrid.tsx` — wrap each PostCard in a MotionSection with stagger to add scroll-triggered entrance. Alternate stagger delay: even cards 0s, odd cards 0.12s.
- `components/blog/PostCard.module.css` — add `font-variant-ligatures: common-ligatures contextual` and `font-feature-settings: "calt" 1, "liga" 1` to `.title`. Add `font-variant-numeric: oldstyle-nums` to `.meta time`.
- `components/services/ServicesProcess.module.css` — add `font-variant-numeric: oldstyle-nums` to `.stepNumber`. Add `font-feature-settings: "calt" 1, "liga" 1` to `.stepTitle`.
- `components/about/ValuesGrid.module.css` — add `font-variant-numeric: oldstyle-nums` to `.itemNumber`. Add hover state: `.item:hover .itemNumber { color: var(--accent) }` and `.item:hover .itemTitle { color: var(--accent) }` with transition.
- `components/about/AboutStory.module.css` — add `font-variant-numeric: oldstyle-nums tabular-nums` to `.milestoneValue`.

**What to Build:**
Two things: (1) Blog cards animate in on scroll via MotionSection wrapper with alternating stagger delays. (2) OpenType polish sweep across remaining components: oldstyle numerals on all editorial numbers (blog meta, service process numbers, values numbers, milestone values), contextual ligatures on display-font titles. Values grid gets subtle hover states (number + title shift to accent color).

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Blog cards animate in on scroll with stagger. OpenType features render where fonts support them. Values items respond to hover.
CHUNK_10_PROMPT
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
)
CHUNK_NAMES=(
  "Portfolio Hero — GSAP Split-Line Text Reveal"
  "Servicios Hero — GSAP Split-Line + Accent Word Reveal"
  "About Hero — GSAP Split-Line + Sector List Stagger"
  "Contact Hero + Blog Hero — GSAP Text Reveals"
  "About Milestones — GSAP Counter Animation"
  "Service Cards — Image Panels with ImageReveal"
  "Portfolio Grid — GSAP Flip on Filter Change"
  "Case Study Hero — Parallax Background Image"
  "Case Study Narrative — Scroll-Triggered Block Stagger"
  "Blog Cards Scroll Reveal + OpenType Polish"
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

  # Refresh CLAUDE.md every N chunks so subprocesses stay current
  if (( num % REFRESH_INTERVAL == 0 && num < TOTAL_CHUNKS )); then
    refresh_claude_md
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
