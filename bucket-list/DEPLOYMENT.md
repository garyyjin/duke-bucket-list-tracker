# Deployment Guide

This guide will help you deploy your Duke Bucket List Tracker to a public server.

## Option 1: Vercel (Recommended - Easiest for Next.js)

Vercel is made by the creators of Next.js and offers the easiest deployment experience.

### Prerequisites
- A GitHub account (or GitLab/Bitbucket)
- Your code pushed to a Git repository

### Step 1: Push Your Code to GitHub

1. If you haven't already, initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Sign up with your GitHub account (recommended)

2. **Import Your Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Next.js project

3. **Configure Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add these two variables:
     - `NEXT_PUBLIC_SUPABASE_URL` = `https://fbvggugvopdujmxdepuf.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZidmdndWd2b3BkdWpteGRlcHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MzYyOTQsImV4cCI6MjA4MDIxMjI5NH0.79f7NwT2TmmMnvoR4ImaBs4Fc4uIVkoNXQt9r1YqQdU`

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your site will be live at `https://your-project-name.vercel.app`

### Step 3: Custom Domain (Optional)

1. Go to your project settings → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

### Benefits of Vercel
- ✅ Free tier with generous limits
- ✅ Automatic deployments on every git push
- ✅ Built-in CDN and edge network
- ✅ Zero configuration needed
- ✅ Preview deployments for pull requests
- ✅ Automatic HTTPS

---

## Option 2: Netlify

### Step 1: Push to GitHub
Same as Vercel - ensure your code is on GitHub.

### Step 2: Deploy to Netlify

1. Go to https://netlify.com and sign up
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy site"

**Note**: For Next.js on Netlify, you may need to install `@netlify/plugin-nextjs`:
```bash
npm install --save-dev @netlify/plugin-nextjs
```

---

## Option 3: Railway

### Step 1: Deploy to Railway

1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Next.js
5. Add environment variables in the "Variables" tab
6. Your site will be live at `https://your-project-name.up.railway.app`

---

## Option 4: Render

### Step 1: Deploy to Render

1. Go to https://render.com and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables
6. Click "Create Web Service"

---

## Important Notes for All Platforms

### Environment Variables
Make sure to add these environment variables in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Supabase Configuration
1. Make sure your Supabase database schema is set up (run `supabase-schema.sql`)
2. Your Supabase project should be accessible from the internet (it is by default)
3. The anon key is safe to expose in the frontend (it's designed for client-side use)

### Build Settings
Your `package.json` already has the correct build script:
```json
"build": "next build --turbopack"
```

However, some platforms may not support Turbopack in production. If you encounter build errors, you can temporarily change it to:
```json
"build": "next build"
```

### Troubleshooting

**Build fails:**
- Check the build logs in your hosting platform
- Ensure all dependencies are in `package.json` (not just `package-lock.json`)
- Try removing `--turbopack` from the build command

**Environment variables not working:**
- Make sure variable names start with `NEXT_PUBLIC_` for client-side access
- Restart/redeploy after adding environment variables
- Check that variables are set for the correct environment (Production/Preview)

**Database connection errors:**
- Verify your Supabase project is active
- Check that the URL and anon key are correct
- Ensure your Supabase database has the schema set up

---

## Quick Start (Vercel - Recommended)

1. Push code to GitHub
2. Go to vercel.com → Import project
3. Add environment variables
4. Deploy
5. Done! 🎉

Your site will be live in ~3 minutes.

