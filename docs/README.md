# Nexus TechHub - Professional Mobile Repair Parts UAE

A modern, full-stack e-commerce website for mobile device repair parts and services in the UAE. Built with Next.js, featuring server-side rendering, user authentication, payment processing, and a comprehensive product catalog.

## 🚀 Features

- **Server-Side Rendering**: Dynamic content with Next.js SSR
- **User Authentication**: Secure login/signup with Supabase Auth
- **E-commerce Functionality**: Shopping cart, checkout, order management
- **Product Management**: Categories, products, reviews, and specifications
- **Payment Processing**: Stripe integration for secure payments
- **Admin Dashboard**: Product and order management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Next.js SEO with sitemap generation
- **PWA Ready**: Progressive Web App capabilities

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with SSR
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - Component library

### Backend
- **Supabase** - PostgreSQL database with real-time features
- **Next.js API Routes** - Serverless API endpoints
- **Supabase Auth** - User authentication
- **Stripe** - Payment processing

### Development Tools
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Jest** - Testing framework
- **Cypress** - E2E testing

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account (for payments)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd nexus-techhub-website
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3006
NEXTAUTH_SECRET=your-nextauth-secret

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
```

### 3. Database Setup

Set up your Supabase database:

```bash
# Run database migrations and seed data
npm run setup:db
```

This will:
- Create necessary tables (products, categories, orders, etc.)
- Set up Row Level Security policies
- Insert sample products and categories
- Create user profiles trigger

### 4. Development Server

```bash
npm run dev
```

Open [http://localhost:3006](http://localhost:3006) in your browser.

## 📁 Project Structure

```
nexus-techhub-website/
├── components/          # React components
│   ├── FeaturedProducts/
│   ├── UnifiedHeader/
│   ├── Hero/
│   └── ...
├── lib/                 # Utility libraries
│   ├── db.js           # Database functions
│   └── ...
├── pages/              # Next.js pages and API routes
│   ├── api/            # API endpoints
│   ├── index.js        # Homepage
│   └── ...
├── public/             # Static assets
├── styles/             # CSS styles
├── migrations/         # Database migrations
├── Scripts/            # Utility scripts
└── utils/              # Helper functions
```

## 🗄️ Database Schema

The application uses the following main tables:

- **categories** - Product categories
- **products** - Product catalog with specifications
- **product_images** - Product image gallery
- **product_variants** - Product variations (color, size, etc.)
- **carts** - Shopping cart data
- **cart_items** - Cart contents
- **orders** - Customer orders
- **order_items** - Order line items
- **reviews** - Product reviews
- **profiles** - User profiles (auto-created via trigger)

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run setup:db        # Setup database with migrations and seed data

# Testing
npm run test            # Run Jest tests
npm run test:e2e        # Run Cypress E2E tests
npm run test:coverage   # Run tests with coverage

# Code Quality
npm run lint            # Run ESLint
npm run lint:css        # Run stylelint

# Deployment
npm run deploy:production  # Deploy to production
```

## 🔐 Authentication

The app uses Supabase Auth for user management:

- **Sign Up**: Users can create accounts with email/password
- **Sign In**: Secure login with session management
- **Profile Management**: Users can update their profiles
- **Password Reset**: Email-based password recovery

## 💳 Payment Processing

Integrated with Stripe for secure payments:

- **Checkout Session**: Secure payment processing
- **Order Management**: Automatic order creation
- **Webhook Handling**: Real-time payment status updates
- **VAT Calculation**: UAE VAT compliance

## 📱 Progressive Web App

The site is PWA-ready with:

- Service worker for offline functionality
- App manifest for mobile installation
- Push notifications (configurable)
- Background sync for forms

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Deploy!

### Other Platforms

The app can be deployed to Vercel, AWS, or any Node.js hosting platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:

- Create an issue on GitHub
- Check the documentation in `/docs`
- Contact the development team

## 🔄 Migration from Static Site

This project was migrated from a static site to include:

- **Server-side rendering** for dynamic content
- **Database integration** with Supabase
- **User authentication** and profiles
- **E-commerce functionality** with cart and checkout
- **Admin features** for content management
- **API endpoints** for data operations

The migration maintains all existing functionality while adding powerful backend capabilities.
