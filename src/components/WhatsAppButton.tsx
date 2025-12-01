'use client';

import { useEffect } from 'react';

export default function WhatsAppButton() {
  const phoneNumber = "971585531029";
  const message = "Hi Nexus TechHub Team! 👋\n\nI'm interested in bulk pricing for iPhone OLED screens and pre-owned devices.\nCan you send me your latest wholesale catalog and MOQ?\n\nThanks!";

  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: 'Floating WhatsApp Button'
      });
    }
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      {/* Floating WhatsApp Button – FULLY ACCESSIBLE */}
      <div
        className="fixed bottom-6 left-6 z-50 group"
        role="region"
        aria-label="WhatsApp Support"
      >
        <button
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          aria-label="Open WhatsApp chat with Nexus TechHub support. Average reply time under 2 minutes."
          aria-describedby="whatsapp-tooltip"
          className="flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-2xl hover:shadow-green-600/60 focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-4 focus:ring-offset-gray-900 transform hover:scale-110 transition-all duration-300 relative"
          type="button"
        >
          {/* WhatsApp Icon – Accessible */}
          <span aria-hidden="true">
            <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.485z"/>
            </svg>
          </span>

          {/* Online Status Indicator */}
          <span
            className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-4 border-gray-950 animate-pulse"
            aria-hidden="true"
          />

          {/* Pulse Ring */}
          <span
            className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-70"
            aria-hidden="true"
          />
        </button>

        {/* Accessible Tooltip (visible on focus too) */}
        <div
          id="whatsapp-tooltip"
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-5 py-3 bg-gray-900 text-white text-sm rounded-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition pointer-events-none shadow-2xl"
        >
          <div className="font-bold">WhatsApp Support</div>
          <div className="text-xs text-gray-400">Average reply: less than 2 minutes</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900" aria-hidden="true" />
        </div>
      </div>

      {/* Reduced Motion Support */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
