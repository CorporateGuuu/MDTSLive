-- =============================================================================
-- Nexus Tech Hub - FedEx Refunds Table
-- =============================================================================
-- This migration creates a fedex_refunds table for managing FedEx refund requests
-- and claim history for delayed shipments

-- =============================================================================
-- Create FedEx Refunds Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.fedex_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Request Information
  order_number TEXT NOT NULL,
  tracking_number TEXT NOT NULL,
  shipping_method TEXT NOT NULL CHECK (shipping_method IN ('Standard', 'Express', 'Priority Overnight', 'Ground')),
  description TEXT,

  -- Request Status and Processing
  request_status TEXT DEFAULT 'pending' CHECK (request_status IN ('pending', 'approved', 'rejected', 'processing')),
  shipping_charges DECIMAL(8, 2) DEFAULT 0 CHECK (shipping_charges >= 0),

  -- Claim Information (for processed refunds)
  claim_status TEXT CHECK (claim_status IN ('Approved', 'Pending', 'Rejected')),
  refund_amount DECIMAL(8, 2) CHECK (refund_amount >= 0),
  claim_date DATE,

  -- Shipping Details
  ship_to TEXT,
  location TEXT,

  -- Timestamps
  request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE
);

-- =============================================================================
-- Create Indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_fedex_refunds_user_id ON public.fedex_refunds(user_id);
CREATE INDEX IF NOT EXISTS idx_fedex_refunds_order_number ON public.fedex_refunds(order_number);
CREATE INDEX IF NOT EXISTS idx_fedex_refunds_tracking_number ON public.fedex_refunds(tracking_number);
CREATE INDEX IF NOT EXISTS idx_fedex_refunds_request_status ON public.fedex_refunds(request_status);
CREATE INDEX IF NOT EXISTS idx_fedex_refunds_claim_status ON public.fedex_refunds(claim_status);
CREATE INDEX IF NOT EXISTS idx_fedex_refunds_request_date ON public.fedex_refunds(request_date);
CREATE INDEX IF NOT EXISTS idx_fedex_refunds_shipping_method ON public.fedex_refunds(shipping_method);
CREATE INDEX IF NOT EXISTS idx_fedex_refunds_created_at ON public.fedex_refunds(created_at);

-- =============================================================================
-- Create Updated At Trigger
-- =============================================================================

DROP TRIGGER IF EXISTS fedex_refunds_updated_at ON public.fedex_refunds;
CREATE TRIGGER fedex_refunds_updated_at
  BEFORE UPDATE ON public.fedex_refunds
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- Enable Row Level Security
-- =============================================================================

ALTER TABLE public.fedex_refunds ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS Policies for FedEx Refunds
-- =============================================================================

-- Users can view their own refund requests
CREATE POLICY "Users can view their own fedex refunds"
  ON public.fedex_refunds FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own refund requests
CREATE POLICY "Users can insert their own fedex refunds"
  ON public.fedex_refunds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own refund requests (limited)
CREATE POLICY "Users can update their own fedex refunds"
  ON public.fedex_refunds FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all refund requests
CREATE POLICY "Admins can view all fedex refunds"
  ON public.fedex_refunds FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all refund requests
CREATE POLICY "Admins can update all fedex refunds"
  ON public.fedex_refunds FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- Helper Functions
-- =============================================================================

-- Function to generate refund request number
CREATE OR REPLACE FUNCTION public.generate_refund_request_number()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  random_part TEXT;
  request_number TEXT;
  counter INTEGER := 0;
BEGIN
  -- Get date part: YYYYMMDD
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');

  -- Generate unique request number with retry logic
  LOOP
    -- Generate 4-digit random number
    random_part := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

    -- Combine parts with REF prefix
    request_number := 'REF-' || date_part || '-' || random_part;

    -- Check if request number already exists (using order_number as unique identifier)
    IF NOT EXISTS (SELECT 1 FROM public.fedex_refunds WHERE order_number = request_number) THEN
      RETURN request_number;
    END IF;

    -- Prevent infinite loop
    counter := counter + 1;
    IF counter > 100 THEN
      RAISE EXCEPTION 'Could not generate unique refund request number after 100 attempts';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Insert Sample Data
-- =============================================================================

-- Insert sample fedex refund requests for testing
INSERT INTO public.fedex_refunds (
  user_id,
  order_number,
  tracking_number,
  shipping_method,
  request_status,
  shipping_charges,
  ship_to,
  location,
  description,
  request_date
) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  '1078717',
  '9400123456789012345678',
  'Standard',
  'pending',
  25.00,
  'Fitzgerald Amaranpong',
  'Midas Technical Solutions',
  'Package delayed by 3 days',
  CURRENT_DATE - INTERVAL '2 days'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '1078718',
  '9400123456789012345679',
  'Express',
  'approved',
  45.00,
  'John Smith',
  'Tech Solutions Inc',
  'Package never arrived',
  CURRENT_DATE - INTERVAL '5 days'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '1078719',
  '9400123456789012345680',
  'Priority Overnight',
  'rejected',
  75.00,
  'Sarah Johnson',
  'Mobile Repair Co',
  'Package damaged during shipping',
  CURRENT_DATE - INTERVAL '7 days'
)
ON CONFLICT (order_number) DO NOTHING;

-- Update sample data with claim information
UPDATE public.fedex_refunds
SET
  claim_status = 'Approved',
  refund_amount = 45.00,
  claim_date = CURRENT_DATE - INTERVAL '3 days',
  processed_at = CURRENT_DATE - INTERVAL '3 days',
  approved_at = CURRENT_DATE - INTERVAL '3 days'
WHERE order_number = '1078718' AND claim_status IS NULL;

UPDATE public.fedex_refunds
SET
  claim_status = 'Rejected',
  refund_amount = 0.00,
  claim_date = CURRENT_DATE - INTERVAL '5 days',
  processed_at = CURRENT_DATE - INTERVAL '5 days',
  rejected_at = CURRENT_DATE - INTERVAL '5 days'
WHERE order_number = '1078719' AND claim_status IS NULL;

-- =============================================================================
-- Migration Tracking
-- =============================================================================

-- Record this migration in the supabase_migrations table
INSERT INTO public.supabase_migrations (migration_name, checksum)
VALUES ('012_fedex_refunds', 'fedex_refunds_table_v1')
ON CONFLICT (migration_name) DO NOTHING;
