-- =============================================================================
-- Nexus Tech Hub - Reserve Orders Table
-- =============================================================================
-- This migration creates a reserve_orders table for managing held orders
-- that can be reserved before final processing

-- =============================================================================
-- Create Reserve Orders Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.reserve_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'reserved' CHECK (status IN ('reserved', 'shipped', 'cancelled', 'expired')),
  order_type TEXT DEFAULT 'Reserve' CHECK (order_type IN ('Reserve', 'Bulk', 'Express')),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),

  -- Shipping Information
  ship_to TEXT NOT NULL,
  location TEXT NOT NULL,
  shipping_method TEXT NOT NULL,

  -- Filter/Search fields
  company_name TEXT,
  date_ordered DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Order details (JSON for flexibility)
  items JSONB DEFAULT '[]'::jsonb,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shipped_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- =============================================================================
-- Create Indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_reserve_orders_user_id ON public.reserve_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_reserve_orders_order_number ON public.reserve_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_reserve_orders_status ON public.reserve_orders(status);
CREATE INDEX IF NOT EXISTS idx_reserve_orders_order_type ON public.reserve_orders(order_type);
CREATE INDEX IF NOT EXISTS idx_reserve_orders_date_ordered ON public.reserve_orders(date_ordered);
CREATE INDEX IF NOT EXISTS idx_reserve_orders_company_name ON public.reserve_orders(company_name);
CREATE INDEX IF NOT EXISTS idx_reserve_orders_ship_to ON public.reserve_orders(ship_to);
CREATE INDEX IF NOT EXISTS idx_reserve_orders_location ON public.reserve_orders(location);
CREATE INDEX IF NOT EXISTS idx_reserve_orders_created_at ON public.reserve_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_reserve_orders_expires_at ON public.reserve_orders(expires_at);

-- =============================================================================
-- Create Updated At Trigger
-- =============================================================================

DROP TRIGGER IF EXISTS reserve_orders_updated_at ON public.reserve_orders;
CREATE TRIGGER reserve_orders_updated_at
  BEFORE UPDATE ON public.reserve_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- Enable Row Level Security
-- =============================================================================

ALTER TABLE public.reserve_orders ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS Policies for Reserve Orders
-- =============================================================================

-- Users can view their own reserve orders
CREATE POLICY "Users can view their own reserve orders"
  ON public.reserve_orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own reserve orders
CREATE POLICY "Users can insert their own reserve orders"
  ON public.reserve_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reserve orders (limited actions)
CREATE POLICY "Users can update their own reserve orders"
  ON public.reserve_orders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND (
      -- Allow cancelling orders
      NEW.status = 'cancelled'
      -- Allow limited status changes
      OR (OLD.status = 'reserved' AND NEW.status IN ('shipped', 'cancelled'))
    )
  );

-- Admins can view all reserve orders
CREATE POLICY "Admins can view all reserve orders"
  ON public.reserve_orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all reserve orders
CREATE POLICY "Admins can update all reserve orders"
  ON public.reserve_orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- Helper Functions
-- =============================================================================

-- Function to generate reserve order number
CREATE OR REPLACE FUNCTION public.generate_reserve_order_number()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  random_part TEXT;
  order_number TEXT;
  counter INTEGER := 0;
BEGIN
  -- Get date part: YYYYMMDD
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');

  -- Generate unique order number with retry logic
  LOOP
    -- Generate 4-digit random number
    random_part := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

    -- Combine parts with RES prefix
    order_number := 'RES-' || date_part || '-' || random_part;

    -- Check if order number already exists
    IF NOT EXISTS (SELECT 1 FROM public.reserve_orders WHERE order_number = order_number) THEN
      RETURN order_number;
    END IF;

    -- Prevent infinite loop
    counter := counter + 1;
    IF counter > 100 THEN
      RAISE EXCEPTION 'Could not generate unique reserve order number after 100 attempts';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Insert Sample Data
-- =============================================================================

-- Insert sample reserve orders for testing
INSERT INTO public.reserve_orders (
  user_id,
  order_number,
  status,
  order_type,
  total_amount,
  ship_to,
  location,
  shipping_method,
  company_name,
  items
) VALUES
(
  (SELECT id FROM auth.users LIMIT 1), -- Use first user or create test user
  '1078717',
  'reserved',
  'Reserve',
  182.86,
  'Fitzgerald Amaranpong',
  'Midas Technical Solutions',
  'Standard',
  'Midas Technical Solutions',
  '[{"name": "iPhone 15 Pro Display", "qty": 2, "price": 91.43}]'::jsonb
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '1078718',
  'reserved',
  'Reserve',
  245.99,
  'John Smith',
  'Tech Solutions Inc',
  'Express',
  'Tech Solutions Inc',
  '[{"name": "Samsung Galaxy S24 Screen", "qty": 1, "price": 245.99}]'::jsonb
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '1078719',
  'reserved',
  'Reserve',
  156.75,
  'Sarah Johnson',
  'Mobile Repair Co',
  'Standard',
  'Mobile Repair Co',
  '[{"name": "iPad Pro Battery", "qty": 3, "price": 52.25}]'::jsonb
)
ON CONFLICT (order_number) DO NOTHING;

-- =============================================================================
-- Migration Tracking
-- =============================================================================

-- Record this migration in the supabase_migrations table
INSERT INTO public.supabase_migrations (migration_name, checksum)
VALUES ('011_reserve_orders', 'reserve_orders_table_v1')
ON CONFLICT (migration_name) DO NOTHING;
