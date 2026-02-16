# ADR 002: Deployment Strategy and Cloud Services

**Status**: Accepted  
**Date**: 2026-02-15  
**Deciders**: Development Team  
**AI Tool Used**: Claude (Anthropic) for cloud provider research

---

## Context

Buckeye Marketplace needs a cloud deployment strategy that:
1. Meets the "Cloud Deployment" requirement from Milestone 2
2. Provides public accessibility for real-world testing and grading
3. Fits within student budget constraints (ideally free tier)
4. Supports separate deployment of frontend (React) and backend (Node.js)
5. Includes managed PostgreSQL database hosting
6. Provides HTTPS and custom domain support

---

## Decision

We will use a **multi-service deployment architecture**:

### Frontend Hosting
**Primary Choice**: **Vercel**  
**Fallback**: Netlify

### Backend Hosting
**Primary Choice**: **Render** (Free Tier)  
**Fallback**: Railway, Fly.io

### Database Hosting
**Primary Choice**: **Supabase** (PostgreSQL managed service)  
**Fallback**: Render PostgreSQL, Neon

### Image Storage
**Primary Choice**: **Cloudinary** (Free Tier)  
**Fallback**: AWS S3 with CloudFront

### Domain & SSL
- **HTTPS**: Provided automatically by Vercel and Render
- **Custom Domain**: Optional (e.g., buckeye-marketplace.vercel.app)

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    Internet / Users                       │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   DNS / Domain Registrar   │
        │  (Namecheap / Cloudflare)  │
        └────────┬───────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌───────────────┐   ┌───────────────────┐
│    Vercel     │   │      Render       │
│  (Frontend)   │   │    (Backend)      │
│               │   │                   │
│ React SPA     │   │ Node.js/Express   │
│ Static Build  │   │ API Server        │
│               │   │                   │
│ HTTPS Auto    │   │ HTTPS Auto        │
│ CDN Global    │   │ Auto-scale        │
└───────┬───────┘   └────────┬──────────┘
        │                    │
        │                    │
        │                    ▼
        │            ┌───────────────────┐
        │            │    Supabase       │
        │            │  (PostgreSQL DB)  │
        │            │                   │
        │            │ Managed DB        │
        │            │ Auto Backups      │
        │            │ Connection Pool   │
        │            └─────────┬─────────┘
        │                      │
        │                      │
        ▼                      ▼
┌───────────────────────────────────────┐
│           Cloudinary                  │
│      (Image Storage & CDN)            │
│                                       │
│  Product Images                       │
│  Auto-optimization                    │
│  Global CDN                           │
└───────────────────────────────────────┘
```

---

## Service-by-Service Breakdown

### 1. Frontend: Vercel

**What it hosts**: React production build (static files)

**Why Vercel**:
- **Zero Configuration**: Automatic deployment from GitHub
- **Perfect React Support**: Built by creators of Next.js, optimized for React
- **Global CDN**: Fast page loads worldwide (addresses Alex's user experience)
- **Free Tier**: Unlimited bandwidth for personal projects
- **HTTPS Automatic**: SSL certificates managed automatically
- **Preview Deployments**: Each git branch gets a preview URL (great for testing)
- **Environment Variables**: Securely store API endpoints

**Deployment Process**:
1. Push React code to GitHub
2. Connect Vercel to GitHub repo
3. Vercel auto-builds and deploys on every push to `main`
4. Access via `https://buckeye-marketplace.vercel.app`

**Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "env": {
    "REACT_APP_API_URL": "https://buckeye-marketplace-api.onrender.com"
  }
}
```

**Alternative: Netlify**
- Very similar to Vercel (also excellent React support)
- Slightly different UI, same core features
- Use if Vercel has issues

---

### 2. Backend: Render

**What it hosts**: Node.js/Express API server

**Why Render**:
- **Free Tier**: 750 hours/month free (enough for 24/7 uptime)
- **Automatic Deployments**: GitHub integration (push to deploy)
- **PostgreSQL Included**: Can bundle database and backend in one service
- **HTTPS Automatic**: SSL certificates managed
- **Easy Environment Variables**: Secure config management
- **Student-Friendly**: Simpler than AWS/GCP, more reliable than Heroku free tier (deprecated)

**Deployment Process**:
1. Push backend code to GitHub
2. Connect Render to GitHub repo
3. Specify start command: `node server.js`
4. Add environment variables (DATABASE_URL, JWT_SECRET)
5. Render auto-deploys on push to `main`

**Configuration** (`render.yaml`):
```yaml
services:
  - type: web
    name: buckeye-marketplace-api
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: buckeye-marketplace-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: CLOUDINARY_URL
        sync: false  # Set manually in Render dashboard
```

**Free Tier Limitations**:
- Spins down after 15 minutes of inactivity → First request after idle may be slow (~30 seconds)
- 512 MB RAM (sufficient for project scope)
- Solution: Can use UptimeRobot to ping every 14 minutes to keep alive (within free tier rules)

**Alternatives**:
- **Railway**: Similar features, generous free tier, good UI
- **Fly.io**: More complex setup but better performance
- **AWS Elastic Beanstalk**: Overkill for project scope

---

### 3. Database: Supabase

**What it hosts**: PostgreSQL database

**Why Supabase**:
- **Fully Managed PostgreSQL**: No database administration needed
- **Free Tier**: 500 MB storage, 2 GB bandwidth (plenty for project)
- **Connection Pooling**: Handles multiple concurrent connections efficiently
- **Auto Backups**: Daily backups included (data safety)
- **Dashboard**: Visual table browser, SQL editor (great for Jordan's admin needs)
- **Direct SQL Access**: Can run migrations, write custom queries
- **RESTful API**: Optional (we'll use Sequelize/Prisma instead, but nice to have)

**Connection String**:
```
postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres
```

**Supabase Features Used**:
- PostgreSQL database
- Table editor (for manual data inspection)
- SQL editor (for running migrations)

**Supabase Features NOT Used** (but available):
- Auth (we're using custom JWT)
- Storage (we're using Cloudinary)
- Edge Functions (not needed)

**Alternatives**:
- **Render PostgreSQL**: Bundled with backend, but free tier has limitations (90 days expiration)
- **Neon**: Serverless PostgreSQL (auto-scales to zero)
- **ElephantSQL**: Simple managed PostgreSQL (being phased out)
- **AWS RDS**: Too expensive for student project

---

### 4. Image Storage: Cloudinary

**What it hosts**: Product images uploaded by Jordan

**Why Cloudinary**:
- **Free Tier**: 25 GB storage, 25 GB bandwidth/month (generous for project)
- **Image Optimization**: Auto-converts to WebP, resizes, compresses
- **Transformations**: Can resize images on-the-fly via URL params
- **CDN**: Global distribution → Fast image loading (Alex's pain point: "Poor photos")
- **Easy Upload**: Simple API for uploading from Node.js backend
- **Image Management**: Dashboard to browse/manage images

**Use Cases**:
- Jordan uploads product photos → Stored in Cloudinary
- React frontend displays images → Fetches from Cloudinary CDN
- Multiple image sizes → Cloudinary generates thumbnails automatically

**Upload Flow**:
```javascript
// Backend route: POST /api/admin/products
const cloudinary = require('cloudinary').v2;

cloudinary.uploader.upload(imageFile, {
  folder: 'buckeye-marketplace/products',
  transformation: [
    { width: 800, height: 800, crop: 'limit' },
    { quality: 'auto' },
    { fetch_format: 'auto' }
  ]
}, (error, result) => {
  const imageUrl = result.secure_url;
  // Save imageUrl to database
});
```

**Alternative: AWS S3**
- Lower long-term cost at scale
- More complex setup (IAM roles, bucket policies, CloudFront)
- Better for production at scale
- **Decision**: Use Cloudinary for simplicity, migrate to S3 if project scales beyond free tier

---

## Deployment Workflow

### Initial Setup (One-Time)

1. **Create Accounts**:
   - Vercel: Sign up with GitHub
   - Render: Sign up with GitHub
   - Supabase: Sign up with GitHub
   - Cloudinary: Sign up with email

2. **Configure Supabase Database**:
   - Create new project
   - Copy connection string
   - Run schema migration to create tables

3. **Configure Backend on Render**:
   - Connect GitHub repo
   - Add environment variables:
     - `DATABASE_URL`: Supabase connection string
     - `JWT_SECRET`: Random 256-bit string
     - `CLOUDINARY_URL`: From Cloudinary dashboard
     - `NODE_ENV`: production
   - Deploy

4. **Configure Frontend on Vercel**:
   - Connect GitHub repo
   - Add environment variable:
     - `REACT_APP_API_URL`: Render backend URL
   - Deploy

### Continuous Deployment (Ongoing)

```
Developer pushes to GitHub
        ↓
GitHub webhook triggers builds
        ↓
┌───────────────┬───────────────┐
│               │               │
▼               ▼               ▼
Vercel builds   Render builds   (Database is
React app       Node.js app     always running)
↓               ↓
Deployed to     Deployed to
Production      Production
```

**Result**: Every push to `main` branch auto-deploys both frontend and backend

---

## Cost Analysis

| Service | Free Tier Limits | Overage Cost | Projected Usage | Cost |
|---------|-----------------|--------------|----------------|------|
| **Vercel** | Unlimited bandwidth | N/A | ~100 GB/month | $0 |
| **Render** | 750 hours/month | $0.01/hour | 750 hours (24/7) | $0 |
| **Supabase** | 500 MB storage, 2 GB bandwidth | $25/month for Pro | ~50 MB DB, 500 MB bandwidth | $0 |
| **Cloudinary** | 25 GB storage, 25 GB bandwidth | $0.0018/GB | ~2 GB storage, 5 GB bandwidth | $0 |
| **Domain** (optional) | N/A | $10-15/year | 1 domain | $10/year |
| **Total** | | | | **$0-10/year** |

**Conclusion**: Entire deployment can stay within free tiers for project duration.

---

## Security Considerations

### HTTPS Everywhere
- Vercel: Automatic SSL via Let's Encrypt
- Render: Automatic SSL via Let's Encrypt
- Supabase: TLS connections enforced
- Cloudinary: HTTPS URLs by default

### Environment Variables
- **Never commit secrets to GitHub** (use `.gitenv` in `.gitignore`)
- Store in platform dashboards:
  - Vercel: Settings → Environment Variables
  - Render: Dashboard → Environment
  - Backend: Access via `process.env.JWT_SECRET`

### CORS Configuration
```javascript
// Backend: server.js
const cors = require('cors');

app.use(cors({
  origin: 'https://buckeye-marketplace.vercel.app',
  credentials: true
}));
```

### Database Security
- Supabase enforces SSL connections
- Use connection pooling to prevent connection exhaustion attacks
- Set max connections limit

---

## Monitoring & Logging

### Render Logs
- View real-time logs in dashboard
- Logs persist for 7 days
- Can download logs for debugging

### Error Tracking (Future Enhancement)
- Consider adding Sentry for error monitoring
- Free tier: 5,000 errors/month

### Uptime Monitoring
- Use UptimeRobot (free) to ping backend every 15 minutes
- Prevents Render free tier from sleeping
- Sends alert if site goes down

---

## Rollback Strategy

### Git-Based Rollback
- Vercel: Can revert to any previous deployment via dashboard
- Render: Can redeploy from any git commit

### Database Rollback
- Supabase: Daily auto-backups
- Can restore to any backup point
- Consider manual SQL exports before major migrations

---

## Scalability Path

### Current Setup (Free Tier)
- **Capacity**: ~1,000 users/day, ~100 concurrent users
- **Sufficient for**: Course project, local store

### If Scaling Needed (Future)
1. **Upgrade Render**: $7/month for always-on instances
2. **Upgrade Supabase**: $25/month for Pro (8 GB storage, 50 GB bandwidth)
3. **Add CDN**: Cloudflare (free tier for caching)
4. **Database Optimization**: Read replicas, connection pooling
5. **Migrate Images**: S3 + CloudFront for lower cost at scale

---

## Alternatives Considered

### Alternative 1: Full AWS Deployment

**Configuration**: EC2 + RDS + S3 + CloudFront

**Pros**:
- Industry-standard, highly scalable
- Full control over infrastructure
- Best long-term solution

**Cons**:
- Complex setup (VPC, security groups, IAM)
- Cost: ~$30-50/month even with free tier
- Overkill for semester project

**Why Rejected**: Too complex and expensive for project scope

---

### Alternative 2: Heroku

**Why Rejected**: Heroku discontinued free tier in November 2022

---

### Alternative 3: DigitalOcean App Platform

**Pros**:
- Simple deployment
- $5/month starter tier

**Cons**:
- No free tier
- Less generous than Render for student projects

**Why Rejected**: Render free tier is better for budget

---

### Alternative 4: Vercel for Full-Stack (Next.js)

**Pros**:
- Single deployment platform
- Vercel serverless functions for backend

**Cons**:
- Blurs frontend/backend separation (less clear for grading)
- Serverless cold starts (slower first request)
- Learning Next.js adds complexity

**Why Rejected**: Prefer clear separation of concerns (frontend vs backend)

---

## Validation Against User Needs

| User Need | Deployment Support |
|-----------|-------------------|
| Alex: Fast browsing | Vercel CDN → Fast React page loads globally |
| Alex: Trust in store | HTTPS everywhere → Secure connection (lock icon) |
| Jordan: Upload images | Cloudinary → Easy image management with dashboard |
| Jordan: Manage inventory | Supabase dashboard → Can inspect/edit data directly |
| Course Requirement: Cloud Deployment | ✅ Fully cloud-hosted and publicly accessible |
| Grader Access | ✅ Public URLs, no VPN/auth required |

---

## Implementation Checklist

- [ ] Set up Supabase project and run schema migration
- [ ] Deploy backend to Render with environment variables
- [ ] Deploy frontend to Vercel with API URL
- [ ] Test frontend → backend → database connection
- [ ] Set up Cloudinary and test image upload
- [ ] Configure CORS to allow frontend domain
- [ ] Test authentication flow (signup, login, JWT)
- [ ] Set up UptimeRobot to keep backend alive
- [ ] Document deployment URLs in README
- [ ] Test all features in production environment

---

## AI Tool Usage Documentation

**Tool**: Claude (Anthropic)  
**Version**: Claude Sonnet 4.5  
**Date**: February 15, 2026

### Prompts Used:

1. **Cloud Provider Comparison**:
   > "Compare deployment options for a React + Node.js + PostgreSQL student project. Need free tiers. Consider Vercel, Netlify, Render, Railway, Heroku, AWS. Prioritize ease of use and zero cost."

2. **Database Hosting**:
   > "Compare Supabase vs Render PostgreSQL vs Neon vs AWS RDS for a student e-commerce project. Need free tier, managed service, and easy backups."

3. **Image Storage**:
   > "Compare Cloudinary vs AWS S3 vs storing images in PostgreSQL for a vintage clothing store with ~100 products. Consider cost, ease of use, and image optimization."

### AI Contributions:
- Researched free tier limits of various cloud providers
- Identified Render as best Heroku replacement after free tier deprecation
- Suggested UptimeRobot strategy to prevent Render sleep
- Provided deployment configuration examples

### Human Decisions:
- Final platform choices based on AI research + course timeline
- Cost-benefit analysis for student budget
- Security configuration aligned with best practices

---

**References**:
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

