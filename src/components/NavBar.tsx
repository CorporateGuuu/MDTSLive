'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';
import { searchProducts } from '../lib/supabase';
import { Product } from '../types';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(7);
  const [cartTotal] = useState('$182.34');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user, logout } = useAuth();

  // Search products when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchProducts(searchQuery.trim());
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const filteredSuggestions = searchResults.map(product => ({
    id: product.id,
    title: product.name,
    category: product.category || 'Parts',
    price: `$${product.price.toFixed(2)}`,
    link: product.slug ? `/products/${product.slug}` : `/products/${product.id}`,
    image: product.image,
    inStock: product.inStock,
    isFeatured: product.isFeatured,
  }));

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <a href="/" className="flex items-center space-x-1 -ml-2 transform hover:scale-105 transition">
              <span className="text-5xl font-black text-sky-500 tracking-tighter">Nexus</span>
              <span className="text-5xl font-black text-gray-900 tracking-tighter">TechHub</span>
            </a>

            {/* LIVE SEARCH WITH SUGGESTIONS */}
            <div className="hidden lg:block relative flex-1 max-w-md mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setShowSuggestions(false);
                    if (e.key === 'Enter' && searchQuery) {
                      // Handle search submission
                      console.log('Search:', searchQuery);
                    }
                  }}
                  className="w-full pl-14 pr-12 py-4 bg-white/90 backdrop-blur border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500 transition-all duration-300 font-medium text-gray-800 placeholder-gray-500"
                />

                <svg className="w-6 h-6 text-sky-600 absolute left-5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>

              {/* LIVE SUGGESTIONS DROPDOWN */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full mt-3 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 transition-all duration-200 ease-out">
                  <div className="py-3">
                    {filteredSuggestions.map((item) => (
                      <a
                        key={item.id}
                        href={item.link}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-sky-50 transition group"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 group-hover:border-sky-400 transition"></div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.category}</div>
                        </div>
                        <span className="text-sky-600 font-bold">{item.price}</span>
                      </a>
                    ))}
                  </div>

                  <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
                    <span className="text-sm text-gray-600">Press Enter to see all results</span>
                    <kbd className="text-xs bg-white px-3 py-1 rounded border">Enter</kbd>
                  </div>
                </div>
              )}
            </div>

            {/* Login Button - Moved to right side of search */}
            <div className="hidden lg:flex items-center ml-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.email[0].toUpperCase()}
                  </div>
                  <span className="text-gray-800 font-medium">{user.name || user.email}</span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition text-sm ml-4"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="group flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                  title="Login / Register"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </Link>
              )}
            </div>

            {/* FedEx and Cart */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="text-purple-600 font-bold">FedEx</div>
              <div className="text-red-600 font-bold animate-pulse">Free Shipping Over $500</div>
              <Link href="/cart" className="relative group">
                <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-4 rounded-2xl flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 7.5M17 13l1.5 7.5"/>
                  </svg>
                  <span className="font-bold text-lg">{cartTotal}</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-black w-8 h-8 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-3 rounded-xl hover:bg-gray-100 transition"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>

        {/* INTERACTIVE NAVIGATION BAR */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-screen-2xl mx-auto px-4">
            <div className="flex justify-center h-16">
              <div className="flex items-center space-x-10 text-sm font-bold">
                {/* Example with active state & animations */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 py-3 text-gray-700 hover:text-sky-600 transition relative after:content-[''] after:absolute after:bottom-[-4px] after:left-1/2 after:w-0 after:h-[3px] after:bg-sky-500 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:after:left-0">
                    Apple
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full animate-pulse">NEW</span>
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  {/* Apple Mega Dropdown - Keep existing */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white rounded-2xl shadow-2xl border border-gray-100 p-10 z-50 w-[90vw] max-w-6xl">
                    <div className="grid grid-cols-5 gap-12 max-w-7xl mx-auto">
                      <div>
                        <h3 className="font-bold mb-4">iPhone 16 Series</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li><Link href="/parts/apple" className="hover:text-sky-600">iPhone Parts</Link></li>
                          <li><a href="#" className="hover:text-sky-600">iPhone 16 Pro Max</a></li>
                          <li><a href="#" className="hover:text-sky-600">iPhone 16 Pro</a></li>
                          <li><a href="#" className="hover:text-sky-600">iPhone 16 Plus</a></li>
                          <li><a href="#" className="hover:text-sky-600">iPhone 16</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold mb-4">iPhone 15 Series</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">iPhone 15 Pro Max</a></li>
                          <li><a href="#" className="hover:text-sky-600">iPhone 15 Pro</a></li>
                          <li><a href="#" className="hover:text-sky-600">iPhone 15 Plus</a></li>
                          <li><a href="#" className="hover:text-sky-600">iPhone 15</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold mb-4">iPad</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">iPad Pro 13" 7th Gen</a></li>
                          <li><a href="#" className="hover:text-sky-600">iPad Pro 12.9" 6th Gen</a></li>
                          <li><a href="#" className="hover:text-sky-600">iPad Air 11"</a></li>
                          <li><a href="#" className="font-medium text-sky-600">View all models →</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold mb-4">Watch</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">Series Ultra 2</a></li>
                          <li><a href="#" className="hover:text-sky-600">Series 10</a></li>
                          <li><a href="#" className="hover:text-sky-600">SE (2024)</a></li>
                          <li><a href="#" className="font-medium text-sky-600">View all →</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold mb-4">MacBook / AirPods</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">MacBook Pro</a></li>
                          <li><a href="#" className="hover:text-sky-600">AirPods Pro 2</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keep all other mega dropdowns exactly as they are */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 py-3 text-gray-800 hover:text-sky-600 transition font-semibold">
                    Accessories
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  {/* Accessories Mega Dropdown - Keep existing */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white rounded-2xl shadow-2xl border border-gray-100 p-10 z-50 w-[90vw] max-w-6xl">
                    <div className="grid grid-cols-6 gap-10 max-w-7xl mx-auto text-sm">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-4">Recently Added</h3>
                        <ul className="space-y-3 text-gray-600">
                          <li className="flex items-center gap-3 bg-red-50 px-3 py-2 rounded-lg">
                            <div className="w-10 h-10 bg-gray-200 border-2 border-dashed rounded"></div>
                            <span className="font-medium text-red-700">Recently Added</span>
                          </li>
                          <li><Link href="/parts/accessories" className="hover:text-sky-600 flex items-center gap-2"><div className="w-8 h-8 bg-gray-200 rounded"></div>Accessories Overview</Link></li>
                          <li><a href="#" className="hover:text-sky-600 flex items-center gap-2"><div className="w-8 h-8 bg-gray-200 rounded"></div>Casper</a></li>
                          <li><a href="#" className="hover:text-sky-600 flex items-center gap-2"><div className="w-8 h-8 bg-gray-200 rounded"></div>OEM Accessories</a></li>
                          <li><a href="#" className="hover:text-sky-600 flex items-center gap-2 bg-amber-50 rounded-lg px-2"><div className="w-8 h-8 bg-gray-200 rounded"></div>AmpSentrix</a></li>
                          <li><a href="#" className="hover:text-sky-600 flex items-center gap-2"><div className="w-8 h-8 bg-gray-200 rounded"></div>Generic Accessories</a></li>
                          <li><a href="#" className="hover:text-sky-600 flex items-center gap-2"><div className="w-8 h-8 bg-gray-200 rounded"></div>Console Accessories</a></li>
                          <li><a href="#" className="hover:text-sky-600 flex items-center gap-2"><div className="w-8 h-8 bg-gray-200 rounded"></div>Memory</a></li>
                          <li><a href="#" className="hover:text-sky-600 flex items-center gap-2"><div className="w-8 h-8 bg-gray-200 rounded"></div>Skins</a></li>
                        </ul>
                      </div>
                      {/* Keep all other columns */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-4">Chargers & Cables</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">USB-C Cables</a></li>
                          <li><a href="#" className="hover:text-sky-600">Lightning Cables</a></li>
                          <li><a href="#" className="hover:text-sky-600">Wall Chargers</a></li>
                          <li><a href="#" className="hover:text-sky-600">Car Chargers</a></li>
                          <li><a href="#" className="hover:text-sky-600">Wireless Chargers</a></li>
                          <li><a href="#" className="hover:text-sky-600">Power Banks</a></li>
                          <li><a href="#" className="font-medium text-sky-600 mt-3 block">View all chargers →</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-4">Cases & Protection</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">iPhone Cases</a></li>
                          <li><a href="#" className="hover:text-sky-600">Samsung Cases</a></li>
                          <li><a href="#" className="hover:text-sky-600">Screen Protectors</a></li>
                          <li><a href="#" className="hover:text-sky-600">Tempered Glass</a></li>
                          <li><a href="#" className="hover:text-sky-600">Camera Lens Protectors</a></li>
                          <li><a href="#" className="hover:text-sky-600">Privacy Glass</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-4">Audio</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">Wired Earphones</a></li>
                          <li><a href="#" className="hover:text-sky-600">Bluetooth Earbuds</a></li>
                          <li><a href="#" className="hover:text-sky-600">Headphones</a></li>
                          <li><a href="#" className="hover:text-sky-600">Speakers</a></li>
                          <li><a href="#" className="hover:text-sky-600">Adapters (USB-C → 3.5mm)</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-4">Mounts & Holders</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">Car Mounts</a></li>
                          <li><a href="#" className="hover:text-sky-600">Desk Stands</a></li>
                          <li><a href="#" className="hover:text-sky-600">Bike Mounts</a></li>
                          <li><a href="#" className="hover:text-sky-600">Wallet Cases</a></li>
                          <li><a href="#" className="hover:text-sky-600">PopSockets</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-4">Gaming & Others</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">Console Controllers</a></li>
                          <li><a href="#" className="hover:text-sky-600">Gaming Headsets</a></li>
                          <li><a href="#" className="hover:text-sky-600">Smartwatch Bands</a></li>
                          <li><a href="#" className="hover:text-sky-600">Stylus Pens</a></li>
                          <li><a href="#" className="hover:text-sky-600">Memory Cards</a></li>
                          <li><a href="#" className="font-medium text-sky-600 mt-3 block">View all accessories →</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue with all other mega dropdowns - keep them exactly the same */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 py-2 text-gray-800 hover:text-sky-600 transition font-semibold">
                    Tools & Supplies
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  {/* Tools & Supplies Mega Dropdown - Keep existing */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white rounded-2xl shadow-2xl border border-gray-100 p-10 z-50 w-[90vw] max-w-6xl">
                    <div className="grid grid-cols-6 gap-10 max-w-7xl mx-auto text-sm">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-5">Shop by Brand</h3>
                        <ul className="space-y-3 text-gray-600">
                          <li><Link href="/parts/tools-&-supplies" className="hover:text-sky-600">Tools & Supplies Overview</Link></li>
                          <li><a href="#" className="hover:text-sky-600">iFixit</a></li>
                          <li><a href="#" className="hover:text-sky-600">Wiha</a></li>
                          <li><a href="#" className="hover:text-sky-600">Wrepair</a></li>
                          <li><a href="#" className="hover:text-sky-600">Dotterpodx</a></li>
                          <li><a href="#" className="hover:text-sky-600">Qianli</a></li>
                          <li><a href="#" className="font-medium text-sky-600 mt-4 block">View all brands →</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-5">Essentials</h3>
                        <ul className="space-y-3 text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">Screwdrivers</a></li>
                          <li><a href="#" className="hover:text-sky-600">Tweezers</a></li>
                          <li><a href="#" className="hover:text-sky-600">Tool Kits</a></li>
                          <li><a href="#" className="hover:text-sky-600">Adhesive Tapes</a></li>
                          <li><a href="#" className="hover:text-sky-600">Pry Tools</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-5">OEM Service Tools</h3>
                        <ul className="space-y-3 text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">Disassembly Tools</a></li>
                          <li><a href="#" className="hover:text-sky-600">Repair Fixtures</a></li>
                          <li><a href="#" className="hover:text-sky-600">Clamps & Holders</a></li>
                          <li><a href="#" className="hover:text-sky-600">Pliers & Cutters</a></li>
                          <li><a href="#" className="hover:text-sky-600">Cleaning Supplies</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-5">Testing Devices</h3>
                        <ul className="space-y-3 text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">Screen Tester</a></li>
                          <li><a href="#" className="hover:text-sky-600">Battery Tester</a></li>
                          <li><a href="#" className="hover:text-sky-600">Tristar Tester</a></li>
                          <li><a href="#" className="hover:text-sky-600">MFI Tester</a></li>
                          <li><a href="#" className="hover:text-sky-600">Test Cables</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-5">Microsoldering</h3>
                        <ul className="space-y-3 text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">Hot Air Stations</a></li>
                          <li><a href="#" className="hover:text-sky-600">Soldering Stations</a></li>
                          <li><a href="#" className="hover:text-sky-600">Board Holders</a></li>
                          <li><a href="#" className="hover:text-sky-600">Power Supply Units</a></li>
                          <li><a href="#" className="hover:text-sky-600">Thermal Cameras</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-5">Refurbishing</h3>
                        <ul className="space-y-3 text-gray-600">
                          <li><a href="#" className="hover:text-sky-600">Glass Separation</a></li>
                          <li><a href="#" className="hover:text-sky-600">Cutting Wire</a></li>
                          <li><a href="#" className="hover:text-sky-600">Glue Removal</a></li>
                          <li><a href="#" className="hover:text-sky-600">Alignment Moulds</a></li>
                          <li><a href="#" className="hover:text-sky-600">Lamination Tools</a></li>
                          <li><a href="#" className="font-medium text-sky-600 mt-4 block">View all tools →</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keep all remaining mega dropdowns exactly as they are */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 py-2 text-gray-800 hover:text-sky-600 transition font-semibold">
                    Refurbishing
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  {/* Refurbishing Mega Dropdown - Keep existing */}
                  <div className="mega-dropdown absolute top-full mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white rounded-2xl shadow-2xl border border-gray-100 p-10 z-50 w-[90vw] max-w-6xl">
                    <div className="grid grid-cols-6 gap-10 max-w-7xl mx-auto text-sm">
                      <div><h3 className="font-bold mb-5">OCA Machines</h3><ul className="space-y-3 text-gray-600"><li><Link href="/parts/refurbishing" className="hover:text-sky-600">Refurbishing Overview</Link></li><li><a href="#" className="hover:text-sky-600">Forward OCA Pro</a></li><li><a href="#" className="hover:text-sky-600">TBK-578</a></li><li><a href="#" className="hover:text-sky-600">Mini Laminators</a></li></ul></div>
                      <div><h3 className="font-bold mb-5">Bubble Removers</h3><ul className="space-y-3 text-gray-600"><li><a href="#" className="hover:text-sky-600">Auto Bubble Remover</a></li><li><a href="#" className="hover:text-sky-600">30L Autoclave</a></li></ul></div>
                      <div><h3 className="font-bold mb-5">Laser Machines</h3><ul className="space-y-3 text-gray-600"><li><a href="#" className="hover:text-sky-600">Back Glass Laser</a></li><li><a href="#" className="hover:text-sky-600">Frame Separator</a></li></ul></div>
                      <div><h3 className="font-bold mb-5">Separation</h3><ul className="space-y-3 text-gray-600"><li><a href="#" className="hover:text-sky-600">Freezer Separator</a></li><li><a href="#" className="hover:text-sky-600">Hot Plate</a></li><li><a href="#" className="hover:text-sky-600">Wire Separator</a></li></ul></div>
                      <div><h3 className="font-bold mb-5">Lamination</h3><ul className="space-y-3 text-gray-600"><li><a href="#" className="hover:text-sky-600">OCA Sheets</a></li><li><a href="#" className="hover:text-sky-600">Polarizer Film</a></li><li><a href="#" className="hover:text-sky-600">Backlight</a></li></ul></div>
                      <div><h3 className="font-bold mb-5">Cleaning</h3><ul className="space-y-3 text-gray-600"><li><a href="#" className="hover:text-sky-600">Ultrasonic Cleaner</a></li><li><a href="#" className="hover:text-sky-600">IPA Solution</a></li><li><a href="#" className="font-medium text-sky-600 mt-4 block">View all →</a></li></ul></div>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <button className="flex items-center space-x-1 py-2 text-gray-800 hover:text-sky-600 transition font-semibold">
                    Board Components
                  </button>
                  {/* Board Components Mega Dropdown - Keep existing */}
                  <div className="mega-dropdown absolute top-full mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white rounded-2xl shadow-2xl border border-gray-100 p-10 z-50 w-[90vw] max-w-6xl">
                    <div className="grid grid-cols-6 gap-10 max-w-7xl mx-auto text-sm">
                      <div><h3 className="font-bold mb-5">IC Chips</h3><ul className="space-y-3 text-gray-600"><li><Link href="/parts/board-components" className="hover:text-sky-600">Board Components Overview</Link></li><li><a href="#" className="hover:text-sky-600">Tristar / Tigris</a></li><li><a href="#" className="hover:text-sky-600">Charging IC</a></li><li><a href="#" className="hover:text-sky-600">Audio IC</a></li><li><a href="#" className="hover:text-sky-600">Power IC</a></li></ul></div>
                      <div><h3 className="font-bold mb-5">Connectors</h3><ul className="space-y-3 text-gray-600"><li><a href="#" className="hover:text-sky-600">FPC Connectors</a></li><li><a href="#" className="hover:text-sky-600">Battery Connectors</a></li><li><a href="#" className="hover:text-sky-600">Charging Port</a></li></ul></div>
                      <div><h3 className="font-bold mb-5">Cameras</h3><ul className="space-y-3 text-gray-600"><li><a href="#" className="hover:text-sky-600">Front Camera</a></li><li><a href="#" className="hover:text-sky-600">Rear Camera Modules</a></li></ul></div>
                      <div><h3 className="font-bold mb-5">Flex Cables</h3><ul className="space-y-3 text-gray-600"><li><a href="#" className="hover:text-sky-600">Power / Volume Flex</a></li><li><a href="#" className="hover:text-sky-600">Mainboard Flex</a></li></ul></div>
                      <div><h3 className="font-bold mb-5">Vibration & Sensors</h3><ul className="space-y-3 text-gray-600"><li><a href="#" className="hover:text-sky-600">Taptic Engine</a></li><li><a href="#" className="hover:text-sky-600">Proximity Sensor</a></li></ul></div>
                      <div><h3 className="font-bold mb-5">Other</h3><ul className="space-y-3 text-gray-600"><li><a href="#" className="hover:text-sky-600">Backlight IC</a></li><li><a href="#" className="hover:text-sky-600">WiFi IC</a></li><li><a href="#" className="font-medium text-sky-600 mt-4 block">View all →</a></li></ul></div>
                    </div>
                  </div>
                </div>

                <Link href="/parts/samsung" className="py-2 text-gray-800 hover:text-sky-600 transition font-semibold">
                  Samsung
                </Link>

                <Link href="/parts/motorola" className="py-2 text-gray-800 hover:text-sky-600 transition font-semibold">
                  Motorola
                </Link>

                <Link href="/parts/google-pixel" className="py-2 text-gray-800 hover:text-sky-600 transition font-semibold">
                  Google
                </Link>

                <Link href="/parts/other-parts" className="py-2 text-gray-800 hover:text-sky-600 transition font-semibold">
                  Other Parts
                </Link>

                <Link href="/parts/game-console" className="py-2 text-gray-800 hover:text-sky-600 transition font-semibold">
                  Game Console
                </Link>

                <a href="#" className="py-2 text-red-600 font-bold hover:text-red-700 transition">
                  Pre-Owned Devices
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE MENU – ULTRA SMOOTH */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden transition-opacity duration-300">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 translate-x-0">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-sky-500">Nexus TechHub</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <input type="text" placeholder="Search anything..." className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-sky-500" />
              {/* Mobile accordion menu items would go here */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
