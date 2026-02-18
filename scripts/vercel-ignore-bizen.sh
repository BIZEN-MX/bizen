#!/usr/bin/env bash
set -euo pipefail

# Vercel Ignore Build Step for the BIZEN project
# Exit 0  -> skip build
# Exit 1+ -> run build

# Get changed files (fallback to build if unknown)
CHANGED_FILES=$(git diff --name-only HEAD^ HEAD || true)
if [ -z "$CHANGED_FILES" ]; then
  # In case of shallow/no diff context, run the build
  exit 1
fi

# If any change touches BIZEN-specific or shared/global files, run build
if echo "$CHANGED_FILES" | grep -E '^(src/app/bizen/|src/lib/supabase/client-bizen\.ts|src/shared/|public/|package\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb|next\.config\.ts|postcss\.config\.mjs|tailwind\.config|tsconfig\.json|eslint\.config\.mjs|middleware\.ts)' -q; then
  exit 1
fi

# If changes are only outside BIZEN scope (e.g., microcred-only), skip build
exit 0


