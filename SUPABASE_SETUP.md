# Supabase Database Setup for ORA Fashions

## Quick Setup Guide

### 1. Get Supabase Connection String
1. Go to Supabase Dashboard: https://app.supabase.com/
2. Select your ORA project
3. Settings → Database → Connection string → URI
4. Copy the connection string

### 2. Update .env.local
Replace DATABASE_URL in .env.local with:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 3. Set Up Database Schema
Run these commands in order:

```bash
# Install dependencies if not already installed
npm install

# Generate Prisma client
npx prisma generate

# Push database schema to Supabase
npx prisma db push

# Seed the database with initial data
npm run seed
```

### 4. Test Database Connection
```bash
# Test if database is accessible
npx prisma studio
```

### 5. Environment Variables for Production (Vercel)
Add these to Vercel dashboard → Your Project → Settings → Environment Variables:

```
DATABASE_URL = [Your Supabase Connection String]
NEXTAUTH_SECRET = [Generate a secure random string]
NEXTAUTH_URL = https://orafashionz.com
NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID = [Your Google Pay Merchant ID]
NEXT_PUBLIC_GOOGLE_PAY_ENVIRONMENT = PRODUCTION
```

### 6. Database Schema Overview
Your database will include these tables:
- users (customers and admin)
- categories (jewelry types)
- products (jewelry items)
- orders & orderItems (purchase history)
- cartItems (shopping cart)
- favorites (wishlist)
- loyaltyPoints (rewards system)
- reviews (product reviews)
- addresses (shipping/billing)

### Troubleshooting
- If connection fails, check password in connection string
- Ensure Supabase project is not paused
- Verify IP restrictions in Supabase settings
- Check database URL format is correct

### Next Steps After Setup
1. Deploy to Vercel with environment variables
2. Set up custom domain orafashionz.com
3. Configure Google Pay for production
4. Test complete checkout flow
