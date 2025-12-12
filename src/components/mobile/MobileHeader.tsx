'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../stores/cartStore';
import { Badge } from '../ui/badge';
import CartDrawer from '../CartDrawer';

export default function MobileHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between">
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-black text-sky-500 tracking-tight">MIDAS</span>
            <span className="text-xl font-black text-gray-900 tracking-tight ml-1">TECHHUB</span>
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {itemCount > 0 && (
              <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 min-w-[18px] h-5">
                {itemCount}
              </Badge>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <span className="text-lg font-bold text-gray-900">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* User Section */}
              <div className="p-4 border-b border-gray-200">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name || user.email}</p>
                      <p className="text-sm text-gray-500">Welcome back!</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-sky-500/25 transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Login / Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-4">
                  <div className="space-y-2">
                    <Link
                      href="/"
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      href="/products"
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      href="/cart"
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Cart ({itemCount})
                    </Link>
                    {user && (
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    )}
                  </div>

                  {/* Categories Section */}
                  <div className="mt-6">
                    <h3 className="px-4 text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                      Categories
                    </h3>
                    <div className="space-y-1">
                      <Link href="/parts/apple" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Apple Parts</Link>
                      <Link href="/parts/samsung" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Samsung Parts</Link>
                      <Link href="/parts/accessories" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Accessories</Link>
                      <Link href="/parts/tools-&-supplies" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Tools & Supplies</Link>
                      <Link href="/parts/refurbishing" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Refurbishing</Link>
                    </div>
                  </div>
                </nav>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-200">
                {user && (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
