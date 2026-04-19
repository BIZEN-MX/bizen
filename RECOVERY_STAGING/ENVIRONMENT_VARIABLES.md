# Environment Variables - Complete List

## 📋 All Required Variables

Copy these into your `.env.local` file (create it in the root directory if it doesn't exist):

```bash
# ==============================================
# SUPABASE CONFIGURATION (REQUIRED)
# ==============================================
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ==============================================
# DATABASE CONFIGURATION (REQUIRED)
# ==============================================
# Get this from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/database
# Use the "Connection Pooling" URL with "Session mode"

DATABASE_URL="postgresql://postgres.xxxxx:password@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct database URL (for migrations)
DIRECT_URL="postgresql://postgres.xxxxx:password@aws-1-us-east-2.pooler.supabase.com:5432/postgres"

# ==============================================
# SITE CONFIGURATION (REQUIRED FOR PRODUCTION)
# ==============================================

# Production:
NEXT_PUBLIC_SITE_URL=https://bsmx.site

# Local Development:
# NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ==============================================
# EMAIL SERVICE - RESEND (OPTIONAL)
# ==============================================
# Get your API key from: https://resend.com/api-keys
# Only required if sending welcome emails

RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# ==============================================
# NODE ENVIRONMENT (AUTO-SET BY HOSTING)
# ==============================================
# Usually auto-set by Vercel/Railway/etc - you don't need to set this manually
# NODE_ENV=production
```

---

## 🔧 How to Set Up

### For Local Development:

1. Create `.env.local` in the root directory:
```bash
touch .env.local
```

2. Copy the variables above and fill in your values

3. Restart your dev server:
```bash
npm run dev
```

### For Production Deployment (Vercel/Railway/etc):

1. Go to your deployment dashboard
2. Find "Environment Variables" section
3. Add each variable one by one:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - `RESEND_API_KEY` (optional)

4. Redeploy your app

---

## 📝 Where to Find These Values

### Supabase Keys:
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings > API**
4. Copy:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

### Database URL:
1. Go to **Settings > Database**
2. Scroll to **Connection string**
3. Select **Session mode** tab
4. Copy the URI:
   - Full URI → `DATABASE_URL`
   - Change port from `:6543` to `:5432` → `DIRECT_URL`

### Site URL:
- Production: `https://bsmx.site`
- Local dev: `http://localhost:3000`

### Resend API Key (Optional):
1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys**
3. Create new key
4. Copy key → `RESEND_API_KEY`

---

## ⚠️ Important Notes

### Security:
- ✅ **NEVER** commit `.env.local` to GitHub
- ✅ `.env*` is already in `.gitignore`
- ✅ Only `NEXT_PUBLIC_*` variables are exposed to the browser
- ❌ Keep `SERVICE_ROLE_KEY` and `DATABASE_URL` secret!

### Required vs Optional:

**REQUIRED** (app won't work without these):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SITE_URL`

**OPTIONAL** (app works, but features limited):
- `RESEND_API_KEY` - Only needed for automated welcome emails

---

## 🧪 Testing Your Environment Variables

Create a test file to verify everything is set correctly:

```typescript
// test-env.js
console.log('Environment Check:')
console.log('✓ SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'MISSING')
console.log('✓ SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'MISSING')
console.log('✓ SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'MISSING')
console.log('✓ DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'MISSING')
console.log('✓ SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL ? 'Set' : 'MISSING')
console.log('✓ RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set (optional)' : 'Not set (optional)')
```

Run: `node test-env.js`

---

## 🚀 Deployment Platform Specific

### Vercel:
1. Project Settings > Environment Variables
2. Add all variables
3. Select environments: Production, Preview, Development
4. Redeploy

### Railway:
1. Project > Variables tab
2. Click "+ New Variable"
3. Add each variable
4. Railway auto-redeploys

### Render:
1. Dashboard > Environment
2. Add Secret Files or Environment Variables
3. Click "Save Changes"
4. Manual redeploy required

---

## 📚 Related Documentation

- `SUPABASE_DATABASE_SETUP.sql` - Database setup SQL
- `PRISMA_SETUP.md` - Prisma configuration
- `RESEND_SETUP.md` - Email service setup
- `DEPLOYMENT_GUIDE.md` - Full deployment instructions

---

## 🔍 Troubleshooting

### "Can't connect to database"
- Check `DATABASE_URL` is correct
- Verify Supabase project is running
- Test connection with: `npx prisma db pull`

### "Error in PostgreSQL connection: Error { kind: Closed }" (Prisma)
- Caused by Supabase connection pooler (port 6543) closing idle connections.
- **Fix:** Add `&connection_limit=1` to your `DATABASE_URL` so each request uses a short-lived connection.
- Example: `...?pgbouncer=true&sslmode=require&connection_limit=1`
- Restart the dev server after changing `.env.local`.

### "Authentication error"
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Verify it matches your Supabase project
- Try logging out and back in

### "Service role error" (Admin functions)
- Check `SUPABASE_SERVICE_ROLE_KEY` is set
- Verify it's the **service_role** key, not anon key
- Only use for server-side operations

### "Email not sending"
- Check `RESEND_API_KEY` is set
- Verify Resend account is active
- Check domain verification if using custom domain

