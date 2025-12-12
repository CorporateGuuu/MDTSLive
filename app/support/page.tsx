'use client';

import React from 'react';
import { ArrowLeft, MessageCircle, Phone, Mail, Book, HelpCircle, FileText, Users } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat Support',
      description: 'Get instant help from our technical experts',
      availability: '24/7 Available',
      action: 'Start Chat'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with certified technicians',
      availability: 'Mon-Fri 8AM-6PM EST',
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Detailed responses within 2 hours',
      availability: '24/7 Response',
      action: 'Send Email'
    },
    {
      icon: Book,
      title: 'Knowledge Base',
      description: 'Comprehensive repair guides and tutorials',
      availability: 'Always Available',
      action: 'Browse Guides'
    }
  ];

  const quickTopics = [
    {
      icon: HelpCircle,
      title: 'Product Compatibility',
      description: 'Find compatible parts for specific devices'
    },
    {
      icon: FileText,
      title: 'Installation Guides',
      description: 'Step-by-step repair instructions'
    },
    {
      icon: Users,
      title: 'Technical Training',
      description: 'Advanced repair techniques and best practices'
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gold hover:text-opacity-80 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-gold">Midas</span> Support Center
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Get expert assistance with your mobile repair needs. Our certified technicians
            and comprehensive resources are here to help you succeed.
          </p>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">How Can We Help?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the support method that works best for your needs. We're here to ensure
              your success with our premium repair solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center">
                <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <option.icon size={24} className="text-gold" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">{option.description}</p>
                <p className="text-xs text-gold font-medium mb-4">{option.availability}</p>
                <button className="w-full bg-gold hover:bg-opacity-90 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm">
                  {option.action}
                </button>
              </div>
            ))}
          </div>

          {/* Quick Access Topics */}
          <div className="grid md:grid-cols-3 gap-8">
            {quickTopics.map((topic, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:bg-white hover:shadow-md transition-all border border-gray-100">
                <div className="w-16 h-16 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                  <topic.icon size={32} className="text-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{topic.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{topic.description}</p>
                <Link
                  href="#"
                  className="text-gold hover:text-opacity-80 font-semibold inline-flex items-center"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Resources */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Popular Resources</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Access our most requested guides, tutorials, and troubleshooting resources.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">iPhone Screen Replacement</h3>
              <p className="text-blue-100 mb-4">Complete guide with tools and techniques for professional screen repairs.</p>
              <Link href="#" className="text-gold hover:text-opacity-80 font-semibold">View Guide →</Link>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Battery Diagnostics</h3>
              <p className="text-blue-100 mb-4">Learn to identify battery issues and perform accurate replacements.</p>
              <Link href="#" className="text-gold hover:text-opacity-80 font-semibold">View Guide →</Link>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4">Water Damage Recovery</h3>
              <p className="text-blue-100 mb-4">Advanced techniques for repairing water-damaged devices.</p>
              <Link href="#" className="text-gold hover:text-opacity-80 font-semibold">View Guide →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="py-20 bg-gold bg-opacity-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Our support team is standing by to help with any questions or technical challenges
            you may encounter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gold hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="#"
              className="border border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
