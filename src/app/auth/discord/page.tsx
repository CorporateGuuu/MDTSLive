'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { MessageSquare, CheckCircle } from 'lucide-react';

export default function DiscordAuthPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDiscordLogin = () => {
    setIsLoading(true);

    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || `${window.location.origin}/auth/discord/callback`;

    if (!clientId) {
      console.error('Discord Client ID not configured');
      setIsLoading(false);
      return;
    }

    // Discord OAuth2 URL
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?${new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify guilds.join',
      state: 'guild_join', // You can use this to track the flow
    })}`;

    // Redirect to Discord OAuth
    window.location.href = discordAuthUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Join Our Discord Server
          </h1>
          <p className="text-gray-600 mb-6">
            Connect your Discord account to join our community server and get access to exclusive content,
            support channels, and member-only features.
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Access to community support channels</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Exclusive member-only content</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Direct communication with our team</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Early access to new features</span>
            </div>
          </div>

          <Button
            onClick={handleDiscordLogin}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                Connect Discord Account
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            By connecting your Discord account, you agree to join our server and abide by our community guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
