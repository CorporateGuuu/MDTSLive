-- =============================================================================
-- Nexus Tech Hub - Payment Methods Table
-- =============================================================================
-- This migration creates a payment_methods table for storing saved payment information

-- =============================================================================
-- Create Payment Methods Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  braintree_token TEXT NOT NULL, -- Braintree payment method token
  last_four TEXT NOT NULL, -- Last 4 digits of card
  card_type TEXT NOT NULL, -- Visa, Mastercard, etc.
  expiration_month TEXT NOT NULL,
  expiration_year TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- Create Indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_braintree_token ON public.payment_methods(braintree_token);

-- =============================================================================
-- Create Updated At Trigger
-- =============================================================================

DROP TRIGGER IF EXISTS payment_methods_updated_at ON public.payment_methods;
CREATE TRIGGER payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- Enable Row Level Security
-- =============================================================================

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS Policies for Payment Methods
-- =============================================================================

-- Users can view their own payment methods
CREATE POLICY "Users can view their own payment methods"
  ON public.payment_methods FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own payment methods
CREATE POLICY "Users can insert their own payment methods"
  ON public.payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own payment methods
CREATE POLICY "Users can update their own payment methods"
  ON public.payment_methods FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own payment methods
CREATE POLICY "Users can delete their own payment methods"
  ON public.payment_methods FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all payment methods
CREATE POLICY "Admins can view all payment methods"
  ON public.payment_methods FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- Migration Tracking
-- =============================================================================

-- Record this migration in the supabase_migrations table
INSERT INTO public.supabase_migrations (migration_name, checksum)
VALUES ('014_payment_methods', 'payment_methods_table_v1')
ON CONFLICT (migration_name) DO NOTHING;
