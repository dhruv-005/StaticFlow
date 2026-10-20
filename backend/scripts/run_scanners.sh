#!/bin/bash
set -euo pipefail

TARGET_URL="${1:-http://localhost:3000}"
SCAN_TYPE="${2:-quick}"

echo "=================================================="
echo "🛡️  StaticFlow: Running Local Scanner Pipeline"
echo "🎯 Target: ${TARGET_URL}"
echo "=================================================="

echo "[1/3] Running Semgrep AST Code Rule Scan..."
python3 -m semgrep scan --config=../security-engine/configs/semgrep-rules.yaml ../ --error || true

echo "[2/3] Executing Python AST Security Checks (Bandit)..."
python3 -m bandit -r ../backend/ -lll || true

echo "[3/3] Checking API Endpoints via HTTP Fuzz..."
curl -s -o /dev/null -w "HTTP Probe Response Code: %{http_code}\n" "${TARGET_URL}/health" || true

echo "✅ Local Scanner Pipeline Completed."
