'use client';

import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-16 bg-red-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Your Wholesale Order Today</h2>
        <p className="text-xl mb-8 opacity-90">Join thousands of repair shops worldwide</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
            Shop Now
          </Link>
          <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-red-600 transition">
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
