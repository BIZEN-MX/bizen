# 🚀 Deployment Guide - Connect to bizen.mx

## 📋 Overview

This guide will help you deploy your BIZEN app to production at `bizen.mx`.

**What you'll do:**
1. Configure Vercel for deployment
2. Set up custom domain (bizen.mx)
3. Update Supabase settings for production
4. Configure environment variables
5. Deploy and test

**Time needed:** ~30 minutes

---

## 🎯 Step 1: Prepare Your Code (5 min)

### **1.1 Remove Development-Only Code**

Before deploying, remove the development bypass:

```bash
# Delete the dev email confirmation endpoint
rm src/app/api/auth/admin-confirm/route.ts
```

The green "DEV: Confirmar cuenta" button will automatically disappear in production (it only shows when `NODE_ENV === 'development'`).

### **1.2 Update Environment Variables**

Update your `.env` file with production URLs:

```bash
# Supabase (keep these as-is)
NEXT_PUBLIC_SUPABASE_URL=https://jbodeaqxjaezzjwewvrg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Production URLs (UPDATE THESE)
NEXT_PUBLIC_SITE_URL=https://bizen.mx
AUTH_REDIRECT_URL=https://bizen.mx/auth/callback

# Database (for Prisma - if you use it)
DATABASE_URL="postgresql://postgres.jbodeaqxjaezzjwewvrg:[YOUR-DB-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.jbodeaqxjaezzjwewvrg:[YOUR-DB-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

### **1.3 Commit Your Code**

```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for production deployment"
```

---

## 🌐 Step 2: Deploy to Vercel (10 min)

### **2.1 Create Vercel Project**

1. **Go to Vercel:**
   - https://vercel.com
   - Sign in with GitHub/GitLab

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the `bsmx` folder as root

3. **Configure Build Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (or leave default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

### **2.2 Add Environment Variables in Vercel**

In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://jbodeaqxjaezzjwewvrg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_SITE_URL=https://bizen.mx
AUTH_REDIRECT_URL=https://bizen.mx/auth/callback
```

**Important:** Select "All Environments" or at least "Production"

### **2.3 Deploy**

Click **"Deploy"** and wait ~2-3 minutes.

You'll get a URL like: `https://bsmx-xyz123.vercel.app`

---

## 🔗 Step 3: Connect Custom Domain (5 min)

### **3.1 Add Domain in Vercel**

1. Go to your Vercel project
2. Click **Settings** → **Domains**
3. Add domain: `bizen.mx`
4. Add subdomain: `www.bizen.mx` (recommended)

### **3.2 Configure DNS**

Vercel will show you DNS records to add. Go to your domain registrar (GoDaddy, Namecheap, etc.) and add:

**For bizen.mx (apex domain):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www.bizen.mx:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**DNS propagation takes 5-60 minutes.** Vercel will auto-verify when ready.

---

## ⚙️ Step 4: Update Supabase Settings (5 min)

### **4.1 Add Production URL to Supabase**

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/jbodeaqxjaezzjwewvrg

2. **Authentication → URL Configuration:**
   - Click **Authentication** → **URL Configuration**
   
3. **Add Site URL:**
   ```
   https://bizen.mx
   ```

4. **Add Redirect URLs:**
   ```
   https://bizen.mx/auth/callback
   https://bizen.mx/*
   http://localhost:3000/* (keep for development)
   ```

5. **Save changes**

### **4.2 Configure Email Templates**

1. **Go to Authentication → Email Templates**

2. **Update "Confirm signup" template:**
   - Replace `{{ .ConfirmationURL }}` URLs to point to `bizen.mx`
   - Should redirect to `https://bizen.mx/auth/callback`

3. **Save template**

---

## 🔐 Step 5: Set Up Custom Email (IMPORTANT)

**Supabase's default email won't work in production!** You need custom SMTP.

### **Recommended: Resend (Easiest)**

1. **Create Resend Account:**
   - Go to https://resend.com
   - Sign up (free tier includes 3,000 emails/month)

2. **Get API Key:**
   - Create an API key
   - Verify your domain (bizen.mx) or use their free domain

3. **Configure in Supabase:**
   - Supabase Dashboard → **Project Settings** → **Auth** → **SMTP Settings**
   - Enable custom SMTP
   - **Host:** `smtp.resend.com`
   - **Port:** `465` (SSL) or `587` (TLS)
   - **Username:** `resend`
   - **Password:** `your-resend-api-key`
   - **Sender email:** `noreply@bizen.mx` (or use Resend's free domain)
   - **Sender name:** `BIZEN`

4. **Save and test**

### **Alternative: SendGrid, AWS SES, Mailgun**

See `SUPABASE_EMAIL_SETUP.md` for other options.

---

## 📱 Step 6: Test Production (5 min)

Once DNS propagates and deployment is complete:

### **6.1 Test Authentication**

1. Go to `https://bizen.mx/signup`
2. Create a test account
3. Check email for verification (should arrive if SMTP configured)
4. Verify and login

### **6.2 Test Progress Tracking**

1. Go to `https://bizen.mx/modules/menu`
2. Click "Módulo 1"
3. Complete Section 1
4. Verify Section 2 unlocks

### **6.3 Test Cross-Device**

1. Login from a different device/browser
2. Should see the same progress
3. Continue where you left off

---

## 🎨 Step 7: Optional Customizations

### **Update Brand Assets**

Make sure these are in `/public/`:
- ✅ `bsmx-logo.png` (your logo)
- ✅ `bsmx-left.png` (signup/login image)
- ✅ `bizen-mondragonlogo.png` (Mondragón logo)

### **Update Contact Email**

Update in these files:
- `/src/app/signup/page.tsx` - Line 15: `supportEmail`
- `/src/app/login/page.tsx` - Line 15: `supportEmail`

```typescript
const supportEmail = "soporte@bizen.mx" // Update to your email
```

### **Analytics (Optional)**

Add Google Analytics or Vercel Analytics:

1. **Vercel Analytics:**
   ```bash
   npm install @vercel/analytics
   ```

2. **Update `layout.tsx`:**
   ```typescript
   import { Analytics } from '@vercel/analytics/react'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   ```

---

## 🔒 Security Checklist

Before going live:

- [ ] Remove `/src/app/api/auth/admin-confirm/route.ts`
- [ ] Enable HTTPS only (Vercel does this automatically)
- [ ] Verify RLS policies are enabled in Supabase
- [ ] Set up custom SMTP for emails
- [ ] Add rate limiting (optional, for API routes)
- [ ] Review all environment variables
- [ ] Test with real user accounts
- [ ] Set up error monitoring (Sentry, optional)

---

## 🌍 Environment Variables Summary

### **Production (.env for Vercel):**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://jbodeaqxjaezzjwewvrg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Site URLs
NEXT_PUBLIC_SITE_URL=https://bizen.mx
AUTH_REDIRECT_URL=https://bizen.mx/auth/callback

# Database (optional, if using Prisma)
DATABASE_URL="postgresql://postgres.jbodeaqxjaezzjwewvrg:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.jbodeaqxjaezzjwewvrg:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

**Get your database password:**
- Supabase Dashboard → Project Settings → Database
- Copy the password from "Connection string"

### **1.3 Verify Build Locally**

```bash
npm run build
```

If the build succeeds, you're ready to deploy!

---

## 🚀 Step 2: Deploy to Vercel (Recommended Platform)

### **Why Vercel?**
- ✅ Built for Next.js
- ✅ Automatic deployments
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ Easy domain setup
- ✅ Free tier available

### **2.1 Push to GitHub**

```bash
# Create a GitHub repository if you haven't
git remote add origin https://github.com/YOUR-USERNAME/bizen-app.git
git push -u origin main
```

### **2.2 Import to Vercel**

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Select your `bizen-app` repository
5. Click **"Import"**

### **2.3 Configure Project**

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (leave as default)

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables:** Add all variables from above

Click **"Deploy"**

---

## 🔗 Step 3: Add Custom Domain

### **3.1 In Vercel Dashboard**

1. Go to your project in Vercel
2. Click **"Settings"** → **"Domains"**
3. Click **"Add Domain"**
4. Enter: `bizen.mx`
5. Click **"Add"**

Vercel will show you DNS configuration instructions.

### **3.2 Configure DNS Records**

**Option A: Using Vercel Nameservers (Easiest)**

Point your domain's nameservers to Vercel:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Option B: Using A/CNAME Records**

Add these records in your domain registrar (GoDaddy, Namecheap, etc.):

**For root domain (bizen.mx):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Note:** DNS changes take 5-60 minutes to propagate.

### **3.3 Wait for Verification**

Vercel will automatically verify your domain. You'll see:
- ✅ Valid Configuration
- 🔒 SSL Certificate issued

---

## ⚙️ Step 4: Configure Supabase for Production

### **4.1 Update Authentication URLs**

1. **Supabase Dashboard:**
   - https://supabase.com/dashboard/project/jbodeaqxjaezzjwewvrg

2. **Authentication → URL Configuration:**
   
   **Site URL:**
   ```
   https://bizen.mx
   ```

   **Redirect URLs (add these):**
   ```
   https://bizen.mx/**
   https://bizen.mx/auth/callback
   https://www.bizen.mx/**
   https://www.bizen.mx/auth/callback
   http://localhost:3000/** (keep for development)
   ```

3. **Save changes**

### **4.2 Set Up Custom SMTP (REQUIRED)**

**Why:** Supabase's default email service doesn't work reliably in production.

**Quick Setup with Resend:**

1. **Create account:** https://resend.com
2. **Add your domain:** bizen.mx
3. **Verify domain:** Add DNS records they provide
4. **Get API key:** Create in dashboard

5. **Configure in Supabase:**
   - Project Settings → Auth → SMTP Settings
   - **Enable custom SMTP**
   - Host: `smtp.resend.com`
   - Port: `465` or `587`
   - Username: `resend`
   - Password: `[your-resend-api-key]`
   - Sender email: `noreply@bizen.mx`
   - Sender name: `BIZEN`

6. **Test:** Send a test email from Supabase

---

## 🗄️ Step 5: Set Up Database Tables

**If you haven't already:**

1. **Run the SQL in Supabase:**
   - Open `SUPABASE_DATABASE_SETUP.sql`
   - Copy all SQL
   - Supabase Dashboard → SQL Editor → Paste → Run

2. **Verify tables exist:**
   - Table Editor → Check for:
     - `user_section_completion`
     - `user_module_progress`
     - `progress`

---

## 🧪 Step 6: Test Production

### **6.1 Test URLs**

Visit these to verify everything works:

- ✅ `https://bizen.mx` - Landing page
- ✅ `https://bizen.mx/signup` - Sign up
- ✅ `https://bizen.mx/login` - Login
- ✅ `https://bizen.mx/modules/menu` - Modules menu
- ✅ `https://bizen.mx/module/1/sections` - Module 1 sections
- ✅ `https://bizen.mx/module/1/section/1/page/1` - Content

### **6.2 Test Full Flow**

1. **Create account** on production
2. **Verify email** (should receive it if SMTP configured)
3. **Login**
4. **Complete Module 1, Section 1**
5. **Verify Section 2 unlocks**
6. **Check different device** - Progress should persist

### **6.3 Monitor Logs**

**Vercel Logs:**
- Vercel Dashboard → Your Project → Logs
- Real-time server logs

**Supabase Logs:**
- Supabase Dashboard → Logs → API Logs
- Database queries and errors

---

## 🔄 Continuous Deployment

**Automatic deployments are now active!**

Every time you push to GitHub:
1. Vercel automatically deploys
2. Changes go live in ~2 minutes
3. Rollback available if needed

```bash
# Make changes
git add .
git commit -m "Update content"
git push

# Vercel automatically deploys! 🚀
```

---

## 📊 Monitoring & Analytics

### **Vercel Analytics (Free)**

```bash
npm install @vercel/analytics
```

Add to `src/app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### **Vercel Speed Insights (Free)**

```bash
npm install @vercel/speed-insights
```

Add to `src/app/layout.tsx`:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'

// Add <SpeedInsights /> to your layout
```

---

## 🛡️ Production Checklist

Before announcing to users:

- [ ] Custom domain working (bizen.mx)
- [ ] SSL certificate active (🔒 padlock in browser)
- [ ] Email verification working (SMTP configured)
- [ ] Database tables created
- [ ] Progress tracking tested
- [ ] All sections unlocking correctly
- [ ] Module completion working
- [ ] "Regresar" buttons working
- [ ] Images loading (check `/public/` folder)
- [ ] Mobile responsive (test on phone)
- [ ] Test with multiple users
- [ ] Set up error monitoring (Sentry, optional)
- [ ] Terms and Privacy pages created (optional)

---

## 🚨 Common Issues

### **Issue: "Module 'prisma' not found"**
```bash
npm install @prisma/client
npx prisma generate
```

### **Issue: "Database connection failed"**
- Check DATABASE_URL in Vercel environment variables
- Verify Supabase password is correct
- Check if IP is whitelisted in Supabase (usually not needed)

### **Issue: "Authentication redirect not working"**
- Verify redirect URLs in Supabase match your domain
- Check that AUTH_REDIRECT_URL environment variable is set in Vercel
- Clear browser cookies and try again

### **Issue: "Images not loading"**
- Verify images are in `/public/` folder
- Check Next.js build includes them
- Try accessing directly: `https://bizen.mx/bsmx-logo.png`

### **Issue: "Progress not saving"**
- Check browser console for API errors
- Verify tables exist in Supabase
- Check Supabase logs for RLS policy errors
- Verify user is authenticated (check browser console)

---

## 🎯 Alternative Deployment Options

### **Netlify**
1. Similar to Vercel
2. Works with Next.js
3. Free tier available

### **Railway**
1. Good for full-stack apps
2. Includes database hosting
3. Slightly more expensive

### **Self-hosted (VPS)**
1. DigitalOcean, Linode, AWS
2. More control, more setup
3. Need to configure SSL, domains manually

**Recommendation: Stick with Vercel** for Next.js apps. It's the easiest and most optimized.

---

## 📝 Post-Deployment

### **Update These:**

1. **`package.json`** - Add deployment scripts:
   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
     "lint": "next lint",
     "deploy": "git push origin main"
   }
   ```

2. **`.gitignore`** - Verify these are ignored:
   ```
   .env
   .env.local
   .env.production
   .vercel
   ```

3. **`README.md`** - Update with production URL

---

## 🎉 You're Done!

Your app is now live at **https://bizen.mx**! 🚀

### **Next Steps:**

1. Share with test users
2. Gather feedback
3. Monitor analytics
4. Iterate and improve

### **Support:**

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

## 📞 Need Help?

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase API logs
3. Check browser console
4. Review this guide's troubleshooting section

**Common gotchas:**
- DNS propagation takes time (be patient!)
- Email SMTP must be configured (can't skip this)
- Environment variables must be in Vercel (not just .env)
- Database tables must exist in Supabase

---

**Estimated total setup time:** ~45 minutes  
**Most of that is waiting for DNS propagation!**

Good luck! 🍀

