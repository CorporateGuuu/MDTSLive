# Midas Technical Solutions E-Commerce Wireframe

## Overview
This wireframe designs a complete, responsive e-commerce platform for Midas Technical Solutions, a wholesale-only supplier of cell phone repair parts, screens, batteries, tools, and refurbished devices. The design mirrors the functionality of mobilesentrix.com while focusing exclusively on wholesale distribution.

## Design System
- **Color Scheme**:
  - Background: Clean white (#FFFFFF)
  - Text: Black (#000000)
  - Primary: Gold (#FFD700) for buttons and accents
  - Secondary: Dark blue (#003087) for secondary elements
- **Typography**:
  - Headings: Helvetica/Arial Bold (font-weight: 700)
  - Body: Helvetica/Arial Regular (font-weight: 400)
- **Spacing**: 16px base grid, multiples for larger gaps
- **Breakpoints**: Desktop (1024px+), Tablet (768-1023px), Mobile (<768px)

## Global Header (Fixed)
```
┌─────────────────────────────────────────────────────────────┐
│ [Midas Logo] [Mega Menu ▼] [Search Bar] [Login] [Cart (0)] │
└─────────────────────────────────────────────────────────────┘
```
- Height: 80px desktop, 60px mobile
- Midas logo: Left, 200px width, clickable to homepage
- Mega-menu: Center-left, dropdown categories (Parts, Screens, Batteries, Tools, Refurbished Devices)
- Search bar: Center, 400px width, with search icon
- Account/Login: Right, "Wholesale Login" button (gold background)
- Cart: Right, icon with badge for item count

### Mobile Header
- Hamburger menu replaces mega-menu
- Search bar collapses to icon
- Stacked layout: Logo top, search + cart bottom

## Page 1: Homepage
```
┌─────────────────────────────────────────────────────────────┐
│                        HERO CAROUSEL                        │
│  [Slide 1: Promotion Banner] [Slide 2] [Slide 3]           │
│  Dots: ● ○ ○    Prev/Next Arrows                          │
├─────────────────────────────────────────────────────────────┤
│                     TOP CATEGORIES GRID                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │
│  │Parts│ │Scrns│ │Batt │ │Tools│ │Refrb│ │Acces│           │
│  │     │ │     │ │     │ │     │ │     │ │     │           │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘           │
├─────────────────────────────────────────────────────────────┤
│               FEATURED / NEW ARRIVAL PRODUCTS               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │ Product Card 1  │ │ Product Card 2  │ │ Product Card 3  │ │
│  │ [Image]         │ │ [Image]         │ │ [Image]         │ │
│  │ Title           │ │ Title           │ │ Title           │ │
│  │ Price: $X.XX    │ │ Price: $X.XX    │ │ Price: $X.XX    │ │
│  │ [Add to Cart]   │ │ [Add to Cart]   │ │ [Add to Cart]   │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                        BRANDS ROW                            │
│  [Apple] [Samsung] [Google] [LG] [Motorola] [Huawei]       │
├─────────────────────────────────────────────────────────────┤
│                   WHOLESALE PERKS SECTION                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ ⚡ Fast Shipping  🚚 Secure Packaging  💰 Bulk Pricing │ │
│  │ 🔧 Genuine Parts  📞 24/7 Support  🏆 Quality Guarantee │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                   NEWSLETTER SIGNUP                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Subscribe for Wholesale Updates                         │ │
│  │ [Email Input] [Subscribe Button]                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Section Details
- **Hero Carousel**: 800px height, auto-play 5s, full-width images with overlay text
- **Top Categories**: 6 categories, 2x3 grid, 200px squares, hover effects
- **Featured Products**: 3-4 columns grid, 300px cards, lazy loading
- **Brands Row**: Logo grid, 100px height, linked to brand pages
- **Wholesale Perks**: 4-column grid, icon + text, 200px height
- **Newsletter**: Centered, 600px width, gold subscribe button

## Page 2: Shop / All Products
```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR FILTERS              │        PRODUCT GRID         │
│  ┌─────────────────────────┐  │  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ BRAND                    │  │  │Card1│ │Card2│ │Card3│   │
│  │ □ Apple                  │  │  │     │ │     │ │     │   │
│  │ □ Samsung                │  │  └─────┘ └─────┘ └─────┘   │
│  │ □ Google                 │  │  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ □ LG                     │  │  │Card4│ │Card5│ │Card6│   │
│  │                         │  │  │     │ │     │ │     │   │
│  │ DEVICE MODEL             │  │  └─────┘ └─────┘ └─────┘   │
│  │ □ iPhone 15              │  │                            │
│  │ □ iPhone 14              │  │  Sort: [Price Low-High ▼]  │
│  │ □ Galaxy S23             │  │  Showing 1-12 of 156       │
│  │                         │  │                            │
│  │ PART TYPE                │  │  [Load More]                │
│  │ □ Screen                 │  │                            │
│  │ □ Battery                │  │                            │
│  │ □ Housing                │  │                            │
│  │                         │  │                            │
│  │ PRICE RANGE              │  │                            │
│  │ [Min] ──○──────── [Max]  │  │                            │
│  │                         │  │                            │
│  │ CONDITION                │  │                            │
│  │ □ New                    │  │                            │
│  │ □ Refurbished            │  │                            │
│  │ □ Used                   │  │                            │
│  │                         │  │                            │
│  │ [Apply Filters]          │  │                            │
│  │ [Clear All]              │  │                            │
│  └─────────────────────────┘  │                            │
└─────────────────────────────────────────────────────────────┘
```

### Section Details
- **Sidebar**: 300px width, collapsible on mobile
- **Filters**: Checkboxes for multi-select, slider for price range
- **Product Grid**: 3 columns desktop, 2 tablet, 1 mobile
- **Product Cards**: 250px height, image top, title, price, quick-add button
- **Sorting**: Dropdown with options (Price, Name, Newest, Popularity)
- **Pagination**: Load more button or numbered pages

## Page 3: Product Detail Page
```
┌─────────────────────────────────────────────────────────────┐
│  IMAGE GALLERY          │ PRODUCT INFO                      │
│  ┌────────────────────┐ │  ┌─────────────────────────────┐ │
│  │ [Main Image]       │ │  │ Product Title                │ │
│  │ Zoom on Hover      │ │  │ SKU: XXX-XXX                │ │
│  │                    │ │  │                             │ │
│  │ Thumbnails ────►   │ │  │ TIERED PRICING              │ │
│  │ □ □ □ □ □          │ │  │ 1-9 pcs: $X.XX each        │ │
│  └────────────────────┘ │  │ 10-49 pcs: $X.XX each      │ │
│                         │  │ 50+ pcs: $X.XX each        │ │
│                         │  │                             │ │
│                         │  │ Quantity: [ 1 ] [+] [-]     │ │
│                         │  │ [Add to Cart]               │ │
│                         │  │                             │ │
│                         │  │ COMPATIBILITY               │ │
│                         │  │ ✓ iPhone 15                 │ │
│                         │  │ ✓ iPhone 15 Pro             │ │
│                         │  │ ✓ iPhone 15 Pro Max         │ │
│                         │  └─────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                     RELATED PRODUCTS                        │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                           │
│  │Prod1│ │Prod2│ │Prod3│ │Prod4│                           │
│  └─────┘ └─────┘ └─────┘ └─────┘                           │
└─────────────────────────────────────────────────────────────┘
```

### Section Details
- **Image Gallery**: 500px width, zoom functionality, thumbnail navigation
- **Product Info**: Title, SKU, description, tiered pricing table
- **Quantity Selector**: Number input with +/- buttons
- **Compatibility List**: Bulleted list of compatible devices
- **Related Products**: 4-product carousel, same card style as homepage

## Page 4: Brands Page
```
┌─────────────────────────────────────────────────────────────┐
│                        BRANDS GRID                           │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │
│  │     │ │     │ │     │ │     │ │     │ │     │           │
│  │Apple│ │Samng│ │Googl│ │  LG │ │Motor│ │Huawei│           │
│  │     │ │     │ │     │ │     │ │     │ │     │           │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘           │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐           │
│  │Sony │ │Nokia│ │OnePl│ │Xiaom│ │Oppo │ │Vivo │           │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Section Details
- **Brand Grid**: 6x2 grid, 150px squares, logo images centered
- Each brand links to filtered shop page for that brand
- Hover effects: slight scale and shadow

## Page 5: Wholesale Account Application
```
┌─────────────────────────────────────────────────────────────┐
│              WHOLESALE ACCOUNT APPLICATION                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Business Information                                     │ │
│  │ Company Name: [Input]                                    │ │
│  │ Business Type: [Dropdown]                                │ │
│  │ Tax ID: [Input]                                          │ │
│  │                                                         │ │
│  │ Contact Information                                      │ │
│  │ Name: [Input]                                            │ │
│  │ Email: [Input]                                           │ │
│  │ Phone: [Input]                                           │ │
│  │                                                         │ │
│  │ Shipping Address                                         │ │
│  │ Address: [Input]                                         │ │
│  │ City: [Input] State: [Input] ZIP: [Input]               │ │
│  │                                                         │ │
│  │ [Submit Application]                                     │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Section Details
- **Form Layout**: Single column, 600px centered width
- **Required Fields**: All fields marked with asterisk
- **Validation**: Real-time validation with error messages
- **Submit Button**: Gold, full-width, disabled until form complete

## Page 6: Cart Page
```
┌─────────────────────────────────────────────────────────────┐
│  CART ITEMS                    │ ORDER SUMMARY               │
│  ┌─────────────────────────┐   │  ┌─────────────────────┐   │
│  │ [ ] Item 1                │   │  Subtotal: $XXX.XX    │   │
│  │     [Image] Title         │   │  Shipping: $XX.XX     │   │
│  │     Qty: [1] Price: $X.XX │   │  Tax: $XX.XX          │   │
│  │     [Remove]              │   │  Total: $XXX.XX       │   │
│  │                           │   │                        │   │
│  │ [ ] Item 2                │   │  [Checkout]            │   │
│  │     ...                   │   │                        │   │
│  └─────────────────────────┘   │  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Section Details
- **Cart Items**: List with checkboxes for bulk actions, quantity controls
- **Order Summary**: Sticky sidebar, auto-calculating totals
- **Empty State**: Illustration + "Continue Shopping" CTA

## Page 7: Checkout Page
```
┌─────────────────────────────────────────────────────────────┐
│  CHECKOUT STEPS: 1.Cart  2.Shipping  3.Payment  4.Confirm   │
├─────────────────────────────────────────────────────────────┤
│  GUEST CHECKOUT              │ SHIPPING INFO                 │
│  ┌─────────────────────────┐ │  ┌─────────────────────────┐ │
│  │ [Continue as Guest]      │ │  │ Name: [Input]           │ │
│  │ or                       │ │  │ Email: [Input]          │ │
│  │ [Login to Account]       │ │  │ Phone: [Input]          │ │
│  │                          │ │  │ Address: [Textarea]     │ │
│  │                          │ │  │ City/State/ZIP          │ │
│  └─────────────────────────┘ │  └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  PAYMENT METHOD               │ ORDER SUMMARY                │
│  ┌─────────────────────────┐ │  (Same as cart)              │
│  │ Credit Card               │ │                             │
│  │ [Card Number]             │ │                             │
│  │ [MM/YY] [CVC]             │ │                             │
│  │ [Billing Address]         │ │                             │
│  └─────────────────────────┘ │                             │
├─────────────────────────────────────────────────────────────┤
│                           [Place Order]                      │
└─────────────────────────────────────────────────────────────┘
```

### Section Details
- **Step Indicator**: Horizontal progress bar
- **Guest/Login Toggle**: Radio buttons at top
- **Form Sections**: Expandable accordions
- **Payment**: Secure form with card icons

## Page 8: Contact + Live Chat
```
┌─────────────────────────────────────────────────────────────┐
│  CONTACT FORM                 │ CONTACT INFO                 │
│  ┌─────────────────────────┐   │  ┌─────────────────────┐   │
│  │ Name: [Input]            │   │  📧 Email:            │   │
│  │ Email: [Input]           │   │     support@midas.com │   │
│  │ Subject: [Dropdown]      │   │  📞 Phone:            │   │
│  │ Message: [Textarea]      │   │     1-800-MIDAS     │   │
│  │                          │   │  🕒 Hours:            │   │
│  │ [Send Message]           │   │     Mon-Fri 9AM-6PM   │   │
│  └─────────────────────────┘   │  └─────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    LIVE CHAT WIDGET                         │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 💬 Live Chat Available Now                              │ │
│  │ Click here to start a conversation                      │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Section Details
- **Contact Form**: Standard form with validation
- **Contact Info**: Sidebar with business hours
- **Live Chat**: Persistent widget, integrates with chat system

## Mobile Responsiveness
- **Header**: Collapses to hamburger menu, stacked search/cart
- **Filters**: Slide-out sidebar on mobile, collapsible sections
- **Product Grid**: Single column mobile, 2 columns tablet
- **Buttons**: Minimum 44px touch targets
- **Forms**: Full-width inputs, stacked labels
- **Images**: Responsive with proper aspect ratios

## User Flows

### Primary Flow: Search → Filter → Add to Cart → Wholesale Signup
1. **Search**: User enters product in header search → Results page loads
2. **Filter**: User applies brand/device filters in sidebar → Grid updates
3. **Product Detail**: User clicks product → Detail page with gallery/pricing
4. **Add to Cart**: User selects quantity → Adds to cart with tiered pricing
5. **Cart Review**: User views cart → Proceeds to checkout
6. **Wholesale Signup**: Guest prompted to apply for wholesale account during checkout

### Secondary Flows
- **Brand Exploration**: Homepage brands → Brand page → Filtered shop
- **Category Navigation**: Mega-menu → Category landing → Shop filters
- **Bulk Ordering**: Product detail tiered pricing → Quantity selection → Cart

### Error States
- **Login Required**: Wholesale pricing hidden until account approval
- **Minimum Order**: Warning for orders under minimum wholesale threshold
- **Out of Stock**: Disabled add-to-cart, "Notify when available" option

## Technical Considerations
- **Performance**: Lazy loading images, CDN for assets
- **Accessibility**: Alt text, keyboard navigation, screen reader support
- **SEO**: Structured data for products, meta tags for pages
- **Analytics**: Track user flows, conversion funnels
- **Security**: HTTPS, secure payment processing, data encryption
