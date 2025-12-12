'use client';

import React from 'react';
import { ArrowLeft, Wrench, Users, Book, MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TechnicalSupportPage() {
  const services = [
    {
      icon: Wrench,
      title: 'Repair Guidance',
      description: 'Step-by-step technical support for complex repairs and troubleshooting.'
    },
    {
      icon: Users,
      title: 'Training Programs',
      description: 'Comprehensive training for your technicians on advanced repair techniques.'
    },
    {
      icon: Book,
      title: 'Documentation',
      description: 'Access to detailed repair manuals, schematics, and technical specifications.'
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
            Technical <span className="text-gold">Support</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Expert technical assistance from certified repair specialists. Get the help you need
            to succeed in mobile device repair.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <service.icon size={32} className="text-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Technical Support</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg">
              <MessageCircle size={24} className="text-gold" />
              <div>
                <div className="font-semibold">Live Chat</div>
                <div className="text-sm text-gray-600">24/7 Available</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg">
              <Phone size={24} className="text-gold" />
              <div>
                <div className="font-semibold">Phone</div>
                <div className="text-sm text-gray-600">Mon-Fri 8AM-6PM</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg">
              <Mail size={24} className="text-gold" />
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-sm text-gray-600">Within 2 hours</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Technical Help?</h2>
          <p className="text-xl text-blue-100 mb-8">Our experts are ready to assist you.</p>
          <Link href="/contact" className="bg-gold hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Get Support Now
          </Link>
        </div>
      </section>
    </main>
  );
}
