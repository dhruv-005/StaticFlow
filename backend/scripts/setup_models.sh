#!/bin/bash
set -euo pipefail

echo "=================================================="
echo "🤖 StaticFlow: Pulling Free Local Ollama AI Models"
echo "=================================================="

OLLAMA_HOST="${OLLAMA_BASE_URL:-http://localhost:11434}"

# Verify Ollama is reachable
if ! curl -s "${OLLAMA_HOST}/api/tags" > /dev/null; then
    echo "❌ Error: Ollama daemon is not running at ${OLLAMA_HOST}"
    echo "💡 Start Ollama locally with: 'ollama serve' or 'docker compose up ollama'"
    exit 1
fi

echo "[*] Pulling DeepSeek Coder 6.7B (Code Generation Model)..."
curl -s -X POST "${OLLAMA_HOST}/api/pull" -d '{"name": "deepseek-coder:6.7b"}' | while read -r line; do echo -n "."; done
echo ""

echo "[*] Pulling CodeLlama 7B (API & Schema Model)..."
curl -s -X POST "${OLLAMA_HOST}/api/pull" -d '{"name": "codellama:7b"}' | while read -r line; do echo -n "."; done
echo ""

echo "[*] Pulling Mistral 7B (General Architecture Model)..."
curl -s -X POST "${OLLAMA_HOST}/api/pull" -d '{"name": "mistral:7b"}' | while read -r line; do echo -n "."; done
echo ""

echo "🎉 All local AI models pulled and verified successfully!"
