# 🔧 Fix: Google OAuth Error 400 - redirect_uri_mismatch

## ❌ The Error You're Seeing

```
Error 400: redirect_uri_mismatch
You can't sign in because Bizen sent an invalid request.
```

**What this means**: The redirect URI in Google Cloud Console doesn't match what Supabase is sending.

---

## ✅ How to Fix It (5 minutes)

### **Step 1: Find Your Supabase Project Reference**

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project** (the one you're using for BIZEN)
3. **Look at the URL in your browser**:
   ```
   https://supabase.com/project/YOUR_PROJECT_REF
   ```
   OR
4. **Go to Settings → API** and look at "Project URL":
   ```
   https://YOUR_PROJECT_REF.supabase.co
   ```

**Example**: If your Project URL is `https://abcdefghijk.supabase.co`, then:
- Your Project Ref = `abcdefghijk`

**✍️ Write it down**: _______________________

---

### **Step 2: Get the Exact Redirect URI from Supabase**

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Click on **Google** (it should already be enabled)
3. Scroll down and you'll see **"Callback URL (for OAuth)"**:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
4. **COPY THIS EXACT URL** (there's a copy button)

**Example**:
```
https://abcdefghijk.supabase.co/auth/v1/callback
```

---

### **Step 3: Add This URI to Google Cloud Console**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. Make sure you're in the correct project (top left dropdown)
3. Navigate to **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID** (the one you created for BIZEN)
5. **Click on it** to edit
6. Scroll to **"Authorized redirect URIs"**
7. **Click "ADD URI"**
8. **Paste the exact URL** from Supabase:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
9. **Click "SAVE"** at the bottom

---

### **Step 4: Test Again**

1. Go back to your BIZEN app: http://localhost:3004/login
2. Click **"Continuar con Google"**
3. It should work now! 🎉

---

## 📝 Quick Checklist

Make sure you have BOTH of these in your Google Cloud Console "Authorized redirect URIs":

```
✅ https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
✅ http://localhost:3004 (in "Authorized JavaScript origins" for local testing)
```

---

## 🎯 Common Mistakes

### ❌ **Wrong**: Using your app's domain
```
https://bizen.mx/auth/callback  ❌ WRONG
```

### ✅ **Correct**: Using Supabase's callback URL
```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback  ✅ CORRECT
```

---

## 🔍 Visual Guide

Here's exactly what your Google Cloud Console should look like:

**Authorized JavaScript origins:**
```
http://localhost:3004
https://bizen.mx (your production domain if you have one)
```

**Authorized redirect URIs:**
```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

---

## 🆘 Still Not Working?

### Double-check these:

1. ✅ **Exact match**: The URI must match EXACTLY (including https://, no trailing slash)
2. ✅ **Saved**: Click "SAVE" at the bottom of Google Cloud Console
3. ✅ **Wait**: Sometimes takes 1-2 minutes for Google to update
4. ✅ **Clear cache**: Try in incognito/private browsing mode
5. ✅ **Project**: Make sure you're editing the correct OAuth Client ID

### If you're getting "Access blocked: This app's request is invalid"

This means:
- The redirect URI is still wrong
- OR you haven't published your OAuth consent screen

**Solution**: Make sure your OAuth consent screen is configured:
1. Go to **APIs & Services** → **OAuth consent screen**
2. Add required info (app name, support email)
3. Click **SAVE AND CONTINUE**

---

## 🎉 Once It Works

You should see:
1. Google sign-in page opens
2. You select your Google account
3. You're redirected back to BIZEN
4. You're logged in and at `/courses`

---

## 💡 Pro Tip

**Copy the EXACT redirect URI from Supabase** - don't type it manually! Even a tiny difference (like a trailing slash or http vs https) will cause this error.

---

**Need more help?** Let me know the exact error message or what step you're stuck on!

