import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../types/supabase';

// =============================================================================
// Midas Technical Solutions - Supabase Client Configuration (Next.js Auth Helpers)
// =============================================================================

// -----------------------------------------------------------------------------
// Browser Client (for client-side operations)
// -----------------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Browser client using Next.js auth helpers for proper SSR and auth handling
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// For compatibility with existing code that expects createClient()
export const createClient = () => supabase;

// -----------------------------------------------------------------------------
// Server Client (for server-side operations)
// -----------------------------------------------------------------------------
// Note: Use supabaseAdmin from './supabase/admin' for admin operations
// or supabaseServer from './supabase/server' for server operations

// Re-export for backward compatibility
export { supabaseAdmin } from './supabase/admin';

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------

/**
 * Get the current user's session (client-side)
 */
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
};

/**
 * Get the current user (client-side)
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// -----------------------------------------------------------------------------
// Type Exports
// -----------------------------------------------------------------------------
export type { Database } from './supabase';
