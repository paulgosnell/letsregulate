# Deployment Guide

## Vercel Deployment

This monorepo contains two separate applications that should be deployed to different platforms:

### Website (Marketing Landing Page)

**Deploy to:** Vercel
**URL:** https://letsregulate.vercel.app

#### Vercel Configuration

The website is configured to deploy from the root with these settings:

- **Root Directory:** `website/` (set in Vercel dashboard)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Framework Preset:** Vite

#### Option 1: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import the `letsregulate` repository
3. Configure project settings:
   - **Root Directory:** `website`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click "Deploy"

#### Option 2: Deploy via Vercel CLI

```bash
cd website
vercel --prod
```

### App (Main Application)

**Deploy to:** Vercel (separate project) or another platform
**Recommended URL:** https://app.letsregulate.com (or similar)

#### Environment Variables Required

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CLAUDE_API_KEY=your-claude-api-key
VITE_ELEVENLABS_API_KEY=your-elevenlabs-api-key
VITE_ELEVENLABS_AGENT_ID=your-agent-id
```

#### Vercel Configuration for App

1. Create a **separate** Vercel project for the app
2. Configure project settings:
   - **Root Directory:** `app`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
3. Add environment variables in Vercel dashboard
4. Click "Deploy"

## Post-Deployment Configuration

### Update App URL in Website

After deploying the app, update the website to link to the correct URL:

1. In Vercel dashboard for the website project
2. Add environment variable: `VITE_APP_URL=https://your-app-url.vercel.app`
3. Redeploy the website

### Supabase Redirect URLs

After deploying the app, add the production URL to Supabase:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add to **Redirect URLs**:
   ```
   https://your-app-url.vercel.app
   https://your-app-url.vercel.app/
   ```
3. Update the **Site URL** to match your app URL

## Testing Deployment

### Website
- Visit https://letsregulate.vercel.app
- Check that all sections load correctly
- Test "Launch App" button
- Verify video plays in app showcase

### App
- Visit your app URL
- Test registration flow
- Check email confirmation (should redirect properly)
- Test voice chat and text chat features

## Troubleshooting

### 404 Errors

**Problem:** Getting 404 on Vercel
**Solution:** Verify root directory is set correctly in Vercel project settings

**For website:** Root Directory = `website`
**For app:** Root Directory = `app`

### Build Failures

**Problem:** Build fails on Vercel
**Solution:**
1. Check build logs for specific errors
2. Verify `package.json` has all dependencies
3. Ensure environment variables are set (for app)

### Routing Issues (SPA)

**Problem:** Direct URLs return 404
**Solution:** The `vercel.json` rewrite rules should handle this. If not working:
1. Check `vercel.json` exists in the project root
2. Verify rewrites configuration points to `/index.html`

## Separate Deployments

For cleaner deployments, you can split these into two separate repositories:

1. Create `letsregulate-website` repo with just the website folder
2. Create `letsregulate-app` repo with just the app folder
3. Deploy each independently to Vercel

This eliminates the need for root directory configuration.
