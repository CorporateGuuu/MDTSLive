-- Migration: 008_fix_rls_policies
-- Description: Fix RLS policies to properly check user roles and improve security

-- =============================================================================
-- FIX RLS POLICIES FOR PROPER ROLE CHECKING
-- =============================================================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can insert brands" ON public.brands;
DROP POLICY IF EXISTS "Admins can update brands" ON public.brands;
DROP POLICY IF EXISTS "Admins can delete brands" ON public.brands;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage product variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admins can manage product specifications" ON public.product_specifications;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Admins can manage all wholesale requests" ON public.wholesale_requests;
DROP POLICY IF EXISTS "Admins can manage all LCD buyback requests" ON public.lcd_buyback_requests;

-- =============================================================================
-- IMPROVED ADMIN ROLE CHECKING POLICIES
-- =============================================================================

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies (improved)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (auth.is_admin());

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (auth.is_admin());

-- Categories policies (improved)
CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.is_admin());

CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (auth.is_admin());

CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  USING (auth.is_admin());

-- Brands policies (improved)
CREATE POLICY "Admins can insert brands"
  ON public.brands FOR INSERT
  WITH CHECK (auth.is_admin());

CREATE POLICY "Admins can update brands"
  ON public.brands FOR UPDATE
  USING (auth.is_admin());

CREATE POLICY "Admins can delete brands"
  ON public.brands FOR DELETE
  USING (auth.is_admin());

-- Products policies (improved)
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (auth.is_admin());

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (auth.is_admin());

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (auth.is_admin());

-- Product variants policies (improved)
CREATE POLICY "Admins can manage product variants"
  ON public.product_variants FOR ALL
  USING (auth.is_admin());

-- Product specifications policies (improved)
CREATE POLICY "Admins can manage product specifications"
  ON public.product_specifications FOR ALL
  USING (auth.is_admin());

-- Orders policies (improved)
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (auth.is_admin());

CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (auth.is_admin());

-- Order items policies (improved)
CREATE POLICY "Admins can manage all order items"
  ON public.order_items FOR ALL
  USING (auth.is_admin());

-- Product reviews policies (improved)
CREATE POLICY "Admins can manage all reviews"
  ON public.product_reviews FOR ALL
  USING (auth.is_admin());

-- Wholesale requests policies (improved)
CREATE POLICY "Admins can manage all wholesale requests"
  ON public.wholesale_requests FOR ALL
  USING (auth.is_admin());

-- LCD buyback requests policies (improved)
CREATE POLICY "Admins can manage all LCD buyback requests"
  ON public.lcd_buyback_requests FOR ALL
  USING (auth.is_admin());

-- =============================================================================
-- FIX STORAGE POLICIES FOR BETTER SECURITY
-- =============================================================================

-- Drop existing storage policies
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

-- Improved storage policies (only admins can manage product images)
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products'
  AND auth.is_admin()
);

CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'products'
  AND auth.is_admin()
)
WITH CHECK (
  bucket_id = 'products'
  AND auth.is_admin()
);

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'products'
  AND auth.is_admin()
);

-- =============================================================================
-- ADD DATABASE INDEXES FOR PERFORMANCE
-- =============================================================================

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock_quantity ON public.products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- Categories table indexes
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- Brands table indexes
CREATE INDEX IF NOT EXISTS idx_brands_is_active ON public.brands(is_active);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);

-- Order items table indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Cart items table indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);

-- Product reviews table indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON public.product_reviews(rating);

-- =============================================================================
-- MIGRATION TRACKING
-- =============================================================================

INSERT INTO public.supabase_migrations (migration_name, checksum)
VALUES ('008_fix_rls_policies', 'rls_policies_and_indexes_v2')
ON CONFLICT (migration_name) DO NOTHING;
