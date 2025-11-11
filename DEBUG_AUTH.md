# 🔍 Debug: Unauthorized Error

## Quick Fixes to Try:

### 1. Check if You're Logged In
- Are you logged into BIZEN?
- Go to http://localhost:3004/login
- Log in with your account
- Then go to http://localhost:3004/forum/new

### 2. Clear Cookies & Re-login
- Open Dev Tools (F12)
- Application → Cookies
- Clear all cookies for localhost:3004
- Refresh and log in again

### 3. Check Console for Detailed Error
- When you try to publish, open Dev Tools Console (F12)
- Look for the error message that says "❌ Unauthorized:"
- Tell me what the details say

### 4. Manual Profile Creation
If the above doesn't work, we can manually create your profile:
- Go to Supabase Dashboard
- SQL Editor
- Run:
```sql
INSERT INTO profiles (user_id, full_name, role, reputation, posts_created, comments_created, accepted_answers)
VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with your Supabase user ID
  'Your Name',
  'student',
  0,
  0,
  0,
  0
);
```

## Most Common Issues:

1. **Not logged in** - Solution: Log in first
2. **Cookies expired** - Solution: Clear cookies and re-login
3. **Wrong Supabase project** - Solution: Check .env file
4. **No profile created** - Solution: Auto-creates now, but might need manual creation

## Quick Test:

Try accessing: http://localhost:3004/profile

If it redirects to login → You're not logged in
If it shows your profile → You're logged in (auth is working)

Let me know what happens!

