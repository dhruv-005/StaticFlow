#!/bin/bash
set -euo pipefail

TARGET_URL="${1:-${TARGET_URL:-http://host.docker.internal:3000}}"
REPORT_DIR="${REPORT_DIR:-/engine/reports}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="${REPORT_DIR}/nuclei_report_${TIMESTAMP}.json"

echo "=================================================="
echo "🛡️  StaticFlow: Starting Nuclei Vulnerability Scan"
echo "🎯 Target URL: ${TARGET_URL}"
echo "📁 Output:     ${REPORT_FILE}"
echo "=================================================="

mkdir -p "${REPORT_DIR}"

nuclei -u "${TARGET_URL}" \
    -tags cve,owasp,exposure,misconfig,auth \
    -severity critical,high,medium,low \
    -jsonl \
    -output "${REPORT_FILE}" || true

echo "✅ Nuclei Scan Complete. Report saved to ${REPORT_FILE}"
