#!/bin/bash
cd ~/music/staticflow

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}⚡ STATICFLOW — FULL VERIFICATION ⚡${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Counts
DIRS=$(find . -type d | grep -v '.git\|node_modules\|__pycache__' | wc -l)
FILES=$(find . -type f | grep -v '.git\|node_modules\|__pycache__' | wc -l)

echo ""
echo -e "${CYAN}📊 COUNTS${NC}"
echo -e "   Folders: ${GREEN}$DIRS${NC}"
echo -e "   Files:   ${GREEN}$FILES${NC}"

# Expected minimums
if [ "$DIRS" -ge 95 ]; then
  echo -e "   Folders: ${GREEN}✅ PASS (≥95)${NC}"
else
  echo -e "   Folders: ${RED}❌ FAIL (expected ≥95, got $DIRS)${NC}"
fi

if [ "$FILES" -ge 300 ]; then
  echo -e "   Files:   ${GREEN}✅ PASS (≥300)${NC}"
else
  echo -e "   Files:   ${RED}❌ FAIL (expected ≥300, got $FILES)${NC}"
fi

# Critical paths
echo ""
echo -e "${CYAN}🔍 CRITICAL PATHS${NC}"
CRITICAL=(
  "app/(dashboard)/builder"
  "app/api/generate"
  "components/builder"
  "components/security"
  "backend/app/services/ai"
  "backend/app/services/security"
  "security-engine/scanners"
  "prisma"
)

ALL_OK=true
for p in "${CRITICAL[@]}"; do
  if [ -d "$p" ]; then
    echo -e "   ${GREEN}✅${NC} $p"
  else
    echo -e "   ${RED}❌${NC} $p"
    ALL_OK=false
  fi
done

# Empty dirs
EMPTY=$(find . -type d -empty | grep -v '.git\|node_modules\|__pycache__' | wc -l)
echo ""
echo -e "${CYAN}⚠️  EMPTY DIRECTORIES${NC}"
if [ "$EMPTY" -eq 0 ]; then
  echo -e "   ${GREEN}✅ None — all folders have files${NC}"
else
  echo -e "   ${YELLOW}⚠️  $EMPTY empty directories found:${NC}"
  find . -type d -empty | grep -v '.git\|node_modules\|__pycache__' | head -10 | sed 's/^/      /'
  if [ "$EMPTY" -gt 10 ]; then
    echo -e "      ${YELLOW}... and $((EMPTY - 10)) more${NC}"
  fi
fi

# Final verdict
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ALL_OK" = true ] && [ "$FILES" -ge 300 ] && [ "$DIRS" -ge 95 ]; then
  echo -e "${GREEN}🎉 ALL CHECKS PASSED — READY TO CODE!${NC}"
else
  echo -e "${YELLOW}⚠️  SOME ISSUES FOUND — REVIEW ABOVE${NC}"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
