#!/bin/sh
export OPENAI_BASE_URL="${OPENAI_BASE_URL:-http://127.0.0.1:9655/v1}"
export OPENAI_API_KEY="${OPENAI_API_KEY:-local}"
if command -v cursor >/dev/null 2>&1; then
  exec cursor "$@"
fi
if [ "$(uname)" = Darwin ] && [ -d "/Applications/Cursor.app" ]; then
  exec open -a Cursor --args "$@"
fi
echo "Cursor not found. In Settings → Models set Override OpenAI Base URL to $OPENAI_BASE_URL" >&2
exit 1
