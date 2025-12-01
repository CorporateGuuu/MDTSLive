# Nexus Tech Hub - Storage Setup Guide

This guide explains how to set up Supabase Storage buckets and policies for the Nexus Tech Hub application.

## Overview

The application uses Supabase Storage for:
- **Product Images**: Public bucket for product photos (5MB limit)
- **User Avatars**: Public bucket for profile pictures (2MB limit)

## Quick Setup

### 1. Run the Storage Setup Script

```bash
npm run storage:setup
```

This script will:
- ✅ Check for existing buckets
- ✅ Create missing buckets with proper configuration
- ✅ Provide instructions for manual policy setup

### 2. Manual Policy Setup (Required)

After running the script, you need to manually create storage policies in Supabase Dashboard:

1. Go to **Supabase Dashboard > Storage**
2. Verify buckets `products` and `avatars` exist
3. Go to **Policies** tab for each bucket
4. Copy and execute the `CREATE POLICY` statements from `migrations/004_storage.sql`

### 3. Test File Upload

```bash
# Test the upload endpoint
curl -X POST http://localhost:3000/api/upload-signed-url \
  -H "Content-Type: application/json" \
  -H "Cookie: supabase-auth-token=YOUR_JWT_TOKEN" \
  -d '{"fileName": "test-image.jpg", "bucket": "products"}'
```

## Storage Buckets

### Products Bucket
- **Name**: `products`
- **Public**: Yes (images displayed on website)
- **File Size Limit**: 5MB
- **Allowed Types**: `image/jpeg`, `image/png`, `image/webp`

### Avatars Bucket
- **Name**: `avatars`
- **Public**: Yes (profile images)
- **File Size Limit**: 2MB
- **Allowed Types**: `image/jpeg`, `image/png`, `image/webp`

## Security Policies

### Products Bucket Policies

**Public Read Access:**
```sql
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');
```

**Authenticated Upload (Admin or Owner):**
```sql
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
  AND (auth.jwt() ->> 'role' = 'admin' OR auth.uid()::text = (storage.foldername(name))[1])
);
```

**Update/Delete (Admin or Owner):**
```sql
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
```

### Avatars Bucket Policies

**Public Read Access:**
```sql
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

**Owner-Only Operations:**
```sql
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## File Naming Convention

Files are automatically named using timestamp + random string:
```
{timestamp}-{randomString}.{extension}
```

Example: `1730582400000-abc123def.jpg`

## API Integration

### Get Signed Upload URL

```javascript
const response = await fetch('/api/upload-signed-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    fileName: 'product-image.jpg',
    bucket: 'products'
  })
});

const { signedUrl, publicUrl } = await response.json();
```

### Upload File

```javascript
await fetch(signedUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type }
});
```

## Troubleshooting

### Bucket Creation Fails
- Check Supabase service role key permissions
- Verify environment variables are set correctly
- Try creating buckets manually in Supabase Dashboard

### Policy Errors
- Ensure you're using the correct Supabase project
- Check that the service role has policy creation permissions
- Verify policy syntax in the SQL file

### Upload Fails
- Check file size limits (5MB for products, 2MB for avatars)
- Verify file type is allowed
- Ensure user is authenticated
- Check storage policies are applied correctly

## Migration Tracking

This setup is tracked in the `supabase_migrations` table with migration name `004_storage`.

## Next Steps

After storage setup:
1. Test file uploads using the ImageUploader component
2. Verify images display correctly in product listings
3. Check avatar uploads in user profiles
4. Monitor storage usage in Supabase Dashboard
