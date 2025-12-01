-- =============================================================================
-- Nexus Tech Hub - Balance Sheet Table
-- =============================================================================
-- This migration creates a balance_sheet table for managing user transaction
-- ledger with debit/credit tracking and running balance calculations

-- =============================================================================
-- Create Balance Sheet Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.balance_sheet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  details TEXT NOT NULL,
  debit DECIMAL(10,2) DEFAULT 0.00,
  credit DECIMAL(10,2) DEFAULT 0.00,
  balance DECIMAL(10,2) DEFAULT 0.00,
  type TEXT NOT NULL DEFAULT 'Transaction',
  reference TEXT,
  transaction_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- Create Indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_balance_sheet_user_id ON public.balance_sheet(user_id);
CREATE INDEX IF NOT EXISTS idx_balance_sheet_date ON public.balance_sheet(date);
CREATE INDEX IF NOT EXISTS idx_balance_sheet_transaction_id ON public.balance_sheet(transaction_id);

-- =============================================================================
-- Create Updated At Trigger
-- =============================================================================

DROP TRIGGER IF EXISTS balance_sheet_updated_at ON public.balance_sheet;
CREATE TRIGGER balance_sheet_updated_at
  BEFORE UPDATE ON public.balance_sheet
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- Enable Row Level Security
-- =============================================================================

ALTER TABLE public.balance_sheet ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS Policies for Balance Sheet
-- =============================================================================

-- Users can view their own balance sheet transactions
CREATE POLICY "Users can view their own balance sheet"
  ON public.balance_sheet FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own balance sheet transactions
CREATE POLICY "Users can insert their own balance sheet transactions"
  ON public.balance_sheet FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all balance sheet transactions
CREATE POLICY "Admins can view all balance sheet transactions"
  ON public.balance_sheet FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- Insert Sample Data
-- =============================================================================

-- Insert sample balance sheet data for testing
INSERT INTO public.balance_sheet (
  user_id,
  date,
  details,
  debit,
  credit,
  balance,
  type,
  reference,
  transaction_id
) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  '2025-10-01',
  'Initial Balance',
  0.00,
  0.00,
  1829.44,
  'Initial',
  'SYS-001',
  'initial-balance-001'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '2025-11-27',
  'Payment #1078717 Apple Pay',
  1829.44,
  0.00,
  0.00,
  'Payment',
  'PAY-1078717',
  'txn-1078717'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '2025-11-26',
  'Store Credit Applied',
  0.00,
  250.00,
  250.00,
  'Credit',
  'CRD-20251126',
  'txn-20251126-credit'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '2025-11-25',
  'Purchase - iPhone Parts',
  189.99,
  0.00,
  60.01,
  'Purchase',
  'ORD-1078562',
  'txn-1078562'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '2025-11-24',
  'Refund - Order #1078563',
  0.00,
  45.67,
  249.68,
  'Refund',
  'REF-1078563',
  'txn-1078563-refund'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '2025-11-23',
  'Bulk Purchase Discount',
  0.00,
  125.00,
  203.68,
  'Discount',
  'DSC-20251123',
  'txn-discount-20251123'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '2025-11-22',
  'Equipment Purchase',
  299.99,
  0.00,
  78.69,
  'Purchase',
  'ORD-1078550',
  'txn-1078550'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '2025-11-21',
  'Service Fee Adjustment',
  15.00,
  0.00,
  378.68,
  'Fee',
  'FEE-20251121',
  'txn-fee-20251121'
)
ON CONFLICT (transaction_id) DO NOTHING;

-- =============================================================================
-- Migration Tracking
-- =============================================================================

-- Record this migration in the supabase_migrations table
INSERT INTO public.supabase_migrations (migration_name, checksum)
VALUES ('015_balance_sheet', 'balance_sheet_table_v1')
ON CONFLICT (migration_name) DO NOTHING;
