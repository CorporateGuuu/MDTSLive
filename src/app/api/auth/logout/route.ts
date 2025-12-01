import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseClient';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Get the current session token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (token) {
      // Sign out using the service role client
      const { error } = await supabaseAdmin.auth.signOut();

      if (error) {
        console.error('Logout error:', error);
        // Don't fail the logout if there's an error, just log it
      }
    }

    // Clear the auth cookie regardless
    cookieStore.set('supabase-auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return NextResponse.json({
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
