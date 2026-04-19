# 📱 Converting BIZEN to Mobile App

This guide will help you convert your Next.js web app into native iOS and Android apps using **Capacitor**.

## 🎯 Overview

**Capacitor** wraps your existing Next.js app in a native container, allowing you to:
- ✅ Keep 95% of your existing code
- ✅ Publish to Apple App Store and Google Play Store
- ✅ Access native device features (camera, notifications, etc.)
- ✅ Better performance than a pure web app

## 📋 Prerequisites

Before starting, you'll need:

1. **Apple Developer Account** ($99/year) - for iOS App Store
2. **Google Play Developer Account** ($25 one-time) - for Android Play Store
3. **macOS** - Required for building iOS apps (Xcode)
4. **Node.js** - Already installed ✅

---

## 🚀 Step 1: Install Capacitor

```bash
# Install Capacitor CLI and core
npm install @capacitor/core @capacitor/cli

# Install platform-specific packages
npm install @capacitor/ios @capacitor/android

# Install useful plugins
npm install @capacitor/app @capacitor/keyboard @capacitor/status-bar @capacitor/splash-screen
```

---

## 🔧 Step 2: Initialize Capacitor

```bash
# Initialize Capacitor in your project
npx cap init

# When prompted:
# - App name: BIZEN
# - App ID: com.bizen.app (or your preferred bundle ID)
# - Web dir: .next (or out if using static export)
```

---

## ⚙️ Step 3: Configure Next.js for Mobile

### ⚠️ IMPORTANT: You Have 100+ API Routes!

**Your app has many API routes** (`/api/*`), so we need to use **Option B** (Server-Based) to keep everything working.

### Option A: Static Export (❌ WILL BREAK YOUR API ROUTES)

**⚠️ DO NOT USE THIS OPTION** - It will break all your API routes!

Static export would require:
- Moving all 100+ API routes to a separate backend
- Major refactoring of your codebase
- Not recommended for your app

### Option B: Server-Based (✅ RECOMMENDED - Keeps Everything Working)

**This is the safe approach** that won't break your existing code:

1. **Keep your Next.js config as-is** (no changes needed!)
2. **Deploy your app to a server** (Vercel, already done ✅)
3. **Point Capacitor to your live server URL**

**How it works:**
- Your web app continues running on Vercel (or your server)
- Mobile app loads your web app from the server
- All API routes work exactly as they do now
- No code changes required!

**Configuration:**

In `capacitor.config.ts` (created in Step 2), set:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bizen.app',
  appName: 'BIZEN',
  webDir: 'dist', // We'll create a build for mobile
  server: {
    url: 'https://bizen.mx', // Your production URL
    cleartext: false // Use HTTPS
  },
  // For development, you can use localhost:
  // server: {
  //   url: 'http://localhost:3004',
  //   cleartext: true
  // }
};

export default config;
```

**Benefits:**
- ✅ Zero code changes to your existing app
- ✅ All API routes continue working
- ✅ Easy updates (just deploy to web)
- ✅ Single codebase for web and mobile

---

## 📱 Step 4: Build Your App

**For Server-Based Approach (Option B):**

```bash
# You don't need to build Next.js for mobile!
# Your app runs on the server, mobile just loads it

# Add iOS platform
npx cap add ios

# Add Android platform
npx cap add android

# Sync configuration to native projects
npx cap sync
```

**Note:** Since you're using the server-based approach, the mobile app will load your web app from your server URL. No build needed!

---

## 🍎 Step 5: Configure iOS App

### 5.1 Open in Xcode

```bash
npx cap open ios
```

### 5.2 Configure App Settings

1. **Select your project** in Xcode
2. **General Tab:**
   - Display Name: `BIZEN`
   - Bundle Identifier: `com.bizen.app` (must match your Apple Developer account)
   - Version: `1.0.0`
   - Build: `1`

3. **Signing & Capabilities:**
   - Select your Team (Apple Developer account)
   - Enable "Automatically manage signing"

### 5.3 Configure Info.plist

Add to `ios/App/App/Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
</dict>
```

### 5.4 Build and Test

1. Select a simulator or device
2. Click **Run** (▶️) or press `Cmd + R`
3. Test your app!

---

## 🤖 Step 6: Configure Android App

### 6.1 Open in Android Studio

```bash
npx cap open android
```

### 6.2 Configure App Settings

1. **Open `android/app/build.gradle`:**
   - Update `applicationId`: `com.bizen.app`
   - Update `versionCode`: `1`
   - Update `versionName`: `"1.0.0"`

2. **Update `android/app/src/main/AndroidManifest.xml`:**
   - Add internet permission (usually already there)

### 6.3 Build and Test

1. Click **Run** (▶️) or press `Shift + F10`
2. Select an emulator or device
3. Test your app!

---

## 🔐 Step 7: Handle Authentication & API Calls

Since you're using Supabase, you'll need to handle:

### 7.1 Update Supabase URLs

Make sure your mobile app can reach Supabase:

```typescript
// In your Supabase config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-key';
```

### 7.2 Handle Deep Links

For OAuth redirects, configure deep links:

**iOS (`ios/App/App/Info.plist`):**
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.bizen.app</string>
    </array>
  </dict>
</array>
```

**Android (`android/app/src/main/AndroidManifest.xml`):**
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="com.bizen.app" />
</intent-filter>
```

### 7.3 Update Supabase Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

Add:
- `com.bizen.app://auth/callback`
- `com.bizen.app://`

---

## 📦 Step 8: Prepare for App Store Submission

### iOS App Store

1. **Create App Store Connect Listing:**
   - Go to https://appstoreconnect.apple.com
   - Create new app
   - Fill in app information, screenshots, description

2. **Archive and Upload:**
   ```bash
   # In Xcode
   Product → Archive
   # Then click "Distribute App"
   ```

3. **Submit for Review:**
   - Complete all required information
   - Submit for review

### Google Play Store

1. **Create Play Console Listing:**
   - Go to https://play.google.com/console
   - Create new app
   - Fill in app information, screenshots, description

2. **Generate Signed APK/AAB:**
   ```bash
   # In Android Studio
   Build → Generate Signed Bundle / APK
   # Select "Android App Bundle" (recommended)
   ```

3. **Upload to Play Console:**
   - Upload the AAB file
   - Complete store listing
   - Submit for review

---

## 🔄 Step 9: Update Workflow

**For Server-Based Approach:**

After making changes to your Next.js app:

```bash
# 1. Deploy to your server (Vercel, etc.)
# Your web app updates automatically

# 2. If you change Capacitor config, sync:
npx cap sync

# 3. Open and test mobile app
npx cap open ios    # or android
```

**Key Point:** Since your mobile app loads from your server, updates to your web app automatically appear in the mobile app (after users refresh or restart the app).

---

## 🎨 Step 10: Mobile-Specific Optimizations

### 10.1 Add Mobile Meta Tags

Update `src/app/layout.tsx`:

```tsx
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### 10.2 Handle Status Bar

```typescript
import { StatusBar, Style } from '@capacitor/status-bar';

// Set status bar style
StatusBar.setStyle({ style: Style.Light });
```

### 10.3 Handle Keyboard

```typescript
import { Keyboard } from '@capacitor/keyboard';

Keyboard.addListener('keyboardWillShow', info => {
  // Adjust UI when keyboard appears
});

Keyboard.addListener('keyboardWillHide', () => {
  // Restore UI when keyboard hides
});
```

### 10.4 Add Splash Screen

```typescript
import { SplashScreen } from '@capacitor/splash-screen';

// Hide splash screen when app is ready
SplashScreen.hide();
```

---

## 🐛 Common Issues & Solutions

### Issue: API Routes Don't Work

**If using Server-Based Approach (Option B):** This shouldn't happen! Your API routes work exactly as they do on web.

**If using Static Export (Option A):** You'd need to move API logic to:
- Supabase Edge Functions
- Vercel Serverless Functions (separate deployment)
- External backend service

**But you're using Option B, so this isn't an issue! ✅**

### Issue: Images Not Loading

**Solution:** 
- Use `unoptimized: true` in Next.js config
- Or use Capacitor's HTTP plugin to load images

### Issue: Deep Links Not Working

**Solution:** 
- Verify URL schemes match in both platforms
- Update Supabase redirect URLs
- Test with `npx cap run ios` or `npx cap run android`

### Issue: Build Errors

**Solution:**
```bash
# Clean and rebuild
npx cap sync --clean
npm run build
npx cap sync
```

---

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

---

## 💡 Alternative: Progressive Web App (PWA)

If you want a simpler solution (but with limitations):

1. **Add PWA support:**
   ```bash
   npm install next-pwa
   ```

2. **Configure `next.config.ts`:**
   ```typescript
   const withPWA = require('next-pwa')({
     dest: 'public',
     register: true,
     skipWaiting: true,
   });
   
   module.exports = withPWA(nextConfig);
   ```

3. **Add manifest.json** in `public/` folder

**Limitations:**
- ❌ Can't publish to App Store (only Play Store with TWA)
- ❌ Limited native features
- ✅ Easier to implement
- ✅ Works on all devices

---

## ✅ Checklist

- [ ] Install Capacitor
- [ ] Initialize Capacitor (use server-based approach)
- [ ] Configure `capacitor.config.ts` with your server URL
- [ ] Add iOS platform
- [ ] Add Android platform
- [ ] Test on devices/simulators
- [ ] Configure deep links for OAuth
- [ ] Update Supabase redirect URLs
- [ ] Create App Store Connect listing
- [ ] Create Play Console listing
- [ ] Submit for review

**Important:** No changes needed to your Next.js code! ✅

---

## 🎉 Next Steps

1. Start with **iOS** (easier to test on simulator)
2. Test thoroughly on real devices
3. Get feedback from beta testers
4. Submit to stores
5. Monitor reviews and analytics

Good luck! 🚀

