# LCD BuyBack Program Environment Variables

This document outlines the environment variables required for the LCD BuyBack Program functionality.

## Required Environment Variables

### Supabase Configuration
```bash
# Supabase URL and Keys (inherited from main project)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Setup

The LCD BuyBack feature requires the following database table:

### Migration: `016_lcd_buyback.sql`
- Creates the `public.lcd_buyback` table
- Includes Row Level Security (RLS) policies
- Sets up proper indexes for performance
- Auto-generates request IDs

### Table Schema
```sql
CREATE TABLE public.lcd_buyback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    device_model VARCHAR(100) NOT NULL,
    photos TEXT[], -- Array of photo URLs
    ship_to TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    requested_date DATE DEFAULT CURRENT_DATE,
    completed_on DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Features Enabled

### Authentication
- User authentication via Supabase Auth
- Row Level Security ensures users only see their own requests
- Automatic user_id assignment on insert

### Request Management
- Create new LCD buyback requests
- View request history with filtering
- Status tracking (Pending, Approved, Rejected, Completed, Cancelled)
- Photo upload and storage

### PDF Generation
- Automatic shipping label generation using jsPDF
- Includes request details and shipping information

## Setup Instructions

1. Run the migration:
   ```bash
   node run-lcd-buyback-migration.js
   ```

2. Ensure environment variables are set in `.env.local`

3. The LCD BuyBack page will be available at `/account/lcd-buyback`

## Security Notes

- All database operations use Row Level Security
- Users can only access their own buyback requests
- File uploads are handled securely through Supabase Storage (when implemented)
- Request IDs are auto-generated to prevent conflicts
