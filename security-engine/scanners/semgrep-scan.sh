#!/bin/bash
set -euo pipefail

TARGET_PATH="${1:-/target}"
CONFIG_FILE="${2:-/engine/configs/semgrep-rules.yaml}"
REPORT_DIR="${REPORT_DIR:-/engine/reports}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="${REPORT_DIR}/semgrep_report_${TIMESTAMP}.json"

echo "=================================================="
echo "🛡️  StaticFlow: Starting Semgrep AST Static Analysis"
echo "📂 Target Path: ${TARGET_PATH}"
echo "⚙️ Config:      ${CONFIG_FILE}"
echo "📁 Output:      ${REPORT_FILE}"
echo "=================================================="

mkdir -p "${REPORT_DIR}"

semgrep scan \
    --config="${CONFIG_FILE}" \
    --json \
    --output="${REPORT_FILE}" \
    "${TARGET_PATH}" || true

echo "✅ Semgrep Analysis Complete. Report saved to ${REPORT_FILE}"
