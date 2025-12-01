'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer for 24 hours from now
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 24);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      type: 'hero',
      title: 'New devices mean new repairs...',
      subtitle: 'Genuine Apple Parts',
      cta: 'Shop Now',
      link: '/products',
      bgImage: '/images/hero-repair-parts.svg',
      isWhiteText: true
    },
    {
      type: 'promo',
      shippingText: 'FREE SHIPPING on orders over $100',
      bgImage: '/images/hero-banner.jpg',
      isWhiteText: false
    },
    {
      type: 'promo',
      shippingText: 'FREE SHIPPING on orders over $200',
      bgImage: '/images/product-detail-1.jpg',
      isWhiteText: false
    },
    {
      type: 'promo',
      shippingText: 'FREE SHIPPING on orders over $300',
      bgImage: '/images/product-detail-2.jpg',
      isWhiteText: false
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative">
      <div className="hero-slider relative overflow-hidden" style={{ height: '600px' }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`slide absolute inset-0 transition-opacity duration-1000 ${
              i === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ height: '600px' }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.bgImage})`,
                backgroundColor: slide.type === 'hero' ? '#f3f4f6' : '#ffffff'
              }}
            />

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-40" />

            {/* Content */}
            <div className="relative h-full flex items-center justify-center text-center px-4">
              {slide.type === 'hero' ? (
                <div className="max-w-4xl">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white font-sans">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-white font-sans">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.link || '/products'}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 inline-block font-sans"
                    style={{ backgroundColor: '#007bff' }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#0056b3'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#007bff'}
                  >
                    {slide.cta}
                  </Link>
                </div>
              ) : (
                <div className="max-w-4xl">
                  <div className="text-green-400 text-2xl md:text-4xl font-bold mb-6 font-sans">
                    {slide.shippingText}
                  </div>

                  {/* Countdown Timer */}
                  <div className="flex justify-center gap-4 mb-6">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
                      <div className="text-2xl font-bold font-sans">{timeLeft.days.toString().padStart(2, '0')}</div>
                      <div className="text-sm font-sans">Days</div>
                    </div>
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
                      <div className="text-2xl font-bold font-sans">{timeLeft.hours.toString().padStart(2, '0')}</div>
                      <div className="text-sm font-sans">Hours</div>
                    </div>
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
                      <div className="text-2xl font-bold font-sans">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                      <div className="text-sm font-sans">Min</div>
                    </div>
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
                      <div className="text-2xl font-bold font-sans">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                      <div className="text-sm font-sans">Sec</div>
                    </div>
                  </div>

                  <Link
                    href="/products"
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 inline-block font-sans"
                    style={{ backgroundColor: '#007bff' }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#0056b3'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#007bff'}
                  >
                    Shop Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-600 bg-opacity-80 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-300 z-10"
          style={{ backgroundColor: 'rgba(0, 123, 255, 0.8)' }}
          onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(0, 123, 255, 0.8)'}
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 bg-opacity-80 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-300 z-10"
          style={{ backgroundColor: 'rgba(0, 123, 255, 0.8)' }}
          onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'rgba(0, 123, 255, 0.8)'}
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                i === currentSlide ? 'bg-blue-600' : 'bg-blue-400 bg-opacity-50'
              }`}
              style={{
                backgroundColor: i === currentSlide ? '#007bff' : 'rgba(0, 123, 255, 0.5)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {['100% Quality Tested', 'Fast UAE Shipping', '30-Day Returns'].map((text, i) => (
            <div key={i} className="flex items-center gap-3 justify-center md:justify-start">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <span className="font-medium font-sans">{text}</span>
            </div>
          ))}
        </div>
      </div>


    </section>
  );
}
