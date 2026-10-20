#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}🔍 STATICFLOW — FULL SYSTEM ERROR & HEALTH SCANNER 🔍${NC}"
echo -e "${CYAN}======================================================${NC}"
echo ""

ERRORS_FOUND=0

# ─────────────────────────────────────────────────────────────
# 1. PRISMA SCHEMA & CLIENT CHECK
# ─────────────────────────────────────────────────────────────
echo -e "${CYAN}[1/6] Testing Database & Prisma Client...${NC}"
if npx prisma generate > /dev/null 2>&1; then
  echo -e "  ${GREEN}✅ Prisma Schema & Client: OK${NC}"
else
  echo -e "  ${RED}❌ Prisma Client Generation Failed!${NC}"
  npx prisma generate
  ERRORS_FOUND=$((ERRORS_FOUND + 1))
fi

# ─────────────────────────────────────────────────────────────
# 2. TYPESCRIPT COMPILER & IMPORT RESOLUTION CHECK
# ─────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}[2/6] Checking TypeScript Types & Missing Imports...${NC}"
TS_ERRORS=$(npx tsc --noEmit 2>&1 || true)
if [ -z "$TS_ERRORS" ]; then
  echo -e "  ${GREEN}✅ TypeScript: 0 Type or Import Errors!${NC}"
else
  echo -e "  ${YELLOW}⚠️  TypeScript Findings:${NC}"
  echo "$TS_ERRORS" | head -n 15 | sed 's/^/     /'
fi

# ─────────────────────────────────────────────────────────────
# 3. NEXT.JS PRODUCTION BUILD CHECK
# ─────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}[3/6] Running Next.js Production Build Test...${NC}"
BUILD_OUTPUT=$(npm run build 2>&1 || true)
if echo "$BUILD_OUTPUT" | grep -q "✓ Generating static pages"; then
  echo -e "  ${GREEN}✅ Frontend Production Build: PASSED (All pages compiled!)${NC}"
else
  echo -e "  ${RED}❌ Frontend Build Failed!${NC}"
  echo "$BUILD_OUTPUT" | tail -n 25 | sed 's/^/     /'
  ERRORS_FOUND=$((ERRORS_FOUND + 1))
fi

# ─────────────────────────────────────────────────────────────
# 4. PYTHON BACKEND FASTAPI CHECK
# ─────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}[4/6] Testing Python FastAPI Backend Engine...${NC}"
PY_BIN="./backend/venv/bin/python3"
if [ ! -f "$PY_BIN" ]; then
  PY_BIN="python3"
fi

PY_TEST=$($PY_BIN -c "import sys; sys.path.insert(0, './backend'); import main; print(f'Routes: {len(main.app.routes)}')" 2>&1 || true)
if echo "$PY_TEST" | grep -q "Routes:"; then
  echo -e "  ${GREEN}✅ Python Backend: PASSED ($PY_TEST)${NC}"
else
  echo -e "  ${RED}❌ Python Backend Import Error!${NC}"
  echo "$PY_TEST" | sed 's/^/     /'
  ERRORS_FOUND=$((ERRORS_FOUND + 1))
fi

# ─────────────────────────────────────────────────────────────
# 5. GIT TRACKING & UNPUSHED COMMITS CHECK
# ─────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}[5/6] Checking Git Sync & Untracked Files...${NC}"
git fetch origin > /dev/null 2>&1 || true
LOCAL_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "none")
REMOTE_SHA=$(git rev-parse --short origin/main 2>/dev/null || echo "none")
UNCOMMITTED=$(git status --porcelain)

echo "  Local Commit:  $LOCAL_SHA"
echo "  GitHub Commit: $REMOTE_SHA"

if [ -n "$UNCOMMITTED" ]; then
  echo -e "  ${YELLOW}⚠️  You have uncommitted changes on disk:${NC}"
  echo "$UNCOMMITTED" | head -n 10 | sed 's/^/     /'
else
  echo -e "  ${GREEN}✅ Working directory clean (All files staged/committed).${NC}"
fi

if [ "$LOCAL_SHA" != "$REMOTE_SHA" ]; then
  echo -e "  ${YELLOW}⚠️  Local commits are NOT pushed to GitHub yet!${NC}"
  echo "     Run: git push origin main"
  ERRORS_FOUND=$((ERRORS_FOUND + 1))
else
  echo -e "  ${GREEN}✅ Git Sync: Local and GitHub (origin/main) are identical!${NC}"
fi

# ─────────────────────────────────────────────────────────────
# 6. LIVE PRODUCTION ENDPOINTS CHECK
# ─────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}[6/6] Pinging Live Production URLs...${NC}"

RENDER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://staticflow.onrender.com/health || echo "000")
if [ "$RENDER_STATUS" = "200" ]; then
  echo -e "  ${GREEN}✅ Render Backend (https://staticflow.onrender.com): LIVE (200 OK)${NC}"
else
  echo -e "  ${YELLOW}⚠️  Render Backend returned HTTP $RENDER_STATUS (Service may be asleep)${NC}"
fi

VERCEL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://staticflow-dhruv-005.vercel.app/home || echo "000")
if [ "$VERCEL_STATUS" = "200" ]; then
  echo -e "  ${GREEN}✅ Vercel Frontend (https://staticflow-dhruv-005.vercel.app): LIVE (200 OK)${NC}"
else
  echo -e "  ${YELLOW}⚠️  Vercel Frontend returned HTTP $VERCEL_STATUS${NC}"
fi

# ─────────────────────────────────────────────────────────────
# FINAL SUMMARY
# ─────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}======================================================${NC}"
if [ $ERRORS_FOUND -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL CORE CHECKS PASSED — ZERO FATAL ERRORS FOUND!${NC}"
else
  echo -e "${RED}⚠️  $ERRORS_FOUND ISSUE(S) DETECTED — REVIEW DETAILS ABOVE${NC}"
fi
echo -e "${CYAN}======================================================${NC}"
echo ""

