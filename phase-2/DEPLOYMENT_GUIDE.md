# Phase 2 - Deployment Guide

This guide covers deploying Phase 2 of the Todo App to production environments.

## Architecture Overview

**3-Tier Architecture:**
- **Frontend**: Next.js 16+ (Vercel)
- **Backend API**: FastAPI (Railway/Render)
- **Auth Server**: Node.js + Better Auth (Railway/Render)

## Prerequisites

### Required Accounts
- [Vercel Account](https://vercel.com) - Frontend hosting
- [Railway Account](https://railway.app) OR [Render Account](https://render.com) - Backend hosting
- [Neon Account](https://neon.tech) - PostgreSQL database (free tier available)
- [GitHub Account](https://github.com) - Source code repository

### Local Tools
- Git
- Node.js 18+
- Python 3.13+
- UV package manager

## Deployment Steps

### 1. Database Setup (Neon PostgreSQL)

#### Create Neon Database
1. Go to [Neon Console](https://console.neon.tech)
2. Click "Create Project"
3. Name: `phase2-todo-db`
4. Region: Choose closest to your users
5. Copy the connection string (format: `postgresql://user:password@host/dbname`)

#### Configure Database
Save the connection string for later. You'll need it for both backend services.

---

### 2. Backend Deployment (Railway)

#### Option A: Deploy via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to backend directory
cd phase-2/backend

# Initialize Railway project
railway init

# Link to new project
railway link

# Add environment variables
railway variables set DATABASE_URL="postgresql://user:password@host/dbname"
railway variables set JWT_SECRET="$(openssl rand -base64 32)"
railway variables set CORS_ORIGINS="https://your-frontend.vercel.app"
railway variables set OPENAI_API_KEY="sk-your-openai-key"
railway variables set ENVIRONMENT="production"

# Deploy
railway up
```

#### Option B: Deploy via Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Root Directory: `phase-2/backend`
5. Add environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host/dbname
   JWT_SECRET=<generate with: openssl rand -base64 32>
   CORS_ORIGINS=https://your-frontend.vercel.app
   OPENAI_API_KEY=sk-your-openai-key
   ENVIRONMENT=production
   ```
6. Deploy automatically detects Dockerfile
7. Wait for deployment to complete
8. Copy the generated URL (e.g., `https://backend-production-xxxx.up.railway.app`)

#### Verify Backend Deployment
```bash
curl https://your-backend-url.railway.app/health
# Should return: {"status":"healthy","timestamp":"..."}

# Visit Swagger docs
# Open: https://your-backend-url.railway.app/docs
```

---

### 3. Auth Server Deployment (Railway)

#### Deploy via Railway Dashboard

1. Click "New Project" in Railway
2. Deploy from GitHub repo
3. Root Directory: `phase-2/auth-server`
4. Add environment variables:
   ```
   PORT=3001
   DATABASE_URL=postgresql://user:password@host/dbname?schema=auth
   JWT_SECRET=<same secret as backend>
   BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
   FRONTEND_URL=https://your-frontend.vercel.app
   ENVIRONMENT=production
   ```
5. Deploy
6. Copy the generated URL (e.g., `https://auth-production-xxxx.up.railway.app`)

#### Verify Auth Server
```bash
curl https://your-auth-url.railway.app/api/auth/health
# Should return auth service status
```

---

### 4. Frontend Deployment (Vercel)

#### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd phase-2/frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: phase2-todo-frontend
# - Directory: ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-backend-url.railway.app

vercel env add NEXT_PUBLIC_AUTH_URL production
# Enter: https://your-auth-url.railway.app

vercel env add BETTER_AUTH_SECRET production
# Enter: (same as backend)

# Deploy to production
vercel --prod
```

#### Option B: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import from GitHub repository
4. Root Directory: `phase-2/frontend`
5. Framework Preset: Next.js
6. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   NEXT_PUBLIC_AUTH_URL=https://your-auth-url.railway.app
   BETTER_AUTH_SECRET=<same as backend>
   NEXT_PUBLIC_ENVIRONMENT=production
   ```
7. Click "Deploy"
8. Wait for deployment to complete
9. Copy the generated URL (e.g., `https://phase2-todo.vercel.app`)

---

### 5. Update CORS Settings

After deploying the frontend, update the backend CORS settings:

#### Railway Backend
```bash
railway variables set CORS_ORIGINS="https://your-frontend.vercel.app"

# Or multiple origins (separated by commas)
railway variables set CORS_ORIGINS="https://your-frontend.vercel.app,https://www.your-domain.com"
```

#### Trigger Redeploy
Railway will automatically redeploy when you change environment variables.

---

### 6. Run Database Migrations

Migrations should run automatically on deployment, but if needed:

```bash
# Connect to Railway backend
railway run alembic upgrade head

# Or via Railway shell
railway shell
> alembic upgrade head
> exit
```

---

## Environment Variables Summary

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=<32-character random string>
CORS_ORIGINS=https://your-frontend.vercel.app
OPENAI_API_KEY=sk-your-openai-key
ENVIRONMENT=production
```

### Auth Server (.env)
```env
PORT=3001
DATABASE_URL=postgresql://user:password@host/dbname?schema=auth
JWT_SECRET=<same as backend>
BETTER_AUTH_SECRET=<32-character random string>
FRONTEND_URL=https://your-frontend.vercel.app
ENVIRONMENT=production
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_AUTH_URL=https://your-auth-url.railway.app
BETTER_AUTH_SECRET=<same as backend>
NEXT_PUBLIC_ENVIRONMENT=production
```

---

## Post-Deployment Testing

### 1. Health Checks
```bash
# Backend
curl https://your-backend-url.railway.app/health

# Auth Server
curl https://your-auth-url.railway.app/api/auth/health

# Frontend (open in browser)
https://your-frontend.vercel.app
```

### 2. User Registration Flow
1. Open frontend URL
2. Click "Sign Up"
3. Create account with email/password
4. Verify redirect to dashboard
5. Check database for new user record

### 3. Task Management Flow
1. Login to your account
2. Create a new task
3. Edit the task
4. Mark as complete
5. Delete the task
6. Verify all operations work

### 4. Chat Interface (Phase III)
1. Navigate to `/chat`
2. Send a message: "Add a task called Test"
3. Verify AI responds and task is created
4. Send: "Show me all my tasks"
5. Verify AI lists tasks correctly

---

## Monitoring & Logs

### Railway Logs
```bash
# View backend logs
railway logs

# View auth server logs
railway logs --service auth-server

# Follow logs in real-time
railway logs --tail
```

### Vercel Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on latest deployment
5. View "Functions" tab for serverless logs

---

## Troubleshooting

### Frontend Can't Connect to Backend

**Symptom**: Network errors, CORS errors in browser console

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check CORS settings in backend
3. Ensure backend is deployed and healthy
4. Check browser console for exact error

### Authentication Not Working

**Symptom**: Login fails, token errors

**Solution**:
1. Verify `JWT_SECRET` is the same in backend and auth server
2. Check `BETTER_AUTH_SECRET` is set in all services
3. Verify auth server is deployed and healthy
4. Clear browser cookies and try again

### Database Connection Errors

**Symptom**: 500 errors, "could not connect to database"

**Solution**:
1. Verify `DATABASE_URL` is correct
2. Check Neon database is active (not paused)
3. Verify IP whitelist in Neon (Railway IPs allowed)
4. Run migrations: `railway run alembic upgrade head`

### Chat/AI Not Responding

**Symptom**: Chat messages send but no response

**Solution**:
1. Verify `OPENAI_API_KEY` is set in backend
2. Check OpenAI API quota/billing
3. View backend logs for errors
4. Ensure MCP tools are registered correctly

---

## Custom Domain Setup

### Vercel Custom Domain
1. Go to Project Settings → Domains
2. Add your domain (e.g., `todo.yourdomain.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

### Railway Custom Domain
1. Go to Railway project
2. Click "Settings" → "Domains"
3. Add custom domain
4. Update DNS records with provided values
5. Wait for SSL certificate provisioning

---

## Rollback Procedure

### Vercel Rollback
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Railway Rollback
1. Go to Deployments tab
2. Find previous deployment
3. Click "Redeploy"

---

## Cost Estimates

### Free Tier Limits
- **Vercel**: Unlimited personal projects, 100GB bandwidth/month
- **Railway**: $5 free credits/month (resets monthly)
- **Neon**: 1 project, 3GB storage, 0.5GB RAM
- **Total**: ~$0-5/month for hobby projects

### Paid Tier (if needed)
- **Vercel Pro**: $20/month
- **Railway**: Pay-as-you-go (~$5-20/month)
- **Neon Scale**: $19/month
- **Total**: ~$44-59/month for production apps

---

## Security Checklist

- [ ] All environment variables stored securely (not in code)
- [ ] JWT secrets are random and at least 32 characters
- [ ] CORS configured with specific origins (not `*`)
- [ ] HTTPS enforced on all services
- [ ] Database credentials use strong passwords
- [ ] API keys have minimal required permissions
- [ ] Rate limiting enabled on sensitive endpoints
- [ ] Authentication required for all user data endpoints

---

## Continuous Deployment

### Automatic Deployments

**Vercel**: Deploys automatically on push to `main` branch

**Railway**: Deploys automatically on push to linked branch

### Deployment Workflow
1. Make changes locally
2. Test thoroughly: `npm test` and `pytest`
3. Commit: `git commit -m "feat: add feature"`
4. Push: `git push origin main`
5. Services auto-deploy
6. Monitor deployment logs
7. Verify in production

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Neon Docs**: https://neon.tech/docs
- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com

---

**Deployment Status**: Ready for production
**Last Updated**: 2025-12-17
