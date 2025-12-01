# 🚀 EAD Platform Deployment Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Database Migration](#database-migration)
4. [Storage Migration](#storage-migration)
5. [Frontend Deployment](#frontend-deployment)
6. [Backend Deployment](#backend-deployment)
7. [DNS & Domain Configuration](#dns--domain-configuration)
8. [Post-Deployment Testing](#post-deployment-testing)
9. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

Your EAD application consists of three main components:

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR EAD PLATFORM                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
│  │   FRONTEND   │   │   DATABASE   │   │   STORAGE    │    │
│  │  React/Vite  │◄─►│  PostgreSQL  │   │  Files/Media │    │
│  │  Static HTML │   │   Supabase   │   │   Supabase   │    │
│  └──────────────┘   └──────────────┘   └──────────────┘    │
│         │                    │                   │           │
│         └────────────────────┴───────────────────┘           │
│                     Backend API Layer                        │
│                  (Supabase Edge Functions)                   │
└─────────────────────────────────────────────────────────────┘
```

### Important: HostGator Limitations

**⚠️ CRITICAL INFORMATION:**

HostGator shared hosting **CANNOT** run the backend of this application because:
- ✗ No support for PostgreSQL database
- ✗ No support for Node.js/Deno edge functions
- ✗ No WebSocket support for real-time features
- ✗ Limited PHP-only environment

**What HostGator CAN do:**
- ✓ Host the static frontend (HTML/CSS/JS files)
- ✓ Serve built React application
- ✓ Handle domain and SSL

### Recommended Deployment Strategy

**Option 1: Keep Backend on Supabase (Easiest)**
- Frontend: HostGator shared hosting
- Backend: Keep using Supabase (current Lovable Cloud)
- Cost: $0-25/month for Supabase

**Option 2: Full Migration to Platform (Recommended)**
- Frontend + Backend: Vercel/Netlify/Render
- Database: Supabase/PlanetScale/Neon
- Cost: $0-20/month

**Option 3: VPS Deployment (Advanced)**
- Frontend: HostGator or Vercel
- Backend: DigitalOcean/Vultr VPS with Docker
- Database: Self-hosted PostgreSQL or managed service
- Cost: $5-20/month

---

## Pre-Deployment Checklist

### 1. Gather Current Credentials

```bash
# Export from Lovable Cloud
# Go to Project Settings → Cloud → View Credentials

SUPABASE_URL: rvqxtrbhpfepxgkwprwj.supabase.co
SUPABASE_ANON_KEY: [from settings]
SUPABASE_SERVICE_KEY: [from settings]
```

### 2. Install Required Tools

```bash
# Install Node.js (v18 or higher)
node --version  # Should be 18.x or higher

# Install pnpm (or npm)
npm install -g pnpm

# Install Supabase CLI (for database export)
npm install -g supabase

# Install AWS CLI (if using S3)
# https://aws.amazon.com/cli/
```

### 3. Clone/Download Your Code

```bash
# If using Git
git clone [your-repository-url]
cd course-arena

# Install dependencies
pnpm install
```

---

## Database Migration

### Option A: Keep Using Supabase (Recommended)

**No migration needed!** Your current Supabase project can be used from any frontend host.

1. Note your credentials (already in `.env`)
2. Update CORS settings in Supabase dashboard to allow your new domain
3. Continue to [Frontend Deployment](#frontend-deployment)

### Option B: Export and Migrate to New Supabase Project

```bash
# 1. Login to Supabase CLI
supabase login

# 2. Link to your project
supabase link --project-ref rvqxtrbhpfepxgkwprwj

# 3. Export database schema
supabase db dump --schema public --file deployment/database-export.sql

# 4. Create new Supabase project at https://supabase.com

# 5. Import to new project
supabase link --project-ref [new-project-id]
supabase db push

# 6. Update environment variables with new credentials
```

### Option C: Migrate to PlanetScale (MySQL)

⚠️ **Not recommended** - This app uses PostgreSQL-specific features (UUIDs, JSONB, RLS)

### Option D: Migrate to Managed PostgreSQL

**For Railway.app:**

```bash
# 1. Create Railway account and new project
# 2. Add PostgreSQL database service
# 3. Get connection string from Railway dashboard

# 4. Import schema
psql [railway-connection-string] < deployment/database-export.sql

# 5. Update .env with Railway credentials
DATABASE_URL=postgresql://...railway.app:port/railway
```

**For Render.com:**

```bash
# 1. Create Render account
# 2. New → PostgreSQL
# 3. Copy Internal/External Database URL

# 4. Import schema
psql [render-connection-string] < deployment/database-export.sql
```

---

## Storage Migration

Your app uses these storage buckets:
- `course-thumbnails` (public)
- `lesson-content` (public)
- `lesson-thumbnails` (public)
- `banners` (public)

### Option A: Keep Supabase Storage (Easiest)

**No migration needed!** Files remain accessible.

1. Update CORS in Supabase Storage settings:
   ```
   Allowed origins: https://yourdomain.com
   ```

2. Ensure your storage URLs in code use the correct Supabase URL

### Option B: Migrate to AWS S3

```bash
# 1. Create S3 bucket
aws s3 mb s3://your-ead-platform

# 2. Enable public access for public files
aws s3api put-bucket-policy --bucket your-ead-platform --policy file://bucket-policy.json

# 3. Download files from Supabase Storage
# (Use Supabase Dashboard → Storage → Download)

# 4. Upload to S3
aws s3 sync ./local-files s3://your-ead-platform --acl public-read

# 5. Update CORS configuration
aws s3api put-bucket-cors --bucket your-ead-platform --cors-configuration file://cors.json
```

**cors.json:**
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourdomain.com"],
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

### Option C: DigitalOcean Spaces (S3-Compatible)

```bash
# 1. Create Space at digitalocean.com
# 2. Get Access Key and Secret

# 3. Configure AWS CLI for Spaces
aws configure --profile digitalocean
AWS Access Key ID: [your-key]
AWS Secret Access Key: [your-secret]
Default region name: nyc3

# 4. Upload files
aws s3 sync ./files s3://your-space-name --endpoint=https://nyc3.digitaloceanspaces.com --profile digitalocean --acl public-read
```

---

## Frontend Deployment

### Build the Application

```bash
# 1. Update environment variables
cp deployment/env.example .env
# Edit .env with your production values

# 2. Build for production
pnpm run build

# This creates a 'dist' folder with static files
```

### Option 1: Deploy to HostGator (Shared Hosting)

**Step-by-Step Instructions:**

1. **Access cPanel**
   - Login to HostGator cPanel
   - Navigate to "File Manager"

2. **Prepare Directory**
   ```
   - Go to public_html (or subdomain folder)
   - Delete default index.html
   - Create backup of any existing files
   ```

3. **Upload Files**
   ```
   Method A: File Manager Upload
   - Click "Upload" button
   - Upload all files from your 'dist' folder
   - Wait for completion (may take 5-10 minutes)

   Method B: FTP (Recommended for large files)
   - Use FileZilla or similar FTP client
   - Connect: ftp.yourdomain.com
   - Upload entire 'dist' folder contents to public_html
   ```

4. **Create .htaccess for React Router**
   
   Create file: `public_html/.htaccess`
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>

   # Enable GZIP compression
   <IfModule mod_deflate.c>
     AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
   </IfModule>

   # Browser caching
   <IfModule mod_expires.c>
     ExpiresActive On
     ExpiresByType image/jpg "access plus 1 year"
     ExpiresByType image/jpeg "access plus 1 year"
     ExpiresByType image/png "access plus 1 year"
     ExpiresByType image/webp "access plus 1 year"
     ExpiresByType text/css "access plus 1 month"
     ExpiresByType application/javascript "access plus 1 month"
   </IfModule>
   ```

5. **Set File Permissions**
   ```
   - Files: 644
   - Folders: 755
   - .htaccess: 644
   ```

6. **Configure Environment Variables**
   
   Since HostGator doesn't support `.env` files for static sites, your environment variables are baked into the build. If you need to change them:
   ```bash
   # Locally update .env
   # Rebuild: pnpm run build
   # Re-upload dist folder
   ```

### Option 2: Deploy to Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. For production
vercel --prod

# 5. Add environment variables in Vercel Dashboard
# Project Settings → Environment Variables
```

**vercel.json:**
```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Option 3: Deploy to Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy --prod

# 4. Configure build settings
```

**netlify.toml:**
```toml
[build]
  command = "pnpm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## Backend Deployment

### Option 1: Keep Supabase Backend (Recommended)

**No deployment needed!** Your edge functions and database are already live.

**Update CORS only:**

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your production domain to "Site URL" and "Redirect URLs"
3. Go to Storage → Policies → Update CORS settings

### Option 2: Self-Host on VPS (Advanced)

**Requirements:**
- VPS with Ubuntu 20.04+ (DigitalOcean, Vultr, Linode)
- Minimum 2GB RAM, 2 CPU cores
- Docker and Docker Compose installed

**Steps:**

```bash
# 1. Connect to your VPS
ssh root@your-vps-ip

# 2. Install dependencies
apt update && apt upgrade -y
apt install docker.io docker-compose nginx certbot python3-certbot-nginx -y

# 3. Clone your repository
git clone [your-repo] /var/www/ead-platform
cd /var/www/ead-platform

# 4. Create docker-compose.yml
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ead_database
      POSTGRES_USER: ead_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./deployment/database-export.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  supabase:
    image: supabase/supabase:latest
    depends_on:
      - postgres
    environment:
      POSTGRES_HOST: postgres
      POSTGRES_PORT: 5432
      POSTGRES_DB: ead_database
      POSTGRES_USER: ead_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      ANON_KEY: ${ANON_KEY}
      SERVICE_ROLE_KEY: ${SERVICE_KEY}
    ports:
      - "8000:8000"
    restart: unless-stopped

volumes:
  postgres_data:
```

```bash
# 5. Start services
docker-compose up -d

# 6. Configure Nginx reverse proxy
nano /etc/nginx/sites-available/ead-platform
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 7. Enable site and SSL
ln -s /etc/nginx/sites-available/ead-platform /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
certbot --nginx -d api.yourdomain.com

# 8. Update frontend environment variables to point to your VPS
VITE_SUPABASE_URL=https://api.yourdomain.com
```

---

## DNS & Domain Configuration

### Configure DNS Records

**If using HostGator for frontend + Supabase for backend:**

```
Type    Name    Value                           TTL
A       @       [HostGator IP]                  14400
A       www     [HostGator IP]                  14400
CNAME   api     rvqxtrbhpfepxgkwprwj.supabase.co  14400
```

**If using Vercel for frontend:**

```
Type    Name    Value                   TTL
CNAME   @       cname.vercel-dns.com    14400
CNAME   www     cname.vercel-dns.com    14400
```

### SSL Certificate

**For HostGator:**
1. cPanel → SSL/TLS Status
2. Run AutoSSL or install Let's Encrypt

**For Vercel/Netlify:**
- SSL is automatic

**For VPS:**
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Post-Deployment Testing

See `operations-checklist.md` for comprehensive testing procedures.

**Quick verification:**

```bash
# 1. Check frontend loads
curl -I https://yourdomain.com
# Should return: HTTP/2 200

# 2. Check API connection
curl https://yourdomain.com/api/health
# Or check browser console for any errors

# 3. Test database connection
# Login to your app and try to load courses

# 4. Test file uploads
# Try uploading a course thumbnail

# 5. Check CORS
# Open browser console, should see no CORS errors
```

---

## Troubleshooting

### Problem: White screen on HostGator

**Solution:**
```bash
# Check .htaccess is present
# Verify base path in vite.config.ts
export default defineConfig({
  base: '/',  # or '/subdirectory/' if in subfolder
})

# Rebuild and re-upload
pnpm run build
```

### Problem: API requests fail with CORS error

**Solution:**
```javascript
// Update Supabase Dashboard:
// Settings → API → CORS → Add domain
https://yourdomain.com
https://www.yourdomain.com

// Or update your .env
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Problem: Images/PDFs not loading

**Solution:**
```javascript
// Check storage bucket URLs
// Update VITE_SUPABASE_URL in .env
// Verify CORS on storage bucket
```

### Problem: Large files timing out on HostGator

**Solution:**
```apache
# Add to .htaccess
php_value upload_max_filesize 64M
php_value post_max_size 64M
php_value max_execution_time 300
```

---

## Cost Estimates

### Option 1: HostGator + Supabase
- HostGator Shared: $3-10/month
- Supabase Free: $0/month (up to 500MB)
- Supabase Pro: $25/month (8GB + more features)
- **Total: $3-35/month**

### Option 2: Vercel + Supabase
- Vercel Hobby: $0/month
- Vercel Pro: $20/month
- Supabase Free: $0/month
- **Total: $0-20/month**

### Option 3: VPS Everything
- DigitalOcean Droplet: $6-12/month
- Domain: $12/year
- **Total: $6-15/month**

---

## Support & Resources

- Supabase Docs: https://supabase.com/docs
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html
- HostGator Support: https://www.hostgator.com/help
- Vercel Docs: https://vercel.com/docs

---

## Quick Start Commands Reference

```bash
# Build frontend
pnpm install
pnpm run build

# Export database
supabase db dump --file deployment/database-export.sql

# Deploy to Vercel
vercel --prod

# Deploy to HostGator
# Upload 'dist' folder contents via FTP

# Check deployment
curl -I https://yourdomain.com
```

---

**Created:** December 2024  
**Version:** 1.0  
**Last Updated:** [Current Date]
