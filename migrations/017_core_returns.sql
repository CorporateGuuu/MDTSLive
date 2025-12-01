-- Migration: 017_core_returns
-- Description: Create core_returns table for Apple GAPP Core Returns Program

-- Create core_returns table
CREATE TABLE IF NOT EXISTS public.core_returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  return_number VARCHAR(50) UNIQUE NOT NULL,
  store_name VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  shipped_date DATE,
  received_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_core_returns_user_id ON public.core_returns(user_id);
CREATE INDEX IF NOT EXISTS idx_core_returns_status ON public.core_returns(status);
CREATE INDEX IF NOT EXISTS idx_core_returns_created_at ON public.core_returns(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.core_returns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own core returns
CREATE POLICY "Users can view own core returns"
  ON public.core_returns FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own core returns
CREATE POLICY "Users can insert own core returns"
  ON public.core_returns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own core returns
CREATE POLICY "Users can update own core returns"
  ON public.core_returns FOR UPDATE
  USING (auth.uid() = user_id);
