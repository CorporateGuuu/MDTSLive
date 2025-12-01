'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Global Application Error:', error);

    // Optional: Send to error reporting service
    // captureException(error);
  }, [error]);

  const errorId = error.digest || `GLOBAL-ERR-${Date.now()}`;

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          {/* Global Error Banner */}
          <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-3 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Application Error</p>
                  <p className="text-sm opacity-90">Error ID: {errorId}</p>
                </div>
              </div>
              <Button
                onClick={reset}
                variant="secondary"
                size="sm"
                className="bg-white text-red-600 hover:bg-gray-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload
              </Button>
            </div>
          </div>

          <Card className="w-full max-w-md mt-20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                System Unavailable
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  We're experiencing technical difficulties. Our engineering team has been notified and is working to resolve this issue.
                </AlertDescription>
              </Alert>

              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Error ID:</strong> {errorId}</p>
                <p className="text-xs">
                  This error affects the entire application. Please try refreshing the page or contact support if the issue persists.
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <Button onClick={reset} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Application
                </Button>

                <div className="flex space-x-2">
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Link>
                  </Button>

                  <Button variant="outline" asChild className="flex-1">
                    <a href="mailto:support@nexustechhub.com">
                      <Mail className="w-4 h-4 mr-2" />
                      Support
                    </a>
                  </Button>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center pt-4 border-t">
                Nexus Tech Hub - Professional Device Solutions
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
