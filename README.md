# ORA Fashions - E-commerce Platform

A modern, responsive e-commerce platform built for ORA Fashions, specializing in traditional and contemporary jewelry including chains, earrings, bangles, necklaces, rings, and bracelets.

## ✨ Features

- **🏪 Complete E-commerce Solution**: Product catalog, shopping cart, order management
- **👤 User Authentication**: Customer registration/login and admin dashboard
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🎯 SEO Optimized**: Next.js metadata API and structured data
- **💳 Payment Integration**: Google Pay support (configurable)
- **🛒 Shopping Experience**: Cart, favorites, product search and filtering
- **👑 Loyalty System**: Points-based reward program for registered users
- **📧 Newsletter**: Email subscription with promotional updates
- **🏆 Admin Dashboard**: Product/category management, order processing
- **📊 Analytics Ready**: Built-in tracking hooks for commerce analytics

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based custom auth
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ORA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/orafashionz"
   NEXTAUTH_SECRET="your-secret-key"
   GOOGLE_PAY_MERCHANT_ID="your-merchant-id"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database (optional)**
   ```bash
   npx prisma db seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   ├── page.js           # Homepage
│   └── api/              # API routes
├── components/            # Reusable components
│   ├── layout/           # Header, Footer
│   ├── Hero.js           # Homepage hero
│   ├── FeaturedCategories.js
│   ├── FeaturedProducts.js
│   ├── ProductCard.js
│   └── Newsletter.js
├── contexts/             # React Context providers
│   ├── AuthContext.js    # Authentication state
│   └── CartContext.js    # Shopping cart state
└── lib/                  # Utilities and configurations
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma database GUI
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database

### Database Management

The project uses Prisma ORM with PostgreSQL. Key commands:

```bash
# View/edit data
npx prisma studio

# Reset database
npx prisma db reset

# Apply schema changes
npx prisma db push

# Generate client after schema changes
npx prisma generate
```

### Adding New Features

1. **New Components**: Add to `src/components/` directory
2. **New Pages**: Create in `src/app/` following App Router conventions
3. **API Endpoints**: Add to `src/app/api/` directory
4. **Database Changes**: Modify `prisma/schema.prisma` and run `npx prisma db push`

## 🎨 Styling

The project uses Tailwind CSS with a custom color scheme:

- **Primary**: Gold (#c48902) - Used for branding and CTAs
- **Secondary**: Gray shades for text and backgrounds
- **Fonts**: Playfair Display (serif) for headings, Inter (sans) for body

Custom animations and effects are defined in `globals.css`.

## 📊 Database Schema

Key models:

- **User**: Customer and admin accounts
- **Category**: Jewelry categories (chains, earrings, etc.)
- **Product**: Individual jewelry items
- **Order/OrderItem**: Purchase history
- **CartItem**: Shopping cart contents
- **Favorite**: User wishlist
- **LoyaltyPoint**: Reward system
- **Review**: Product reviews
- **Address**: Shipping/billing addresses

## 🔐 Authentication

- JWT-based authentication system
- Role-based access (USER/ADMIN)
- Protected routes for admin features
- Guest shopping with cart persistence

## 🛒 E-commerce Features

- Product catalog with categories
- Advanced product search and filtering
- Shopping cart with persistence
- Favorites/wishlist functionality
- Order history and tracking
- Loyalty points system
- Newsletter subscription
- Admin product management

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

### Manual Deployment

1. Build the project: `npm run build`
2. Start production server: `npm run start`
3. Ensure PostgreSQL database is accessible
4. Configure environment variables

## 🔧 Configuration

### Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google Pay (optional)
GOOGLE_PAY_MERCHANT_ID="your-merchant-id"

# Email (optional)
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
```

### Customization

- **Branding**: Update colors in `tailwind.config.js`
- **Logo**: Replace logo files in `public/` directory
- **Categories**: Modify in database or `FeaturedCategories.js`
- **Homepage Content**: Edit components in `src/components/`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - List products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Cart Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PATCH /api/cart` - Update quantity
- `DELETE /api/cart` - Remove from cart

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software for ORA Fashions. All rights reserved.

## 📞 Support

For support and questions:
- Email: support@orafashions.com
- Phone: +91 98765 43210

---

**ORA Fashions** - *Where Tradition Meets Elegance* ✨
