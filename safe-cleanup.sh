#!/bin/bash

# Safe Cleanup Script for BIZEN
# Removes files that are confirmed safe to remove

echo "🧹 Starting safe cleanup..."
echo ""

# 1. Remove BSMX component (not used anywhere)
echo "1. Removing BSMX component..."
if [ -f "src/components/BSMXWelcomeM1.ssr.tsx" ]; then
    rm src/components/BSMXWelcomeM1.ssr.tsx
    echo "   ✅ Removed BSMXWelcomeM1.ssr.tsx"
else
    echo "   ⚠️  File already removed"
fi

# 2. Remove duplicate src/api/ directory (Next.js 13+ uses src/app/api/)
echo ""
echo "2. Checking for duplicate API routes..."
if [ -d "src/api" ]; then
    echo "   ⚠️  Found src/api/ directory"
    echo "   📋 Contents:"
    ls -1 src/api/ | head -5
    echo ""
    read -p "   Remove src/api/ directory? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf src/api/
        echo "   ✅ Removed src/api/ directory"
    else
        echo "   ⏭️  Skipped"
    fi
else
    echo "   ✅ Already removed"
fi

# 3. Check for root auth routes
echo ""
echo "3. Checking root auth routes..."
if [ -d "src/app/login" ] || [ -d "src/app/signup" ]; then
    echo "   ⚠️  Found root login/signup routes"
    echo "   📋 If BIZEN uses /bizen/login, these can be removed"
    echo ""
    read -p "   Remove root login/signup? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf src/app/login/
        rm -rf src/app/signup/
        rm -rf src/app/auth/callback/
        echo "   ✅ Removed root auth routes"
    else
        echo "   ⏭️  Skipped"
    fi
else
    echo "   ✅ Already removed"
fi

# 4. Summary
echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Test your app: npm run dev"
echo "   2. Check for broken imports"
echo "   3. Review CLEANUP_REPORT.md for code references to clean up"







