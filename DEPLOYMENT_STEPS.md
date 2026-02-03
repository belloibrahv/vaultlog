# VaultLog - Quick Deployment Steps

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1: Go to Vercel Dashboard
- Visit https://vercel.com
- Sign in with GitHub

### Step 2: Import Project
- Click "Add New" → "Project"
- Select `vaultlog` repository
- Click "Import"

### Step 3: Add Environment Variables
In the "Environment Variables" section, add:

```
DATABASE_URL=postgresql://neondb_owner:npg_K1aeTQRXnBr7@ep-wandering-sun-aha3n1xz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=5IREUfWVAc2/yw5LFEjeXUMs6btG8380HL4zqTlQfXI=

NEXT_PUBLIC_UPLOAD_URL=https://your-app.vercel.app/api/upload
```

**Note**: Replace `your-app` with your actual Vercel project name

### Step 4: Deploy
- Click "Deploy"
- Wait for build to complete (2-3 minutes)
- Get your production URL

### Step 5: Update NEXTAUTH_URL
- Copy your Vercel domain
- Update `NEXTAUTH_URL` environment variable
- Redeploy

## ✅ Verification Checklist

After deployment:

- [ ] App loads without errors
- [ ] Login page displays correctly
- [ ] Can log in with test account
- [ ] Dashboard loads with data
- [ ] Tasks page works
- [ ] Clients page works
- [ ] Can create new task
- [ ] Can create new client
- [ ] Responsive design works on mobile
- [ ] No console errors

## 🔑 Test Accounts

Use these to test after deployment:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vaultlog.local | admin123 |
| Manager | manager@vaultlog.local | manager123 |
| Staff | alice@vaultlog.local | staff123 |

## 📊 Monitoring

After deployment, monitor:

1. **Vercel Dashboard**
   - Go to Deployments tab
   - Check build logs
   - Monitor error rates

2. **Application**
   - Check browser console for errors
   - Test all main features
   - Verify database connectivity

## 🆘 Troubleshooting

### Build Fails
- Check all environment variables are set
- Verify DATABASE_URL is correct
- Check Node.js version compatibility

### App Won't Load
- Check NEXTAUTH_URL matches Vercel domain
- Verify NEXTAUTH_SECRET is set
- Check database connection

### Login Not Working
- Verify NEXTAUTH_URL is correct
- Check NEXTAUTH_SECRET is set
- Clear browser cookies and try again

## 📝 Environment Variables Reference

| Variable | Value | Notes |
|----------|-------|-------|
| DATABASE_URL | Neon connection string | Keep as is |
| NEXTAUTH_URL | https://your-app.vercel.app | Update with your domain |
| NEXTAUTH_SECRET | Generated secret | Keep secure |
| NEXT_PUBLIC_UPLOAD_URL | https://your-app.vercel.app/api/upload | Update with your domain |

## 🎯 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test all features
3. ✅ Set up custom domain (optional)
4. ✅ Configure monitoring
5. ✅ Set up backups
6. ✅ Share with team

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub Issues: https://github.com/belloibrahv/vaultlog/issues

---

**Status**: ✅ Ready for Deployment
