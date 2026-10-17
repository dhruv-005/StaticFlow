#!/bin/bash
set -euo pipefail

TARGET_URL="${1:-${TARGET_URL:-http://host.docker.internal:3000/api/items?id=1}}"
REPORT_DIR="${REPORT_DIR:-/engine/reports}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="${REPORT_DIR}/sqlmap_report_${TIMESTAMP}.json"

echo "=================================================="
echo "🛡️  StaticFlow: Starting SQLMap Injection Scan"
echo "🎯 Target URL: ${TARGET_URL}"
echo "📁 Output:     ${REPORT_FILE}"
echo "=================================================="

mkdir -p "${REPORT_DIR}"

sqlmap -u "${TARGET_URL}" \
    --batch \
    --random-agent \
    --level=2 \
    --risk=2 \
    --threads=4 \
    --answers="follow=Y" \
    --output-dir="${REPORT_DIR}/sqlmap_raw_${TIMESTAMP}" || true

cat <<EOF > "${REPORT_FILE}"
{
  "scanner": "SQLMap",
  "target": "${TARGET_URL}",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "status": "completed",
  "raw_directory": "${REPORT_DIR}/sqlmap_raw_${TIMESTAMP}"
}
EOF

echo "✅ SQLMap Scan Finished."
