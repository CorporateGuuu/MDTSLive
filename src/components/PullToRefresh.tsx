'use client';

import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY !== 0 || isRefreshing) return;

      currentY = e.touches[0].clientY;
      const distance = currentY - startY;

      if (distance > 0) {
        setPullDistance(Math.min(distance / 3, 120));
        setIsPulling(true);
        e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > 80 && !isRefreshing) {
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
      }
      setPullDistance(0);
      setIsPulling(false);
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing, onRefresh]);

  return (
    <div className="relative min-h-screen">
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-center transition-all duration-300 pointer-events-none"
        style={{ transform: `translateY(${pullDistance - 100}px)` }}
      >
        <div className={`mt-16 transition-transform duration-500 ${isRefreshing ? 'rotate-360' : ''}`}>
          <RefreshCw className={`h-8 w-8 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
        </div>
      </div>

      {children}
    </div>
  );
}
