'use client';

import React from 'react';
import { ArrowLeft, Shield, Award, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function WarrantyPage() {
  const warrantyTypes = [
    {
      icon: Shield,
      title: 'Lifetime Warranty',
      description: 'Comprehensive coverage on all core components and premium parts.',
      coverage: 'Screens, batteries, motherboards, cameras, and more'
    },
    {
      icon: Award,
      title: 'Premium Parts Warranty',
      description: 'Extended warranty on MidasTech certified replacement parts.',
      coverage: 'Up to 2 years coverage on select premium components'
    },
    {
      icon: Clock,
      title: 'Repair Work Warranty',
      description: '90-day warranty on all repair work performed by certified technicians.',
      coverage: 'Labor and parts for repairs within warranty period'
    }
  ];

  const faqs = [
    {
      question: 'What does the lifetime warranty cover?',
      answer: 'Our lifetime warranty covers manufacturing defects in core components like screens, batteries, and motherboards. It does not cover accidental damage or normal wear and tear.'
    },
    {
      question: 'How do I file a warranty claim?',
      answer: 'Contact our support team with your order details and a description of the issue. We will guide you through the claims process and arrange for repair or replacement.'
    },
    {
      question: 'Is shipping covered under warranty?',
      answer: 'Return shipping is covered for valid warranty claims. We will provide a prepaid shipping label for defective items being returned to us.'
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
            Warranty <span className="text-gold">& Protection</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Comprehensive warranty coverage that protects your investment and ensures peace of mind
            with every Midas Technical Solutions purchase.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {warrantyTypes.map((warranty, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-16 h-16 bg-gold bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                  <warranty.icon size={32} className="text-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{warranty.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{warranty.description}</p>
                <p className="text-sm text-gold font-medium">{warranty.coverage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Warranty Support?</h2>
          <p className="text-xl text-blue-100 mb-8">Our warranty team is here to help with any claims or questions.</p>
          <Link href="/contact" className="bg-gold hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            File Warranty Claim
          </Link>
        </div>
      </section>
    </main>
  );
}
