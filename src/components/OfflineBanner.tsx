'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    // Force a page reload to check connectivity
    window.location.reload();
  };

  if (!showBanner) return null;

  return (
    <Alert className="fixed top-0 left-0 right-0 z-50 border-yellow-200 bg-yellow-50 rounded-none">
      <WifiOff className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-800">
            You're currently offline. Some features may not be available.
          </span>
        </div>
        <Button
          onClick={handleRetry}
          variant="outline"
          size="sm"
          className="ml-4 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}
