# PEHOREM PRIME — Production Deployment Guide

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Name: `pehorem-prime`
3. Do NOT initialize with README, .gitignore, or license
4. Click "Create repository"
5. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/pehorem-prime.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Supabase (Free PostgreSQL)

1. Go to https://supabase.com and sign up
2. Click "New Project"
3. Fill in:
   - Name: `pehorem-prime`
   - Database Password: (generate a strong one)
   - Region: Choose closest to your users
4. Wait 1-2 minutes for the database to provision
5. Go to Project Settings → Database → Connection string (URI)
6. Copy the connection string (it looks like: `postgresql://postgres:password@db.xxxxxxxx.supabase.co:5432/postgres`)
7. Append `?schema=public` to the end

## Step 3: Deploy to Vercel

### Option A: Via Vercel CLI (faster)

```bash
npx vercel login          # Authenticate in browser
npx vercel --prod         # Deploy directly
```

### Option B: Via GitHub Import (recommended)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `pehorem-prime` repo
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
5. Add Environment Variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `JWT_SECRET`: A random secret string
   - `NEXT_PUBLIC_SITE_URL`: Your Vercel URL
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: `234800746736`
6. Click "Deploy"

## Step 4: Run Database Migrations

After Vercel deploys, run migrations via the Vercel Console:

```bash
# In Vercel dashboard → your project → Terminal tab, or locally:
npx vercel env pull .env.production.local
npx prisma migrate deploy
```

Or push the schema directly:

```bash
npx prisma db push
```

## Step 5: Custom Domain (Optional)

1. In Vercel Dashboard → Project → Domains
2. Add your domain (e.g., `pehorem.com`)
3. Follow Vercel's DNS configuration instructions
4. Update `NEXT_PUBLIC_SITE_URL` env variable

## Step 6: Verify Deployment

Visit your deployed URL. Check:
- Homepage loads with all sections
- Properties page loads
- Vehicles page loads  
- Auth pages work
- Admin dashboard accessible
- WhatsApp button visible
- AI Chatbot accessible

## Environment Variables Summary

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `NEXT_PUBLIC_SITE_URL` | Public URL of your site |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number for support |
