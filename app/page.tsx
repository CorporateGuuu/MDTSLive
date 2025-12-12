'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Flag, User, ShoppingCart, Award, ChevronLeft, ChevronRight, Shield, Smartphone, Package, Wrench, Star, Facebook, Twitter, Instagram, Youtube, ChevronDown, Menu, X, Globe, Linkedin } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function Home() {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCartNotification, setShowCartNotification] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    const savedTotal = localStorage.getItem('cartTotal');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedTotal) {
      setCartTotal(parseFloat(savedTotal));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartTotal', cartTotal.toString());
  }, [cartItems, cartTotal]);

  const toolkits = [
    {
      name: 'Moray Driver Kit',
      image: 'https://images.ifixit.com/igi/3Q5wK2cR5w5wK2cR.standard',
      originalPrice: 89.99,
      salePrice: 71.99
    },
    {
      name: 'Mako Driver Kit',
      image: 'https://images.ifixit.com/igi/5wK2cR3Q5wK2cR.standard',
      originalPrice: 49.99,
      salePrice: 39.99
    },
    {
      name: 'Pro Tech Toolkit',
      image: 'https://images.ifixit.com/igi/K2cR3Q5wK2cR3Q.standard',
      originalPrice: 149.99,
      salePrice: 119.99
    },
    {
      name: 'Essential Electronics Toolkit',
      image: 'https://images.ifixit.com/igi/wK2cR3Q5wK2cR3Q.standard',
      originalPrice: 29.99,
      salePrice: 23.99
    },
  ];

  const qualityFeatures = [
    { icon: Shield, text: 'Lifetime Warranty on Parts', color: 'text-gold' },
    { icon: Smartphone, text: 'Ready-to-Sell Devices', color: 'text-navy' },
    { icon: Package, text: 'Premium Toolkits', color: 'text-green-500' },
    { icon: Wrench, text: 'Expert Repair Services', color: 'text-orange-500' },
    { icon: Star, text: 'Certified Quality Standards', color: 'text-yellow-500' }
  ];

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % toolkits.length);
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, toolkits.length]);

  // Touch handlers for carousel swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  // Keyboard navigation for carousel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };



  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log(`Searching for: ${query}`);
    // In a real app, this would trigger a search API call
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % toolkits.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + toolkits.length) % toolkits.length);
  };

  const addToCart = (item: typeof toolkits[0]) => {
    const newItem: CartItem = {
      id: Date.now(),
      name: item.name,
      price: item.salePrice,
      image: item.image
    };
    setCartItems(prev => [...prev, newItem]);
    setCartTotal(prev => prev + item.salePrice);

    // Show notification
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 3000);

    // Enhanced fly-to-cart animation
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      cartIcon.classList.add('animate-bounce', 'scale-110');
      setTimeout(() => {
        cartIcon.classList.remove('animate-bounce', 'scale-110');
      }, 1000);
    }
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    console.log(`Country changed to: ${country}`);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    console.log(`Language changed to: ${language}`);
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    console.log(`Currency changed to: ${currency}`);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-16 bg-gray-200 rounded mb-4"></div>
      <div className="h-96 bg-gray-200 rounded mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-48 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <span className="text-lg">✓</span>
            <span className="font-medium">Item added to cart!</span>
          </div>
        </div>
      )}

      {/* Mobile-First Header */}
      <header className="sticky top-0 bg-white shadow-lg z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile-First Top Bar */}
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button - First on Mobile */}
            <button
              className="lg:hidden text-gray-700 hover:text-gold transition-colors mr-4"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo - Centered on Mobile, Left on Desktop */}
            <div className="flex items-center lg:flex-1">
              <h1 className="text-xl sm:text-2xl font-bold">
                <span className="text-gold">Midas</span>
                <span className="text-navy ml-2">Technical Solutions</span>
              </h1>
            </div>

            {/* Desktop Search - Hidden on Mobile */}
            <div className="hidden lg:block flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search parts, tools, accessories..."
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gold text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
                  aria-label="Search"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>

            {/* Right Icons - Desktop */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Country Selector */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-gold transition-colors">
                  <Flag size={20} className="text-green-600" />
                  <span className="text-sm font-medium">US</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48">
                  <div className="py-2">
                    {['United States', 'Canada', 'United Kingdom', 'Australia'].map((country) => (
                      <button
                        key={country}
                        onClick={() => handleCountryChange(country)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* My Account */}
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gold transition-colors" aria-label="My Account">
                <User size={20} />
                <span className="text-sm font-medium hidden xl:inline">My Account</span>
              </button>

              {/* Amazon Payout Badge */}
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                <Award size={16} className="text-orange-600" />
                <span className="text-xs font-semibold text-orange-700 hidden xl:inline">Amazon Payout</span>
                <span className="text-xs font-semibold text-orange-700 xl:hidden">Payout</span>
              </div>

              {/* Cart */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-gold transition-colors cart-icon">
                  <div className="relative">
                    <ShoppingCart size={20} />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                        {cartItems.length}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">${cartTotal.toFixed(2)}</span>
                </button>
                {/* Cart Dropdown */}
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-80">
                  <div className="p-4">
                    <h3 className="font-semibold mb-3">Cart ({cartItems.length} items)</h3>
                    {cartItems.length === 0 ? (
                      <p className="text-gray-500 text-sm">Your cart is empty</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {cartItems.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center space-x-2">
                            <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                            <div className="flex-1">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">${item.price}</p>
                            </div>
                          </div>
                        ))}
                        {cartItems.length > 3 && (
                          <p className="text-xs text-gray-500">And {cartItems.length - 3} more...</p>
                        )}
                      </div>
                    )}
                    <button className="w-full bg-gold text-white py-2 rounded-lg mt-3 hover:bg-opacity-90 transition-colors">
                      View Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Search Button */}
            <button
              className="lg:hidden text-gray-700 hover:text-gold transition-colors ml-4"
              onClick={() => setSearchExpanded(!searchExpanded)}
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Mobile Search Bar - Expandable */}
          {searchExpanded && (
            <div className="lg:hidden pb-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search parts, tools, accessories..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gold text-white p-2 rounded-lg hover:bg-opacity-90 transition-colors"
                  aria-label="Search"
                >
                  <Search size={16} />
                </button>
              </form>
            </div>
          )}

          {/* Navigation Menu - Desktop */}
          <nav className="hidden lg:block bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-6 py-3">
              {[
                'Apple', 'Samsung', 'Motorola', 'Google', 'Midas Exclusive Parts',
                'Game Console', 'Accessories', 'Tools & Supplies',
                'Refurbishing', 'Board Components', 'Pre-Owned Devices'
              ].map((category) => (
                <a
                  key={category}
                  href="#"
                  className="text-gray-700 hover:text-gold font-medium text-sm transition-colors relative group py-2"
                >
                  {category}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-200 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </nav>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <nav className="block lg:hidden bg-gray-50 border-t border-gray-200">
              <div className="p-4 space-y-4">
                {/* Mobile Cart Summary */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart size={20} />
                    <span className="font-medium">{cartItems.length} items</span>
                  </div>
                  <span className="font-bold text-gold">${cartTotal.toFixed(2)}</span>
                </div>

                {/* Mobile Country Selector */}
                <div className="space-y-2">
                  <label htmlFor="mobile-country-select" className="text-sm font-medium text-gray-700">Country</label>
                  <select
                    id="mobile-country-select"
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    aria-label="Select your country"
                  >
                    {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'].map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Mobile Categories Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Apple', 'Samsung', 'Motorola', 'Google', 'Midas Exclusive Parts',
                    'Game Console', 'Accessories', 'Tools & Supplies',
                    'Refurbishing', 'Board Components', 'Pre-Owned Devices'
                  ].map((category) => (
                    <a
                      key={category}
                      href="#"
                      className="text-gray-700 hover:text-gold font-medium text-sm py-3 px-4 rounded-lg hover:bg-white transition-colors border border-gray-200 text-center"
                    >
                      {category}
                    </a>
                  ))}
                </div>

                {/* Mobile Quick Links */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <a href="#" className="block text-gray-700 hover:text-gold font-medium py-2">My Account</a>
                  <a href="#" className="block text-gray-700 hover:text-gold font-medium py-2">Support</a>
                  <a href="#" className="block text-gray-700 hover:text-gold font-medium py-2">Contact</a>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Top Banner */}
            <div className="bg-gold text-white text-center py-3">
              <div className="flex items-center justify-center space-x-4 text-sm font-medium">
                <span>LIMITED TIME: Premium Repair Tools Up to 20% OFF</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Nov 27 - Dec 11, 2025</span>
              </div>
            </div>

            {/* Logos */}
            <div className="flex justify-center items-center space-x-4 py-6 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gold">Midas Technical Solutions</span>
                <span className="text-gray-400 text-xl">+</span>
                <span className="text-2xl font-bold text-navy">Premium Tools</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Side Content */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent leading-tight">
                  Premium Repair Tools at
                  <span className="block text-gold">Limited-Time Discounts</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Professional-grade repair tools with up to 20% off select toolkits.
                  Limited time offer from November 27 to December 11.
                </p>
                <button className="bg-gold hover:bg-opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg w-fit">
                  Shop Tools Now →
                </button>
              </div>

              {/* Right Side Carousel */}
              <div className="relative bg-gray-50 p-8 md:p-12">
                <div
                  ref={carouselRef}
                  className="relative h-80 md:h-96 bg-white rounded-xl shadow-lg overflow-hidden cursor-grab active:cursor-grabbing"
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onKeyDown={handleKeyDown}
                  tabIndex={0}
                  role="region"
                  aria-label="Product carousel"
                >
                  {toolkits.map((toolkit, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={toolkit.image}
                        alt={toolkit.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                        <h3 className="text-white font-bold text-xl mb-2">{toolkit.name}</h3>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-300 line-through text-lg">${toolkit.originalPrice}</span>
                          <span className="text-gold font-bold text-2xl">${toolkit.salePrice}</span>
                          <span className="bg-gold text-white px-2 py-1 rounded text-xs font-bold">
                            SAVE ${(toolkit.originalPrice - toolkit.salePrice).toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => addToCart(toolkit)}
                          className="mt-4 bg-gold hover:bg-opacity-90 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 hover:scale-110"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200 hover:scale-110"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center space-x-3 mt-6">
                  {toolkits.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentSlide ? 'bg-gold scale-125' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Standards Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left Side Title */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Discover Our
                <span className="block text-gold">Midas Quality Standards</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We maintain the highest industry standards to ensure every product meets professional repair requirements.
              </p>
            </div>

            {/* Right Side AQ7 Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-gold text-white px-6 py-3 rounded-xl font-bold text-xl shadow-lg">
                  MidasTech 7.0 Technology
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Unmatched Quality and Reliability
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Our proprietary MidasTech 7.0 Technology ensures top-tier materials, rigorous quality control, and reliable performance for professional repairs.
              </p>
              <div className="flex items-center space-x-2 text-gold font-semibold">
                <Shield size={20} />
                <span>Lifetime Warranty Included</span>
              </div>
            </div>
          </div>

          {/* Feature Bubbles Grid */}
          <div className="grid md:grid-cols-5 gap-8">
            {qualityFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group"
              >
                <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold group-hover:bg-opacity-10 transition-colors duration-300">
                  <feature.icon className={`w-10 h-10 ${feature.color} group-hover:text-gold transition-colors duration-300`} />
                </div>
                <p className="text-gray-800 font-semibold text-lg leading-tight">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Top Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-6 gap-12">
            {/* Left Side Selectors */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold mb-6 text-gold">Midas Technical Solutions</h3>
              <div className="space-y-4">
                {/* Country Selector */}
                <div className="relative">
                  <button className="flex items-center justify-between w-full bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Globe size={16} />
                      <span className="text-sm">{selectedCountry}</span>
                    </div>
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-full opacity-0 invisible hover:opacity-100 hover:visible transition-all duration-200">
                    <div className="py-2">
                      {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'].map((country) => (
                        <button
                          key={country}
                          onClick={() => handleCountryChange(country)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Language & Currency Selector */}
                <div className="relative">
                  <button className="flex items-center justify-between w-full bg-gray-800 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <span className="text-sm">{selectedLanguage} • {selectedCurrency}</span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-full">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Language</p>
                        {['English', 'Español', 'Français', 'Deutsch'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => handleLanguageChange(lang)}
                            className="w-full text-left py-1 text-sm hover:text-gold transition-colors"
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                      <div className="px-4 py-2">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Currency</p>
                        {['USD', 'CAD', 'GBP', 'EUR', 'AUD'].map((curr) => (
                          <button
                            key={curr}
                            onClick={() => handleCurrencyChange(curr)}
                            className="w-full text-left py-1 text-sm hover:text-gold transition-colors"
                          >
                            {curr}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Columns */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-gold">About</h4>
              <ul className="space-y-3">
                {['About Us', 'Blog', 'Quality Standards', 'Return Policy', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-gold">Services</h4>
              <ul className="space-y-3">
                {['My Account', 'LCD Buyback', 'Pre-Owned Devices', 'Shipping', 'Bulk Orders', 'Trade-In'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-gold">Our Brands</h4>
              <ul className="space-y-3">
                {['MidasTech 7.0 Technology', 'Premium Toolkits', 'Expert Repair Services', 'Certified Quality Standards'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-gold">Support</h4>
              <ul className="space-y-3">
                {['Location', 'Live Chat', 'Phone', 'WhatsApp', 'Email', 'FAQs', 'Warranty'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Authorized Distributors */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-gold">Authorized Distributors</h4>
              <div className="space-y-3">
                {[
                  { brand: 'Apple', color: 'bg-gray-700' },
                  { brand: 'Google', color: 'bg-blue-600' },
                  { brand: 'Samsung', color: 'bg-blue-500' },
                  { brand: 'Motorola', color: 'bg-green-600' },
                  { brand: 'LG', color: 'bg-gray-600' }
                ].map(({ brand, color }) => (
                  <div key={brand} className={`${color} px-4 py-3 rounded-lg text-sm font-semibold shadow-lg`}>
                    {brand} Authorized Distributor
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Certifications and Payment */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Certifications */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                'ISO 9001 Certified',
                'ISO 14001 Certified',
                'ISO 45001 Certified',
                'PCI DSS Compliant',
                'RoHS Compliant'
              ].map((cert) => (
                <div key={cert} className="bg-gray-800 px-4 py-2 rounded-full text-xs font-semibold text-center">
                  {cert}
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {[
                { name: 'FedEx', icon: '🚚' },
                { name: 'Visa', icon: '💳' },
                { name: 'MasterCard', icon: '💳' },
                { name: 'PayPal', icon: '🅿️' },
                { name: 'Amazon Pay', icon: '📦' },
                { name: 'Apple Pay', icon: '📱' },
                { name: 'Google Pay', icon: '🎯' }
              ].map(({ name, icon }) => (
                <div key={name} className="flex items-center space-x-2 text-gray-300">
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm font-medium">{name}</span>
                </div>
              ))}
            </div>

            {/* Copyright and Social */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2025 Midas Technical Solutions. All rights reserved. | Privacy Policy | Terms of Service
              </p>
              <div className="flex space-x-6">
                {[
                  { Icon: Facebook, href: 'https://www.facebook.com/midastechnicalsolutions' },
                  { Icon: Twitter, href: 'https://www.twitter.com/midastechnical' },
                  { Icon: Instagram, href: 'https://www.instagram.com/midastechnical/' },
                  { Icon: Linkedin, href: 'https://www.linkedin.com/company/midas-technical-solutions/?viewAsMember=true' },
                  { Icon: Youtube, href: 'https://www.youtube.com/@midastechnicalsolutions' }
                ].map(({ Icon, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="text-gray-400 hover:text-gold transition-colors"
                    aria-label={`Visit our ${Icon.name} page`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
