#!/usr/bin/env bash
set -euo pipefail

# Vercel Ignore Build Step for the Microcredential project
# Exit 0  -> skip build
# Exit 1+ -> run build

CHANGED_FILES=$(git diff --name-only HEAD^ HEAD || true)
if [ -z "$CHANGED_FILES" ]; then
  exit 1
fi

# 1. Build if global or shared files changed
if echo "$CHANGED_FILES" | grep -E '^(src/lib/supabase/client\.ts|src/shared/|public/|package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb|next\.config\.ts|postcss\.config\.mjs|tailwind\.config|tsconfig\.json|eslint\.config\.mjs|middleware\.ts)' -q; then
  exit 1
fi

# 2. Build if anything in src/app changed EXCEPT src/app/bizen/
# We identify this by checking if there's a file that starts with src/app/ 
# but DOES NOT match src/app/bizen/
if echo "$CHANGED_FILES" | grep '^src/app/' | grep -v '^src/app/bizen/' -q; then
  exit 1
fi

# If the only changes are inside BIZEN-only paths, skip Microcred build
exit 0


