-- =============================================================================
-- Nexus Tech Hub - Cart Items Table (Simplified)
-- =============================================================================
-- This migration creates a simplified cart_items table for shopping cart functionality
-- Run this after the main schema migration

-- =============================================================================
-- Create Cart Items Table
-- =============================================================================

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id UUID REFERENCES products NOT NULL,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  PRIMARY KEY (user_id, product_id)
);

-- =============================================================================
-- Enable Row Level Security
-- =============================================================================

-- Enable RLS on cart_items table
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS Policies
-- =============================================================================

-- Users can manage their own cart items
CREATE POLICY "users can manage own cart"
  ON cart_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- Migration Tracking
-- =============================================================================

-- Record this migration in the supabase_migrations table
INSERT INTO public.supabase_migrations (migration_name, checksum)
VALUES ('005_cart_items_simple', 'cart_items_table_simple_v1')
ON CONFLICT (migration_name) DO NOTHING;
