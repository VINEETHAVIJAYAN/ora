# Google Pay Setup Guide for ORA Fashions

## Quick Test (Demo Mode) - Current Setup ✅
Your current setup runs in **demo mode** - Google Pay will work without real payment processing.
- No payment gateway required
- No real money transactions
- Perfect for development and testing
- Orders are created successfully

## Production Setup (Real Payments) 💳

To accept real payments, choose one of these popular payment gateways for India:

### Option 1: Razorpay (Recommended for India) 🇮🇳

1. **Sign up at**: https://razorpay.com
2. **Complete KYC**: Upload business documents
3. **Get credentials**:
   - Key ID: `rzp_test_...` (test) or `rzp_live_...` (live)
   - Key Secret: Your secret key
4. **Google Pay Integration**:
   - Apply for Google Pay through Razorpay dashboard
   - Get merchant ID from Google Pay Console

**Environment Variables:**
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_secret_key"
NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID="your_google_merchant_id"
NEXT_PUBLIC_GOOGLE_PAY_ENVIRONMENT="TEST"
```

### Option 2: PayU (Popular in India) 🇮🇳

1. **Sign up at**: https://www.payu.in
2. **Get credentials**:
   - Merchant Key
   - Salt Key
3. **Google Pay setup** through PayU dashboard

**Environment Variables:**
```bash
PAYU_MERCHANT_KEY="your_merchant_key"
PAYU_MERCHANT_SALT="your_salt_key"
NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID="your_google_merchant_id"
```

### Option 3: Stripe (International) 🌍

1. **Sign up at**: https://stripe.com
2. **Get credentials**:
   - Publishable Key: `pk_test_...`
   - Secret Key: `sk_test_...`
3. **Enable Google Pay** in Stripe dashboard

**Environment Variables:**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key"
STRIPE_SECRET_KEY="sk_test_your_secret"
NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID="your_google_merchant_id"
```

## Google Pay Merchant Setup 📱

1. **Visit**: https://pay.google.com/business/console/
2. **Create merchant account**
3. **Verify your business**
4. **Get Merchant ID** (format: 12345678901234567890)
5. **Configure payment methods**

## Testing vs Production 🧪

### Test Mode:
- Use test API keys
- `NEXT_PUBLIC_GOOGLE_PAY_ENVIRONMENT="TEST"`
- No real money charged
- Use test card numbers

### Production Mode:
- Use live API keys
- `NEXT_PUBLIC_GOOGLE_PAY_ENVIRONMENT="PRODUCTION"`
- Real money transactions
- Complete business verification required

## Current Status ✅

Your ORA Fashions site is currently running in **demo mode**:
- ✅ Google Pay UI works
- ✅ Orders are created
- ✅ Cart is cleared
- ✅ Email confirmations sent
- ✅ Stock updated
- ✅ Loyalty points awarded

**No real payment processing** - perfect for development!

## Next Steps 🚀

1. **For Testing**: Continue using demo mode ✅
2. **For Production**: 
   - Choose a payment gateway (Razorpay recommended)
   - Complete business verification
   - Add credentials to .env.local
   - Test with small amounts first

## Support 💬

- **Razorpay**: https://razorpay.com/support/
- **Google Pay**: https://support.google.com/googlepay/merchants/
- **PayU**: https://www.payu.in/contact-us
- **Stripe**: https://stripe.com/support
