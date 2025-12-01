-- =============================================================================
-- Nexus Tech Hub - Product Reviews Tables
-- =============================================================================
-- This migration creates product_reviews table for user reviews and ratings
-- Run this after products table is created

-- =============================================================================
-- Create Product Reviews Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one review per user per product
  UNIQUE(user_id, product_id)
);

-- =============================================================================
-- Create Review Images Table (optional)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.review_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.product_reviews(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- Create Indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON public.product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON public.product_reviews(created_at);

CREATE INDEX IF NOT EXISTS idx_review_images_review_id ON public.review_images(review_id);

-- =============================================================================
-- Create Updated At Trigger
-- =============================================================================

DROP TRIGGER IF EXISTS product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER product_reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- Enable Row Level Security
-- =============================================================================

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_images ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS Policies for Product Reviews
-- =============================================================================

-- Anyone can view reviews
CREATE POLICY "Anyone can view product reviews"
  ON public.product_reviews FOR SELECT
  USING (true);

-- Authenticated users can insert their own reviews
CREATE POLICY "Users can insert their own reviews"
  ON public.product_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON public.product_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON public.product_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews"
  ON public.product_reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- RLS Policies for Review Images
-- =============================================================================

-- Anyone can view review images
CREATE POLICY "Anyone can view review images"
  ON public.review_images FOR SELECT
  USING (true);

-- Users can manage images for their own reviews
CREATE POLICY "Users can manage their own review images"
  ON public.review_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.product_reviews
      WHERE id = review_id AND user_id = auth.uid()
    )
  );

-- Admins can manage all review images
CREATE POLICY "Admins can manage all review images"
  ON public.review_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- Helper Functions
-- =============================================================================

-- Function to calculate average rating for a product
CREATE OR REPLACE FUNCTION public.get_product_average_rating(product_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  avg_rating DECIMAL(3,2);
BEGIN
  SELECT COALESCE(AVG(rating)::DECIMAL(3,2), 0)
  INTO avg_rating
  FROM public.product_reviews
  WHERE product_id = product_uuid;

  RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- Function to get review count for a product
CREATE OR REPLACE FUNCTION public.get_product_review_count(product_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  review_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO review_count
  FROM public.product_reviews
  WHERE product_id = product_uuid;

  RETURN review_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Migration Tracking
-- =============================================================================

-- Record this migration in the supabase_migrations table
INSERT INTO public.supabase_migrations (migration_name, checksum)
VALUES ('009_product_reviews', 'product_reviews_and_images_tables_v1')
ON CONFLICT (migration_name) DO NOTHING;
