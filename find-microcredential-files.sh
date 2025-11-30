#!/bin/bash

# Script to find Microcredential-specific files in BIZEN project
# Run: bash find-microcredential-files.sh

echo "🔍 Finding Microcredential-specific files..."
echo ""

echo "📁 Files mentioning 'microcredential':"
grep -r "microcredential\|Microcredential" src/ --include="*.tsx" --include="*.ts" --include="*.json" | cut -d: -f1 | sort -u

echo ""
echo "📁 Files mentioning 'mondragon' or 'Mondragón':"
grep -r "mondragon\|Mondragón" src/ --include="*.tsx" --include="*.ts" --include="*.json" | cut -d: -f1 | sort -u

echo ""
echo "📁 Files mentioning 'BSMX' (Brand Builders Microcredencial):"
grep -r "BSMX" src/ --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort -u

echo ""
echo "📁 Module-related routes (likely Microcredential):"
find src/app/module* -type f 2>/dev/null
find src/app/modules* -type f 2>/dev/null
find src/module* -type f 2>/dev/null

echo ""
echo "📁 Microcredential auth routes (if BIZEN uses /bizen/*):"
find src/app/login -type f 2>/dev/null
find src/app/signup -type f 2>/dev/null
find src/app/auth/callback -type f 2>/dev/null

echo ""
echo "✅ BIZEN-specific routes (KEEP these):"
find src/app/bizen -type f 2>/dev/null | head -10
echo "... (showing first 10)"

echo ""
echo "📊 Summary:"
echo "Review the files above and check CLEANUP_PLAN.md for removal instructions"







