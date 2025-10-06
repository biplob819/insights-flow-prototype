# Deployment Guide - Insights Flow

## Production Deployment to Vercel

This guide covers deploying the Insights Flow application to Vercel for production use.

### Prerequisites

1. **Node.js**: Version 18.0.0 or higher
2. **npm**: Version 8.0.0 or higher
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
4. **GitHub Repository**: Code should be pushed to GitHub

### Environment Variables

Set the following environment variables in your Vercel dashboard:

#### Required Variables
```bash
NEXT_PUBLIC_APP_NAME="Insights Flow"
NEXT_PUBLIC_APP_VERSION="0.1.0"
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### Optional Variables (for enhanced features)
```bash
# Analytics & Monitoring
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_DASHBOARD_BUILDER=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true

# Build Configuration
NEXT_TELEMETRY_DISABLED=1
```

### Deployment Steps

#### Method 1: Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project root:
```bash
cd insights-flow
vercel --prod
```

#### Method 2: GitHub Integration

1. Push code to GitHub (see Git commands below)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables
6. Deploy

### Build Configuration

The project is configured with:
- **Framework**: Next.js 15.5.0
- **Build Command**: `npm run vercel-build`
- **Install Command**: `npm ci --only=production`
- **Output Directory**: `.next` (automatic)
- **Node.js Version**: 18.x

### Performance Optimizations

- ✅ Image optimization with WebP/AVIF formats
- ✅ Bundle splitting and code optimization
- ✅ Compression enabled
- ✅ Security headers configured
- ✅ Static asset caching (1 year)
- ✅ TypeScript strict mode
- ✅ ESLint validation

### Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test dashboard functionality
- [ ] Check responsive design on mobile
- [ ] Validate security headers
- [ ] Test performance with Lighthouse
- [ ] Verify sitemap generation
- [ ] Check error tracking (if enabled)

### Monitoring & Analytics

After deployment, monitor your application using:
- Vercel Analytics (built-in)
- Google Analytics (if configured)
- Sentry for error tracking (if configured)
- Core Web Vitals in Vercel dashboard

### Troubleshooting

#### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review TypeScript errors
- Check ESLint warnings

#### Runtime Issues
- Verify environment variables are set
- Check Vercel function logs
- Review browser console for client-side errors
- Validate API endpoints

### Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs in Vercel dashboard
3. Verify environment variables
4. Test locally with `npm run build && npm start`
