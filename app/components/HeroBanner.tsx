'use client';

import React from 'react';

export default function HeroBanner() {
  return (
    <section className="relative h-[400px] w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-gold-100/20">
        {/* Placeholder for the golden Midas hand assembling iPhone parts into UAE skyline */}
        <div className="absolute inset-0 opacity-10">
          {/* Abstract geometric pattern representing the concept */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-blue-200 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gold-200 rounded-lg transform rotate-45"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border-2 border-blue-300 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-gold-300 rounded-lg"></div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <div className="max-w-4xl text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Wholesale Phone Parts,<br />
            <span className="text-blue-600">Pre-Owned Devices</span> &<br />
            <span className="text-gold-600">Premium IT Services</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            American Quality, Global Reach
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
              Get Wholesale Quote
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
              View Products
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Elements (Apple Watch, Secure Lock, Repair Tool) */}
      <div className="absolute bottom-6 right-6 flex space-x-4 opacity-60">
        <div className="w-8 h-8 border-2 border-blue-400 rounded-full flex items-center justify-center">
          <span className="text-blue-500 text-sm">⌚</span>
        </div>
        <div className="w-8 h-8 border-2 border-gold-400 rounded flex items-center justify-center">
          <span className="text-gold-500 text-sm">🔒</span>
        </div>
        <div className="w-8 h-8 border-2 border-blue-400 rounded flex items-center justify-center">
          <span className="text-blue-500 text-sm">🔧</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
