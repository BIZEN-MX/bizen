# 🚀 BIZEN Supabase Setup - Complete Separation Guide

## ✅ What's Been Done

I've set up the infrastructure for **two separate Supabase instances**:

### Created Files:
1. ✅ `src/lib/supabase/client-microcred.ts` - Microcredential Supabase client
2. ✅ `src/lib/supabase/client-bizen.ts` - BIZEN Supabase client  
3. ✅ `src/lib/supabase/server-microcred.ts` - Microcredential server client
4. ✅ `src/lib/supabase/server-bizen.ts` - BIZEN server client
5. ✅ `src/contexts/AuthContextBizen.tsx` - BIZEN auth context
6. ✅ Updated `src/app/api/signup/route.ts` to support both apps

### Updated:
- ✅ Signup route now accepts `appSource` parameter
- ✅ AuthContext now uses microcredential client
- ✅ Middleware routes to correct Supabase based on URL path

---

## 🔧 What You Need to Do

### Step 1: Add Environment Variables

Add these to your `.env.local` file:

```env
# ==========================================
# MICROCREDENTIAL APP (Mondragón Students)
# Existing Supabase Project
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://your-microcredential.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ==========================================
# BIZEN APP (Public App)  
# NEW Supabase Project
# ==========================================
NEXT_PUBLIC_SUPABASE_URL_BIZEN=https://your-bizen.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN=your_bizen_anon_key
SUPABASE_SERVICE_ROLE_KEY_BIZEN=your_bizen_service_role_key
```

### Step 2: Get Your BIZEN Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your BIZEN project
3. Go to Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL_BIZEN`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY_BIZEN`

### Step 3: Test the Setup

1. **BIZEN Signup** (using BIZEN Supabase):
   - Visit: http://localhost:3000/bizen/signup
   - Sign up with any email
   - Check: Supabase Dashboard → Your BIZEN project → Authentication → Users

2. **Microcredential Signup** (using Microcredential Supabase):
   - Visit: http://localhost:3000/signup
   - Sign up with @mondragonmexico.edu.mx email
   - Check: Supabase Dashboard → Your Microcredential project → Authentication → Users

---

## 🔍 How It Works

### Route-Based Routing:
- **BIZEN routes** (`/bizen/*`) → Uses BIZEN Supabase
- **Microcredential routes** (`/module/*`, `/dashboard/*`) → Uses Microcredential Supabase

### User Separation:
- Users sign up from different pages
- Different databases store user data
- Middleware automatically routes to correct Supabase
- No data mixing between apps

---

## 📝 Next Steps (Optional)

1. **Create BIZEN login/signup pages** in `src/apps/bizen/`
2. **Update navigation** to route to correct apps
3. **Test authentication** for both apps independently

---

## ✅ Verification Checklist

After setup, verify:
- [ ] BIZEN signup creates user in BIZEN Supabase
- [ ] Microcredential signup creates user in Microcredential Supabase
- [ ] Users can't access each other's data
- [ ] Both apps work independently

