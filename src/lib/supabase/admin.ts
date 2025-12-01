import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';

// =============================================================================
// Nexus Tech Hub - Supabase Admin Client
// =============================================================================
// This client is specifically for seeding, migrations, and admin operations
// that require bypassing RLS policies completely.

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Admin client with service role key for admin operations
// This client has full access to all data and bypasses all RLS policies
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// =============================================================================
// Admin Utility Functions
// =============================================================================

/**
 * Check if the admin client can connect to the database
 */
export async function testAdminConnection() {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('count')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Get database health status
 */
export async function getDatabaseHealth() {
  try {
    // Test basic connectivity
    const { data: version, error: versionError } = await supabaseAdmin.rpc('version');

    if (versionError) {
      throw versionError;
    }

    // Test table access
    const { count: userCount, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (userError) {
      throw userError;
    }

    return {
      status: 'healthy',
      version: version || 'unknown',
      userCount: userCount || 0,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Upload a file to Supabase Storage and return the public URL
 */
export async function uploadFileToStorage(
  file: File,
  bucket: 'products' | 'avatars' = 'products'
): Promise<string> {
  try {
    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;

    // Get signed upload URL
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(fileName, {
        upsert: false, // Don't allow overwriting existing files
      });

    if (uploadError) {
      throw new Error(`Failed to get upload URL: ${uploadError.message}`);
    }

    // Upload file to signed URL
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('PUT', uploadData.signedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

/**
 * Clean up test data (use with caution!)
 */
export async function cleanupTestData() {
  console.warn('🧹 Cleaning up test data...');

  try {
    // Delete test cart items
    await supabaseAdmin
      .from('cart_items')
      .delete()
      .ilike('user_id', 'test%');

    // Delete test profiles
    await supabaseAdmin
      .from('profiles')
      .delete()
      .ilike('email', 'test%');

    // Delete test users from auth
    // Note: This requires direct access to auth.users which may not be available
    // depending on your Supabase configuration

    console.log('✅ Test data cleanup completed');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}
