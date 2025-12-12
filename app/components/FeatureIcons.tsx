'use client';

import React from 'react';

// Genuine Parts Icon - Shielded phone chip
export const GenuinePartsIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="200" cy="200" r="180" stroke="#FFD700" strokeWidth="8" fill="transparent"/>
    <rect x="160" y="160" width="80" height="80" rx="8" stroke="#FFD700" strokeWidth="6" fill="transparent"/>
    <circle cx="180" cy="180" r="6" fill="#FFD700"/>
    <circle cx="220" cy="180" r="6" fill="#FFD700"/>
    <circle cx="200" cy="200" r="6" fill="#FFD700"/>
    <circle cx="180" cy="220" r="6" fill="#FFD700"/>
    <circle cx="220" cy="220" r="6" fill="#FFD700"/>
    <path d="M140 140 L140 120 L160 120" stroke="#FFD700" strokeWidth="6" strokeLinecap="round"/>
    <path d="M260 140 L260 120 L240 120" stroke="#FFD700" strokeWidth="6" strokeLinecap="round"/>
  </svg>
);

// Lifetime Warranty Icon - Eternal loop on battery
export const LifetimeWarrantyIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="120" y="160" width="160" height="80" rx="12" stroke="#FFD700" strokeWidth="8" fill="transparent"/>
    <rect x="140" y="180" width="120" height="8" fill="#FFD700"/>
    <circle cx="160" cy="200" r="4" fill="#FFD700"/>
    <circle cx="240" cy="200" r="4" fill="#FFD700"/>
    <path d="M200 120 C240 120 260 140 260 180" stroke="#FFD700" strokeWidth="8" strokeLinecap="round" fill="transparent"/>
    <path d="M260 220 C260 260 240 280 200 280" stroke="#FFD700" strokeWidth="8" strokeLinecap="round" fill="transparent"/>
    <path d="M140 180 C140 140 160 120 200 120" stroke="#FFD700" strokeWidth="8" strokeLinecap="round" fill="transparent"/>
    <path d="M200 280 C160 280 140 260 140 220" stroke="#FFD700" strokeWidth="8" strokeLinecap="round" fill="transparent"/>
  </svg>
);

// Pre-Owned Devices Icon - Refurb arrow on tablet
export const PreOwnedDevicesIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="140" y="120" width="120" height="160" rx="12" stroke="#FFD700" strokeWidth="8" fill="transparent"/>
    <circle cx="200" cy="145" r="6" fill="#FFD700"/>
    <rect x="170" y="165" width="60" height="4" fill="#FFD700"/>
    <rect x="170" y="175" width="40" height="4" fill="#FFD700"/>
    <rect x="170" y="185" width="50" height="4" fill="#FFD700"/>
    <rect x="170" y="195" width="35" height="4" fill="#FFD700"/>
    <circle cx="200" cy="240" r="8" stroke="#FFD700" strokeWidth="6" fill="transparent"/>
    <path d="M185 225 L200 210 L215 225" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="transparent"/>
    <path d="M200 210 L200 235" stroke="#FFD700" strokeWidth="6" strokeLinecap="round"/>
  </svg>
);

// Secure IT Gateways Icon - Lock + cart
export const SecureITGatewaysIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Lock */}
    <rect x="160" y="180" width="80" height="60" rx="8" stroke="#FFD700" strokeWidth="6" fill="transparent"/>
    <path d="M180 180 C180 170 190 160 200 160 C210 160 220 170 220 180" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" fill="transparent"/>
    <circle cx="200" cy="200" r="4" fill="#FFD700"/>
    <rect x="195" y="210" width="10" height="20" fill="#FFD700"/>
    {/* Shopping Cart */}
    <circle cx="280" cy="240" r="12" stroke="#FFD700" strokeWidth="6" fill="transparent"/>
    <circle cx="320" cy="240" r="12" stroke="#FFD700" strokeWidth="6" fill="transparent"/>
    <rect x="260" y="220" width="80" height="8" fill="#FFD700"/>
    <rect x="270" y="190" width="8" height="30" fill="#FFD700"/>
    <path d="M270 190 L285 205 L300 190" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="transparent"/>
  </svg>
);

// Fast Web Hosting Icon - Speedy server
export const FastWebHostingIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Server Rack */}
    <rect x="140" y="140" width="120" height="120" rx="8" stroke="#FFD700" strokeWidth="8" fill="transparent"/>
    <rect x="160" y="160" width="80" height="8" fill="#FFD700"/>
    <rect x="160" y="180" width="80" height="8" fill="#FFD700"/>
    <rect x="160" y="200" width="80" height="8" fill="#FFD700"/>
    <circle cx="170" cy="170" r="3" fill="#007BFF"/>
    <circle cx="190" cy="170" r="3" fill="#007BFF"/>
    <circle cx="210" cy="170" r="3" fill="#007BFF"/>
    {/* Speed Lines */}
    <path d="M280 120 L300 100" stroke="#FFD700" strokeWidth="6" strokeLinecap="round"/>
    <path d="M290 130 L310 110" stroke="#FFD700" strokeWidth="6" strokeLinecap="round"/>
    <path d="M280 140 L300 160" stroke="#FFD700" strokeWidth="6" strokeLinecap="round"/>
    <circle cx="320" cy="130" r="8" stroke="#FFD700" strokeWidth="6" fill="transparent"/>
    <path d="M315 130 L325 130" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
    <path d="M320 125 L320 135" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

// Wholesale Delivery Icon - USA delivery truck
export const WholesaleDeliveryIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Truck Body */}
    <rect x="120" y="160" width="140" height="80" rx="8" stroke="#FFD700" strokeWidth="8" fill="transparent"/>
    <rect x="260" y="180" width="60" height="60" rx="8" stroke="#FFD700" strokeWidth="8" fill="transparent"/>
    {/* Wheels */}
    <circle cx="160" cy="260" r="20" stroke="#FFD700" strokeWidth="8" fill="transparent"/>
    <circle cx="240" cy="260" r="20" stroke="#FFD700" strokeWidth="8" fill="transparent"/>
    <circle cx="300" cy="260" r="20" stroke="#FFD700" strokeWidth="8" fill="transparent"/>
    {/* USA Star */}
    <path d="M140 140 L145 150 L155 150 L148 157 L151 167 L140 161 L129 167 L132 157 L125 150 L135 150 Z" fill="#FFD700"/>
    {/* Delivery boxes */}
    <rect x="130" y="170" width="20" height="15" stroke="#FFD700" strokeWidth="4" fill="transparent"/>
    <rect x="155" y="170" width="20" height="15" stroke="#FFD700" strokeWidth="4" fill="transparent"/>
    <rect x="180" y="170" width="20" height="15" stroke="#FFD700" strokeWidth="4" fill="transparent"/>
  </svg>
);

// Export all icons as an array for easy iteration
export const featureIcons = [
  { component: GenuinePartsIcon, title: 'Genuine Parts' },
  { component: LifetimeWarrantyIcon, title: 'Lifetime Warranty' },
  { component: PreOwnedDevicesIcon, title: 'Pre-Owned Devices' },
  { component: SecureITGatewaysIcon, title: 'Secure IT Gateways' },
  { component: FastWebHostingIcon, title: 'Fast Web Hosting' },
  { component: WholesaleDeliveryIcon, title: 'Wholesale Delivery' },
];
