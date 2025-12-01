'use client';

import { useState } from 'react';
import { supabase } from 'lib/supabase';
import { Fingerprint, Loader2 } from 'lucide-react';

export default function PasskeyAuth({ mode = 'login' }: { mode?: 'login' | 'register' }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handlePasskey = async () => {
    setLoading(true);

    try {
      if (mode === 'register' && email) {
        // Step 1: Register with email first (required for passkey)
        const { error } = await supabase.auth.signUp({
          email,
          password: crypto.randomUUID(), // dummy password
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      }

      // Step 2: Trigger passkey authentication
      const { error } = await supabase.auth.signInWithPasskey({
        options: {
          // Optional: bind to email (recommended)
          email: mode === 'register' ? email : undefined,
        },
      });

      if (error) throw error;

      alert(
        mode === 'register'
          ? 'Passkey registered! You can now login with biometrics'
          : 'Login successful with passkey!'
      );
    } catch (err: any) {
      alert(err.message || 'Passkey not supported on this device');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {mode === 'register' && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com (required for first-time setup)"
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-6 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
          required
        />
      )}

      <button
        onClick={handlePasskey}
        disabled={loading || (mode === 'register' && !email)}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xl py-6 rounded-2xl shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 disabled:opacity-70 flex items-center justify-center gap-4"
      >
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : (
          <Fingerprint className="w-8 h-8" />
        )}
        {loading
          ? 'Setting up passkey...'
          : mode === 'register'
          ? 'REGISTER WITH FACE ID / TOUCH ID'
          : 'LOGIN WITH BIOMETRICS'}
      </button>
    </div>
  );
}
