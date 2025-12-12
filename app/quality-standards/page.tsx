'use client';

import React from 'react';
import { ArrowLeft, Shield, CheckCircle, Award, Star, Zap, Users } from 'lucide-react';
import Link from 'next/link';

export default function QualityStandardsPage() {
  const standards = [
    {
      icon: Shield,
      title: 'Rigorous Testing',
      description: 'Every product undergoes comprehensive testing protocols including electrical testing, durability testing, and compatibility verification.'
    },
    {
      icon: CheckCircle,
      title: 'ISO Certification',
      description: 'Our manufacturing partners maintain ISO 9001:2015 and ISO 14001:2015 certifications ensuring consistent quality management.'
    },
    {
      icon: Award,
      title: 'Premium Materials',
      description: 'We source only the highest grade materials and components from certified manufacturers worldwide.'
    },
    {
      icon: Star,
      title: 'Performance Guarantee',
      description: 'All products meet or exceed OEM specifications and come with our performance guarantee.'
    },
    {
      icon: Zap,
      title: 'Innovation Standards',
      description: 'Our proprietary MidasTech 7.0 Technology sets new industry benchmarks for quality and reliability.'
    },
    {
      icon: Users,
      title: 'Expert Validation',
      description: 'Products are validated by our team of certified repair technicians and electronics engineers.'
    }
  ];

  const certifications = [
    'ISO 9001:2015 Quality Management',
    'ISO 14001:2015 Environmental Management',
    'RoHS Compliance',
    'REACH Compliance',
    'Conflict-Free Minerals',
    'UL Certification',
    'CE Marking',
    'FCC Compliance'
  ];

  return (
    <main className="min-h-screen bg-white">
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

      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-gold">Quality Standards</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Discover the rigorous quality assurance processes and industry certifications that make
            Midas Technical Solutions the trusted choice for professional repair parts and tools.
          </p>
        </div>
      </section>

      <section className="py-20 bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="bg-gold text-navy px-6 py-3 rounded-xl font-bold text-xl inline-block mb-6">
                MidasTech 7.0 Technology
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Unmatched Quality and Reliability</h2>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                Our proprietary MidasTech 7.0 Technology represents the pinnacle of quality assurance
                in the mobile repair industry. This comprehensive system ensures every product meets
                the highest standards of performance, durability, and compatibility.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-gold" />
                  <span>Advanced material analysis and testing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-gold" />
                  <span>Real-world performance validation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-gold" />
                  <span>Continuous quality monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-gold" />
                  <span>Lifetime performance guarantee</span>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 p-8 rounded-2xl backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-6">Quality Metrics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-100">Defect Rate</span>
                    <span className="text-gold font-bold">Less than 0.01%</span>
                  </div>
                  <div className="w-full bg-blue-900 rounded-full h-2">
                    <div className="bg-gold h-2 rounded-full" style={{ width: '99.9%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-100">Performance Rating</span>
                    <span className="text-gold font-bold">99.8%</span>
                  </div>
                  <div className="w-full bg-blue-900 rounded-full h-2">
                    <div className="bg-gold h-2 rounded-full" style={{ width: '99.8%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-100">Customer Satisfaction</span>
                    <span className="text-gold font-bold">98.5%</span>
                  </div>
                  <div className="w-full bg-blue-900 rounded-full h-2">
                    <div className="bg-gold h-2 rounded-full" style={{ width: '98.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Quality Standards</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every product in our catalog adheres to these comprehensive quality standards,
              ensuring reliability and performance that professionals can depend on.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {standards.map((standard, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                  <standard.icon size={24} className="text-gold" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{standard.title}</h3>
                <p className="text-gray-600 leading-relaxed">{standard.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Certifications & Compliance</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Our commitment to quality is backed by industry-leading certifications and compliance standards.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <Award size={24} className="text-gold mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-900 text-center">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Testing Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every product undergoes a comprehensive testing regimen before reaching our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-gold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Incoming Inspection</h3>
              <p className="text-gray-600">Raw materials and components are inspected for quality and specifications upon arrival.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-gold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">In-Process Testing</h3>
              <p className="text-gray-600">Continuous monitoring and testing throughout the manufacturing and assembly process.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-gold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Final Validation</h3>
              <p className="text-gray-600">Complete functionality testing and quality assurance before packaging and shipping.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gold bg-opacity-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Quality You Can Trust</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Experience the difference that rigorous quality standards and industry-leading certifications make.
            Join thousands of professionals who trust Midas Technical Solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gold hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Request Quality Documentation
            </Link>
            <Link
              href="/bulk-orders"
              className="border border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View Certified Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
