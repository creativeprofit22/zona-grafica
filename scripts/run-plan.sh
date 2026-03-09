#!/bin/bash
set -eo pipefail

PROJECT_DIR="/mnt/e/Projects/zona-grafica"
LOG_DIR="$PROJECT_DIR/.claude/logs"
CHECK_CMD="npx tsc --noEmit && bun run lint"
FEATURE_NAME="v3 Polish Pass"
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
# CHUNK FUNCTIONS — one per chunk, prompt baked in as heredoc
# ══════════════════════════════════════════════════════

run_chunk_1() {
  local log="$LOG_DIR/chunk-1.log"
  echo -e "${YELLOW}▶ Chunk 1/$TOTAL_CHUNKS: Google Maps Fix${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### GSAP Patterns (established in codebase)
- `useGSAP(() => { ... }, { scope: ref })` for scoped animations with auto-cleanup
- ScrollTrigger: `{ trigger, start: "top 85%", toggleActions: "play none none none" }`
- CSS custom properties as animation targets: `gsap.to(el, { "--prop": value })`
- `.animItem { opacity: 0 }` initial state convention, GSAP sets final values
- ParallaxDrift: `scrub: true`, desktop-only via `gsap.matchMedia()`
- MagneticButton: `gsap.quickTo()` with `elastic.out(1, 0.4)` easing

### Design Tokens
- Colors: `--accent: #2AA876`, `--ochre: #F5A623`, `--fg-dark: #1A1714`, `--muted: #7A756E`
- Fonts: `--font-display: "Clash Display"`, `--font-sans: "Satoshi"`
- Timing: `--duration-fast: 0.2s`, `--duration-normal: 0.4s`, `--duration-slow: 0.8s`
- Spacing: `--space-xs` through `--space-3xl` (4px to 128px)

## Chunk 1/16: Google Maps Fix

**Read these files first** (do NOT explore beyond this list):
- `components/contact/ContactInfo.tsx` — current iframe embed URL
- `next.config.ts` — current CSP headers

**Modify:**
- `components/contact/ContactInfo.tsx` — update embed URL with fresh timestamp
- `next.config.ts` — add `maps.gstatic.com` to `connect-src`

**What to Build:**
Replace the stale Google Maps embed URL timestamp (`4v1709900000000`, circa 2021) with a current one. The embed URL structure stays the same — only the `4v` parameter changes to current epoch milliseconds. Also add `maps.gstatic.com` to `connect-src` in CSP for tile loading.

**Code to Adapt:**
Current URL ends with `!4v1709900000000`. Replace with `!4v` + current epoch ms (e.g., `!4v1741484400000` for March 2026).

CSP connect-src: change `'self' https://maps.googleapis.com` to `'self' https://maps.googleapis.com https://maps.gstatic.com`.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Map iframe URL has current timestamp. CSP connect-src includes maps.gstatic.com.
CHUNK_1_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_2() {
  local log="$LOG_DIR/chunk-2.log"
  echo -e "${YELLOW}▶ Chunk 2/$TOTAL_CHUNKS: Navbar — Asymmetric Layout & Structure${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### GSAP Patterns (established in codebase)
- `useGSAP(() => { ... }, { scope: ref })` for scoped animations with auto-cleanup
- ScrollTrigger: `{ trigger, start: "top 85%", toggleActions: "play none none none" }`
- CSS custom properties as animation targets: `gsap.to(el, { "--prop": value })`
- `.animItem { opacity: 0 }` initial state convention, GSAP sets final values
- ParallaxDrift: `scrub: true`, desktop-only via `gsap.matchMedia()`
- MagneticButton: `gsap.quickTo()` with `elastic.out(1, 0.4)` easing

### Design Tokens
- Colors: `--accent: #2AA876`, `--ochre: #F5A623`, `--fg-dark: #1A1714`, `--muted: #7A756E`
- Fonts: `--font-display: "Clash Display"`, `--font-sans: "Satoshi"`
- Timing: `--duration-fast: 0.2s`, `--duration-normal: 0.4s`, `--duration-slow: 0.8s`
- Spacing: `--space-xs` through `--space-3xl` (4px to 128px)

## Chunk 2/16: Navbar — Asymmetric Layout & Structure

**Read these files first** (do NOT explore beyond this list):
- `components/layout/Navbar.tsx` — current structure (167 lines)
- `components/layout/Navbar.module.css` — current styling (422 lines)
- `data/site.ts` — navigation array (6 items, skips "Inicio" on desktop)

**Modify:**
- `components/layout/Navbar.tsx` — restructure link rendering: dot separators between links, logo text conditional on scroll
- `components/layout/Navbar.module.css` — asymmetric layout: links grouped left (after logo), CTA far right. Replace pill hover with dot-separated links. Update active state to bracket marks.

**What to Build:**
Restructure desktop nav from evenly-spaced pills to asymmetric editorial layout. Links are grouped together with centered dot (·) separators between them (not pills). Active link gets mini bracket marks (same design language as CTA). Logo "Zona Gráfica" text fades out on scroll (just chameleon icon remains). Remove border-radius:100px pills.

**Code to Adapt:**
Active link bracket marks — reuse the CTA's `background-image` gradient technique but at smaller scale:
```css
.navLink.active {
  background-image: /* 8 gradients for 4 corner brackets */;
  background-size: 6px 1px, 1px 6px, /* ... */;
  background-position: 0 0, 0 0, /* ... */;
}
```

Dot separator via CSS `::after` on links (not last-child):
```css
.navLink:not(:last-child)::after {
  content: "·";
  margin-left: 8px;
  color: var(--muted-light);
  pointer-events: none;
}
```

Logo text fade on scroll:
```css
.nav.scrolled .logoFull {
  opacity: 0;
  width: 0;
  overflow: hidden;
  transition: opacity 0.3s, width 0.3s;
}
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Desktop nav shows dot-separated links grouped left. Active link has bracket marks. Logo text hides on scroll.
CHUNK_2_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_3() {
  local log="$LOG_DIR/chunk-3.log"
  echo -e "${YELLOW}▶ Chunk 3/$TOTAL_CHUNKS: Navbar — Scroll Hide/Reveal${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### GSAP Patterns (established in codebase)
- `useGSAP(() => { ... }, { scope: ref })` for scoped animations with auto-cleanup
- ScrollTrigger: `{ trigger, start: "top 85%", toggleActions: "play none none none" }`

### Design Tokens
- Colors: `--accent: #2AA876`, `--ochre: #F5A623`, `--fg-dark: #1A1714`, `--muted: #7A756E`

## Chunk 3/16: Navbar — Scroll Hide/Reveal

**Read these files first** (do NOT explore beyond this list):
- `components/layout/Navbar.tsx` — current scroll detection (scrollY > 60 threshold)
- `components/layout/Navbar.module.css` — scrolled state styles

**Modify:**
- `components/layout/Navbar.tsx` — add scroll direction tracking (store lastScrollY, compare to determine up/down), add `hidden` state when scrolling down past threshold, show when scrolling up
- `components/layout/Navbar.module.css` — add `.hidden` class with `transform: translateY(-100%)` and transition

**What to Build:**
Replace simple "scrolled > 60px" with scroll-direction-aware hide/reveal. When user scrolls down past 80px, nav slides up out of view. When user scrolls up (any amount), nav slides back down with frosted glass. Always visible when near top (scrollY < 80). The inverted state (dark hero) logic remains unchanged.

**Code to Adapt:**
```typescript
const [hidden, setHidden] = useState(false);
const lastScrollY = useRef(0);

useEffect(() => {
  const onScroll = () => {
    const y = window.scrollY;
    setScrolled(y > 60);
    setHidden(y > 80 && y > lastScrollY.current);
    lastScrollY.current = y;
  };
  // ...
}, []);
```

```css
.nav.hidden {
  transform: translateY(-100%);
  pointer-events: none;
}
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Nav hides on scroll-down, reveals on scroll-up. Still shows at top of page. Inverted mode unaffected.
CHUNK_3_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_4() {
  local log="$LOG_DIR/chunk-4.log"
  echo -e "${YELLOW}▶ Chunk 4/$TOTAL_CHUNKS: Navbar — Magnetic Links & Hover Animations${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### GSAP Patterns (established in codebase)
- `useGSAP(() => { ... }, { scope: ref })` for scoped animations with auto-cleanup
- MagneticButton: `gsap.quickTo()` with `elastic.out(1, 0.4)` easing

### Design Tokens
- Colors: `--accent: #2AA876`, `--ochre: #F5A623`, `--fg-dark: #1A1714`, `--muted: #7A756E`

## Chunk 4/16: Navbar — Magnetic Links & Hover Animations

**Read these files first** (do NOT explore beyond this list):
- `components/layout/Navbar.tsx` — current link rendering
- `components/layout/Navbar.module.css` — current hover states
- `components/ui/MagneticButton.tsx` — MagneticButton implementation (strength prop, quickTo pattern, elastic easing)

**Modify:**
- `components/layout/Navbar.tsx` — wrap each nav link in MagneticButton (strength 0.25, lighter than default 0.35). Add GSAP hover animation for number↔label interaction.
- `components/layout/Navbar.module.css` — number hover: scale 1.4x + shift color to accent. Label hover: underline wipe animation (scaleX 0→1, left origin). Remove ghost pill background on hover.

**What to Build:**
Each desktop nav link gets MagneticButton wrapper (subtle pull, strength 0.25). On hover, the ochre number scales up 1.4x and shifts color to accent green. The label gets an underline that wipes in from left (transform-origin: left, scaleX 0→1). Remove the rgba background-color hover effect — replace with these dynamic interactions.

**Code to Adapt:**
```tsx
<MagneticButton strength={0.25} className={styles.navLinkWrap}>
  <Link href={link.href} className={`${styles.navLink} ${active}`}>
    <span className={styles.navNumber}>{link.number}</span>
    {link.label}
  </Link>
</MagneticButton>
```

Number hover animation (CSS):
```css
.navLink:hover .navNumber {
  transform: scale(1.4);
  color: var(--accent);
}
.navNumber {
  transition: transform 0.3s var(--ease-out), color 0.3s var(--ease-out);
  display: inline-block; /* needed for transform */
}
```

Underline wipe (CSS):
```css
.navLink::after {
  content: "";
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background: var(--fg-dark);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s ease;
}
.navLink:hover::after { transform: scaleX(1); }
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Nav links have magnetic pull on hover. Number scales up + changes color. Underline wipes in from left.
CHUNK_4_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_5() {
  local log="$LOG_DIR/chunk-5.log"
  echo -e "${YELLOW}▶ Chunk 5/$TOTAL_CHUNKS: Navbar — Scroll Progress & Section Tracking${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### GSAP Patterns (established in codebase)
- `useGSAP(() => { ... }, { scope: ref })` for scoped animations with auto-cleanup
- ScrollTrigger: `{ trigger, start: "top 85%", toggleActions: "play none none none" }`

### Design Tokens
- Colors: `--accent: #2AA876`, `--ochre: #F5A623`, `--fg-dark: #1A1714`, `--muted: #7A756E`

## Chunk 5/16: Navbar — Scroll Progress & Section Tracking

**Read these files first** (do NOT explore beyond this list):
- `components/layout/Navbar.tsx` — current nav structure
- `components/layout/Navbar.module.css` — current styles
- `components/effects/ScrollProgress.tsx` — existing ScrollProgress implementation (scaleX bar with ScrollTrigger)
- `data/site.ts` — navigation hrefs for section matching

**Modify:**
- `components/layout/Navbar.tsx` — add scroll progress bar element at bottom of nav. Add section-aware active tracking: use IntersectionObserver on page sections matching nav hrefs to highlight current section.
- `components/layout/Navbar.module.css` — add `.progressBar` style (1px accent line at bottom of nav, scaleX driven by scroll). Active link tracking overrides pathname-based active.

**What to Build:**
Add a 1px accent-colored progress bar at the bottom edge of the navbar that grows from left to right as user scrolls (0% at top, 100% at bottom). Implement inline — don't import ScrollProgress component (it's a standalone bar, we need it embedded in nav). Also add section-aware active tracking: on long pages, detect which section is currently in view and highlight the corresponding nav link (e.g., scrolling past portfolio section highlights "Portafolio" even if on home page).

**Code to Adapt:**
Progress bar (inline GSAP in Navbar):
```typescript
useGSAP(() => {
  if (!progressRef.current) return;
  gsap.to(progressRef.current, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  });
}, { scope: navRef });
```

Section tracking (IntersectionObserver):
```typescript
useEffect(() => {
  const sections = document.querySelectorAll("[data-nav-section]");
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.getAttribute("data-nav-section") || "");
      }
    }
  }, { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" });
  sections.forEach(s => observer.observe(s));
  return () => observer.disconnect();
}, [pathname]);
```

Note: Section tracking only works on pages that add `data-nav-section` attributes to their sections. The home page is the primary candidate. On sub-pages, pathname-based active remains.

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Progress bar visible at nav bottom, grows with scroll. Section tracking highlights correct link on home page.
CHUNK_5_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_6() {
  local log="$LOG_DIR/chunk-6.log"
  echo -e "${YELLOW}▶ Chunk 6/$TOTAL_CHUNKS: Portfolio — Coordinated Stagger & ParallaxDrift${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### GSAP Patterns (established in codebase)
- `useGSAP(() => { ... }, { scope: ref })` for scoped animations with auto-cleanup
- ScrollTrigger: `{ trigger, start: "top 85%", toggleActions: "play none none none" }`
- ParallaxDrift: `scrub: true`, desktop-only via `gsap.matchMedia()`

## Chunk 6/16: Portfolio — Coordinated Stagger & ParallaxDrift

**Read these files first** (do NOT explore beyond this list):
- `components/portfolio/ProjectGrid.tsx` — CategoryImageWrap routing, reveal components (DevelopReveal, CenterReveal, DiagonalReveal), grid layout
- `components/portfolio/ProjectGrid.module.css` — grid layout classes, featured vs standard cards
- `components/animations/ParallaxDrift.tsx` — props API (distance, className)

**Modify:**
- `components/portfolio/ProjectGrid.tsx` — add stagger coordination: each card's ScrollTrigger delay increases by 150ms based on its visual position in the current viewport row. Wrap featured card images in ParallaxDrift (distance 20).
- `components/portfolio/ProjectGrid.module.css` — ensure featured cards have overflow:hidden for ParallaxDrift clipping.

**What to Build:**
Instead of all cards triggering independently at `top 85%`, add coordinated stagger. Each reveal component (DevelopReveal, CenterReveal, DiagonalReveal, ImageReveal usage in CategoryImageWrap) receives a `staggerIndex` prop that maps to its position in the grid. Pass `delay={staggerIndex * 0.15}` to create a cascading wave effect across the grid. Wrap featured card images in `<ParallaxDrift distance={20}>` for subtle scroll-linked depth.

**Code to Adapt:**
Add staggerIndex to CategoryImageWrap:
```tsx
function CategoryImageWrap({ category, children, index, staggerIndex }: {
  category: string; children: ReactNode; index: number; staggerIndex: number;
}) {
  const delay = staggerIndex * 0.15;
  // Pass delay to each reveal component
}
```

ParallaxDrift on featured:
```tsx
{project.featured ? (
  <ParallaxDrift distance={20}>
    <CategoryImageWrap ...>{imageElement}</CategoryImageWrap>
  </ParallaxDrift>
) : (
  <CategoryImageWrap ...>{imageElement}</CategoryImageWrap>
)}
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Portfolio cards animate in with cascading delays. Featured cards have parallax drift on scroll.
CHUNK_6_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_7() {
  local log="$LOG_DIR/chunk-7.log"
  echo -e "${YELLOW}▶ Chunk 7/$TOTAL_CHUNKS: Portfolio — Magnetic Tilt Hover${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### GSAP Patterns (established in codebase)
- `useGSAP(() => { ... }, { scope: ref })` for scoped animations with auto-cleanup
- MagneticButton: `gsap.quickTo()` with `elastic.out(1, 0.4)` easing

## Chunk 7/16: Portfolio — Magnetic Tilt Hover

**Read these files first** (do NOT explore beyond this list):
- `components/portfolio/ProjectGrid.tsx` — current card rendering, hover handling
- `components/portfolio/ProjectGrid.module.css` — current hover styles (CSS-only image scale, category-specific filters)

**Modify:**
- `components/portfolio/ProjectGrid.tsx` — add GSAP-driven magnetic tilt on card hover: track mouse position relative to card center, apply perspective + rotateX/rotateY transform. Reset on mouse leave.
- `components/portfolio/ProjectGrid.module.css` — add `perspective: 800px` to card containers, `will-change: transform` on images.

**What to Build:**
On desktop, portfolio card images respond to mouse position with a subtle 3D tilt effect. As cursor moves over a card, the image rotates slightly toward the cursor (max 4deg rotateX, 4deg rotateY). Uses `gsap.quickTo()` for smooth elastic following. On mouse leave, card smoothly returns to flat. Only applies on desktop (matchMedia 769px+). This replaces the static CSS scale hover.

**Code to Adapt:**
```typescript
// Inside ProjectGrid card component
const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  xTo(x * 8);   // ±4deg rotateY
  yTo(y * -8);  // ±4deg rotateX (inverted)
};

const handleMouseLeave = () => {
  xTo(0); yTo(0);
};

// Initialize quickTo refs
const xTo = useRef(gsap.quickTo(el, "rotateY", { duration: 0.6, ease: "power3.out" }));
const yTo = useRef(gsap.quickTo(el, "rotateX", { duration: 0.6, ease: "power3.out" }));
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Cards tilt toward cursor on hover. Smooth return to flat on leave. Desktop only.
CHUNK_7_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_8() {
  local log="$LOG_DIR/chunk-8.log"
  echo -e "${YELLOW}▶ Chunk 8/$TOTAL_CHUNKS: Portfolio — Cinematic Filter Transitions & Idle Float${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### GSAP Patterns (established in codebase)
- `useGSAP(() => { ... }, { scope: ref })` for scoped animations with auto-cleanup
- ScrollTrigger: `{ trigger, start: "top 85%", toggleActions: "play none none none" }`

## Chunk 8/16: Portfolio — Cinematic Filter Transitions & Idle Float

**Read these files first** (do NOT explore beyond this list):
- `components/portfolio/PortfolioClient.tsx` — current FLIP animation on filter change
- `components/portfolio/ProjectGrid.tsx` — grid rendering
- `components/portfolio/ProjectGrid.module.css` — card styles

**Modify:**
- `components/portfolio/PortfolioClient.tsx` — enhance FLIP transition: add blur(8px) on exit, blur(0) on enter, creating cinematic dissolve effect.
- `components/portfolio/ProjectGrid.tsx` — add idle floating animation to featured card images: subtle `y` oscillation (±5px) via GSAP timeline with yoyo repeat.
- `components/portfolio/ProjectGrid.module.css` — add will-change hints for blur/transform.

**What to Build:**
When switching portfolio category filters, items don't just scale in/out — they blur-dissolve. Exiting items: `opacity: 0, scale: 0.95, filter: "blur(8px)"`. Entering items: start at `opacity: 0, scale: 0.95, filter: "blur(8px)"` and resolve to clear. Featured cards get a perpetual idle floating animation: gentle 5px Y oscillation on a 4-second yoyo timeline (desktop only, respects reduced motion).

**Code to Adapt:**
FLIP enhancement:
```typescript
onEnter: (elements) =>
  gsap.fromTo(elements,
    { opacity: 0, scale: 0.95, filter: "blur(8px)" },
    { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5 }
  ),
onLeave: (elements) =>
  gsap.to(elements, { opacity: 0, scale: 0.95, filter: "blur(8px)", duration: 0.35 }),
```

Idle float:
```typescript
gsap.to(featuredImage, {
  y: 5,
  duration: 4,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1,
});
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Filter transitions use blur dissolve. Featured cards float gently. Reduced motion respected.
CHUNK_8_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_9() {
  local log="$LOG_DIR/chunk-9.log"
  echo -e "${YELLOW}▶ Chunk 9/$TOTAL_CHUNKS: Services — Card Text Animations & Parallax${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### GSAP Patterns (established in codebase)
- `useGSAP(() => { ... }, { scope: ref })` for scoped animations with auto-cleanup
- ScrollTrigger: `{ trigger, start: "top 85%", toggleActions: "play none none none" }`
- ParallaxDrift: `scrub: true`, desktop-only via `gsap.matchMedia()`

### Design Tokens
- Colors: `--accent: #2AA876`, `--ochre: #F5A623`, `--fg-dark: #1A1714`, `--muted: #7A756E`
- Fonts: `--font-display: "Clash Display"`, `--font-sans: "Satoshi"`

## Chunk 9/16: Services — Card Text Animations & Parallax

**Read these files first** (do NOT explore beyond this list):
- `components/services/ServiceCard.tsx` — card structure, number/title/description rendering
- `components/services/ServiceCard.module.css` — watermark number (opacity 0.04, clamp 120-300px), title/description styles
- `components/services/ServicesList.tsx` — layout orchestration, MotionSection wrapping
- `components/animations/ParallaxDrift.tsx` — API reference

**Modify:**
- `components/services/ServiceCard.tsx` — convert to client component ("use client"). Add useGSAP: title words animate in with stagger (translateY + opacity), watermark number responds to scroll (parallax via ScrollTrigger scrub). Wrap image in ParallaxDrift.
- `components/services/ServiceCard.module.css` — add `.animWord { opacity: 0 }` initial state. Add will-change for number parallax.

**What to Build:**
Service card titles get split-word animation: each word fades up individually with 80ms stagger as the card enters viewport. The giant watermark number (01-07) gets scroll-linked parallax — drifts upward slowly as user scrolls past (scrub, -20px to +20px range). Service images get ParallaxDrift wrapper (distance 15). Convert ServiceCard to client component since it now needs GSAP.

**Code to Adapt:**
Title split-word:
```tsx
const words = title.split(" ");
return (
  <h3 className={styles.title}>
    {words.map((word, i) => (
      <span key={i} className="animWord" style={{ display: "inline-block" }}>
        {word}{i < words.length - 1 ? "\u00A0" : ""}
      </span>
    ))}
  </h3>
);
```

```typescript
useGSAP(() => {
  gsap.from(".animWord", {
    y: 30, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08,
    scrollTrigger: { trigger: cardRef.current, start: "top 80%", toggleActions: "play none none none" },
  });
}, { scope: cardRef });
```

Number parallax:
```typescript
gsap.fromTo(numberEl, { y: -20 }, {
  y: 20, ease: "none",
  scrollTrigger: { trigger: cardRef.current, start: "top bottom", end: "bottom top", scrub: true },
});
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Service titles animate word-by-word. Watermark numbers drift with scroll. Images have parallax.
CHUNK_9_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_10() {
  local log="$LOG_DIR/chunk-10.log"
  echo -e "${YELLOW}▶ Chunk 10/$TOTAL_CHUNKS: Services — Process Steps Sequential Reveal${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### GSAP Patterns (established in codebase)
- `useGSAP(() => { ... }, { scope: ref })` for scoped animations with auto-cleanup
- ScrollTrigger: `{ trigger, start: "top 85%", toggleActions: "play none none none" }`

## Chunk 10/16: Services — Process Steps Sequential Reveal

**Read these files first** (do NOT explore beyond this list):
- `components/services/ServicesProcess.tsx` — current GSAP animation (line scaleY scrub + dot reveals with 50ms delay)
- `components/services/ServicesProcess.module.css` — timeline line, dot, step layout styles

**Modify:**
- `components/services/ServicesProcess.tsx` — enhance step reveal: each step's content (number, title, description) fades in + slides up sequentially AFTER its dot appears. Add connecting line segments between dots that draw themselves. Each step triggers 200ms after the previous.
- `components/services/ServicesProcess.module.css` — add `.animStep` initial state (opacity 0, translateY 20px). Add connector line segment styles.

**What to Build:**
Upgrade the process timeline from "dots pop in" to a full sequential reveal choreography. The vertical line still grows with scroll (scrub). But now: (1) each dot appears with `back.out(2)` bounce, (2) 150ms after dot appears, the step content (number + title + description) fades up, (3) each step triggers 200ms after the previous one fully appears. The overall effect: line draws → dot bounces in → content reveals → next dot → next content, creating a domino cascade down the timeline.

**Code to Adapt:**
Enhanced step animation:
```typescript
steps.forEach((step, i) => {
  const content = step.querySelector(`.${styles.stepContent}`);

  // Dot bounce
  gsap.to(step, {
    "--dot-opacity": 1, "--dot-scale": 1,
    duration: 0.4, ease: "back.out(2)",
    scrollTrigger: { trigger: step, start: "top 75%", toggleActions: "play none none none" },
    delay: i * 0.2,
  });

  // Content reveal (tied to same trigger, extra delay)
  gsap.from(content, {
    y: 20, opacity: 0, duration: 0.6, ease: "power3.out",
    scrollTrigger: { trigger: step, start: "top 75%", toggleActions: "play none none none" },
    delay: i * 0.2 + 0.15,
  });
});
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Process timeline shows cascading reveal: line grows → dots bounce → content fades up sequentially.
CHUNK_10_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_11() {
  local log="$LOG_DIR/chunk-11.log"
  echo -e "${YELLOW}▶ Chunk 11/$TOTAL_CHUNKS: Blog Listing — Editorial Enhancement${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### MotionSection Variants
`fade-up | slide-left | slide-right | clip-up | scale-in | blur-in`
Uses IntersectionObserver (15% threshold), adds `is-visible` class, fires `onVisible` callback.

### Blog Post Frontmatter
`title, excerpt, category, date, isoDate, readingTime, featured, gradientFrom, gradientTo, image?`

### Design Tokens
- Colors: `--accent: #2AA876`, `--ochre: #F5A623`, `--fg-dark: #1A1714`, `--muted: #7A756E`

## Chunk 11/16: Blog Listing — Editorial Enhancement

**Read these files first** (do NOT explore beyond this list):
- `components/blog/PostGrid.tsx` — current grid (featured + list, MotionSection wrappers)
- `components/blog/PostGrid.module.css` — current styles (featured split, list items)
- `components/blog/BlogHero.tsx` — hero animation
- `components/animations/MotionSection.tsx` — variant list (blur-in available)
- `lib/blog.ts` — BlogPostMeta type (gradientFrom, gradientTo fields)

**Modify:**
- `components/blog/PostGrid.tsx` — change MotionSection variants: featured uses `clip-up`, list items use `blur-in` with stagger. Add gradient accent bar to each list item using post's gradientFrom color. Add creative reading time (small visual progress arc or icon).
- `components/blog/PostGrid.module.css` — featured post image gets subtle parallax (CSS transform on hover or scroll). List items get gradient accent left-border. Reading time visualization styles.

**What to Build:**
Transform blog listing from "safe grid" to editorial showcase. Featured post: `clip-up` reveal with 4px left border using post's `gradientFrom` color. List items: `blur-in` variant (exists but unused) with stagger mode. Each list item gets a 3px left border colored by the post's `gradientFrom`. Reading time shown as a small circular arc (SVG) instead of plain text — the arc fills proportional to reading time (e.g., 5min = 5/10 = half circle).

**Code to Adapt:**
Gradient accent border:
```tsx
<div className={styles.listItem} style={{ borderLeftColor: post.gradientFrom }}>
```

Reading time arc (small SVG):
```tsx
function ReadingArc({ minutes }: { minutes: number }) {
  const pct = Math.min(minutes / 10, 1);
  const r = 8; const c = 2 * Math.PI * r;
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className={styles.readingArc}>
      <circle cx="10" cy="10" r={r} fill="none" stroke="var(--border-light)" strokeWidth="2" />
      <circle cx="10" cy="10" r={r} fill="none" stroke="var(--accent)" strokeWidth="2"
        strokeDasharray={`${c * pct} ${c}`} transform="rotate(-90 10 10)" />
    </svg>
  );
}
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Blog listing uses blur-in with stagger. Gradient accent borders visible. Reading time arcs render.
CHUNK_11_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_12() {
  local log="$LOG_DIR/chunk-12.log"
  echo -e "${YELLOW}▶ Chunk 12/$TOTAL_CHUNKS: Blog MDX Components — Callout, PullQuote, Stat${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### MotionSection Variants
`fade-up | slide-left | slide-right | clip-up | scale-in | blur-in`
Uses IntersectionObserver (15% threshold), adds `is-visible` class, fires `onVisible` callback.

### Design Tokens
- Colors: `--accent: #2AA876`, `--ochre: #F5A623`, `--fg-dark: #1A1714`, `--muted: #7A756E`
- Fonts: `--font-display: "Clash Display"`, `--font-sans: "Satoshi"`

## Chunk 12/16: Blog MDX Components — Callout, PullQuote, Stat

**Read these files first** (do NOT explore beyond this list):
- `mdx-components.tsx` — currently empty, need to register components
- `components/blog/PostContent.tsx` — MDXRemote rendering
- `components/blog/PostContent.module.css` — existing prose styles (blockquote, etc.)
- `types/content.ts` — existing type patterns

**Create:**
- `components/blog/mdx/Callout.tsx` — branded aside box (accent border, icon, background tint)
- `components/blog/mdx/Callout.module.css` — callout styles
- `components/blog/mdx/PullQuote.tsx` — oversized quote that breaks out of content column
- `components/blog/mdx/PullQuote.module.css` — pullquote styles (negative margins, large display font)
- `components/blog/mdx/Stat.tsx` — big number with label (e.g., "30+" / "años de experiencia")
- `components/blog/mdx/Stat.module.css` — stat styles (large Clash Display number, accent color)

**Modify:**
- `mdx-components.tsx` — register Callout, PullQuote, Stat components

**What to Build:**
Three editorial MDX components. **Callout**: bordered aside with cream background, accent left border, optional icon (tip/warning/note types). **PullQuote**: full-bleed quote that breaks out of 680px content column with negative margins, using Clash Display italic at 28-36px, with top/bottom ochre borders. **Stat**: big number (Clash Display, 64px, accent) with small label below — for embedding impressive metrics in prose. All three are client components wrapped in MotionSection for scroll reveal.

**Code to Adapt:**
Callout:
```tsx
export function Callout({ type = "note", children }: { type?: "note" | "tip" | "warning"; children: ReactNode }) {
  return (
    <MotionSection as="div" variant="fade-up" className={styles.callout} data-type={type}>
      <div className={styles.icon}>{icons[type]}</div>
      <div className={styles.content}>{children}</div>
    </MotionSection>
  );
}
```

PullQuote:
```tsx
export function PullQuote({ children, attribution }: { children: ReactNode; attribution?: string }) {
  return (
    <MotionSection as="div" variant="clip-up" className={styles.pullQuote}>
      <blockquote>{children}</blockquote>
      {attribution && <cite className={styles.attribution}>{attribution}</cite>}
    </MotionSection>
  );
}
```

MDX registration:
```tsx
export function useMDXComponents(): MDXComponents {
  return { Callout, PullQuote, Stat };
}
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Components render when used in MDX files. Scroll reveal works.
CHUNK_12_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_13() {
  local log="$LOG_DIR/chunk-13.log"
  echo -e "${YELLOW}▶ Chunk 13/$TOTAL_CHUNKS: Blog MDX Components — Gallery, VideoEmbed${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### MotionSection Variants
`fade-up | slide-left | slide-right | clip-up | scale-in | blur-in`
Uses IntersectionObserver (15% threshold), adds `is-visible` class, fires `onVisible` callback.

## Chunk 13/16: Blog MDX Components — Gallery, VideoEmbed

**Read these files first** (do NOT explore beyond this list):
- `mdx-components.tsx` — current registrations (from chunk 12)
- `components/blog/PostContent.module.css` — image breakout styles

**Create:**
- `components/blog/mdx/Gallery.tsx` — multi-image grid with lightbox overlay
- `components/blog/mdx/Gallery.module.css` — responsive grid (2-3 columns), hover zoom, lightbox overlay
- `components/blog/mdx/VideoEmbed.tsx` — branded YouTube/video wrapper
- `components/blog/mdx/VideoEmbed.module.css` — 16:9 aspect ratio, play overlay, branded frame

**Modify:**
- `mdx-components.tsx` — add Gallery, VideoEmbed to registrations

**What to Build:**
**Gallery**: Accepts array of image objects `{ src, alt, caption? }`. Renders as responsive grid (2 cols on mobile, 3 on desktop) with ImageReveal on each image. Click opens a simple lightbox overlay (dark backdrop, large image, close button). Full-bleed — breaks out of 680px column. **VideoEmbed**: Accepts `url` (YouTube) and optional `caption`. Renders 16:9 container with custom play overlay (matching the video service play button style). On click, replaces overlay with actual iframe. Caption below in muted italic.

**Code to Adapt:**
Gallery grid:
```tsx
<MotionSection as="div" variant="fade-up" className={styles.gallery} stagger>
  {images.map((img, i) => (
    <button key={i} className={styles.galleryItem} onClick={() => setLightbox(i)}>
      <ImageReveal direction={i % 2 === 0 ? "left" : "bottom"}>
        <Image src={img.src} alt={img.alt} fill style={{ objectFit: "cover" }} />
      </ImageReveal>
      {img.caption && <span className={styles.caption}>{img.caption}</span>}
    </button>
  ))}
</MotionSection>
```

VideoEmbed:
```tsx
<div className={styles.videoWrap}>
  {!playing ? (
    <button onClick={() => setPlaying(true)} className={styles.playOverlay}>
      <svg>/* play icon */</svg>
    </button>
  ) : (
    <iframe src={embedUrl} allow="autoplay" ... />
  )}
  {caption && <p className={styles.videoCaption}>{caption}</p>}
</div>
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Gallery renders responsive grid, lightbox opens on click. VideoEmbed shows play overlay, loads iframe on click.
CHUNK_13_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_14() {
  local log="$LOG_DIR/chunk-14.log"
  echo -e "${YELLOW}▶ Chunk 14/$TOTAL_CHUNKS: Blog Post — Typography & Scroll Reveals${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### MotionSection Variants
`fade-up | slide-left | slide-right | clip-up | scale-in | blur-in`

### Blog Post Frontmatter
`title, excerpt, category, date, isoDate, readingTime, featured, gradientFrom, gradientTo, image?`

### Design Tokens
- Colors: `--accent: #2AA876`, `--ochre: #F5A623`, `--fg-dark: #1A1714`, `--muted: #7A756E`
- Fonts: `--font-display: "Clash Display"`, `--font-sans: "Satoshi"`

## Chunk 14/16: Blog Post — Typography & Scroll Reveals

**Read these files first** (do NOT explore beyond this list):
- `components/blog/PostContent.tsx` — current MDXRemote rendering
- `components/blog/PostContent.module.css` — all prose styles (242 lines: drop cap, counters, blockquotes, lists, code, images)

**Modify:**
- `components/blog/PostContent.tsx` — convert to client component if not already. Add MotionSection wrappers around content sections (each h2-to-h2 block). Add gradient accent from post meta as CSS variable.
- `components/blog/PostContent.module.css` — large italic lead paragraph after each h2. Small-caps for first line of first paragraph in each section. Variable width: blockquotes and images break out wider (already partially done with -40px margins, enhance). Add hanging punctuation on blockquotes. Post gradient as subtle section divider accent.

**What to Build:**
Upgrade blog post typography from "clean but standard" to "editorial magazine." Each section (h2 + content until next h2) gets a MotionSection wrapper with `fade-up` variant for scroll reveal. First paragraph after each h2 gets slightly larger font (clamp 17-20px) and italic style as a "lead paragraph." Add `hanging-punctuation: first` on blockquotes. Section dividers (the h2 border-top) get a subtle gradient tint using the post's `gradientFrom` color. Images and blockquotes extend to `calc(100% + 120px)` with `-60px` margins for more dramatic breakout.

**Code to Adapt:**
Lead paragraph (CSS):
```css
.prose h2 + p {
  font-size: clamp(17px, 1.8vw, 20px);
  font-style: italic;
  color: var(--fg-dark);
  line-height: 1.75;
}
```

Gradient section divider:
```css
.prose h2 {
  border-image: linear-gradient(to right, var(--post-gradient, var(--accent)), transparent) 1;
  border-top-width: 2px;
}
```

Pass gradient as CSS variable:
```tsx
<article className={styles.prose} style={{ "--post-gradient": meta.gradientFrom } as React.CSSProperties}>
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Lead paragraphs render italic after h2. Section dividers show gradient. Content sections reveal on scroll. Images/quotes break out wider.
CHUNK_14_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_15() {
  local log="$LOG_DIR/chunk-15.log"
  echo -e "${YELLOW}▶ Chunk 15/$TOTAL_CHUNKS: Blog Post — Header Upgrade & Reading Progress${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### GSAP Patterns (established in codebase)
- `useGSAP(() => { ... }, { scope: ref })` for scoped animations with auto-cleanup

### Blog Post Frontmatter
`title, excerpt, category, date, isoDate, readingTime, featured, gradientFrom, gradientTo, image?`

### Design Tokens
- Colors: `--accent: #2AA876`, `--ochre: #F5A623`, `--fg-dark: #1A1714`, `--muted: #7A756E`
- Fonts: `--font-display: "Clash Display"`, `--font-sans: "Satoshi"`

## Chunk 15/16: Blog Post — Header Upgrade & Reading Progress

**Read these files first** (do NOT explore beyond this list):
- `components/blog/PostHeader.tsx` — current split-screen layout
- `components/blog/PostHeader.module.css` — header styles (172 lines)
- `components/effects/ScrollProgress.tsx` — existing implementation
- `app/(site)/blog/[slug]/page.tsx` — page composition

**Modify:**
- `components/blog/PostHeader.tsx` — add GSAP entrance animation (title words stagger in, metadata fades). Use post gradient colors as subtle wash on title column background.
- `components/blog/PostHeader.module.css` — title column gets subtle gradient wash (5% opacity) from gradientFrom→transparent. Enhance breadcrumb integration.
- `app/(site)/blog/[slug]/page.tsx` — add ScrollProgress component to blog post pages. Pass post gradient color as accent override.

**What to Build:**
Blog post header gets entrance animation: title words stagger in (similar to service card pattern — split by word, 80ms stagger, fade up). Category label and metadata fade in after title. The title column background gets a very subtle gradient wash using the post's `gradientFrom` at 5% opacity, giving each post a unique color identity. Add ScrollProgress to blog post pages — the existing component renders a progress bar at the top of the page. Modify it to accept an optional color prop for the post's gradient accent.

**Code to Adapt:**
Title word stagger (in PostHeader, convert to client component):
```typescript
useGSAP(() => {
  gsap.from(".animWord", {
    y: 40, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
  });
  gsap.from(metaRef.current, {
    y: 20, opacity: 0, duration: 0.6, ease: "power3.out", delay: 0.4,
  });
}, { scope: headerRef });
```

Gradient wash:
```css
.titleCol {
  background: linear-gradient(135deg, var(--post-gradient, transparent) 0%, transparent 60%);
  background-blend-mode: soft-light;
}
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Title words animate in on load. Gradient wash visible on title column. ScrollProgress bar visible on blog posts.
CHUNK_15_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

run_chunk_16() {
  local log="$LOG_DIR/chunk-16.log"
  echo -e "${YELLOW}▶ Chunk 16/$TOTAL_CHUNKS: Blog Post — Related Posts & Author Presence${NC}"

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
Stack: Next.js 16, React 19, TypeScript 5.9, GSAP 3.14, Lenis, MDX, Biome, Bun
Check: `npx tsc --noEmit && bun run lint`

## Research Findings

### MotionSection Variants
`fade-up | slide-left | slide-right | clip-up | scale-in | blur-in`
Uses IntersectionObserver (15% threshold), adds `is-visible` class, fires `onVisible` callback.

### Blog Post Frontmatter
`title, excerpt, category, date, isoDate, readingTime, featured, gradientFrom, gradientTo, image?`

### Design Tokens
- Colors: `--accent: #2AA876`, `--ochre: #F5A623`, `--fg-dark: #1A1714`, `--muted: #7A756E`
- Fonts: `--font-display: "Clash Display"`, `--font-sans: "Satoshi"`

## Chunk 16/16: Blog Post — Related Posts & Author Presence

**Read these files first** (do NOT explore beyond this list):
- `app/(site)/blog/[slug]/page.tsx` — current page composition (PostHeader + PostContent + BlogCTA)
- `components/blog/BlogCTA.tsx` — existing P.D. signature section
- `components/blog/PostGrid.tsx` — list item rendering (reuse pattern)
- `lib/blog.ts` — getAllPosts function, post data access

**Create:**
- `components/blog/RelatedPosts.tsx` — "Sigue leyendo" section with 2-3 related posts
- `components/blog/RelatedPosts.module.css` — card grid styles
- `components/blog/mdx/AuthorAside.tsx` — inline author voice component for MDX
- `components/blog/mdx/AuthorAside.module.css` — margin-note style (accent left border, J.H. initials)

**Modify:**
- `app/(site)/blog/[slug]/page.tsx` — add RelatedPosts after BlogCTA. Pass current post slug and category for filtering.
- `mdx-components.tsx` — register AuthorAside component

**What to Build:**
**RelatedPosts**: Section showing 2-3 other posts (same category first, then recent). Rendered as horizontal cards with image thumbnail, title, and reading time. Wrapped in MotionSection with stagger. Uses `blur-in` variant. **AuthorAside**: MDX component for inline author commentary. Renders as a margin-note style aside with J.H. initials badge, accent left border, and italic text in slightly different tone. Used in MDX like `<AuthorAside>Esto es algo que aprendí después de 20 años...</AuthorAside>`. Creates author presence throughout the post, not just the P.D. at the end.

**Code to Adapt:**
RelatedPosts:
```tsx
export default async function RelatedPosts({ currentSlug, category }: Props) {
  const allPosts = await getAllPosts();
  const related = allPosts
    .filter(p => p.meta.slug !== currentSlug)
    .sort((a, b) => (a.meta.category === category ? -1 : 1))
    .slice(0, 3);

  return (
    <MotionSection as="section" variant="fade-up" className={styles.section} stagger>
      <h2 className={styles.heading}>Sigue leyendo</h2>
      <div className={styles.grid}>
        {related.map(post => (
          <Link href={`/blog/${post.meta.slug}`} key={post.meta.slug} className={styles.card}>
            {post.meta.image && <Image src={post.meta.image} ... />}
            <h3>{post.meta.title}</h3>
            <span>{post.meta.readingTime}</span>
          </Link>
        ))}
      </div>
    </MotionSection>
  );
}
```

AuthorAside:
```tsx
export function AuthorAside({ children }: { children: ReactNode }) {
  return (
    <aside className={styles.authorAside}>
      <span className={styles.initials}>J.H.</span>
      <div className={styles.asideContent}>{children}</div>
    </aside>
  );
}
```

**Rules:**
- Read ONLY the files listed above. Do NOT explore the codebase.
- Implement ONLY what's described. No extras, no refactoring.
- After implementing: `npx tsc --noEmit && bun run lint`
- Fix ALL errors before finishing.
- Do NOT ask questions.

**Gate:** `npx tsc --noEmit && bun run lint` passes. Related posts appear after BlogCTA. AuthorAside renders in MDX content with margin-note styling.
CHUNK_16_PROMPT
)$context_section" < /dev/null 2>&1 | tee "$log"
}

# ══════════════════════════════════════════════════════
# MAIN LOOP
# ══════════════════════════════════════════════════════

CHUNK_FUNCTIONS=(
  run_chunk_1 run_chunk_2 run_chunk_3 run_chunk_4
  run_chunk_5 run_chunk_6 run_chunk_7 run_chunk_8
  run_chunk_9 run_chunk_10 run_chunk_11 run_chunk_12
  run_chunk_13 run_chunk_14 run_chunk_15 run_chunk_16
)
CHUNK_NAMES=(
  "Google Maps Fix"
  "Navbar — Asymmetric Layout & Structure"
  "Navbar — Scroll Hide/Reveal"
  "Navbar — Magnetic Links & Hover Animations"
  "Navbar — Scroll Progress & Section Tracking"
  "Portfolio — Coordinated Stagger & ParallaxDrift"
  "Portfolio — Magnetic Tilt Hover"
  "Portfolio — Cinematic Filter Transitions & Idle Float"
  "Services — Card Text Animations & Parallax"
  "Services — Process Steps Sequential Reveal"
  "Blog Listing — Editorial Enhancement"
  "Blog MDX Components — Callout, PullQuote, Stat"
  "Blog MDX Components — Gallery, VideoEmbed"
  "Blog Post — Typography & Scroll Reveals"
  "Blog Post — Header Upgrade & Reading Progress"
  "Blog Post — Related Posts & Author Presence"
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
