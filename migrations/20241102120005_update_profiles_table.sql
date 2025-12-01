-- Migration: 20241102120005_update_profiles_table
-- Description: Update profiles table to match new specification with full_name and role constraints

-- Rename name column to full_name if it exists
ALTER TABLE public.profiles RENAME COLUMN name TO full_name;

-- Add role column if it doesn't exist (it should exist from previous migration)
-- Update role check constraint to match new specification
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('pending', 'approved', 'admin'));

-- Ensure role defaults to 'pending' and is NOT NULL
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'pending';
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;

-- Update any existing roles that don't match the new constraint
UPDATE public.profiles SET role = 'pending' WHERE role NOT IN ('pending', 'approved', 'admin');

-- Update the trigger function to use full_name and phone from raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'fullName', NEW.raw_user_meta_data->>'phone', 'pending');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
