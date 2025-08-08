# ORA Fashions - Custom Domain Deployment Guide

## Your Domain: orafashionz.com

### Step 1: Deploy to Vercel from GitHub

1. **Go to Vercel**: https://vercel.com
2. **Sign in with GitHub**
3. **Import Project**: Select `VINEETHAVIJAYAN/ora` repository
4. **Configure Project**:
   - Project Name: `ora-fashions`
   - Framework Preset: `Next.js` (auto-detected)
   - Root Directory: `./` (default)

### Step 2: Add Environment Variables

In Vercel dashboard, go to Settings → Environment Variables:

```
DATABASE_URL = [Your PostgreSQL connection string]
NEXTAUTH_SECRET = [Generate: openssl rand -base64 32]
NEXTAUTH_URL = https://orafashionz.com
NODE_ENV = production
```

### Step 3: Deploy First Time

- Click **"Deploy"**
- Wait for build to complete
- You'll get a temporary URL: `https://ora-fashions-xyz.vercel.app`

### Step 4: Setup PostgreSQL Database

#### Option A: Vercel Postgres (Recommended)
1. In Vercel dashboard → Storage tab
2. Create → Postgres
3. Database name: `ora-fashions-db`
4. Copy connection string to `DATABASE_URL`

#### Option B: External Database (Neon, Supabase, etc.)
- Create account and database
- Copy connection string
- Make sure it includes `?sslmode=require`

### Step 5: Setup Database Schema

After deployment with DATABASE_URL:

```bash
# In your local terminal
npm install
npx prisma db push
npx prisma db seed  # Optional: adds sample data
```

### Step 6: Add Custom Domain

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Click **"Domains"** tab
   - Add domain: `orafashionz.com`
   - Add domain: `www.orafashionz.com` (optional)

2. **Configure DNS at your domain registrar**:
   - **A Record**: `@` → `76.76.19.61` (Vercel IP)
   - **CNAME**: `www` → `cname.vercel-dns.com`

   Or use Vercel's nameservers:
   - **NS**: `ns1.vercel-dns.com`
   - **NS**: `ns2.vercel-dns.com`

### Step 7: SSL Certificate

Vercel automatically provisions SSL certificates for your custom domain. This usually takes 5-10 minutes.

### Step 8: Final Configuration

1. **Update NEXTAUTH_URL**: Ensure it's set to `https://orafashionz.com`
2. **Test all functionality**:
   - Homepage loads
   - User registration/login
   - Product catalog
   - Cart functionality
   - Checkout process
   - Admin panel access

### Environment Variables Summary

```bash
# Production Environment Variables
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"
NEXTAUTH_SECRET="your-32-character-random-string"
NEXTAUTH_URL="https://orafashionz.com"
NODE_ENV="production"

# Optional
SMTP_HOST="your-smtp-server.com"
SMTP_PORT="587"
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-app-password"
GOOGLE_PAY_MERCHANT_ID="your-merchant-id"
```

### Domain Verification

Once configured, your site will be available at:
- ✅ **https://orafashionz.com** (primary)
- ✅ **https://www.orafashionz.com** (redirect to primary)
- 🔒 SSL certificate automatically provisioned
- 🌍 Global CDN with edge locations

### Post-Deployment Checklist

- [ ] Site loads at orafashionz.com
- [ ] SSL certificate active (https)
- [ ] Admin login works: admin@orafashions.com / admin123
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Checkout process functional
- [ ] Order creation working
- [ ] Database connections stable
- [ ] All images loading properly

### Troubleshooting

**Domain not working?**
- Check DNS propagation: https://dnschecker.org
- Verify Vercel domain settings
- Ensure SSL certificate is issued

**Database connection errors?**
- Verify DATABASE_URL format
- Check database server allows connections
- Ensure SSL mode is enabled

**Authentication issues?**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

### Performance Optimization

1. **Enable Vercel Analytics**
2. **Configure caching headers**
3. **Optimize images** (already configured)
4. **Database connection pooling**
5. **Monitor Core Web Vitals**

---

🎉 **Your ORA Fashions e-commerce site will be live at https://orafashionz.com!**
