#!/bin/bash
set -e

PROJECT_DIR="/mnt/e/Projects/zona-grafica"
PLAN_FILE="$PROJECT_DIR/.gg/current-plan.md"
CLAUDE_MD="$PROJECT_DIR/CLAUDE.md"
LOG_DIR="$PROJECT_DIR/.gg/logs"
CHECK_COMMAND="bun run lint && npx tsc --noEmit"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

START_CHUNK=1
CLEANUP_EVERY=0
SKIP_FINAL_CHECK=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --start) START_CHUNK="$2"; shift 2 ;;
    --cleanup-every) CLEANUP_EVERY="$2"; shift 2 ;;
    --skip-final-check) SKIP_FINAL_CHECK=true; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

mkdir -p "$LOG_DIR"

echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Plan Executor - $(basename "$PROJECT_DIR")${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════════${NC}"

TOTAL_CHUNKS=$(grep -cE "^### Chunk [0-9]+:" "$PLAN_FILE" || echo "0")
echo -e "${GREEN}✓${NC} $TOTAL_CHUNKS chunks, starting from $START_CHUNK"
[[ "$CLEANUP_EVERY" -gt 0 ]] && echo -e "${GREEN}✓${NC} Cleanup every $CLEANUP_EVERY chunks"
echo ""

generate_prompt() {
  local num=$1
  local name=$2
  cat << EOF
Continue work on project at $PROJECT_DIR

**Chunk**: $num of $TOTAL_CHUNKS - $name

Read .gg/current-plan.md for full details.

Instructions:
1. Find Chunk $num and implement exactly what it describes
2. Only modify files listed in that chunk
3. Do NOT run checks - just implement the code

Report what was implemented when done. Do NOT ask questions.
EOF
}

run_chunk() {
  local num=$1
  local name=$2
  local log="$LOG_DIR/chunk-${num}.log"

  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}Chunk $num: $name${NC}"

  cd "$PROJECT_DIR"

  if ggcoder --max-turns 50 --print "$(generate_prompt "$num" "$name")" 2>&1 | tee "$log"; then
    echo -e "${GREEN}✓ Chunk $num done${NC}"
  else
    echo -e "${RED}✗ Chunk $num failed${NC}"
    exit 1
  fi
}

run_cleanup() {
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}Running CLAUDE.md cleanup...${NC}"

  cd "$PROJECT_DIR"

  ggcoder --max-turns 10 --print "Run /init to clean up CLAUDE.md. Keep it minimal." 2>&1 | tee "$LOG_DIR/cleanup.log"

  echo -e "${CYAN}✓ Cleanup done${NC}"
}

CHUNKS_SINCE_CLEANUP=0

grep -E "^### Chunk [0-9]+:" "$PLAN_FILE" | while read -r line; do
  num=$(echo "$line" | grep -oE "Chunk [0-9]+" | grep -oE "[0-9]+")
  name=$(echo "$line" | sed 's/### Chunk [0-9]*: //' | sed 's/ (parallel-safe:.*//')

  if [[ "$num" -lt "$START_CHUNK" ]]; then
    echo -e "${YELLOW}Skipping chunk $num${NC}"
    continue
  fi

  run_chunk "$num" "$name"

  ((CHUNKS_SINCE_CLEANUP++)) || true
  if [[ "$CLEANUP_EVERY" -gt 0 && "$CHUNKS_SINCE_CLEANUP" -ge "$CLEANUP_EVERY" ]]; then
    run_cleanup
    CHUNKS_SINCE_CLEANUP=0
  fi
done

echo ""
echo -e "${GREEN}══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  All chunks complete!${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════════${NC}"

if [[ "$SKIP_FINAL_CHECK" != "true" ]]; then
  echo -e "${BLUE}Running final checks...${NC}"
  cd "$PROJECT_DIR"
  $CHECK_COMMAND && echo -e "${GREEN}✓ Checks passed${NC}" || echo -e "${RED}✗ Checks failed${NC}"
fi

echo ""
echo -e "${GREEN}Done! Next steps:${NC}"
echo -e "  1. Review changes"
echo -e "  2. Run /commit when ready"
