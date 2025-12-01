'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from 'lib/supabase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
      }
    };
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) router.replace('/login');
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return <>{children}</>;
}
