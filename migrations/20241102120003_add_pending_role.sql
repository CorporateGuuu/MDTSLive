-- Migration: 20241102120003_add_pending_role
-- Description: Add 'pending' role to the profiles table role constraint

-- Drop the existing check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add the new check constraint with 'pending' role
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('customer', 'admin', 'wholesale', 'pending'));
