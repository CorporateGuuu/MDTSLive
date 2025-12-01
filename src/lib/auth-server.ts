import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabaseClient';
import { AuthError } from './errors';

// =============================================================================
// Midas Technical Solutions - Cookie-based Authentication Utilities
// =============================================================================

/**
 * Get user from Supabase auth token in cookies
 */
export async function getUserFromCookie() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      throw new AuthError('No authentication token provided');
    }

    // Verify the session using the service role client
    const { data: { user }, error: sessionError } = await supabaseAdmin.auth.getUser(token);

    if (sessionError || !user) {
      throw new AuthError('Invalid or expired session');
    }

    return user;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Authentication failed');
  }
}

/**
 * Get user profile with role information
 */
export async function getUserProfile(userId: string) {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new AuthError('Failed to fetch user profile');
  }

  return profile;
}

/**
 * Check if user has admin role
 */
export async function requireAdmin(userId: string) {
  const profile = await getUserProfile(userId);

  if (profile.role !== 'admin') {
    throw new AuthError('Admin access required', 403);
  }

  return profile;
}

/**
 * Set Supabase session cookie
 */
export async function setSessionCookie(accessToken: string, refreshToken?: string) {
  const cookieStore = cookies();

  // Set the access token cookie
  cookieStore.set('supabase-auth-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  // Optionally set refresh token if provided
  if (refreshToken) {
    cookieStore.set('supabase-refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
  }
}

/**
 * Clear authentication cookies
 */
export async function clearSessionCookies() {
  const cookieStore = cookies();

  cookieStore.set('supabase-auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  cookieStore.set('supabase-refresh-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Create a new user session and set cookies
 */
export async function createUserSession(email: string, password: string) {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new AuthError('Invalid credentials');
  }

  if (data.session) {
    await setSessionCookie(
      data.session.access_token,
      data.session.refresh_token
    );
  }

  return data;
}

/**
 * Sign up a new user
 */
export async function signUpUser(email: string, password: string, userData?: any) {
  const { data, error } = await supabaseAdmin.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });

  if (error) {
    throw new AuthError(error.message);
  }

  return data;
}

// =============================================================================
// Legacy NextAuth Support (for backward compatibility)
// =============================================================================

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from './supabaseClient';
import * as bcrypt from 'bcryptjs';

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo-client-secret',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Query user from Supabase
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single();

          if (error || !user) return null;

          // For demo purposes, we're using bcrypt to compare passwords
          // In production, Supabase Auth handles this automatically
          const isValid = await bcrypt.compare(credentials.password, user.password || '');
          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            wholesaleApproved: user.wholesale_approved,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.wholesaleApproved = user.wholesale_approved;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.role = token.role;
      session.user.wholesaleApproved = token.wholesale_approved;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'demo-secret-key-change-in-production',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
