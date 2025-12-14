import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

interface DynamicFAQProps {
  limit?: number;
  category?: string;
  showSchema?: boolean;
  className?: string;
}

export default async function DynamicFAQ({
  limit,
  category,
  showSchema = true,
  className = ''
}: DynamicFAQProps) {
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

  // Fetch FAQs from Supabase
  let query = supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  // Filter by category if specified
  if (category) {
    query = query.eq('category', category);
  }

  // Apply limit if specified
  if (limit) {
    query = query.limit(limit);
  }

  const { data: faqs, error } = await query;

  // Fallback static FAQs if database fails
  const fallbackFAQs: FAQ[] = [
    {
      id: '1',
      question: 'Do you offer lifetime warranty on your products?',
      answer: 'Yes, all MidasGold 7.0 products come with our lifetime warranty. We stand behind the quality of our premium parts and repair tools with full replacement coverage.',
      category: 'warranty',
      display_order: 1,
      is_active: true
    },
    {
      id: '2',
      question: 'What is MidasGold 7.0 technology?',
      answer: 'MidasGold 7.0 is our proprietary advanced coating technology that provides superior durability, enhanced touch sensitivity, and improved display quality for all our screen replacements.',
      category: 'technology',
      display_order: 2,
      is_active: true
    },
    {
      id: '3',
      question: 'Do you ship internationally?',
      answer: 'Yes, we offer fast worldwide shipping with FedEx, DHL, and UPS. Orders typically ship within 24 hours for in-stock items.',
      category: 'shipping',
      display_order: 3,
      is_active: true
    }
  ];

  const activeFAQs = faqs || fallbackFAQs;

  // Generate FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": activeFAQs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* FAQ Schema Markup */}
      {showSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      )}

      {/* FAQ UI */}
      <div className={`max-w-4xl mx-auto ${className}`}>
        <div className="space-y-4">
          {activeFAQs.map((faq, index) => (
            <details
              key={faq.id}
              className="group bg-gray-50 rounded-lg p-6 border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-lg text-gray-900 group-hover:text-gold transition-colors list-none">
                <span>{faq.question}</span>
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gold transition-colors transform group-open:rotate-180 flex-shrink-0 ml-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 text-gray-700 leading-relaxed">
                <p className="whitespace-pre-line">{faq.answer}</p>
                {faq.category && (
                  <span className="inline-block mt-3 px-2 py-1 bg-gold bg-opacity-10 text-gold text-xs rounded-full">
                    {faq.category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                )}
              </div>
            </details>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions? We're here to help!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@midastechnical.com"
              className="bg-gold hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </a>
            <a
              href="tel:+18885452121"
              className="border-2 border-gold text-gold hover:bg-gold hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us
            </a>
          </div>
        </div>

        {/* Error message for debugging */}
        {error && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> Using fallback FAQ content. Database connection may need to be established.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
