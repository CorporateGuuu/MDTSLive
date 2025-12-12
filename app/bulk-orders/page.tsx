'use client';

import React from 'react';
import { ArrowLeft, Package, Truck, DollarSign, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function BulkOrdersPage() {
  const benefits = [
    { icon: Package, title: 'Volume Discounts', description: 'Save up to 35% on bulk purchases with tiered pricing structures.' },
    { icon: Truck, title: 'Priority Shipping', description: 'Expedited shipping and dedicated logistics for large orders.' },
    { icon: DollarSign, title: 'Flexible Payment Terms', description: 'Net 30 terms available for qualified business customers.' },
    { icon: Users, title: 'Dedicated Account Manager', description: 'Personal account manager to ensure smooth ordering and support.' }
  ];

  const pricingTiers = [
    { min: 100, max: 499, discount: 10, shipping: 'Standard' },
    { min: 500, max: 999, discount: 15, shipping: 'Expedited' },
    { min: 1000, max: 4999, discount: 25, shipping: 'Priority' },
    { min: 5000, max: null, discount: 35, shipping: 'Dedicated Logistics' }
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
            Bulk <span className="text-gold">Order Program</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Unlock significant savings with our wholesale pricing program designed for repair shops,
            distributors, and large-scale operations.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Choose Bulk Ordering?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our bulk program is designed to support growing businesses with cost-effective solutions
              and dedicated support for large-scale operations.
            </p>
          </div>

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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Volume Pricing Tiers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The more you buy, the more you save. Our tiered pricing ensures competitive rates
              at every volume level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-gold mb-2">{tier.discount}%</div>
                <div className="text-sm text-gray-500 mb-4">OFF</div>
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {tier.min.toLocaleString()}{tier.max ? `-${tier.max.toLocaleString()}` : '+'} units
                </div>
                <div className="text-sm text-gray-600 mb-4">{tier.shipping} Shipping</div>
                {tier.min >= 1000 && (
                  <div className="text-xs bg-gold bg-opacity-10 text-gold px-2 py-1 rounded-full inline-block">
                    Premium Tier
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with bulk ordering is simple. Follow these steps to unlock wholesale pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Our Team</h3>
              <p className="text-gray-600 leading-relaxed">
                Reach out to our bulk sales team to discuss your specific needs and get a customized quote.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Account Setup</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete our quick wholesale application and get approved for bulk pricing and terms.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Start Ordering</h3>
              <p className="text-gray-600 leading-relaxed">
                Place orders through our wholesale portal and enjoy priority shipping and dedicated support.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Save Big?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join hundreds of repair shops and distributors who trust Midas Technical Solutions
            for their bulk ordering needs.
          </p>
          <Link href="/contact" className="bg-gold hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Request Bulk Quote
          </Link>
        </div>
      </section>
    </main>
  );
}
