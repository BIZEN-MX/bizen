# Resend Email Integration Guide

This guide explains how to use Resend for sending emails in the BIZEN platform.

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env.local` file in the project root with your Resend API key:

```bash
RESEND_API_KEY=your_resend_api_key_here
```

### 2. Restart Development Server

After adding the environment variable, restart your Next.js development server:

```bash
npm run dev
```

## 📧 Current Email Integrations

### Welcome Email (Automatic)

The welcome email is **automatically sent** when a new user verifies their email after signup. This happens in the auth callback flow.

**Flow:**
1. User signs up → receives verification email from Supabase
2. User clicks verification link → lands on `/auth/callback`
3. Callback verifies the user → sends welcome email via Resend
4. User is redirected to dashboard

**Location:** `src/app/auth/callback/route.ts`

## 🎨 Email Templates

### 1. Welcome Email Template

**Location:** `src/lib/emails/welcome-email.tsx`

**Features:**
- BIZEN branded design
- Responsive layout
- Direct dashboard link
- Feature highlights
- Support contact info

**Usage:**
```typescript
import { sendBizenWelcomeEmail } from '@/lib/emails/welcome-email';

await sendBizenWelcomeEmail(
  'user@example.com',
  'John Doe',
  'https://yourdomain.com/dashboard'
);
```

## 🛠️ API Routes

### 1. Send Welcome Email

**Endpoint:** `POST /api/send-welcome-email`

**Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "dashboardUrl": "https://yourdomain.com/dashboard"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome email sent successfully",
  "emailId": "email_id_from_resend"
}
```

### 2. Generic Send Email (For Custom Emails)

**Endpoint:** `POST /api/send-email`

**Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Your Subject",
  "html": "<p>Your HTML content</p>",
  "from": "BIZEN <sender@yourdomain.com>" // Optional
}
```

**Note:** ⚠️ This endpoint should be protected with authentication in production!

## 🎯 How to Send Emails

### Option 1: Use Pre-built Templates (Recommended)

```typescript
import { sendBizenWelcomeEmail } from '@/lib/emails/welcome-email';

// In an API route or server component
await sendBizenWelcomeEmail(
  userEmail,
  userName,
  dashboardUrl
);
```

### Option 2: Direct Resend Usage

```typescript
import { resend } from '@/lib/resend';

await resend.emails.send({
  from: 'BIZEN <onboarding@resend.dev>',
  to: 'user@example.com',
  subject: 'Your Subject',
  html: '<p>Your HTML content</p>',
});
```

### Option 3: Call API Route from Client

```typescript
// From a client component
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Hello!',
    html: '<p>Your message here</p>',
  }),
});

const result = await response.json();
```

## 🎨 Creating New Email Templates

### Step 1: Create Template File

Create a new file in `src/lib/emails/`, for example `course-completion-email.tsx`:

```typescript
interface CourseCompletionEmailProps {
  name: string;
  courseName: string;
  certificateUrl: string;
}

export const CourseCompletionEmail = ({ 
  name, 
  courseName, 
  certificateUrl 
}: CourseCompletionEmailProps) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Your styles here */
        </style>
      </head>
      <body>
        <h1>¡Felicidades ${name}!</h1>
        <p>Has completado el curso: ${courseName}</p>
        <a href="${certificateUrl}">Ver Certificado</a>
      </body>
    </html>
  `;
};

export const sendCourseCompletionEmail = async (
  to: string,
  name: string,
  courseName: string,
  certificateUrl: string
) => {
  const { resend } = await import('@/lib/resend');
  
  return await resend.emails.send({
    from: 'BIZEN <cursos@bsmx.site>',
    to,
    subject: `¡Felicidades! Completaste ${courseName}`,
    html: CourseCompletionEmail({ name, courseName, certificateUrl }),
  });
};
```

### Step 2: Use Your Template

```typescript
import { sendCourseCompletionEmail } from '@/lib/emails/course-completion-email';

await sendCourseCompletionEmail(
  'student@example.com',
  'John Doe',
  'Introduction to Business',
  'https://yourdomain.com/certificates/123'
);
```

## 🌐 Domain Verification (Production)

### Current Setup (Development)
Currently using: `onboarding@resend.dev` (Resend's test domain)

### For Production

1. **Add Your Domain in Resend Dashboard:**
   - Go to [Resend Dashboard](https://resend.com/domains)
   - Click "Add Domain"
   - Enter your domain (e.g., `bsmx.site`)

2. **Add DNS Records:**
   Resend will provide DNS records to add to your domain:
   - SPF record
   - DKIM record
   - DMARC record (recommended)

3. **Update Email Templates:**
   Replace `onboarding@resend.dev` with your domain:
   ```typescript
   from: 'BIZEN <bienvenida@bsmx.site>'
   from: 'BIZEN <cursos@bsmx.site>'
   from: 'BIZEN <soporte@bsmx.site>'
   ```

## 📊 Monitoring & Logs

### View Email Logs

Check the Resend dashboard at [resend.com/emails](https://resend.com/emails) to see:
- Sent emails
- Delivery status
- Open rates (if enabled)
- Click rates (if enabled)

### Server Logs

Email sending is logged in your server console:
```
Welcome email sent successfully: { email: 'user@example.com', emailId: '...' }
```

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Protect API routes** - Add authentication to `/api/send-email`
3. **Rate limiting** - Consider adding rate limits to prevent abuse
4. **Validate inputs** - Always validate email addresses and content
5. **Use environment variables** - Never hardcode API keys

## 🐛 Troubleshooting

### Email Not Sending?

1. **Check API Key:**
   ```bash
   # Verify in terminal
   echo $RESEND_API_KEY
   ```

2. **Check Server Logs:**
   Look for errors in your terminal where `npm run dev` is running

3. **Check Resend Dashboard:**
   - Go to [resend.com/emails](https://resend.com/emails)
   - Check for failed sends

4. **Common Errors:**
   - `Missing API key` → Check `.env.local` exists and is loaded
   - `Invalid from address` → Use a verified domain or `onboarding@resend.dev`
   - `Rate limit exceeded` → Resend free tier has limits

### Development Tips

- **Test emails:** Use your personal email for testing
- **Spam folder:** Check spam if emails don't arrive
- **Email clients:** Test in multiple email clients (Gmail, Outlook, etc.)

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference/emails/send-email)
- [Resend Dashboard](https://resend.com/home)
- [React Email](https://react.email/) - Build emails with React components

## 💡 Ideas for Future Email Templates

Consider creating templates for:
- ✅ Welcome email (Done!)
- 📧 Email verification
- 🔑 Password reset
- 🎓 Course completion
- 📊 Progress milestones
- 📅 Weekly digest
- 🎉 Achievement unlocked
- 📝 Assignment reminders
- 💬 Comment notifications
- 🔔 Admin notifications

---

**Questions or Issues?**
Contact: soporte@bsmx.site

