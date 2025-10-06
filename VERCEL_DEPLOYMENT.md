# Vercel Deployment Guide

## Production Deployment Checklist

### ✅ Pre-deployment Requirements

1. **Build Success**: `npm run build` completes without errors
2. **Type Safety**: `npm run type-check` passes
3. **Security**: `npm audit` shows no vulnerabilities
4. **Dependencies**: All required packages are in `package.json`

### 🚀 Deployment Steps

#### 1. Connect to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel --prod
```

#### 2. Environment Variables

Set these environment variables in Vercel dashboard:

**Required:**
- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_NAME=Insights Flow`
- `NEXT_PUBLIC_APP_VERSION=0.1.0`

**Optional:**
- `NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app`
- `NEXT_PUBLIC_ENABLE_ANALYTICS=false`
- `NEXT_PUBLIC_ENABLE_CHAT=true`
- `NEXT_PUBLIC_ENABLE_DASHBOARD_BUILDER=true`

#### 3. Build Configuration

The project is configured with:
- **Framework**: Next.js 15.5.0
- **Build Command**: `npm run build`
- **Install Command**: `npm ci`
- **Output Directory**: `.next`

#### 4. Domain Configuration

After deployment:
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain
5. Update DNS records as instructed

### 🔧 Production Optimizations

#### Performance Features Enabled:
- ✅ Image optimization with WebP/AVIF
- ✅ Bundle splitting and code optimization
- ✅ Compression enabled
- ✅ Security headers configured
- ✅ Static generation for pages
- ✅ Sitemap generation

#### Security Features:
- ✅ Content Security Policy
- ✅ XSS Protection
- ✅ Frame Options
- ✅ Content Type Options
- ✅ Referrer Policy
- ✅ Permissions Policy

### 📊 Monitoring

#### Build Performance:
- Build time: ~8-10 seconds
- Bundle size: ~387kB shared JS
- Static pages: 8 pages pre-rendered

#### Runtime Monitoring:
- Enable error reporting in production
- Monitor Core Web Vitals
- Track bundle size changes

### 🐛 Troubleshooting

#### Common Issues:

1. **Build Failures**:
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   npm ci
   npm run build
   ```

2. **Type Errors**:
   ```bash
   # Check TypeScript compilation
   npm run type-check
   ```

3. **Environment Variables**:
   - Ensure all required env vars are set in Vercel
   - Check variable names match exactly

4. **Import Errors**:
   - Verify all imports use correct paths
   - Check for missing dependencies

### 📈 Performance Metrics

#### Target Metrics:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

#### Bundle Analysis:
```bash
# Analyze bundle size
npm run build:analyze
```

### 🔄 CI/CD Integration

#### GitHub Actions (Optional):
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 📝 Post-Deployment

1. **Test Core Functionality**:
   - Dashboard builder
   - Data modeling
   - Chat panel
   - Settings pages

2. **Performance Testing**:
   - Run Lighthouse audit
   - Check mobile responsiveness
   - Test loading times

3. **Security Check**:
   - Verify HTTPS
   - Check security headers
   - Test for XSS vulnerabilities

### 🎯 Success Criteria

✅ **Deployment Successful When**:
- Build completes without errors
- All pages load correctly
- No console errors
- Performance metrics meet targets
- Security headers are present
- Sitemap is accessible

### 📞 Support

For deployment issues:
1. Check Vercel dashboard logs
2. Review build output
3. Verify environment variables
4. Test locally with production build

---

**Last Updated**: December 2024
**Next.js Version**: 15.5.0
**Node Version**: >=18.0.0