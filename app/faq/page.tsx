import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import DynamicFAQ from '../components/DynamicFAQ';
import { ChevronRight, HelpCircle, MessageSquare, Phone, Mail, Clock, Shield, Truck, Award, Users, Star } from 'lucide-react';

// Generate metadata for FAQ page
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'FAQ | Midas Technical Solutions Wholesale',
    description: 'Answers to common questions about warranty, shipping, bulk orders, technical support, and wholesale pricing for phone parts and repair tools.',
    keywords: [
      'FAQ',
      'frequently asked questions',
      'wholesale support',
      'phone parts questions',
      'repair tools FAQ',
      'MidasGold warranty',
      'bulk orders support',
      'shipping questions',
      'technical support',
      'wholesale pricing FAQ'
    ],
    openGraph: {
      title: 'FAQ | Midas Technical Solutions Wholesale',
      description: 'Answers to common questions about warranty, shipping, bulk orders, technical support, and wholesale pricing.',
      url: 'https://midastechnicalsolutions.com/faq',
      siteName: 'Midas Technical Solutions',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'FAQ | Midas Technical Solutions Wholesale',
      description: 'Answers to common questions about warranty, shipping, bulk orders, technical support, and wholesale pricing.',
    },
    other: {
      'faq-page': 'true',
    },
  };
}

// ISR configuration for fresh FAQ data
export const revalidate = 3600; // Revalidate every hour

// Grouped FAQ component
async function GroupedFAQ() {
  // Create server Supabase client
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Fetch all active FAQs
  const { data: faqs, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('display_order', { ascending: true });

  // Group FAQs by category
  const groupedFAQs = faqs?.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, any[]>) || {};

  // Category labels for display
  const categoryLabels: Record<string, string> = {
    'general': 'General Questions',
    'warranty': 'Warranty & Quality',
    'shipping': 'Shipping & Delivery',
    'certification': 'Certifications & Authenticity',
    'ordering': 'Ordering & Pricing',
    'pricing': 'Wholesale Pricing',
    'support': 'Technical Support',
    'payment': 'Payment & Billing',
    'returns': 'Returns & Exchanges',
    'compatibility': 'Product Compatibility',
    'bulk': 'Bulk Orders',
    'company': 'About Our Company',
    'services': 'Services & Repairs',
    'technology': 'Technology & Innovation'
  };

  // Category icons
  const categoryIcons: Record<string, React.ComponentType<any>> = {
    'general': HelpCircle,
    'warranty': Shield,
    'shipping': Truck,
    'certification': Award,
    'ordering': Users,
    'pricing': Star,
    'support': MessageSquare,
    'payment': Star,
    'returns': Star,
    'compatibility': Star,
    'bulk': Star,
    'company': Star,
    'services': Star,
    'technology': Star
  };

  return (
    <div className="space-y-12">
      {Object.entries(groupedFAQs).map(([category, categoryFAQs]) => {
        const CategoryIcon = categoryIcons[category] || HelpCircle;
        const categoryLabel = categoryLabels[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        return (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {/* Category Header */}
            <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-100">
              <div className="bg-gold bg-opacity-10 p-3 rounded-lg">
                <CategoryIcon size={28} className="text-gold" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{categoryLabel}</h2>
                <p className="text-gray-600 mt-1">
                  {categoryFAQs.length} question{categoryFAQs.length !== 1 ? 's' : ''} in this category
                </p>
              </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {categoryFAQs.map((faq) => (
                <details
                  key={faq.id}
                  className="group bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-200"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-lg text-gray-900 group-hover:text-gold transition-colors list-none">
                    <span className="pr-4">{faq.question}</span>
                    <svg
                      className="w-6 h-6 text-gray-500 group-hover:text-gold transition-colors transform group-open:rotate-180 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6">
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line mt-4">
                        {faq.answer}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold bg-opacity-10 text-gold">
                          {categoryLabel}
                        </span>
                        <span className="text-xs text-gray-500">
                          Last updated: {new Date(faq.updated_at || faq.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        );
      })}

      {/* Fallback for no FAQs */}
      {(!faqs || faqs.length === 0) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <HelpCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs Available</h3>
          <p className="text-gray-600 mb-6">
            We're currently updating our FAQ section. Please contact our support team for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@midastechnical.com"
              className="bg-gold hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              <Mail size={20} className="mr-2" />
              Email Support
            </a>
            <a
              href="tel:+18885452121"
              className="border-2 border-gold text-gold hover:bg-gold hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              <Phone size={20} className="mr-2" />
              Call Us
            </a>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <HelpCircle size={24} className="text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Loading FAQs...</h3>
              <p className="text-yellow-700 mt-1">
                We're experiencing a temporary issue loading our FAQ content. Using fallback content for now.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent">
              Midas Technical Solutions FAQ
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Wholesale Support & Answers to Your Questions
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 bg-white bg-opacity-10 px-4 py-2 rounded-full">
                <Clock size={16} className="text-gold" />
                <span>24/7 Support Available</span>
              </div>
              <div className="flex items-center space-x-2 bg-white bg-opacity-10 px-4 py-2 rounded-full">
                <Shield size={16} className="text-gold" />
                <span>Lifetime Warranty</span>
              </div>
              <div className="flex items-center space-x-2 bg-white bg-opacity-10 px-4 py-2 rounded-full">
                <Truck size={16} className="text-gold" />
                <span>Fast Worldwide Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={16} />
            <span className="text-gray-900 font-medium">FAQ</span>
          </nav>
        </div>
      </section>

      {/* Main FAQ Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Find Answers to Your Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Browse our comprehensive FAQ section to learn more about our wholesale phone parts,
              repair tools, warranty coverage, shipping policies, and everything else related to
              Midas Technical Solutions.
            </p>
          </div>

          {/* Dynamic FAQ Content */}
          <GroupedFAQ />

          {/* Contact Support Section */}
          <div className="mt-20 bg-gradient-to-r from-gold to-yellow-500 rounded-2xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Still Need Help?</h3>
            <p className="text-xl mb-8 opacity-90">
              Our expert support team is here to help with any questions or concerns
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <Phone size={32} className="mx-auto mb-4 text-white" />
                <h4 className="font-semibold text-lg mb-2">Call Us</h4>
                <p className="text-sm opacity-90 mb-4">24/7 Technical Support</p>
                <a
                  href="tel:+18885452121"
                  className="bg-white text-gold px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-block"
                >
                  1-888-545-2121
                </a>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <Mail size={32} className="mx-auto mb-4 text-white" />
                <h4 className="font-semibold text-lg mb-2">Email Support</h4>
                <p className="text-sm opacity-90 mb-4">Response within 2 hours</p>
                <a
                  href="mailto:support@midastechnical.com"
                  className="bg-white text-gold px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-block"
                >
                  Email Us
                </a>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <MessageSquare size={32} className="mx-auto mb-4 text-white" />
                <h4 className="font-semibold text-lg mb-2">Live Chat</h4>
                <p className="text-sm opacity-90 mb-4">Instant messaging</p>
                <button
                  onClick={() => alert('Live chat coming soon! Please use email or phone for now.')}
                  className="bg-white text-gold px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Explore More Resources</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link
                href="/about"
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-gold"
              >
                <h4 className="font-semibold text-lg text-gray-900 mb-2">About Us</h4>
                <p className="text-gray-600 text-sm">Learn more about our company and mission</p>
              </Link>

              <Link
                href="/quality-standards"
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-gold"
              >
                <h4 className="font-semibold text-lg text-gray-900 mb-2">Quality Standards</h4>
                <p className="text-gray-600 text-sm">Our commitment to premium quality products</p>
              </Link>

              <Link
                href="/contact"
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-gold"
              >
                <h4 className="font-semibold text-lg text-gray-900 mb-2">Contact Us</h4>
                <p className="text-gray-600 text-sm">Get in touch with our support team</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Include Dynamic FAQ with Schema */}
      <DynamicFAQ showSchema={true} />
    </main>
  );
}
