# VaultLog - Vercel Deployment Guide

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (free tier available)
- Neon PostgreSQL database (already configured)
- NextAuth.js secret key

## Step 1: Connect GitHub Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub account
3. Click "Add New..." → "Project"
4. Select the `vaultlog` repository
5. Click "Import"

## Step 2: Configure Environment Variables

In the Vercel dashboard, go to **Settings** → **Environment Variables** and add:

### Required Variables

```
DATABASE_URL=postgresql://neondb_owner:npg_K1aeTQRXnBr7@ep-wandering-sun-aha3n1xz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=5IREUfWVAc2/yw5LFEjeXUMs6btG8380HL4zqTlQfXI=

NEXT_PUBLIC_UPLOAD_URL=https://your-vercel-domain.vercel.app/api/upload
```

### Important Notes

- Replace `your-vercel-domain` with your actual Vercel domain
- Keep `DATABASE_URL` the same (Neon connection string)
- Generate a new `NEXTAUTH_SECRET` for production:
  ```bash
  openssl rand -base64 32
  ```
- Set environment variables for all environments: Production, Preview, Development

## Step 3: Configure Build Settings

1. In Vercel dashboard, go to **Settings** → **Build & Development Settings**
2. Verify:
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

## Step 4: Deploy

1. Click "Deploy" button
2. Wait for build to complete (usually 2-3 minutes)
3. Once deployed, you'll get a production URL

## Step 5: Update NEXTAUTH_URL

After deployment:

1. Copy your Vercel domain (e.g., `vaultlog-abc123.vercel.app`)
2. Update `NEXTAUTH_URL` environment variable:
   ```
   NEXTAUTH_URL=https://vaultlog-abc123.vercel.app
   ```
3. Redeploy or wait for automatic redeployment

## Step 6: Run Database Migrations

After first deployment:

1. Connect to your Vercel deployment via SSH or use Vercel CLI
2. Run migrations:
   ```bash
   npm run db:migrate
   ```
3. Seed initial data (optional):
   ```bash
   npm run seed
   ```

## Vercel CLI Alternative (Recommended)

### Install Vercel CLI

```bash
npm install -g vercel
```

### Deploy from Command Line

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

### Set Environment Variables via CLI

```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXT_PUBLIC_UPLOAD_URL
```

## Post-Deployment Checklist

- [ ] Verify app loads without errors
- [ ] Test login functionality
- [ ] Test task creation
- [ ] Test client management
- [ ] Test time logging
- [ ] Verify responsive design on mobile
- [ ] Check database connectivity
- [ ] Monitor error logs in Vercel dashboard
- [ ] Set up monitoring/alerts

## Troubleshooting

### Build Fails

**Error**: `Cannot find module 'drizzle-orm'`
- Solution: Ensure all dependencies are in `package.json`
- Run: `npm install` locally first

**Error**: `NEXTAUTH_SECRET is not defined`
- Solution: Add `NEXTAUTH_SECRET` to environment variables
- Generate new secret: `openssl rand -base64 32`

### Database Connection Issues

**Error**: `Connection refused`
- Solution: Verify `DATABASE_URL` is correct
- Check Neon database is running
- Ensure IP whitelist allows Vercel IPs

**Error**: `SSL certificate problem`
- Solution: Ensure `?sslmode=require` is in DATABASE_URL
- Add `&channel_binding=require` if needed

### Authentication Issues

**Error**: `Callback URL mismatch`
- Solution: Update `NEXTAUTH_URL` to match Vercel domain
- Redeploy after updating

**Error**: `Session not persisting`
- Solution: Check `NEXTAUTH_SECRET` is set correctly
- Verify cookies are enabled in browser

## Performance Optimization

### Enable Caching

1. Go to **Settings** → **Caching**
2. Enable "Automatic Cache Optimization"

### Monitor Performance

1. Go to **Analytics** tab
2. Monitor:
   - Page load times
   - Error rates
   - Deployment frequency

## Continuous Deployment

Vercel automatically deploys on:
- Push to `main` branch → Production
- Push to other branches → Preview
- Pull requests → Preview

### Disable Auto-Deploy (if needed)

1. Go to **Settings** → **Git**
2. Disable "Automatic Deployments"

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to use custom domain

## Monitoring & Logs

### View Logs

1. Go to **Deployments** tab
2. Click on deployment
3. View build logs and runtime logs

### Set Up Alerts

1. Go to **Settings** → **Alerts**
2. Configure notifications for:
   - Build failures
   - High error rates
   - Performance issues

## Rollback

If deployment has issues:

1. Go to **Deployments** tab
2. Find previous stable deployment
3. Click "Promote to Production"

## Database Backups

For Neon PostgreSQL:

1. Go to Neon dashboard
2. Set up automated backups
3. Configure backup retention policy

## Security Best Practices

- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up rate limiting
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable two-factor authentication on Vercel

## Scaling

As traffic grows:

1. Vercel automatically scales serverless functions
2. Monitor usage in **Usage** tab
3. Upgrade plan if needed
4. Consider database optimization

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- NextAuth.js Docs: https://next-auth.js.org
- Neon Docs: https://neon.tech/docs

## Deployment Summary

| Component | Status |
|-----------|--------|
| Frontend | ✅ Deployed on Vercel |
| Backend API | ✅ Serverless Functions |
| Database | ✅ Neon PostgreSQL |
| Authentication | ✅ NextAuth.js |
| Responsive Design | ✅ Mobile-optimized |
| Performance | ✅ Optimized |
| Security | ✅ HTTPS, Environment Variables |

---

**Deployment Status**: ✅ READY FOR PRODUCTION

**Last Updated**: February 3, 2026
