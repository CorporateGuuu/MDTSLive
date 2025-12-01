'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '../../../../components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { joinDiscordGuild } from '../../../../actions/discord/join-guild';

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
}

export default function DiscordCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<DiscordUser | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      if (error) {
        setStatus('error');
        setMessage(`Authentication failed: ${error}`);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received');
        return;
      }

      try {
        // Exchange code for access token
        const tokenResponse = await fetch('/api/auth/discord/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json();
        const { access_token } = tokenData;

        // Get user info
        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userData: DiscordUser = await userResponse.json();
        setUser(userData);

        // Extract guild ID from state or use default
        const guildId = state || process.env.NEXT_PUBLIC_DISCORD_GUILD_ID || 'YOUR_GUILD_ID';

        // Join the guild
        const result = await joinDiscordGuild({
          accessToken: access_token,
          userId: userData.id,
          guildId,
        });

        if (result.success) {
          setStatus('success');
          setMessage(result.message);
        } else {
          setStatus('error');
          setMessage(result.message);
        }

      } catch (error) {
        console.error('Discord callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    };

    handleCallback();
  }, [searchParams]);

  const handleContinue = () => {
    // Redirect back to the original page or dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Connecting to Discord
            </h1>
            <p className="text-gray-600">
              Please wait while we connect your Discord account...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Successfully Connected!
            </h1>
            {user && (
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Welcome, <span className="font-semibold">{user.username}#{user.discriminator}</span>!
                </p>
                {user.avatar && (
                  <img
                    src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`}
                    alt={`${user.username}'s avatar`}
                    className="w-16 h-16 rounded-full mx-auto mb-2"
                  />
                )}
              </div>
            )}
            <p className="text-gray-600 mb-6">{message}</p>
            <Button onClick={handleContinue} className="w-full">
              Continue to Dashboard
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Connection Failed
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-2">
              <Button onClick={() => router.push('/auth/discord')} variant="outline" className="w-full">
                Try Again
              </Button>
              <Button onClick={handleContinue} variant="ghost" className="w-full">
                Skip for Now
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
