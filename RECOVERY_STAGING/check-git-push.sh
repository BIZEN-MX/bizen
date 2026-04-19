#!/bin/bash

# Quick test script to check if GitHub push is working
# Run: bash check-git-push.sh

echo "🔍 Testing GitHub connection..."

# Test 1: Check if we can read from remote
echo -n "1. Testing git ls-remote... "
if git ls-remote origin main &>/dev/null; then
    echo "✅ SUCCESS - GitHub is working!"
    echo ""
    echo "You can now push with: git push origin main"
    exit 0
else
    echo "❌ FAILED - Still can't access GitHub"
    echo ""
    echo "Error details:"
    git ls-remote origin main 2>&1 | head -3
    exit 1
fi



