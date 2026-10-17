#!/bin/bash
set -euo pipefail

echo "🔧 StaticFlow Backend: Render Build Script"
echo "Python version: $(python3 --version)"

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Build complete!"
