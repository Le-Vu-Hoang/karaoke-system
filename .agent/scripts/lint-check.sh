#!/bin/bash
# lint-check.sh — Chạy lint trên subproject liên quan sau khi agent sửa file
# Được gọi bởi hooks.json (PostToolUse)
# Working directory: /home/hoang/Projects/KTV-System/.agent/

set -euo pipefail

# Đọc stdin (context từ AGY hook system)
INPUT=$(cat)

# Xác định file nào vừa được sửa từ tool args
MODIFIED_FILE=$(echo "$INPUT" | python3 -c "
import json, sys
data = json.load(sys.stdin)
args = data.get('toolCall', {}).get('args', {})
# Thử các field names của các tool khác nhau
for key in ['TargetFile', 'AbsolutePath', 'Path']:
    if key in args:
        print(args[key])
        break
" 2>/dev/null || echo "")

if [ -z "$MODIFIED_FILE" ]; then
  echo "{}" 
  exit 0
fi

PROJECT_ROOT="/home/hoang/Projects/KTV-System"

# Xác định subproject và chạy lint tương ứng
if [[ "$MODIFIED_FILE" == *"/backend/"* ]]; then
  cd "$PROJECT_ROOT/backend"
  pnpm lint --quiet 2>&1 | tail -5 || true

elif [[ "$MODIFIED_FILE" == *"/ktv_cus/"* ]]; then
  cd "$PROJECT_ROOT/ktv_cus"
  pnpm lint --quiet 2>&1 | tail -5 || true

elif [[ "$MODIFIED_FILE" == *"/ktv_manager/"* ]]; then
  cd "$PROJECT_ROOT/ktv_manager"
  pnpm lint --quiet 2>&1 | tail -5 || true
fi

echo "{}"
