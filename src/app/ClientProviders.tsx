'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';

// Lazy load third-party components - only load when needed
// Note: WebVitals and ChatBot components would need to be created
// const WebVitals = React.lazy(() =>
//   import('../components/WebVitals')
// );
// const ChatBot = React.lazy(() =>
//   import('../components/ChatBot')
// );

function ThirdPartyProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [loadThirdParty, setLoadThirdParty] = useState(false);

  useEffect(() => {
    // Defer third-party loading until after hydration and user interaction
    const timer = setTimeout(() => setMounted(true), 100);

    // Load third-party scripts after initial page load
    const loadTimer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => setLoadThirdParty(true), { timeout: 3000 });
      } else {
        setTimeout(() => setLoadThirdParty(true), 2000);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(loadTimer);
    };
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<>{children}</>}>
      {children}
      {/* Only load third-party components when idle */}
      {/* {loadThirdParty && <WebVitals />} */}
      {loadThirdParty && <ChatBotFacade />}
    </Suspense>
  );
}

// Facade component for ChatBot - shows placeholder until loaded
function ChatBotFacade() {
  const [showChatBot, setShowChatBot] = useState(false);

  useEffect(() => {
    // Load ChatBot when user interacts or after delay
    const handleInteraction = () => {
      setShowChatBot(true);
    };

    // Listen for user interactions that indicate interest in chat
    const handleMouseMove = (e: MouseEvent) => {
      // Load if mouse is near bottom right (typical chat position)
      if (e.clientX > window.innerWidth - 200 && e.clientY > window.innerHeight - 200) {
        handleInteraction();
      }
    };

    const handleScroll = () => {
      // Load if user scrolls near bottom of page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        handleInteraction();
      }
    };

    // Auto-load after user has been on page for a while
    const autoLoadTimer = setTimeout(() => {
      setShowChatBot(true);
    }, 10000); // 10 seconds

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(autoLoadTimer);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (showChatBot) {
    // ChatBot component would be loaded here
    return null;
  }

  // Facade placeholder - looks like a chat widget but loads fast
  // Reserves exact same space to prevent layout shifts
  return (
    <button
      className="chat-facade"
      onClick={() => setShowChatBot(true)}
      aria-label="Open customer support chat"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        backgroundColor: '#10b981',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        border: 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Only animate composited properties
        willChange: 'transform, box-shadow', // GPU acceleration hint
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.transform = 'scale(1.1)';
        (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.transform = 'scale(1)';
        (e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.05 1.05 4.42L2 22l5.58-1.05C9.95 21.64 11.46 22 13 22h7c1.1 0 2-.9 2-2V12c0-5.52-4.48-10-10-10z"/>
        <circle cx="8" cy="12" r="1"/>
        <circle cx="12" cy="12" r="1"/>
        <circle cx="16" cy="12" r="1"/>
      </svg>
    </button>
  );
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure lang attribute is set on document element (fallback for _document.js)
    if (typeof document !== 'undefined' && !document.documentElement.lang) {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    }

    // Defer non-critical JavaScript execution to reduce initial load time
    const deferNonCriticalJS = () => {
      // Use requestIdleCallback for better performance
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Register service worker during idle time
          if (navigator.serviceWorker) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
              // Silently fail if SW registration fails
            });
          }

          // Defer any other non-critical initialization
        }, { timeout: 8000 }); // 8 second timeout
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          if (navigator.serviceWorker) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
          }
        }, 3000);
      }
    };

    deferNonCriticalJS();
  }, []);

  return (
    <SessionProvider>
      <ThirdPartyProviders>{children}</ThirdPartyProviders>
    </SessionProvider>
  );
}
