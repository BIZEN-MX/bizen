# 🧹 Cleanup Plan - Remove Microcredential Files

## 🎯 Goal

BIZEN is a copy of the Microcredential project. This document identifies files that are **Microcredential-specific** and can be safely removed from BIZEN.

---

## 📋 Files to Remove (Microcredential-Specific)

### 1. Module/Course Routes (Microcredential Learning System)

**These are for the student course system:**

```
src/app/module/              # Entire module system
src/app/modules/             # Module menu
src/app/dashboard/           # Student dashboard (if different from BIZEN)
src/app/path/                # Learning path
src/app/learn/               # Learning routes
src/app/unit/                # Unit routes
src/app/assignments/         # Student assignments
src/app/quiz/                # Quiz system
src/app/module-test/         # Module tests
src/app/test-module/         # Test modules
src/app/final-test/          # Final test
src/app/diagnostic-quiz/     # Diagnostic quiz
src/app/course-complete/     # Course completion
src/app/workbook-download/   # Workbook downloads
```

**Also check:**
- `src/module/` directory (if exists)
- `src/modules/` directory (if exists)

### 2. Microcredential Authentication Routes

**If BIZEN uses `/bizen/login` and `/bizen/signup`, these can be removed:**

```
src/app/login/               # Root login (Microcredential)
src/app/signup/              # Root signup (Microcredential)
src/app/forgot-password/     # If BIZEN has its own
src/app/reset-password/      # If BIZEN has its own
src/app/auth/callback/       # Root auth callback (if BIZEN has /bizen/auth/callback)
```

**Keep:**
- `src/app/bizen/login/` ✅
- `src/app/bizen/signup/` ✅
- `src/app/bizen/auth/callback/` ✅

### 3. Microcredential-Specific Components

**Check these components for Microcredential references:**

```
src/components/ModuleGate.tsx
src/components/ModuleSectionsGated.tsx
src/components/SectionGate.tsx
src/components/DiagnosticQuiz.tsx
src/components/FinalTestQuiz.tsx
src/components/BSMXWelcomeM1.ssr.tsx  # "BSMX" = Brand Builders Microcredencial
src/components/BSMXOnePage.tsx
```

### 4. Microcredential API Routes

**These handle student progress, modules, etc.:**

```
src/app/api/modules/         # Module management
src/app/api/curriculum/      # Curriculum (if Microcredential-specific)
src/app/api/progress/        # Student progress tracking
src/app/api/sections/        # Section completion
src/app/api/assignments/     # Assignments
src/app/api/enrollments/     # Course enrollments
src/app/api/prerequisites/   # Prerequisites
src/app/api/lessons/         # Lessons
src/app/api/units/           # Units
src/app/api/quizzes/         # Quizzes (if Microcredential-specific)
src/app/api/diagnostic-quiz/ # Diagnostic quiz
src/app/api/final-test/      # Final test
src/app/api/objectives/      # Learning objectives
```

**Also check `src/api/` directory** (might be duplicate routes)

### 5. Microcredential Contexts & Supabase Clients

**If BIZEN uses its own:**

```
src/contexts/AuthContext.tsx           # Microcredential auth (keep AuthContextBizen)
src/lib/supabase/client-microcred.ts   # Microcredential client
src/lib/supabase/server-microcred.ts   # Microcredential server
```

**Keep:**
- `src/contexts/AuthContextBizen.tsx` ✅
- `src/lib/supabase/client-bizen.ts` ✅
- `src/lib/supabase/server-bizen.ts` ✅

### 6. Teacher/Admin Routes (If Not Needed)

**These might be Microcredential-specific:**

```
src/app/teacher/             # Teacher dashboard
src/app/admin/               # Admin panel (if Microcredential-specific)
```

**Keep if BIZEN needs admin/teacher features**

### 7. References in Code

**Search for and remove/update:**

- `microcredential` / `Microcredential`
- `mondragon` / `Mondragón` / `@mondragonmexico.edu.mx`
- `BSMX` (Brand Builders Microcredencial)
- Email validation for Mondragon emails

---

## ✅ Files to KEEP (BIZEN-Specific)

```
src/app/bizen/               # BIZEN app routes ✅
src/app/business-lab/        # Business Lab (BIZEN feature) ✅
src/app/cash-flow/           # Cash Flow game (BIZEN feature) ✅
src/app/simuladores/          # Simulators (BIZEN feature) ✅
src/app/forum/               # Forum (if BIZEN uses it) ✅
src/app/courses/             # If BIZEN has courses ✅
src/app/profile/             # User profile ✅
src/app/progress/             # If BIZEN tracks progress ✅
src/app/configuracion/        # Settings ✅
src/app/cuenta/               # Account ✅
src/app/payment/              # Payments ✅
src/app/leaderboard/          # Leaderboard ✅
```

---

## 🔍 How to Identify What to Remove

### Step 1: Search for Microcredential References

```bash
# Find files mentioning microcredential
grep -r "microcredential" src/ --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort -u

# Find files mentioning Mondragon
grep -r "mondragon\|Mondragón" src/ --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort -u

# Find files mentioning BSMX
grep -r "BSMX" src/ --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort -u
```

### Step 2: Check Route Usage

**Ask yourself:**
- Does BIZEN use `/module/*` routes? → Remove if no
- Does BIZEN use `/dashboard` (root)? → Remove if BIZEN uses `/bizen/dashboard`
- Does BIZEN use `/login` (root)? → Remove if BIZEN uses `/bizen/login`

### Step 3: Check API Routes

**Ask yourself:**
- Does BIZEN track student progress through modules? → Remove `api/progress/` if no
- Does BIZEN have a module/lesson system? → Remove `api/modules/`, `api/lessons/` if no
- Does BIZEN have quizzes? → Keep if yes, remove if Microcredential-specific

---

## ⚠️ Before Removing

### 1. Backup First
```bash
# Create a backup branch
git checkout -b backup-before-cleanup
git add .
git commit -m "Backup before cleanup"
git checkout main  # or your main branch
```

### 2. Test After Each Removal

**Remove one category at a time:**
1. Remove module routes
2. Test app
3. Remove auth routes
4. Test app
5. Continue...

### 3. Check Dependencies

**Before removing a file, check:**
- Is it imported anywhere?
- Does BIZEN actually use this feature?
- Is it shared between BIZEN and Microcredential?

---

## 🚀 Safe Removal Order

### Phase 1: Clear Microcredential Routes (Safest)
1. Remove `src/app/module/`
2. Remove `src/app/modules/`
3. Remove `src/app/dashboard/` (if BIZEN has `/bizen/dashboard`)
4. Remove `src/app/path/`
5. Remove `src/app/learn/` (if Microcredential-specific)

### Phase 2: Remove Microcredential Auth (If Separate)
1. Remove `src/app/login/` (if BIZEN uses `/bizen/login`)
2. Remove `src/app/signup/` (if BIZEN uses `/bizen/signup`)
3. Remove `src/app/auth/callback/` (if BIZEN uses `/bizen/auth/callback`)

### Phase 3: Remove Microcredential Components
1. Remove module-related components
2. Remove quiz components (if not used by BIZEN)
3. Remove BSMX components

### Phase 4: Remove Microcredential API Routes
1. Remove `src/app/api/modules/`
2. Remove `src/app/api/progress/` (if Microcredential-specific)
3. Remove `src/app/api/sections/`
4. Remove other Microcredential-specific APIs

### Phase 5: Clean Up Code References
1. Remove Microcredential auth context (if not needed)
2. Remove Microcredential Supabase clients
3. Update middleware to remove Microcredential route checks
4. Remove email validation for Mondragon

---

## 📝 Quick Checklist

Before removing, verify:

- [ ] BIZEN doesn't use this route/component
- [ ] No BIZEN features depend on this
- [ ] This is clearly Microcredential-specific
- [ ] I've backed up the code
- [ ] I can test after removal

---

## 🆘 Need Help?

If unsure about a file:
1. Check if it's imported in BIZEN routes
2. Search for references: `grep -r "filename" src/app/bizen/`
3. Ask before removing if uncertain

---

## 🎯 Next Steps

1. **Review this plan** - Confirm what BIZEN actually uses
2. **Create backup** - Git branch or copy
3. **Start with Phase 1** - Remove module routes
4. **Test after each phase** - Make sure nothing breaks
5. **Continue gradually** - Don't remove everything at once

