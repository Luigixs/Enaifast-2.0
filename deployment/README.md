# 📦 Deployment Package - EAD Platform

## Package Contents

```
deployment/
├── README.md                    # This file
├── deployment.md               # Comprehensive deployment guide
├── operations-checklist.md     # Post-deployment testing checklist
├── env.example                 # Environment variables template
├── database-export.sql         # Full database schema
└── scripts/                    # Helper deployment scripts
    ├── build.sh               # Build frontend
    ├── export-db.sh           # Export database
    └── upload-hostgator.sh    # FTP upload script
```

## Quick Start

### 1. Build Frontend for Production

```bash
# Install dependencies
pnpm install

# Copy environment template
cp deployment/env.example .env
# Edit .env with your production values

# Build
pnpm run build

# Output will be in 'dist' folder (ready to upload)
```

### 2. Choose Your Deployment Path

**Path A: HostGator + Keep Supabase Backend (Easiest)**
```bash
# 1. Upload 'dist' folder to HostGator via FTP
# 2. Update CORS in Supabase for your domain
# 3. Test deployment

Time: ~30 minutes
Cost: $3-10/month (HostGator)
```

**Path B: Vercel Full-Stack (Recommended)**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod

# 3. Configure environment variables in dashboard

Time: ~15 minutes
Cost: $0/month (Hobby plan)
```

**Path C: Self-Hosted VPS (Advanced)**
```bash
# See deployment.md for full Docker setup
# Requires: VPS, Docker, Nginx, SSL

Time: ~2-3 hours
Cost: $6-12/month
```

## File-by-File Guide

### 📄 deployment.md
**Full deployment documentation** with step-by-step instructions for:
- HostGator shared hosting
- Vercel/Netlify deployment
- VPS self-hosting
- Database migration options
- Storage configuration
- DNS and SSL setup

**Read this first** for your deployment strategy.

### 📄 operations-checklist.md
**Comprehensive testing checklist** to verify after deployment:
- Functional tests (courses, lessons, admin)
- Performance benchmarks
- Cross-browser testing
- Security verification
- Error handling
- Final sign-off checklist

**Use this** after deployment to ensure everything works.

### 📄 env.example
**Template for environment variables** including:
- Supabase credentials
- Database connection strings
- Storage configuration (S3/Supabase)
- API endpoints
- Feature flags

**Copy to `.env`** and fill in your production values before building.

### 📄 database-export.sql
**Complete PostgreSQL schema** with:
- All table definitions
- Indexes for performance
- Foreign key relationships
- RLS security policies
- Triggers for auto-updates
- Sample data (commented out)

**Import to** new database if migrating away from Lovable Cloud.

## Deployment Decision Tree

```
Do you want to keep your current Lovable Cloud backend?
│
├─ YES → Use HostGator/Vercel for frontend only
│        Backend stays on Supabase (current)
│        ✓ Easiest option
│        ✓ No backend migration needed
│        ✓ Cost: $0-10/month
│
└─ NO → Choose full migration path:
    │
    ├─ I want zero config → Use Vercel/Netlify
    │                        ✓ Automatic CI/CD
    │                        ✓ Free tier available
    │                        ✓ Cost: $0-20/month
    │
    └─ I want full control → Use VPS (DigitalOcean/Vultr)
                             ✓ Complete ownership
                             ✓ Custom configuration
                             ✓ Cost: $6-20/month
                             ✗ More complex setup
```

## Pre-Deployment Checklist

Before starting deployment:

- [ ] Read `deployment.md` completely
- [ ] Choose deployment strategy
- [ ] Gather credentials (Supabase keys, domain, hosting)
- [ ] Backup current data (database + storage files)
- [ ] Test build locally: `pnpm run build`
- [ ] Update `.env` with production values
- [ ] Prepare DNS access for domain configuration
- [ ] Set aside 1-3 hours for deployment

## Common Deployment Scenarios

### Scenario 1: "I just bought HostGator hosting"

**Solution:** Deploy static frontend to HostGator, keep Supabase backend

```bash
# 1. Build frontend
pnpm run build

# 2. Upload 'dist' folder to public_html via FTP
#    Use FileZilla or cPanel File Manager

# 3. Create .htaccess (see deployment.md)

# 4. Update CORS in Supabase dashboard
#    Add: https://yourdomain.com

# Time: ~45 minutes
# See: deployment.md → "Frontend Deployment → HostGator"
```

### Scenario 2: "I want the simplest deployment"

**Solution:** Use Vercel (frontend + backend stays on Supabase)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login and deploy
vercel login
vercel --prod

# 3. Add environment variables in Vercel dashboard

# Time: ~20 minutes
# See: deployment.md → "Frontend Deployment → Vercel"
```

### Scenario 3: "I want to own everything"

**Solution:** VPS with Docker + self-hosted PostgreSQL

```bash
# See: deployment.md → "Backend Deployment → VPS"
# Requires: Linux knowledge, Docker experience
# Time: ~2-3 hours
```

### Scenario 4: "I need to migrate database"

**Solution:** Export from current Supabase, import to new database

```bash
# 1. Export schema (already in database-export.sql)

# 2. Export data
supabase db dump --data-only > data-export.sql

# 3. Import to new database
psql [new-connection-string] < deployment/database-export.sql
psql [new-connection-string] < data-export.sql

# See: deployment.md → "Database Migration"
```

## Required Credentials Checklist

Before deployment, gather these:

### From Lovable Cloud
- [ ] `VITE_SUPABASE_URL` (from .env or project settings)
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_SUPABASE_PROJECT_ID`
- [ ] Service role key (if migrating backend)

### From Hosting Provider
- [ ] FTP credentials (HostGator)
  - Host: ftp.yourdomain.com
  - Username: _______________
  - Password: _______________
- [ ] cPanel login (HostGator)
- [ ] SSH access (VPS)
  - IP address: _____________
  - Username: root
  - Password/Key: ___________

### Domain & DNS
- [ ] Domain registrar login
- [ ] DNS management access
- [ ] Nameservers (if changing)

### Storage (if migrating)
- [ ] AWS Access Key ID
- [ ] AWS Secret Access Key
- [ ] S3 Bucket name
- [ ] Or DigitalOcean Spaces credentials

## Architecture Options

### Option A: Static Frontend + Managed Backend (Recommended)
```
┌─────────────┐       ┌──────────────┐
│  HostGator  │ ────► │   Supabase   │
│  (Frontend) │       │   (Backend)  │
│  Static HTML│       │ DB + Storage │
└─────────────┘       └──────────────┘
        │                     │
        └─────────────────────┘
         HTTPS API Requests
         
Pros: ✓ Simple  ✓ Cheap  ✓ Reliable
Cons: ✗ Two platforms to manage
Cost: $3-10/month (HostGator) + $0-25/month (Supabase)
```

### Option B: All-in-One Platform
```
┌────────────────────────────┐
│         Vercel             │
│  Frontend + Backend Proxy  │
│         ↓                  │
│      Supabase              │
│   (DB + Storage)           │
└────────────────────────────┘

Pros: ✓ Simplest  ✓ Auto-deploy  ✓ Free tier
Cons: ✗ Less control
Cost: $0-20/month
```

### Option C: Full VPS Control
```
┌────────────────────────────┐
│       Your VPS             │
│  ┌──────────┬───────────┐  │
│  │ Frontend │  Backend  │  │
│  │  Nginx   │  Docker   │  │
│  └──────────┴───────────┘  │
│  ┌──────────┬───────────┐  │
│  │PostgreSQL│  Storage  │  │
│  │          │  (Local)  │  │
│  └──────────┴───────────┘  │
└────────────────────────────┘

Pros: ✓ Full control  ✓ One platform  ✓ Predictable cost
Cons: ✗ Complex setup  ✗ Requires maintenance
Cost: $6-20/month
```

## Support & Resources

**Deployment Help:**
- Full guide: [`deployment.md`](./deployment.md)
- Testing: [`operations-checklist.md`](./operations-checklist.md)

**Platform Documentation:**
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- HostGator: https://www.hostgator.com/help
- DigitalOcean: https://docs.digitalocean.com

**Community:**
- Supabase Discord: https://discord.supabase.com
- React Discord: https://discord.gg/react

## Next Steps

1. **Read deployment.md** (start to finish, ~20 minutes)
2. **Choose your path** (HostGator, Vercel, or VPS)
3. **Follow the relevant section** in deployment.md
4. **Use operations-checklist.md** after deployment
5. **Test thoroughly** before announcing to users

## Troubleshooting

**Problem: Build fails**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

**Problem: Environment variables not working**
```bash
# Ensure variables start with VITE_
# Rebuild after changing .env
pnpm run build
```

**Problem: Upload to HostGator fails**
```bash
# Use FTP client instead of cPanel upload
# Split large files, upload in batches
# Check file size limits
```

**More issues?** See deployment.md → Troubleshooting section

---

## Quick Command Reference

```bash
# Local development
pnpm install
pnpm run dev

# Production build
pnpm run build

# Deploy to Vercel
vercel --prod

# Export database
supabase db dump > deployment/db-backup.sql

# FTP upload (example with lftp)
lftp ftp://username@ftp.yourdomain.com
mirror -R dist public_html

# Test production build locally
pnpm run preview
```

---

**Package Version:** 1.0  
**Created:** December 2024  
**Maintained by:** Your EAD Platform Team

**Ready to deploy?** Start with [`deployment.md`](./deployment.md) →
