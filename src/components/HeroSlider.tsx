'use client';
import { useState, useEffect } from 'react';

const slides = [
  {
    title: "Massive price drop<br>on <strong>Apple devices</strong>",
    subtitle: "iPhone 16, iPad 11 (2025), and Apple Watch Series 10 just got more affordable",
    cta: "Browse all Apple devices today",
    image: "https://via.placeholder.com/400x500/eee/ccc?text=Apple+Devices"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[500px] overflow-hidden bg-white">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex items-center justify-between px-5 h-full transition-opacity duration-600 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex-1 max-w-md">
            <h1
              className="text-4xl font-bold leading-tight mb-4"
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />
            <p className="text-lg text-gray-600 mb-6">{slide.subtitle}</p>
            <a
              href="#"
              className="inline-block bg-blue-50 text-blue-700 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 hover:-translate-y-0.5 transition-all duration-200"
            >
              {slide.cta}
            </a>
          </div>
          <div className="flex-1 flex justify-end">
            <img
              src={slide.image}
              alt="Hero"
              className="max-w-md h-auto object-contain"
            />
          </div>
        </div>
      ))}

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentSlide ? 'bg-gray-700' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
