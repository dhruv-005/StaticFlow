#!/bin/bash
set -euo pipefail

TARGET_URL="${1:-${TARGET_URL:-http://host.docker.internal:3000}}"
REPORT_DIR="${REPORT_DIR:-/engine/reports}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="${REPORT_DIR}/nikto_report_${TIMESTAMP}.json"

echo "=================================================="
echo "🛡️  StaticFlow: Starting Nikto Web Server Scan"
echo "🎯 Target URL: ${TARGET_URL}"
echo "=================================================="

mkdir -p "${REPORT_DIR}"

nikto -h "${TARGET_URL}" \
    -Format json \
    -output "${REPORT_FILE}" || true

echo "✅ Nikto Scan Complete."
