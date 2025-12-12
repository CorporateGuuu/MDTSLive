'use client';

import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Support',
      value: 'support@midastechnical.com',
      description: 'General inquiries and customer support',
      action: 'mailto:support@midastechnical.com'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      value: '+1 (888) 545-2121',
      description: 'Call us for immediate assistance',
      action: 'tel:+18885452121'
    },
    {
      icon: MapPin,
      title: 'Business Address',
      value: 'Innovation City, USA',
      description: 'Headquarters and main distribution center',
      action: '#'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: '24/7 Support',
      description: 'Available around the clock for urgent orders',
      action: '#'
    }
  ];

  const faqs = [
    {
      question: 'How do I place a wholesale order?',
      answer: 'Contact our sales team at sales@midastechnical.com or call +1 (888) 545-2121 to discuss your wholesale needs and get a personalized quote.'
    },
    {
      question: 'What are your shipping options?',
      answer: 'We offer worldwide shipping with multiple carriers including FedEx, DHL, and UPS. Express shipping is available for urgent orders.'
    },
    {
      question: 'Do you offer technical support?',
      answer: 'Yes, our technical team provides comprehensive support for repair procedures, part compatibility, and troubleshooting guidance.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unused items in original packaging. Defective items are covered by our lifetime warranty.'
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
            Contact <span className="text-gold">Midas Technical Solutions</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Get in touch with our expert team for wholesale pricing, technical support,
            and all your mobile repair parts and tools needs.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-gold bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <info.icon size={24} className="text-gold" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gold font-semibold mb-1">{info.value}</p>
                <p className="text-gray-600 text-sm mb-4">{info.description}</p>
                {info.action.startsWith('mailto:') || info.action.startsWith('tel:') ? (
                  <a
                    href={info.action}
                    className="text-gold hover:text-opacity-80 text-sm font-medium transition-colors"
                  >
                    Contact Us →
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">Visit Us</span>
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700">Thank you for contacting us. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
                        placeholder="Your Company Name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
                        placeholder="+1 (888) 545-2121"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type</label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="wholesale">Wholesale Pricing</option>
                      <option value="technical">Technical Support</option>
                      <option value="shipping">Shipping & Returns</option>
                      <option value="partnership">Partnership Opportunities</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors resize-vertical"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold hover:bg-opacity-90 disabled:bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <p className="text-gray-600 mb-8">
                Find quick answers to common questions about our products and services.
              </p>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gold bg-opacity-10 rounded-lg border border-gold border-opacity-20">
                <h3 className="text-lg font-semibold text-gold mb-3">Need Immediate Assistance?</h3>
                <p className="text-gray-700 mb-4">
                  For urgent orders or technical support, call our hotline directly.
                </p>
                <a
                  href="tel:+18885452121"
                  className="inline-flex items-center space-x-2 bg-gold hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Phone size={18} />
                  <span>Call +1 (888) 545-2121</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of repair professionals who trust Midas Technical Solutions
            for their wholesale mobile parts and tools needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/bulk-orders"
              className="bg-gold hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Explore Wholesale Pricing
            </Link>
            <Link
              href="/support"
              className="border border-white text-white hover:bg-white hover:text-navy px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Technical Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
