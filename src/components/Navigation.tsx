'use client';
import { useState } from 'react';

const navItems = [
  'Apple', 'Samsung', 'Motorola', 'Google', 'Other Parts', 'Game Console',
  'Accessories', 'Tools & Supplies', 'Refurbishing', 'Board Components',
  { name: 'Pre-Owned Devices', href: '/pre-owned-devices' }
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-50 py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2"
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>

        <ul className={`lg:flex lg:static absolute lg:bg-transparent bg-white lg:shadow-none shadow-lg lg:max-h-full transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-96' : 'max-h-0 overflow-hidden'
        }`}>
          {navItems.map((item, index) => (
            <li key={index} className="w-full lg:w-auto">
              <a
                href={typeof item === 'object' ? item.href : `#${item.toLowerCase()}`}
                className="block text-gray-700 font-semibold text-sm py-2 px-4 hover:text-blue-600 transition-colors"
              >
                {typeof item === 'object' ? item.name : item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
