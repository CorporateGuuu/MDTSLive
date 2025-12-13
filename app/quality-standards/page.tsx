'use client';

import React from 'react';
import { ArrowLeft, Shield, Award, CheckCircle, Star, Zap, Microscope } from 'lucide-react';
import Link from 'next/link';

export default function QualityStandardsPage() {
  const qualityPillars = [
    {
      icon: Shield,
      title: 'Lifetime Warranty',
      description: 'Every core component comes with our comprehensive lifetime warranty, backed by rigorous quality testing and assurance protocols.'
    },
    {
      icon: Microscope,
      title: 'Advanced Testing',
      description: 'Multi-stage quality inspection process including automated testing, manual verification, and performance validation before shipping.'
    },
    {
      icon: Award,
      title: 'Industry Certifications',
      description: 'All products meet or exceed international standards for electronic components and repair parts quality.'
    },
    {
      icon: Zap,
      title: 'Performance Guarantee',
      description: 'Our parts deliver consistent performance that matches or exceeds OEM specifications for reliable repairs.'
    }
  ];

  const qualityProcess = [
    {
      step: '01',
      title: 'Raw Material Inspection',
      description: 'Every component begins with thorough inspection of incoming materials and suppliers.'
    },
    {
      step: '02',
      title: 'Manufacturing Quality Control',
      description: 'In-process monitoring ensures each component meets our exacting standards during production.'
    },
    {
      step: '03',
      title: 'Automated Testing',
      description: 'Advanced testing equipment validates electrical performance and functionality.'
    },
    {
      step: '04',
      title: 'Manual Verification',
      description: 'Expert technicians perform final visual and functional inspections.'
    },
    {
      step: '05',
      title: 'Packaging & Shipping',
      description: 'Careful packaging ensures components arrive in perfect condition.'
    }
  ];

  const certifications = [
    { name: 'ISO 9001', description: 'Quality Management Systems' },
    { name: 'RoHS Compliant', description: 'Restriction of Hazardous Substances' },
    { name: 'CE Certified', description: 'European Conformity' },
    { name: 'FCC Approved', description: 'Federal Communications Commission' }
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
            Discover Our <span className="text-gold">Midas Quality Standards</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Uncompromising quality assurance that ensures every component meets the highest standards
            for professional mobile device repairs worldwide.
          </p>
        </div>
      </section>

      {/* MidasGold 7.0 Technology Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-gold bg-opacity-10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Star size={16} />
                <span>MidasGold 7.0 Technology</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Unmatched Quality and Reliability
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Our proprietary MidasGold 7.0 Technology platform represents the pinnacle of quality assurance
                in the mobile repair industry. Every component undergoes rigorous testing and validation
                to ensure unparalleled performance and reliability.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                This advanced quality system combines cutting-edge testing equipment, expert technician verification,
                and comprehensive quality control measures to deliver components that exceed industry standards.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold mb-1">99.8%</div>
                  <div className="text-sm text-gray-600">Quality Pass Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Quality Monitoring</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
              <div className="flex items-center mb-6">
                <div className="bg-gold text-white px-6 py-3 rounded-xl font-bold text-xl shadow-lg">
                  MidasGold 7.0
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Technology Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Automated electrical testing systems</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">AI-powered defect detection</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Real-time quality monitoring</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Comprehensive performance validation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Lifetime warranty coverage</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Pillars */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Quality Pillars</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four fundamental principles that define our commitment to excellence and ensure
              every product meets the highest standards of quality and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qualityPillars.map((pillar, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-16 h-16 bg-gold bg-opacity-10 rounded-xl flex items-center justify-center mb-6">
                  <pillar.icon size={32} className="text-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{pillar.title}</h3>
                <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Quality Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive 5-stage quality assurance process that ensures every component
              meets our exacting standards before reaching our customers.
            </p>
          </div>

          <div className="space-y-8">
            {qualityProcess.map((step, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gold text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1 pb-8 border-l-2 border-gray-200 pl-6 last:border-l-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Industry Certifications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to quality is validated by leading industry certifications
              and compliance standards that ensure the highest level of product reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award size={24} className="text-gold" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.name}</h3>
                <p className="text-gray-600 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Commitment */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gold to-yellow-500 p-8 rounded-2xl text-white mb-8">
            <Shield className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Our Quality Commitment</h2>
            <p className="text-xl leading-relaxed mb-6">
              Quality is not just a process—it's our promise to every customer.
              We stand behind every component with our lifetime warranty and unwavering
              commitment to excellence in the mobile repair industry.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">10M+</div>
                <div className="text-sm opacity-90">Components Tested</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">99.8%</div>
                <div className="text-sm opacity-90">Quality Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-sm opacity-90">Quality Monitoring</div>
              </div>
            </div>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed">
            When you choose Midas Technical Solutions, you're choosing a partner committed to
            quality excellence. Our rigorous standards and comprehensive quality assurance
            process ensure that every component meets the highest industry benchmarks,
            giving you the confidence to deliver exceptional repair services to your customers.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience Midas Quality</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Discover the difference that uncompromising quality standards make in your repair business.
            Join thousands of professionals who trust Midas Technical Solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-gold hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Quality Products
            </Link>
            <Link
              href="/contact"
              className="border border-white text-white hover:bg-white hover:text-navy px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Quality Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
