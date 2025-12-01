# Supabase Authentication Setup Guide

This guide provides step-by-step instructions to configure Supabase authentication for the Nexus Tech Hub application, including Google OAuth and custom email templates.

## Prerequisites

- Supabase project created
- Google Cloud Console project with OAuth credentials
- Access to Supabase Dashboard

---

## 1. Authentication Settings

### Site URL and Redirect URLs

Navigate to **Supabase Dashboard → Authentication → Settings**

#### Configuration:
```
Site URL: http://localhost:3000
Additional Redirect URLs:
- http://localhost:3000/api/auth/callback
```

**For Production:**
```
Site URL: https://yourdomain.com
Additional Redirect URLs:
- https://yourdomain.com/api/auth/callback
```

---

## 2. Email Templates

### Password Reset Email

Navigate to **Supabase Dashboard → Authentication → Email Templates**

#### Reset Password Template:

**Subject:**
```
Reset Your Nexus Tech Hub Password
```

**Message (Plain Text):**
```
Hi there,

You requested a password reset for your Nexus Tech Hub account.

Click the link below to reset your password:
{{ .ConfirmationURL }}

If you didn't request this password reset, you can safely ignore this email.

Best regards,
Nexus Tech Hub Team
```

**Message (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; background: #f9f9f9; }
    .button {
      display: inline-block;
      background: #dc2626;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nexus Tech Hub</h1>
      <p>Password Reset Request</p>
    </div>

    <div class="content">
      <h2>Reset Your Password</h2>
      <p>Hi there,</p>
      <p>You requested a password reset for your Nexus Tech Hub account.</p>
      <p>Click the button below to reset your password:</p>

      <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>

      <p><strong>Security Note:</strong> This link will expire in 1 hour for your security.</p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>

      <p>If you didn't request this password reset, you can safely ignore this email.</p>
    </div>

    <div class="footer">
      <p>Best regards,<br>Nexus Tech Hub Team</p>
      <p>This email was sent to {{ .Email }}. If you have any questions, contact our support team.</p>
    </div>
  </div>
</body>
</html>
```

---

## 3. Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API:
   - Navigate to **APIs & Services → Library**
   - Search for "Google+ API" and enable it

4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add authorized redirect URIs:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
   - Note down the **Client ID** and **Client Secret**

### Step 2: Configure Supabase Google Provider

Navigate to **Supabase Dashboard → Authentication → Providers**

#### Enable Google Provider:
1. Find **Google** in the providers list
2. Toggle **Enable** to ON
3. Enter your Google OAuth credentials:
   ```
   Client ID: [Your Google Client ID]
   Client Secret: [Your Google Client Secret]
   ```
4. Click **Save**

### Step 3: Update Authorized Redirect URIs (Production)

For production deployment, update your Google OAuth credentials:

1. In Google Cloud Console → APIs & Services → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add your production redirect URI:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

---

## 4. Environment Variables

Update your `.env.local` file with the correct Supabase URLs:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 5. Testing the Setup

### Test Email Password Reset:
1. Go to `/forgot-password`
2. Enter a valid email address
3. Check your email for the reset link
4. Click the link and verify it redirects to `/reset-password`

### Test Google OAuth:
1. Go to `/login` or `/register`
2. Click "Continue with Google"
3. Verify the OAuth flow completes and redirects to `/api/auth/callback`
4. Confirm successful authentication and redirect to intended page

---

## 6. Troubleshooting

### Common Issues:

**OAuth Redirect Error:**
- Verify redirect URLs in Supabase match your Google OAuth configuration
- Ensure the callback URL is: `https://your-project.supabase.co/auth/v1/callback`

**Email Not Sending:**
- Check Supabase email settings in Authentication → Email
- Verify SMTP configuration if using custom SMTP

**Google OAuth Not Working:**
- Confirm Google+ API is enabled in Google Cloud Console
- Check that authorized redirect URIs include the Supabase callback URL
- Verify Client ID and Secret are correct in Supabase

**Reset Password Link Invalid:**
- Ensure the reset password URL in email templates matches your application URL
- Check that the `{{ .ConfirmationURL }}` placeholder is used correctly

---

## 7. Security Considerations

- **Redirect URLs**: Only add trusted domains to prevent open redirect attacks
- **Email Templates**: Use HTTPS URLs in production
- **OAuth Credentials**: Keep Client ID and Secret secure
- **Session Management**: Configure appropriate session expiry times
- **Rate Limiting**: Enable rate limiting for authentication endpoints

---

## 8. Production Deployment Checklist

- [ ] Update Site URL to production domain
- [ ] Add production redirect URLs
- [ ] Update Google OAuth authorized redirect URIs
- [ ] Test email delivery with production SMTP
- [ ] Verify HTTPS URLs in email templates
- [ ] Test OAuth flow in production environment
- [ ] Configure proper CORS settings
- [ ] Set up monitoring for authentication events

---

## Support

For additional help with Supabase configuration:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Authentication Guide](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
