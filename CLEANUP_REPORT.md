# 🧹 Cleanup Report - Current Status

## ✅ Good Progress!

You've already removed:
- ✅ Module routes (`src/app/module/`, `src/module/`)
- ✅ Some Microcredential-specific files

## 🔍 What Still Needs Cleaning

### 1. **BSMX Component (Microcredential-Specific)** ⚠️

**File to remove:**
```
src/components/BSMXWelcomeM1.ssr.tsx
```

**Why:** "BSMX" = "Brand Builders Microcredencial" - clearly from the old project

**Check first:** Is this component used anywhere?
```bash
grep -r "BSMXWelcomeM1" src/
```

---

### 2. **Microcredential Supabase Client** ⚠️

**File to check:**
```
src/lib/supabase/client-microcred.ts
```

**Question:** Does BIZEN use this, or only `client-bizen.ts`?

**If BIZEN doesn't use it:**
- Remove `src/lib/supabase/client-microcred.ts`
- Remove `src/lib/supabase/server-microcred.ts` (if exists)
- Check for imports: `grep -r "client-microcred\|server-microcred" src/`

---

### 3. **Root Login/Signup Routes** ⚠️

**Files to check:**
```
src/app/login/
src/app/signup/
src/app/auth/callback/
```

**Question:** Does BIZEN use `/bizen/login` or root `/login`?

**If BIZEN uses `/bizen/login`:**
- Remove `src/app/login/`
- Remove `src/app/signup/`
- Remove `src/app/auth/callback/` (if BIZEN uses `/bizen/auth/callback`)

**Check first:**
```bash
# See if these routes are referenced
grep -r "/login\|/signup" src/app/bizen/
```

---

### 4. **Code References to Clean Up** 📝

**Files with Microcredential/Mondragon references:**

#### High Priority (Remove References):
1. `src/components/BSMXWelcomeM1.ssr.tsx` - Remove entire file if not used
2. `src/lib/emailValidation.ts` - Remove Mondragon email checks if BIZEN doesn't need them
3. `src/data/faq.json` - Remove Microcredential references
4. `src/landing/page.tsx` - Remove BSMX references

#### Medium Priority (Update References):
1. `src/app/api/signup/route.ts` - Remove Microcredential logic if BIZEN-only
2. `src/app/api/users/list/route.ts` - Remove Microcredential user filtering
3. `src/app/api/free-chatbot/route.ts` - Remove Microcredential references
4. Admin routes - Remove Mondragon-specific filtering

#### Low Priority (Keep if Used):
- `src/components/ModuleSectionsGated.tsx` - Keep if BIZEN has modules
- `src/components/BillyChatbot.tsx` - Keep if it mentions Microcredential in content only

---

### 5. **Duplicate API Routes** 🔄

**You have duplicate routes in:**
- `src/api/` (old location)
- `src/app/api/` (Next.js 13+ location)

**Action:** Remove `src/api/` directory entirely (Next.js 13+ uses `src/app/api/`)

**Check first:**
```bash
# See what's in the old location
ls -la src/api/
```

---

### 6. **Old Auth Context** ⚠️

**File to check:**
```
src/contexts/AuthContext.tsx
```

**Question:** Does BIZEN use `AuthContextBizen` only?

**If yes:**
- Remove `src/contexts/AuthContext.tsx`
- Check for imports: `grep -r "AuthContext" src/app/bizen/`

---

## 🎯 Recommended Cleanup Order

### Phase 1: Remove Obvious Microcredential Files (Safest)

```bash
# 1. Remove BSMX component
rm src/components/BSMXWelcomeM1.ssr.tsx

# 2. Check if used first
grep -r "BSMXWelcomeM1" src/
# If no results, safe to remove
```

### Phase 2: Remove Duplicate API Routes

```bash
# Remove old API location (if you're using src/app/api/)
rm -rf src/api/
```

### Phase 3: Remove Microcredential Auth (If Not Used)

```bash
# If BIZEN uses /bizen/login only:
rm -rf src/app/login/
rm -rf src/app/signup/
rm -rf src/app/auth/callback/
```

### Phase 4: Clean Up Code References

Update files to remove Microcredential mentions:
- `src/lib/emailValidation.ts` - Remove Mondragon checks
- `src/app/api/signup/route.ts` - Simplify if BIZEN-only
- `src/data/faq.json` - Remove Microcredential references

---

## 🔍 Quick Check Commands

**Before removing, check if files are used:**

```bash
# Check if BSMX component is imported
grep -r "BSMXWelcomeM1" src/

# Check if microcred client is used
grep -r "client-microcred\|server-microcred" src/

# Check if root login is used
grep -r "/login" src/app/bizen/

# Check if old AuthContext is used
grep -r "from.*AuthContext" src/app/bizen/ | grep -v "AuthContextBizen"
```

---

## ✅ Files to KEEP (BIZEN-Specific)

These are good - keep them:
- ✅ `src/app/bizen/` - BIZEN app
- ✅ `src/app/business-lab/` - Business Lab
- ✅ `src/app/cash-flow/` - Cash Flow game
- ✅ `src/app/simuladores/` - Simulators
- ✅ `src/app/forum/` - Forum
- ✅ `src/contexts/AuthContextBizen.tsx` - BIZEN auth
- ✅ `src/lib/supabase/client-bizen.ts` - BIZEN Supabase

---

## 🚀 Next Steps

1. **Run the check commands above** - See what's actually used
2. **Remove obvious files** - BSMX component, duplicate APIs
3. **Test after each removal** - `npm run dev` to check
4. **Clean up code references** - Remove Microcredential mentions

---

## 📊 Summary

**Still to remove:**
- ~5-10 files (BSMX, microcred clients, root auth routes)
- ~10-15 code references (Mondragon checks, Microcredential mentions)
- 1 duplicate directory (`src/api/`)

**Estimated cleanup time:** 15-30 minutes







