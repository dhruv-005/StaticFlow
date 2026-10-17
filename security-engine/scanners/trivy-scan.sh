#!/bin/bash
set -euo pipefail

TARGET_PATH="${1:-/target}"
REPORT_DIR="${REPORT_DIR:-/engine/reports}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="${REPORT_DIR}/trivy_report_${TIMESTAMP}.json"

echo "=================================================="
echo "🛡️  StaticFlow: Starting Trivy Dependency & FS Audit"
echo "📂 Target Path: ${TARGET_PATH}"
echo "=================================================="

mkdir -p "${REPORT_DIR}"

trivy fs \
    --scanners vuln,secret,misconfig \
    --format json \
    --output "${REPORT_FILE}" \
    "${TARGET_PATH}" || true

echo "✅ Trivy Audit Complete. Report saved to ${REPORT_FILE}"
