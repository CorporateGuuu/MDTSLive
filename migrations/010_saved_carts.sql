-- =============================================================================
-- Nexus Tech Hub - Saved Carts Table
-- =============================================================================
-- This migration creates a saved_carts table for users to save their shopping carts
-- Run this after the cart_items table migration

-- =============================================================================
-- Create Saved Carts Table
-- =============================================================================

-- Create saved_carts table
CREATE TABLE IF NOT EXISTS saved_carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name VARCHAR(255) NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  total DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_carts_user_id ON saved_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_carts_created_at ON saved_carts(created_at DESC);

-- =============================================================================
-- Enable Row Level Security
-- =============================================================================

-- Enable RLS on saved_carts table
ALTER TABLE saved_carts ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS Policies
-- =============================================================================

-- Users can manage their own saved carts
CREATE POLICY "users can manage own saved carts"
  ON saved_carts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- Functions and Triggers
-- =============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_saved_carts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_saved_carts_updated_at
  BEFORE UPDATE ON saved_carts
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_carts_updated_at();

-- =============================================================================
-- Migration Tracking
-- =============================================================================

-- Record this migration in the supabase_migrations table
INSERT INTO public.supabase_migrations (migration_name, checksum)
VALUES ('010_saved_carts', 'saved_carts_table_v1')
ON CONFLICT (migration_name) DO NOTHING;
