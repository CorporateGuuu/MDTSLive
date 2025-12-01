'use client';

import { useEffect } from 'react';

export default function NonCriticalCSS() {
  useEffect(() => {
    // Load non-critical CSS asynchronously
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/styles/non-critical.css';
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };

    document.head.appendChild(link);

    // Cleanup function
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return null;
}
