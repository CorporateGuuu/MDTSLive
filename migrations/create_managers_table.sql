-- Migration: create_managers_table
-- Description: Create managers table for district managers

-- Create managers table
CREATE TABLE IF NOT EXISTS public.managers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Manager', 'Viewer')),
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see and manage their own managers
CREATE POLICY "Users can view their own managers" ON public.managers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own managers" ON public.managers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own managers" ON public.managers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own managers" ON public.managers
  FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger
DROP TRIGGER IF EXISTS managers_updated_at ON public.managers;
CREATE TRIGGER managers_updated_at
  BEFORE UPDATE ON public.managers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
