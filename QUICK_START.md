# ⚡ Quick Start - What to Do Right Now

## 1️⃣ Test First (5 minutes)

```bash
# Start your dev server
npm run dev
```

**Check:**
- ✅ App starts without errors
- ✅ Login works
- ✅ Protected routes work
- ✅ Admin routes work

**If anything breaks → Stop and let me know!**

---

## 2️⃣ Migrate One Route as Example (10 minutes)

Let's migrate `src/app/api/users/list/route.ts` together:

### Current Code:
```typescript
export async function GET(request: Request) {
  const supabase = await createSupabaseServer()
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  // ... rest
}
```

### New Code:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireAuthAndRole } from '@/lib/auth/api-auth'

export async function GET(request: NextRequest) {
  // This route lists all users - should be admin only
  const authResult = await requireAuthAndRole(request, 'school_admin')
  
  if (!authResult.success) {
    return authResult.response
  }

  const { supabase } = authResult.data
  
  // ... rest of your code (get users, etc.)
}
```

**Try this on one route, test it, then do the rest!**

---

## 3️⃣ Priority Routes to Migrate

Do these in order:

1. **Admin routes** (most important):
   - `src/app/api/admin/list-users/route.ts`
   - `src/app/api/admin/quiz-results/route.ts`
   - `src/app/api/admin/module-quiz-results/route.ts`

2. **User data routes:**
   - `src/app/api/users/list/route.ts`
   - `src/app/api/progress/route.ts`

3. **File upload:**
   - `src/app/api/upload/route.ts`

---

## 4️⃣ Copy-Paste Template

For most routes, use this template:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/api-auth'
// OR for admin: import { requireAuthAndRole } from '@/lib/auth/api-auth'

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request)
  // OR for admin: const authResult = await requireAuthAndRole(request, 'school_admin')
  
  if (!authResult.success) {
    return authResult.response
  }

  const { user, supabase } = authResult.data
  
  // Your existing code here, but now you have:
  // - user: authenticated user
  // - supabase: supabase client
}
```

---

## ✅ Done?

After migrating a few routes:

1. Test them work
2. Check they return 401 when not logged in
3. Check they return 403 for wrong roles
4. Continue with more routes

**That's it! Take it one route at a time.**
