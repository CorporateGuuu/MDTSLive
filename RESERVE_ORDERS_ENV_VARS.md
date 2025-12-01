# Reserve Orders Feature - Environment Variables

The Reserve Orders feature requires Supabase integration for fetching and managing reserve orders. This includes authentication guards and real-time order status updates.

## Required Environment Variables

```bash
# Supabase Configuration (Required for Reserve Orders)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Setup Instructions

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be fully initialized

2. **Get Your Project URL and API Key**
   - In your Supabase dashboard, go to Settings > API
   - Copy the "Project URL" and "anon public" key

3. **Configure Environment Variables**
   - Create or update your `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Run Database Migration**
   - The reserve orders feature requires a database table
   - Run the migration file: `migrations/011_reserve_orders.sql`
   - This can be done via the Supabase SQL Editor or command line

## Database Schema

The reserve orders feature creates a `reserve_orders` table with the following structure:

```sql
CREATE TABLE reserve_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'reserved' CHECK (status IN ('reserved', 'shipped', 'cancelled', 'expired')),
  order_type TEXT DEFAULT 'Reserve' CHECK (order_type IN ('Reserve', 'Bulk', 'Express')),
  total_amount DECIMAL(10, 2) NOT NULL,
  ship_to TEXT NOT NULL,
  location TEXT NOT NULL,
  shipping_method TEXT NOT NULL,
  company_name TEXT,
  date_ordered DATE NOT NULL DEFAULT CURRENT_DATE,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shipped_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);
```

## Features Enabled

With proper Supabase environment variable configuration, the following features become available:

- ✅ **Real-time Reserve Orders**: Fetch orders from Supabase database
- ✅ **Authentication Guard**: Automatic redirect for unauthenticated users
- ✅ **Order Status Updates**: Ship/cancel orders with real-time status updates
- ✅ **Bulk Operations**: Ship or cancel multiple orders at once
- ✅ **Advanced Filtering**: Filter by status, company, date range, and search terms
- ✅ **Loading States**: Proper loading indicators during API calls
- ✅ **Error Handling**: Toast notifications for success/failure states
- ✅ **Row Level Security**: Users can only access their own orders

## Security

- All reserve order operations use Row Level Security (RLS) policies
- Users can only access their own reserve orders
- Authentication is required for all operations
- All database operations are authenticated through Supabase Auth

## Fallback Behavior

If Supabase environment variables are not configured:
- The application will show a loading state indefinitely
- Authentication checks will fail
- API calls will throw errors
- A warning will be shown in the console about missing Supabase configuration

## API Functions

The reserve orders feature provides the following functions in `src/lib/supabase.ts`:

- `getReserveOrders(filters?)`: Fetch reserve orders with optional filters
- `updateReserveOrderStatus(orderId, status)`: Update individual order status
- `bulkUpdateReserveOrderStatus(orderIds, status)`: Bulk update multiple orders

## Status Types

- `reserved`: Order is held and can be shipped or cancelled
- `shipped`: Order has been shipped (sets shipped_at timestamp)
- `cancelled`: Order has been cancelled (sets cancelled_at timestamp)
- `expired`: Order has expired without action (based on expires_at date)

## Order Types

- `Reserve`: Standard reserve order
- `Bulk`: Bulk order with multiple items
- `Express`: Express shipping order
