import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Check user role for appropriate redirect
  const { data: { user } } = await supabase.auth.getUser();

  let redirectTo = '/my-account'; // Default for regular users

  if (user?.user_metadata?.role === 'admin') {
    redirectTo = '/admin';
  }

  // Allow override via query parameter for specific redirects
  const queryRedirect = requestUrl.searchParams.get('redirect');
  if (queryRedirect) {
    redirectTo = queryRedirect;
  }

  return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);
}
