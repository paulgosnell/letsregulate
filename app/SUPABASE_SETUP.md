# Supabase Configuration Guide

## Authentication Configuration

### Redirect URLs

To enable email confirmation and password reset flows, you need to configure the redirect URLs in your Supabase project dashboard.

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Add the following URLs to **Redirect URLs**:

#### Local Development
```
http://localhost:5179
http://localhost:5179/
```

#### Production (update when deployed)
```
https://yourdomain.com
https://yourdomain.com/
```

### Email Templates

The app handles auth errors automatically, but you may want to customize email templates:

1. Go to **Authentication** → **Email Templates**
2. Customize the following templates:
   - Confirm signup
   - Reset password
   - Magic Link

Make sure the action links point to your app URL (configured above).

### Auth Providers

Currently configured for:
- Email/Password authentication
- Email confirmation required

To enable additional providers (Google, Apple, etc.):
1. Go to **Authentication** → **Providers**
2. Enable desired provider
3. Configure OAuth credentials

## Error Handling

The app automatically detects and displays auth errors from URL parameters:

- `otp_expired` → "Your email link has expired. Please request a new one."
- `email_not_confirmed` → "Please check your email and click the confirmation link."
- `access_denied` → "Access denied. Please try signing in again."

Errors are displayed via toast notifications and the URL is automatically cleaned.

## Database Setup

Make sure you've run the migrations in `/app/supabase/migrations/`:

```bash
# Use the Supabase CLI or run via MCP
supabase db push
```

Or apply via the Supabase MCP tools as done in this project.

## Testing Auth Flow

1. Register a new account
2. Check email for confirmation link
3. Click the link (should redirect to app)
4. If the link expires, you'll see an error message
5. Request a new confirmation email from the login page

## Common Issues

### "Email link is invalid or has expired"
- Email confirmation links expire after 24 hours
- Solution: Request a new confirmation email
- The app will display this error automatically

### "Access denied"
- Usually means the OAuth callback failed
- Check your redirect URLs in Supabase dashboard
- Ensure the URL matches exactly (including trailing slash)

### "Missing Supabase environment variables"
- Make sure `.env.local` exists with:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Copy from `.env.example` if needed

## Security Notes

- The app uses PKCE flow for enhanced security
- Sessions persist in localStorage
- Tokens auto-refresh before expiring
- RLS policies protect all database tables
