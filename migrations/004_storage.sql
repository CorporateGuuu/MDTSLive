-- =============================================================================
-- Nexus Tech Hub - Storage Buckets and Policies
-- =============================================================================
-- This migration creates Supabase Storage buckets and policies for file uploads
-- Run this after the main schema migration

-- =============================================================================
-- Create Storage Buckets
-- =============================================================================

-- Create 'products' bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true, -- Public bucket for product images
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] -- Allowed image types
)
ON CONFLICT (id) DO NOTHING;

-- Create 'avatars' bucket for user profile images (if needed)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Public bucket for profile images
  2097152, -- 2MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] -- Allowed image types
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Storage Policies for 'products' Bucket
-- =============================================================================

-- Allow public read access to product images (for displaying on website)
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Allow authenticated users to upload product images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
  AND (auth.jwt() ->> 'role' = 'admin' OR auth.uid()::text = (storage.foldername(name))[1])
);

-- Allow authenticated users to update their own product images
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
  AND (auth.jwt() ->> 'role' = 'admin' OR auth.uid()::text = (storage.foldername(name))[1])
)
WITH CHECK (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
  AND (auth.jwt() ->> 'role' = 'admin' OR auth.uid()::text = (storage.foldername(name))[1])
);

-- Allow authenticated users to delete their own product images
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
  AND (auth.jwt() ->> 'role' = 'admin' OR auth.uid()::text = (storage.foldername(name))[1])
);

-- =============================================================================
-- Storage Policies for 'avatars' Bucket
-- =============================================================================

-- Allow public read access to avatar images
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================================================
-- Helper Functions (Optional)
-- =============================================================================

-- Function to get storage object URL
CREATE OR REPLACE FUNCTION storage.get_object_url(bucket_name text, object_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  project_url text;
BEGIN
  -- Get the project URL from settings (this is a simplified version)
  -- In production, you might want to store this in a config table
  project_url := 'https://' || split_part(current_setting('app.settings.supabase_url', '/'), '//', 2);

  RETURN project_url || '/storage/v1/object/public/' || bucket_name || '/' || object_name;
END;
$$;

-- =============================================================================
-- Migration Tracking
-- =============================================================================

-- Record this migration in the supabase_migrations table
INSERT INTO public.supabase_migrations (migration_name, checksum)
VALUES ('004_storage', 'storage_buckets_and_policies_v1')
ON CONFLICT (migration_name) DO NOTHING;
