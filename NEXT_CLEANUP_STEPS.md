# 🎯 Next Cleanup Steps

## ✅ Completed

1. ✅ Removed BSMX component
2. ✅ Removed duplicate `src/api/` directory (32 files)

## 🔍 What's Left to Clean Up

### 1. Code References (Update, Don't Remove)

These files still have Microcredential/Mondragon references but are **still in use**. Update the references, don't remove the files:

#### High Priority:
1. **`src/lib/emailValidation.ts`**
   - Remove Mondragon email validation if BIZEN doesn't need it
   - Or update to be BIZEN-specific

2. **`src/app/api/signup/route.ts`**
   - Simplify if BIZEN-only (remove Microcredential logic)
   - Or keep if you need both apps

3. **`src/app/api/users/list/route.ts`**
   - Remove Microcredential user filtering if not needed

4. **`src/app/api/free-chatbot/route.ts`**
   - Remove Microcredential references in responses

5. **`src/data/faq.json`**
   - Remove Microcredential-specific FAQ entries

#### Medium Priority:
6. **Admin routes** - Remove Mondragon-specific filtering:
   - `src/app/api/admin/list-users/route.ts`
   - `src/app/api/admin/quiz-results/route.ts`
   - `src/app/api/admin/module-quiz-results/route.ts`
   - `src/app/api/admin/overall-results/route.ts`
   - `src/app/api/admin/delete-user-data/route.ts`

7. **`src/landing/page.tsx`**
   - Remove BSMX references

8. **`src/app/bizen/page.tsx`**
   - Remove Mondragon references if present

### 2. Files Still Using Microcredential Client

These files use `client-microcred.ts` - decide if you want to migrate them to BIZEN client:

- `src/app/simuladores/page.tsx`
- `src/app/configuracion/page.tsx`
- `src/app/cuenta/page.tsx`
- `src/app/profile/page.tsx`
- Several API routes

**Action:** Keep for now, or migrate to BIZEN client if you want full separation

### 3. Root Auth Routes (Optional)

**Question:** Does BIZEN use `/bizen/login` or root `/login`?

**If BIZEN uses `/bizen/login`:**
- Remove `src/app/login/`
- Remove `src/app/signup/`
- Remove `src/app/auth/callback/`
- Update BIZEN routes to use `/bizen/login` instead of `/login`

**If BIZEN uses root `/login`:**
- Keep them (they're needed)

---

## 🚀 Recommended Next Steps

### Step 1: Test Your App (5 minutes)

```bash
npm run dev
```

**Check:**
- ✅ App starts without errors
- ✅ Login works
- ✅ API routes work
- ✅ No broken imports

### Step 2: Clean Up Code References (15-30 minutes)

**Start with the easiest:**

1. **Update `src/data/faq.json`**
   - Remove Microcredential-specific entries
   - Keep BIZEN-related FAQs

2. **Update `src/lib/emailValidation.ts`**
   - Remove Mondragon checks if BIZEN doesn't need them
   - Or make it configurable

3. **Update API routes**
   - Remove Microcredential user filtering
   - Simplify signup route if BIZEN-only

### Step 3: Decide on Auth Routes (5 minutes)

**Check what BIZEN actually uses:**

```bash
# See if BIZEN routes use /login or /bizen/login
grep -r "/login\|/signup" src/app/bizen/ --include="*.tsx"
```

**If they use `/login`:**
- Keep root auth routes
- Update references to be clearer

**If they use `/bizen/login`:**
- Remove root auth routes
- Update any remaining references

### Step 4: Optional - Migrate Microcredential Client (Later)

**If you want full separation:**
- Update routes to use BIZEN client instead
- Then remove `client-microcred.ts`

**If you want to keep both:**
- Keep it (it's working fine)

---

## 📋 Quick Checklist

- [ ] Test app after removing `src/api/`
- [ ] Update `src/data/faq.json` (remove Microcredential refs)
- [ ] Update `src/lib/emailValidation.ts` (remove Mondragon checks)
- [ ] Update `src/app/api/signup/route.ts` (simplify if BIZEN-only)
- [ ] Update admin routes (remove Mondragon filtering)
- [ ] Decide on root auth routes (keep or remove)
- [ ] Update `src/landing/page.tsx` (remove BSMX refs)

---

## 🎯 Priority Order

1. **Test first** - Make sure nothing broke
2. **Update FAQ** - Easiest, low risk
3. **Update email validation** - Quick win
4. **Update API routes** - More impactful
5. **Decide on auth routes** - Architectural decision
6. **Migrate clients** - Optional, can do later

---

## 💡 Tips

- **One file at a time** - Test after each change
- **Keep it working** - Don't break existing functionality
- **Use git** - Commit after each successful cleanup
- **Ask if unsure** - Better to ask than break something

---

## 🆘 If Something Breaks

1. **Check imports:**
   ```bash
   npm run build
   # Fix any import errors
   ```

2. **Check API routes:**
   - Make sure routes exist in `src/app/api/`
   - Test them in browser/Postman

3. **Revert if needed:**
   ```bash
   git checkout -- src/path/to/file
   ```


