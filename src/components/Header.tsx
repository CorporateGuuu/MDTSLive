'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogIn, LogOut, Menu, ShoppingCart } from 'lucide-react';
import { useAuth } from 'hooks/useAuth';
import { useCart } from '../stores/cartStore';
import { Badge } from './ui/badge';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount, subtotal } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black text-white tracking-tighter">
          NEXUS TECHHUB
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Mini Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 text-white hover:text-cyan-300 transition relative"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 min-w-[20px] h-5">
                {itemCount}
              </Badge>
            )}
            <span className="text-sm font-medium">${subtotal.toFixed(2)}</span>
          </button>

          {user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {user.email[0].toUpperCase()}
                </div>
                <span className="text-white font-medium">{user.name || user.email}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="group flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 text-sm"
            >
              <LogIn className="w-4 h-4 group-hover:translate-x-1 transition" />
              LOGIN
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-8 h-8" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
          <div className="px-6 py-8 flex flex-col gap-6">
            {user ? (
              <>
                <div className="text-white font-bold py-4 border-t border-white/10">
                  Hello, {user.name || user.email}
                </div>
                <button onClick={logout} className="text-red-400 text-xl">Logout</button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl px-8 py-5 rounded-2xl text-center"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
