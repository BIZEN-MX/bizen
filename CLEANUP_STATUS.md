# 🧹 Cleanup Status Report

## ✅ What You've Already Removed

Good progress! You've removed:
- ✅ Module routes (`src/app/module/`, `src/module/`)
- ✅ Some Microcredential-specific files

## 🔍 Current Status

### Files Safe to Remove NOW:

1. **BSMX Component** ✅ SAFE
   - File: `src/components/BSMXWelcomeM1.ssr.tsx`
   - Status: Not imported anywhere (checked)
   - Action: `rm src/components/BSMXWelcomeM1.ssr.tsx`

2. **Duplicate API Directory** ⚠️ CHECK FIRST
   - Directory: `src/api/`
   - Status: You have both `src/api/` and `src/app/api/`
   - Next.js 13+ uses `src/app/api/`
   - Action: Check if `src/api/` is still used, then remove

3. **Root Auth Routes** ⚠️ CHECK FIRST
   - Directories: `src/app/login/`, `src/app/signup/`, `src/app/auth/callback/`
   - Status: If BIZEN uses `/bizen/login`, these can be removed
   - Action: Verify BIZEN doesn't use root `/login` first

### Files Still in Use (DON'T REMOVE):

1. **Microcredential Supabase Client** ⚠️ STILL USED
   - File: `src/lib/supabase/client-microcred.ts`
   - Used in:
     - `src/app/simuladores/page.tsx`
     - `src/app/configuracion/page.tsx`
     - `src/app/cuenta/page.tsx`
     - `src/app/profile/page.tsx`
     - Several API routes
   - Action: **Keep for now** - these routes still use it

2. **Old AuthContext** ⚠️ CHECK
   - File: `src/contexts/AuthContext.tsx`
   - Status: Need to check if BIZEN uses it
   - Action: Check imports before removing

---

## 🚀 Quick Actions

### Run Safe Cleanup Script:

```bash
bash safe-cleanup.sh
```

This will:
1. Remove BSMX component (safe)
2. Ask about removing `src/api/` (check first)
3. Ask about removing root auth routes (check first)

### Or Remove Manually:

```bash
# 1. Remove BSMX (100% safe)
rm src/components/BSMXWelcomeM1.ssr.tsx

# 2. Check duplicate API directory
ls -la src/api/
# If you're using src/app/api/, remove src/api/
rm -rf src/api/

# 3. Test after each removal
npm run dev
```

---

## 📝 Code References to Clean Up

After removing files, update these files to remove Microcredential references:

1. **`src/lib/emailValidation.ts`**
   - Remove Mondragon email checks if BIZEN doesn't need them

2. **`src/app/api/signup/route.ts`**
   - Simplify if BIZEN-only (remove Microcredential logic)

3. **`src/app/api/users/list/route.ts`**
   - Remove Microcredential user filtering

4. **`src/data/faq.json`**
   - Remove Microcredential references

5. **`src/landing/page.tsx`**
   - Remove BSMX references

6. **Admin routes**
   - Remove Mondragon-specific filtering

---

## 🎯 Recommended Next Steps

1. **Run safe cleanup:**
   ```bash
   bash safe-cleanup.sh
   ```

2. **Test your app:**
   ```bash
   npm run dev
   # Check that everything still works
   ```

3. **Check for broken imports:**
   ```bash
   npm run build
   # Fix any import errors
   ```

4. **Clean up code references:**
   - Update files listed above
   - Remove Microcredential/Mondragon mentions

5. **Gradually migrate away from microcred client:**
   - Update routes to use BIZEN client instead
   - Then you can remove `client-microcred.ts`

---

## 📊 Summary

**Safe to remove now:**
- ✅ BSMX component (1 file)
- ⚠️ Duplicate API directory (check first)
- ⚠️ Root auth routes (check first)

**Still in use (keep for now):**
- ⚠️ Microcredential Supabase client (used in 10+ files)
- ⚠️ Old AuthContext (check first)

**Code cleanup needed:**
- ~10 files with Microcredential/Mondragon references

**Estimated remaining cleanup:** 20-30 minutes


