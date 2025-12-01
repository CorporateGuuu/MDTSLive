-- Add missing columns to Supabase database
-- Run these commands in your Supabase SQL editor

-- Add is_active column to products table (skip if it already exists)
ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Add logo_url column to brands table (skip if it already exists)
ALTER TABLE brands ADD COLUMN logo_url TEXT;

-- Add is_active column to categories table (skip if it already exists)
ALTER TABLE categories ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Verify the columns were added
SELECT
  'products.is_active exists' as check_result
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'products' AND column_name = 'is_active'
)
UNION ALL
SELECT
  'brands.logo_url exists' as check_result
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'brands' AND column_name = 'logo_url'
)
UNION ALL
SELECT
  'categories.is_active exists' as check_result
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_name = 'categories' AND column_name = 'is_active'
);
