# Vercel Deployment Guide

## 🚀 Quick Deployment

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

3. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm build settings
   - Set environment variables

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Production ready deployment"
   git push origin main
   ```

2. **Import in Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

## ⚙️ Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

### Required Variables
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### Optional Variables
```bash
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_DASHBOARD_BUILDER=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=false
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=false
```

### If you have external services:
```bash
API_BASE_URL=https://your-api.com
API_KEY=your-api-key
DATABASE_URL=your-database-url
NEXTAUTH_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret
```

## 🔧 Vercel Configuration

Your `vercel.json` is already optimized for production:

- ✅ Next.js framework detection
- ✅ Optimized build command (`npm ci`)
- ✅ Security headers
- ✅ Function timeout configuration
- ✅ Static file caching
- ✅ Regional deployment (iad1)

## 📊 Build Settings

Vercel will automatically detect:
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Install Command**: `npm ci`
- **Output Directory**: `.next`

## 🌐 Custom Domain (Optional)

1. **Add Domain in Vercel**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**:
   ```bash
   NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
   ```

## 🔍 Monitoring & Analytics

### Vercel Analytics (Optional)
1. Enable in Project Settings → Analytics
2. Add to your app:
   ```bash
   npm install @vercel/analytics
   ```

### Performance Monitoring
- Vercel provides built-in performance monitoring
- Check the "Speed Insights" tab in your dashboard

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Check build logs in Vercel dashboard
   # Ensure all dependencies are in package.json
   ```

2. **Environment Variables**:
   ```bash
   # Make sure all required env vars are set
   # Check variable names match exactly
   ```

3. **Function Timeouts**:
   ```bash
   # Increase maxDuration in vercel.json if needed
   # Optimize heavy operations
   ```

### Debug Commands
```bash
# Test build locally
npm run build

# Check bundle size
npm run build:analyze

# Test production build
npm run start
```

## 📈 Performance Optimization

### Vercel Edge Functions
Consider using Edge Functions for:
- API routes with global distribution
- Real-time features
- Authentication

### Image Optimization
Vercel automatically optimizes images:
- WebP/AVIF conversion
- Responsive images
- Lazy loading

### Caching
- Static assets: 1 year
- API routes: Configure as needed
- Pages: Automatic ISR support

## 🔒 Security Features

Your deployment includes:
- ✅ HTTPS by default
- ✅ Security headers
- ✅ DDoS protection
- ✅ Global CDN
- ✅ Automatic SSL certificates

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables configured
- [ ] Build passes locally (`npm run build`)
- [ ] No critical errors in console
- [ ] Custom domain configured (if needed)
- [ ] Analytics enabled (if desired)

## 🎯 Post-Deployment

1. **Test Your App**:
   - Visit your Vercel URL
   - Test all major features
   - Check mobile responsiveness

2. **Monitor Performance**:
   - Check Vercel Analytics
   - Monitor Core Web Vitals
   - Set up error tracking

3. **Set Up Monitoring**:
   - Enable Vercel Speed Insights
   - Configure uptime monitoring
   - Set up alerts

## 🚀 Ready to Deploy!

Your app is production-ready for Vercel. Run:

```bash
vercel --prod
```

And follow the prompts to deploy your Insights Flow dashboard to the world! 🌍
