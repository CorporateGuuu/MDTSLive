-- Migration: 20241102120002_create_rls_policies
-- Description: Enable Row Level Security and create policies for all tables

-- =============================================================================
-- PROFILES TABLE POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- USER ADDRESSES TABLE POLICIES
-- =============================================================================

ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Users can view their own addresses
CREATE POLICY "Users can view own addresses"
  ON public.user_addresses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own addresses
CREATE POLICY "Users can insert own addresses"
  ON public.user_addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses"
  ON public.user_addresses FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own addresses
CREATE POLICY "Users can delete own addresses"
  ON public.user_addresses FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- CATEGORIES TABLE POLICIES
-- =============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Everyone can view active categories
CREATE POLICY "Everyone can view categories"
  ON public.categories FOR SELECT
  USING (is_active = true);

-- Only admins can insert categories
CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update categories
CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete categories
CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- BRANDS TABLE POLICIES
-- =============================================================================

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Everyone can view active brands
CREATE POLICY "Everyone can view brands"
  ON public.brands FOR SELECT
  USING (is_active = true);

-- Only admins can insert brands
CREATE POLICY "Admins can insert brands"
  ON public.brands FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update brands
CREATE POLICY "Admins can update brands"
  ON public.brands FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete brands
CREATE POLICY "Admins can delete brands"
  ON public.brands FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- PRODUCTS TABLE POLICIES
-- =============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone can view active products
CREATE POLICY "Everyone can view products"
  ON public.products FOR SELECT
  USING (is_active = true);

-- Only admins can insert products
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update products
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete products
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- PRODUCT VARIANTS TABLE POLICIES
-- =============================================================================

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Everyone can view active product variants
CREATE POLICY "Everyone can view product variants"
  ON public.product_variants FOR SELECT
  USING (is_active = true);

-- Only admins can manage product variants
CREATE POLICY "Admins can manage product variants"
  ON public.product_variants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- PRODUCT SPECIFICATIONS TABLE POLICIES
-- =============================================================================

ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;

-- Everyone can view product specifications
CREATE POLICY "Everyone can view product specifications"
  ON public.product_specifications FOR SELECT
  USING (true);

-- Only admins can manage product specifications
CREATE POLICY "Admins can manage product specifications"
  ON public.product_specifications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- CART ITEMS TABLE POLICIES
-- Cart: only own cart items
-- =============================================================================

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own cart items
CREATE POLICY "Users can view their own cart items"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own cart items
CREATE POLICY "Users can insert their own cart items"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart items
CREATE POLICY "Users can update their own cart items"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own cart items
CREATE POLICY "Users can delete their own cart items"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- ORDERS TABLE POLICIES (if exists)
-- Orders: only own orders
-- =============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

    -- Users can view their own orders
    CREATE POLICY "Users can view their own orders"
      ON public.orders FOR SELECT
      USING (auth.uid() = user_id);

    -- Users can insert their own orders
    CREATE POLICY "Users can insert their own orders"
      ON public.orders FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    -- Users can update their own orders (limited status changes)
    CREATE POLICY "Users can update their own orders"
      ON public.orders FOR UPDATE
      USING (auth.uid() = user_id);

    -- Admins can view all orders
    CREATE POLICY "Admins can view all orders"
      ON public.orders FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

    -- Admins can update all orders
    CREATE POLICY "Admins can update all orders"
      ON public.orders FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- =============================================================================
-- ORDER ITEMS TABLE POLICIES (if exists)
-- Orders: users can view their order items, admins can manage all
-- =============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_items') THEN
    ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

    -- Users can view their own order items
    CREATE POLICY "Users can view their own order items"
      ON public.order_items FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.orders
          WHERE id = order_id AND user_id = auth.uid()
        )
      );

    -- Users can insert order items for their orders
    CREATE POLICY "Users can insert their own order items"
      ON public.order_items FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.orders
          WHERE id = order_id AND user_id = auth.uid()
        )
      );

    -- Admins can manage all order items
    CREATE POLICY "Admins can manage all order items"
      ON public.order_items FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- =============================================================================
-- PRODUCT REVIEWS TABLE POLICIES (if exists)
-- Reviews: authenticated can insert, public read
-- =============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_reviews') THEN
    ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

    -- Everyone can view product reviews
    CREATE POLICY "Everyone can view product reviews"
      ON public.product_reviews FOR SELECT
      USING (true);

    -- Authenticated users can insert reviews
    CREATE POLICY "Authenticated users can insert reviews"
      ON public.product_reviews FOR INSERT
      WITH CHECK (auth.uid() IS NOT NULL);

    -- Users can update their own reviews
    CREATE POLICY "Users can update their own reviews"
      ON public.product_reviews FOR UPDATE
      USING (auth.uid() = user_id);

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
  END IF;
END $$;

-- =============================================================================
-- WHOLESALE REQUESTS TABLE POLICIES (if exists)
-- Wholesale: users manage own requests, admins manage all
-- =============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wholesale_requests') THEN
    ALTER TABLE public.wholesale_requests ENABLE ROW LEVEL SECURITY;

    -- Users can view their own wholesale requests
    CREATE POLICY "Users can view their own wholesale requests"
      ON public.wholesale_requests FOR SELECT
      USING (auth.uid() = user_id);

    -- Users can insert their own wholesale requests
    CREATE POLICY "Users can insert their own wholesale requests"
      ON public.wholesale_requests FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    -- Users can update their own pending wholesale requests
    CREATE POLICY "Users can update their own wholesale requests"
      ON public.wholesale_requests FOR UPDATE
      USING (auth.uid() = user_id AND status = 'pending');

    -- Admins can manage all wholesale requests
    CREATE POLICY "Admins can manage all wholesale requests"
      ON public.wholesale_requests FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- =============================================================================
-- LCD BUYBACK REQUESTS TABLE POLICIES (if exists)
-- LCD Buyback: users manage own requests, admins manage all
-- =============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lcd_buyback_requests') THEN
    ALTER TABLE public.lcd_buyback_requests ENABLE ROW LEVEL SECURITY;

    -- Users can view their own LCD buyback requests
    CREATE POLICY "Users can view their own LCD buyback requests"
      ON public.lcd_buyback_requests FOR SELECT
      USING (auth.uid() = user_id);

    -- Users can insert their own LCD buyback requests
    CREATE POLICY "Users can insert their own LCD buyback requests"
      ON public.lcd_buyback_requests FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    -- Users can update their own pending LCD buyback requests
    CREATE POLICY "Users can update their own LCD buyback requests"
      ON public.lcd_buyback_requests FOR UPDATE
      USING (auth.uid() = user_id AND status = 'pending');

    -- Admins can manage all LCD buyback requests
    CREATE POLICY "Admins can manage all LCD buyback requests"
      ON public.lcd_buyback_requests FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;
