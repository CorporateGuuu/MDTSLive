'use client';

import React from 'react';
import { ArrowLeft, Smartphone, DollarSign, Clock, Shield, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function TradeInPage() {
  const benefits = [
    {
      icon: Smartphone,
      title: 'High Trade-In Values',
      description: 'Get competitive rates for your used or refurbished devices.'
    },
    {
      icon: DollarSign,
      title: 'Instant Quotes',
      description: 'Receive immediate valuations for your inventory.'
    },
    {
      icon: Clock,
      title: 'Quick Processing',
      description: 'Fast turnaround on trade-in evaluations and payments.'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Safe and transparent trade-in process with full documentation.'
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center text-gold hover:text-opacity-80 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trade-In <span className="text-gold">Program</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Maximize the value of your inventory with our competitive trade-in program.
            Get instant quotes and fast processing for used and refurbished devices.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon size={32} className="text-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Get Started</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <CheckCircle size={48} className="text-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">1. Submit Inventory</h3>
              <p className="text-gray-600">Send us details about your devices for instant valuation.</p>
            </div>
            <div>
              <CheckCircle size={48} className="text-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">2. Receive Quote</h3>
              <p className="text-gray-600">Get competitive pricing based on condition and market value.</p>
            </div>
            <div>
              <CheckCircle size={48} className="text-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">3. Quick Payment</h3>
              <p className="text-gray-600">Receive payment within 24-48 hours of acceptance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gold bg-opacity-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Trade In?</h2>
          <p className="text-xl text-gray-600 mb-8">Contact our trade-in specialists to get started.</p>
          <Link href="/contact" className="bg-gold hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Get Trade-In Quote
          </Link>
        </div>
      </section>
    </main>
  );
}
