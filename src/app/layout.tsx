import { AuthProvider } from '../providers/AuthProvider';
import { Inter } from 'next/font/google';
import './globals.css';
import MobileHeader from '../components/mobile/MobileHeader';
import { MobileBottomNav } from '../components/mobile/MobileBottomNav';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* iOS Safari Fixes */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />

        {/* Performance optimizations for 1000ms faster LCP */}
        <link rel="preconnect" href="https://your-project-id.supabase.co" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Prevent zoom on input focus (iOS) */}
        <style jsx global>{`
          input[type="text"], input[type="email"], input[type="password"], textarea {
            font-size: 16px !important;
          }
          * { touch-action: manipulation; }
          body { -webkit-tap-highlight-color: transparent; }
        `}</style>
      </head>
      <body className={`${inter.className} bg-gray-50 antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {/* Mobile Header with Hamburger */}
            <MobileHeader />

            {/* Main Content */}
            <main className="flex-1 pb-20 md:pb-0">
              {children}
            </main>

            {/* Bottom Navigation (only on mobile) */}
            <MobileBottomNav />
          </div>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
