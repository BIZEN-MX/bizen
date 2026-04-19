# 🔐 Google Authentication Setup Guide

## ✅ What's Been Done

I've updated your app to support Google OAuth authentication:

### Files Updated:
1. ✅ `src/contexts/AuthContext.tsx` - Added `signInWithGoogle` method
2. ✅ `src/app/login/page.tsx` - Added Google Sign-In button
3. ✅ `src/app/signup/page.tsx` - Added Google Sign-Up button

---

## 🚀 Setup Steps

### **Step 1: Configure Google OAuth in Google Cloud Console**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
   - Click **Select a project** → **New Project**
   - Name it (e.g., "BIZEN Auth")
   - Click **Create**

3. **Enable Google+ API** (required for OAuth):
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. **Create OAuth Credentials**:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - If prompted, configure the **OAuth consent screen** first:
     - Choose **External** (for public app)
     - Fill in:
       - App name: **BIZEN**
       - User support email: Your email
       - Developer contact: Your email
     - Click **Save and Continue** through all steps
   
5. **Create OAuth Client ID**:
   - Application type: **Web application**
   - Name: **BIZEN Web Client**
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3004
     https://your-production-domain.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     
     **How to find your Supabase Project Ref:**
     - Go to your Supabase Dashboard
     - Your project URL looks like: `https://abcdefg.supabase.co`
     - The `abcdefg` part is your project ref
     - Or check Settings → API → Project URL

6. **Copy Credentials**:
   - After creating, you'll see a modal with:
     - **Client ID** (looks like `123456789-abc.apps.googleusercontent.com`)
     - **Client Secret** (looks like `GOCSPX-abc123...`)
   - Keep this window open or download the JSON

---

### **Step 2: Configure Google OAuth in Supabase**

1. **Go to Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Providers**
3. Find **Google** in the list
4. **Enable Google Provider**:
   - Toggle **Enabled** to ON
   - Paste your **Client ID** from Google Cloud Console
   - Paste your **Client Secret** from Google Cloud Console
   - Click **Save**

5. **Verify Redirect URL**:
   - Supabase will show you the redirect URL
   - It should be: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Make sure this matches what you entered in Google Cloud Console

---

### **Step 3: Test the Authentication**

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test Login with Google**:
   - Go to `http://localhost:3004/login`
   - Click **"Continuar con Google"** button
   - You should be redirected to Google's sign-in page
   - Sign in with your Google account
   - You should be redirected back to your app at `/courses`

3. **Test Sign-Up with Google**:
   - Go to `http://localhost:3004/signup`
   - Click **"Continuar con Google"** button
   - Same flow as login

---

## 🎨 What the User Sees

### Login Page
- New **"Continuar con Google"** button below the main login form
- Official Google logo and branding
- Smooth loading state when clicked

### Signup Page
- Same Google button after the registration form
- Allows new users to sign up instantly with their Google account

---

## 🔒 How It Works

1. **User clicks Google button** → Redirected to Google's OAuth page
2. **User signs in/authorizes** → Google redirects back with an auth code
3. **Supabase exchanges code** for session → User is authenticated
4. **User is redirected** to `/courses` (for login) or dashboard

---

## 🧪 Testing Checklist

- [ ] Google Cloud Console project created
- [ ] OAuth consent screen configured
- [ ] OAuth Client ID created with correct redirect URIs
- [ ] Credentials copied to Supabase
- [ ] Google provider enabled in Supabase
- [ ] Test login with Google account
- [ ] Test sign-up with Google account
- [ ] Verify user is redirected to correct page after auth

---

## 🛠️ Troubleshooting

### Error: "redirect_uri_mismatch"
**Problem**: The redirect URI in Google Cloud Console doesn't match Supabase's callback URL.

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth Client ID
3. Add the exact redirect URI from Supabase: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### Error: "Invalid OAuth client"
**Problem**: Client ID or Client Secret is incorrect.

**Solution**:
1. Go to Supabase → Authentication → Providers → Google
2. Re-enter your Client ID and Client Secret from Google Cloud Console
3. Make sure there are no extra spaces

### Google button doesn't work in development
**Problem**: `localhost:3004` not authorized.

**Solution**:
1. Go to Google Cloud Console → Credentials → Edit OAuth Client
2. Add `http://localhost:3004` to **Authorized JavaScript origins**

### Users can't see their Google profile picture
**Note**: By default, Supabase stores the user's Google profile info in `user.user_metadata`:
```typescript
const { user } = useAuth()
const avatar = user?.user_metadata?.avatar_url
const fullName = user?.user_metadata?.full_name
```

---

## 📚 Additional Features You Can Add

### 1. **Display Google User Info**
```typescript
const { user } = useAuth()
console.log(user?.user_metadata) // { avatar_url, email, full_name, ... }
```

### 2. **Show Avatar in UI**
```tsx
{user?.user_metadata?.avatar_url && (
  <img 
    src={user.user_metadata.avatar_url} 
    alt="Profile" 
    style={{ borderRadius: '50%', width: 40, height: 40 }}
  />
)}
```

### 3. **Add More OAuth Providers**
The same setup works for:
- GitHub
- Facebook
- Twitter
- Apple
- Discord
- And more...

Just enable them in Supabase → Authentication → Providers

---

## 🎯 Production Deployment

When deploying to production:

1. **Update Google Cloud Console**:
   - Add your production domain to **Authorized JavaScript origins**
   - Example: `https://bizen.mx`

2. **No changes needed in Supabase** - the same callback URL works!

3. **Environment Variables**: All Supabase credentials are already in your `.env.local`

---

## 💡 Security Notes

- ✅ Client ID and Secret are securely stored in Supabase
- ✅ OAuth flow uses secure HTTPS redirects
- ✅ Session tokens are managed by Supabase
- ✅ No passwords are stored for Google users
- ✅ Users can revoke access anytime from their Google Account settings

---

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Check Supabase logs: Dashboard → Logs → Auth
3. Verify all credentials are correct
4. Make sure redirect URIs match exactly (case-sensitive)

---

**🎉 That's it! Your users can now sign in with Google!**

