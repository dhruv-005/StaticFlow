#!/bin/bash
set -euo pipefail

TARGET_PATH="${1:-/target}"
REPORT_DIR="${REPORT_DIR:-/engine/reports}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="${REPORT_DIR}/bandit_report_${TIMESTAMP}.json"

echo "=================================================="
echo "🛡️  StaticFlow: Starting Bandit Python AST Scan"
echo "📂 Target Path: ${TARGET_PATH}"
echo "=================================================="

mkdir -p "${REPORT_DIR}"

bandit -r "${TARGET_PATH}" \
    -f json \
    -o "${REPORT_FILE}" \
    -lll || true

echo "✅ Bandit Scan Complete. Report saved to ${REPORT_FILE}"
