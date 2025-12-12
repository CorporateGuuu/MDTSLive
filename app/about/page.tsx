'use client';

import React from 'react';
import { ArrowLeft, Shield, Users, Award, Target, Globe, Package, Star } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description: 'Every product undergoes rigorous testing and quality assurance to ensure professional-grade performance.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our team of technicians and engineers brings decades of experience in mobile device repair and parts.'
    },
    {
      icon: Award,
      title: 'Industry Leader',
      description: 'Recognized as a premier wholesale supplier of mobile phone parts and repair tools worldwide.'
    },
    {
      icon: Target,
      title: 'Innovation Focus',
      description: 'Continuously developing new technologies and solutions to meet evolving industry needs.'
    }
  ];

  const stats = [
    { icon: Globe, value: '50+', label: 'Countries Served' },
    { icon: Package, value: '10,000+', label: 'Products Available' },
    { icon: Users, value: '5,000+', label: 'Happy Customers' },
    { icon: Star, value: '10+', label: 'Years in Business' }
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
            About <span className="text-gold">Midas Technical Solutions</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Leading wholesale provider of premium mobile phone parts, repair tools, and technical solutions
            for professionals in the electronics repair industry worldwide.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To empower repair professionals worldwide with access to the highest quality mobile phone parts,
                cutting-edge repair tools, and innovative technical solutions that enable them to deliver
                exceptional service to their customers.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We believe that by providing premium wholesale solutions at competitive prices,
                we contribute to a sustainable repair industry that reduces electronic waste and extends
                the lifecycle of mobile devices.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <stat.icon size={24} className="text-gold" />
                    </div>
                    <div className="text-2xl font-bold text-gold">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gold to-yellow-500 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4">Why Choose Midas?</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Shield size={20} className="mt-0.5 flex-shrink-0" />
                  <span>Lifetime warranty on all core components</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Award size={20} className="mt-0.5 flex-shrink-0" />
                  <span>MidasGold 7.0 Technology certification</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Users size={20} className="mt-0.5 flex-shrink-0" />
                  <span>Dedicated account management</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Package size={20} className="mt-0.5 flex-shrink-0" />
                  <span>Fast, reliable shipping worldwide</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our relationships with customers, partners, and the industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                  <value.icon size={24} className="text-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
          <p className="text-xl text-gray-600 mb-12">A decade of innovation and excellence in mobile repair solutions.</p>

          <div className="space-y-8 text-left">
            <div className="flex items-start space-x-4">
              <div className="w-4 h-4 bg-gold rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">2015 - Foundation</h3>
                <p className="text-gray-600">Founded with a vision to revolutionize the mobile repair parts industry by providing wholesale access to premium quality components.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-4 h-4 bg-gold rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">2018 - Global Expansion</h3>
                <p className="text-gray-600">Expanded operations to serve customers in over 30 countries, establishing partnerships with leading manufacturers worldwide.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-4 h-4 bg-gold rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">2021 - Innovation Leadership</h3>
                <p className="text-gray-600">Launched MidasGold 7.0 Technology platform, setting new standards for quality assurance and performance in mobile repair parts.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-4 h-4 bg-gold rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">2025 - Industry Leadership</h3>
                <p className="text-gray-600">Recognized as the premier wholesale provider of mobile phone parts and repair tools, serving thousands of professionals worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Global Network</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Become part of the Midas Technical Solutions family and gain access to premium wholesale pricing,
            expert support, and industry-leading products that drive your business success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gold hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Our Team
            </Link>
            <Link
              href="/bulk-orders"
              className="border border-white text-white hover:bg-white hover:text-navy px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Explore Wholesale Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
