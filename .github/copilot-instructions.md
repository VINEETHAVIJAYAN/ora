<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ORA Fashions E-commerce Project Instructions

## Project Overview
This is a Next.js-based e-commerce platform for ORA Fashions, a traditional jewelry store specializing in chains, earrings, bangles, necklaces, rings, and bracelets.

## Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: JavaScript (not TypeScript)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom JWT-based auth
- **State Management**: React Context API + Zustand for cart
- **UI Components**: Custom components with Lucide React icons
- **Payments**: Google Pay integration planned
- **Deployment**: Vercel (recommended)

## Key Features
- Responsive e-commerce website for jewelry
- User authentication (customers and admin)
- Product catalog with categories
- Shopping cart and favorites
- Order management system
- Admin dashboard for inventory management
- Loyalty points system
- SEO optimization
- Newsletter subscription
- Google Pay integration

## Database Schema
The project uses Prisma with PostgreSQL. Key models include:
- `User` (customers and admin)
- `Category` (jewelry categories)
- `Product` (individual jewelry items)
- `Order` and `OrderItem` (purchase history)
- `CartItem` (shopping cart)
- `Favorite` (wishlist)
- `LoyaltyPoint` (reward system)
- `Review` (product reviews)
- `Address` (shipping/billing addresses)

## Code Standards
1. Use functional components with hooks
2. Follow Next.js 15 App Router conventions
3. Use Tailwind CSS for styling (no CSS modules)
4. Implement responsive design (mobile-first approach)
5. Use Context API for global state (auth, cart)
6. Create reusable components in `/src/components`
7. API routes in `/src/app/api`
8. Use proper error handling and loading states
9. Implement SEO best practices with Next.js metadata API
10. Use toast notifications for user feedback

## File Structure
```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
├── contexts/         # React Context providers
├── lib/             # Utility functions and configs
├── styles/          # Global styles (if needed)
└── utils/           # Helper functions
```

## API Design
- RESTful API design
- JWT-based authentication
- Proper HTTP status codes
- Error handling with consistent format
- Input validation
- Rate limiting for security

## UI/UX Guidelines
- Elegant, luxury design suitable for jewelry e-commerce
- Primary color: Gold (#c48902)
- Clean, minimal interface
- High-quality product images
- Easy navigation and search
- Mobile-responsive design
- Accessibility best practices

## Environment Variables
Key environment variables to be configured:
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_SECRET` - Authentication secret
- `GOOGLE_PAY_MERCHANT_ID` - Payment integration
- `SMTP_*` - Email configuration

## Development Practices
- Write clean, readable code
- Add comments for complex logic
- Use meaningful variable and function names
- Implement proper error boundaries
- Add loading states for better UX
- Test responsive design on multiple devices
- Optimize images and performance
- Follow security best practices

## Business Logic
- Traditional jewelry focus (Indian/ethnic designs)
- Multi-category product organization
- Guest checkout available
- Registered users get loyalty points
- Admin can manage products, orders, users
- SEO-optimized product pages
- Email notifications for orders
