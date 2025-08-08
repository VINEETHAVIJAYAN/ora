# ORA Fashions - Vercel Deployment Guide

## Prerequisites
- Vercel account (free tier works)
- GitHub account
- PostgreSQL database (we'll use Vercel Postgres)

## Step 1: Push to GitHub (if not already done)

```bash
# Initialize git if not done
git init
git add .
git commit -m "Initial commit - ORA Fashions e-commerce"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/ora-fashions.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"

### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

## Step 3: Add PostgreSQL Database

### Using Vercel Postgres (Recommended)
1. Go to your project dashboard on Vercel
2. Click on "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose your database name (e.g., "ora-fashions-db")
6. Click "Create"

### Alternative: External PostgreSQL
You can also use:
- **Neon** (free tier): https://neon.tech
- **Supabase** (free tier): https://supabase.com
- **Railway** (free tier): https://railway.app
- **ElephantSQL** (free tier): https://elephantsql.com

## Step 4: Configure Environment Variables

In your Vercel project dashboard:
1. Go to "Settings" > "Environment Variables"
2. Add these variables:

```
DATABASE_URL = [Your PostgreSQL connection string]
NEXTAUTH_SECRET = [Generate a random secret key]
NEXTAUTH_URL = [Your Vercel domain URL]
NODE_ENV = production
```

### Generate NEXTAUTH_SECRET
```bash
# Run this command to generate a secret
openssl rand -base64 32
```

## Step 5: Database Setup

After deployment with DATABASE_URL:

### Option A: Push Prisma Schema
```bash
# Install dependencies
npm install

# Push database schema
npx prisma db push

# Seed the database (optional)
npx prisma db seed
```

### Option B: Run Migration
```bash
# Generate and run migrations
npx prisma migrate deploy
```

## Step 6: Verify Deployment

1. Check your Vercel domain (e.g., `https://ora-fashions.vercel.app`)
2. Test login with admin credentials:
   - Email: `admin@orafashions.com`
   - Password: `admin123`
3. Test adding products to cart
4. Test checkout process

## Environment Variables Reference

### Required
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret key for JWT
- `NEXTAUTH_URL`: Your production domain URL

### Optional
- `SMTP_HOST`: Email server (for order notifications)
- `SMTP_PORT`: Email server port
- `SMTP_USER`: Email username
- `SMTP_PASS`: Email password
- `GOOGLE_PAY_MERCHANT_ID`: Google Pay merchant ID

## Database Connection String Format

```
postgresql://username:password@hostname:port/database_name?sslmode=require
```

Example:
```
postgresql://myuser:mypassword@ep-example.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require
```

## Post-Deployment Tasks

1. **Add admin user** (if not seeded):
   ```sql
   INSERT INTO users (id, email, password, name, role) 
   VALUES ('admin-id', 'admin@orafashions.com', '$2b$10$hashedpassword', 'Admin User', 'ADMIN');
   ```

2. **Add product categories and products** through the admin panel

3. **Test all functionality**:
   - User registration/login
   - Product browsing
   - Cart functionality
   - Checkout process (COD)
   - Admin panel

4. **Configure custom domain** (optional):
   - Go to Vercel project settings
   - Add your custom domain
   - Configure DNS records

## Troubleshooting

### Common Issues:

1. **Database Connection Issues**:
   - Verify DATABASE_URL format
   - Check SSL mode requirement
   - Ensure database allows external connections

2. **Build Errors**:
   - Check Next.js version compatibility
   - Verify all dependencies in package.json
   - Check for TypeScript errors (if applicable)

3. **Authentication Issues**:
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Ensure JWT_SECRET environment variable

4. **Static File Issues**:
   - Ensure images are in public/ directory
   - Check image paths in database

## Performance Optimization

1. **Enable Image Optimization**:
   ```javascript
   // next.config.js
   module.exports = {
     images: {
       domains: ['your-domain.vercel.app'],
     },
   }
   ```

2. **Database Connection Pooling**:
   Add `?connection_limit=20&pool_timeout=20` to DATABASE_URL

3. **Caching**:
   - Use Vercel Edge Caching
   - Implement Redis for session storage (optional)

## Security Checklist

- ✅ Environment variables are secure
- ✅ Database uses SSL
- ✅ JWT secrets are random and secure
- ✅ Admin routes are protected
- ✅ Input validation on all forms
- ✅ SQL injection protection via Prisma
- ✅ XSS protection in templates

## Monitoring

- Set up Vercel Analytics
- Monitor database performance
- Set up error tracking (Sentry recommended)
- Monitor API response times

---

Your ORA Fashions e-commerce platform should now be live and accessible worldwide! 🚀
