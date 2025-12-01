-- =============================================================================
-- Nexus Tech Hub - Orders System (Simplified)
-- =============================================================================
-- This migration creates a simplified orders system with automatic stock reduction
-- Run this after products and users tables are created

-- =============================================================================
-- Create Orders Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'card')),
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- Create Order Items Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.order_items (
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase DECIMAL(10, 2) NOT NULL CHECK (price_at_purchase >= 0),
  PRIMARY KEY (order_id, product_id)
);

-- =============================================================================
-- Create Indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- =============================================================================
-- Create Updated At Trigger
-- =============================================================================

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- Enable Row Level Security
-- =============================================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS Policies for Orders
-- =============================================================================

-- Users can view their own orders
CREATE POLICY "own orders"
  ON public.orders FOR ALL
  USING (auth.uid() = user_id);

-- =============================================================================
-- RLS Policies for Order Items
-- =============================================================================

-- Users can view their own order items
CREATE POLICY "own order items"
  ON public.order_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND auth.uid() = user_id
    )
  );

-- =============================================================================
-- Stock Reduction Trigger
-- =============================================================================

-- Function to reduce stock when order items are created
CREATE OR REPLACE FUNCTION public.reduce_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Reduce stock for the ordered product
  UPDATE public.products
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;

  -- Check if we have sufficient stock (additional safety check)
  IF NOT EXISTS (
    SELECT 1 FROM public.products
    WHERE id = NEW.product_id AND stock_quantity >= 0
  ) THEN
    RAISE EXCEPTION 'Insufficient stock for product %', NEW.product_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically reduce stock on order item creation
DROP TRIGGER IF EXISTS trg_reduce_stock ON public.order_items;
CREATE TRIGGER trg_reduce_stock
  AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.reduce_stock();

-- =============================================================================
-- Migration Tracking
-- =============================================================================

-- Record this migration in the supabase_migrations table
INSERT INTO public.supabase_migrations (migration_name, checksum)
VALUES ('007_orders_system_simple', 'orders_system_simple_v1')
ON CONFLICT (migration_name) DO NOTHING;
