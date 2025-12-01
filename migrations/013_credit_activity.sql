-- =============================================================================
-- Nexus Tech Hub - Credit Activity Table
-- =============================================================================
-- This migration creates a credit_activity table for managing user credit/debit
-- transactions and balance tracking

-- =============================================================================
-- Create Credit Activity Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.credit_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  reason TEXT,
  credit DECIMAL(10,2) DEFAULT 0.00,
  debit DECIMAL(10,2) DEFAULT 0.00,
  ledger TEXT,
  transaction_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- Create Indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_credit_activity_user_id ON public.credit_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_activity_date ON public.credit_activity(date);
CREATE INDEX IF NOT EXISTS idx_credit_activity_transaction_id ON public.credit_activity(transaction_id);

-- =============================================================================
-- Create Updated At Trigger
-- =============================================================================

DROP TRIGGER IF EXISTS credit_activity_updated_at ON public.credit_activity;
CREATE TRIGGER credit_activity_updated_at
  BEFORE UPDATE ON public.credit_activity
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- Enable Row Level Security
-- =============================================================================

ALTER TABLE public.credit_activity ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS Policies for Credit Activity
-- =============================================================================

-- Users can view their own credit activity
CREATE POLICY "Users can view their own credit activity"
  ON public.credit_activity FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own credit activity (for future use)
CREATE POLICY "Users can insert their own credit activity"
  ON public.credit_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all credit activity
CREATE POLICY "Admins can view all credit activity"
  ON public.credit_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================================================
-- Insert Sample Data
-- =============================================================================

-- Insert sample credit activity for testing (using a placeholder user_id)
-- In production, replace with actual user IDs
INSERT INTO public.credit_activity (
  user_id,
  date,
  location,
  reason,
  credit,
  debit,
  ledger,
  transaction_id
) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  '2025-11-27',
  'Midas Technical',
  'In order #1078717',
  0.00,
  12.45,
  'ebca62895',
  'ebca62895'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '2025-11-26',
  'Tech Solutions Inc',
  'Return processing fee',
  25.00,
  0.00,
  'abc123def',
  'abc123def'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '2025-11-25',
  'Electronic Parts Co',
  'Store credit applied',
  15.50,
  0.00,
  'xyz789ghi',
  'xyz789ghi'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '2025-11-24',
  'Mobile Repair Hub',
  'Equipment purchase',
  0.00,
  89.99,
  'jkl456mno',
  'jkl456mno'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  '2025-11-23',
  'Parts Warehouse',
  'Bulk discount adjustment',
  5.75,
  0.00,
  'pqr012stu',
  'pqr012stu'
)
ON CONFLICT (transaction_id) DO NOTHING;

-- =============================================================================
-- Migration Tracking
-- =============================================================================

-- Record this migration in the supabase_migrations table
INSERT INTO public.supabase_migrations (migration_name, checksum)
VALUES ('013_credit_activity', 'credit_activity_table_v1')
ON CONFLICT (migration_name) DO NOTHING;
