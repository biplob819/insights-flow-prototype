# Production Deployment Guide

## Overview
This guide covers deploying Insights Flow to production with all necessary configurations for security, performance, and reliability.

## Prerequisites
- Node.js 18+ and npm 8+
- Docker and Docker Compose
- SSL certificates
- Domain name configured
- Environment variables set

## Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp env.example .env.production

# Edit environment variables
nano .env.production
```

### 2. Build and Deploy with Docker
```bash
# Build the application
npm run build

# Build Docker image
docker build -t insights-flow:latest .

# Deploy with Docker Compose
docker-compose up -d
```

### 3. Verify Deployment
```bash
# Check application health
curl https://your-domain.com/health

# Check logs
docker-compose logs -f app
```

## Production Configuration

### Environment Variables
Required environment variables for production:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Security
NEXTAUTH_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key

# Database (if applicable)
DATABASE_URL=postgresql://user:password@host:port/database

# External APIs
API_BASE_URL=https://api.your-domain.com
API_KEY=your-api-key
```

### Security Features
- ✅ Security headers configured
- ✅ HTTPS enforcement
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling
- ✅ CORS protection
- ✅ Content Security Policy

### Performance Optimizations
- ✅ Bundle optimization
- ✅ Image optimization
- ✅ Compression enabled
- ✅ Caching headers
- ✅ Static file optimization
- ✅ Code splitting

### Monitoring and Logging
- ✅ Structured logging
- ✅ Error tracking
- ✅ Performance monitoring
- ✅ Health checks

## Deployment Options

### Option 1: Docker Compose (Recommended)
```bash
# Production deployment
docker-compose -f docker-compose.yml up -d

# With custom environment
docker-compose -f docker-compose.yml --env-file .env.production up -d
```

### Option 2: Kubernetes
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -l app=insights-flow
```

### Option 3: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

## SSL Configuration

### Let's Encrypt (Recommended)
```bash
# Install Certbot
sudo apt install certbot

# Generate certificates
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ./ssl/key.pem
```

### Self-Signed Certificates (Development)
```bash
# Generate self-signed certificates
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes
```

## Monitoring

### Health Checks
- Application: `GET /health`
- Database: `GET /api/health/db`
- External APIs: `GET /api/health/external`

### Log Monitoring
```bash
# View application logs
docker-compose logs -f app

# View nginx logs
docker-compose logs -f nginx

# View error logs
docker-compose logs -f app | grep ERROR
```

### Performance Monitoring
- Bundle size analysis: `npm run build:analyze`
- Lighthouse audits
- Core Web Vitals monitoring

## Backup and Recovery

### Database Backup
```bash
# PostgreSQL backup
pg_dump -h localhost -U postgres insights_flow > backup.sql

# Restore
psql -h localhost -U postgres insights_flow < backup.sql
```

### Application Backup
```bash
# Backup application data
tar -czf app-backup.tar.gz ./data ./uploads

# Restore
tar -xzf app-backup.tar.gz
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   npm run clean
   npm ci
   npm run build
   ```

2. **Memory Issues**
   ```bash
   # Increase Node.js memory limit
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```

3. **Database Connection Issues**
   - Check database credentials
   - Verify network connectivity
   - Check database server status

4. **SSL Certificate Issues**
   - Verify certificate validity
   - Check certificate paths
   - Ensure proper permissions

### Performance Issues
- Enable bundle analysis
- Check for memory leaks
- Monitor database queries
- Optimize images and assets

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Error handling configured
- [ ] Database credentials secured
- [ ] API keys rotated
- [ ] CORS properly configured
- [ ] Content Security Policy enabled
- [ ] Regular security audits
- [ ] Backup procedures tested

## Support

For production support:
- Check logs: `docker-compose logs -f`
- Monitor health: `curl https://your-domain.com/health`
- Review security: `npm audit`
- Performance: `npm run build:analyze`

## Updates and Maintenance

### Regular Maintenance
- Update dependencies monthly
- Security patches immediately
- Performance monitoring weekly
- Backup verification monthly

### Version Updates
```bash
# Update dependencies
npm update

# Test updates
npm run test

# Deploy updates
docker-compose up -d --build
```
