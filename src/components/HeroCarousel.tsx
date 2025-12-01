'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence, Variant } from 'framer-motion';

// Slides data (easily replaceable with API later)
const slides = [
  { id: 1, url: "/hero/slide1.jpg" },
  { id: 2, url: "https://i.imgur.com/8vL2mK9.jpg" },
  { id: 3, url: "https://i.imgur.com/fF9pR3s.jpg" },
  { id: 4, url: "https://i.imgur.com/X7nQvL2.jpg" },
  { id: 5, url: "https://i.imgur.com/mP4cZ8x.jpg" },
  { id: 6, url: "https://i.imgur.com/rT5vH9y.jpg" },
];

// Advanced Framer Motion Variants with blur effects
const slideVariants: Record<string, Variant> = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    filter: 'blur(10px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.6 },
      scale: { duration: 0.6 },
      filter: { duration: 0.6 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    filter: 'blur(10px)',
    transition: { duration: 0.5 },
  }),
};

const ctaVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.6, type: 'spring' as const, stiffness: 200 },
  },
};

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  // Countdown – ends Dec 5, 2025 23:59:59 Dubai
  const calculateTimeLeft = () => {
    const diff = +new Date('2025-12-05T23:59:59+04:00') - +new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(diff / (86400000)),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const goToNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  // Auto-play
  useEffect(() => {
    const interval = setInterval(goToNext, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [slides.length]);

  const openWhatsApp = () => {
    window.open(
      'https://wa.me/971585531029?text=Hi%20Nexus%20Team!%20I%20want%20the%20Black%20Friday%20bulk%20deal%20before%20it%20ends!',
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl bg-black" role="region" aria-roledescription="carousel">
      <div className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[2560/900] cursor-grab active:cursor-grabbing select-none">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <Image
              src={slides[current].url}
              alt={`Nexus TechHub Premium Wholesale - Slide ${current + 1}`}
              fill
              priority={current <= 1}
              loading={current > 1 ? 'lazy' : 'eager'}
              quality={90}
              className="object-cover"
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </motion.div>
        </AnimatePresence>

        {/* WhatsApp CTA + Countdown – only on last slide */}
        {current === slides.length - 1 && (
          <>
            {/* Countdown */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none">
              <div className="absolute inset-x-0 bottom-48 md:bottom-64 text-center">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white text-2xl md:text-5xl font-black mb-10 drop-shadow-2xl tracking-wider"
                >
                  Black Friday Bulk Deals End In
                </motion.p>
                <div className="flex justify-center gap-6 md:gap-12">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <motion.div
                      key={unit}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <div className="bg-black/90 backdrop-blur-2xl border-2 border-sky-500/60 text-sky-400 text-6xl md:text-9xl font-black rounded-3xl w-28 h-28 md:w-40 md:h-40 flex items-center justify-center shadow-2xl">
                        {String(value).padStart(2, '0')}
                      </div>
                      <p className="text-white/90 text-lg md:text-2xl mt-4 font-medium uppercase">{unit}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* WhatsApp CTA Button */}
            <motion.button
              variants={ctaVariants}
              initial="hidden"
              animate="visible"
              onClick={openWhatsApp}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl md:text-3xl px-12 py-6 rounded-3xl shadow-2xl flex items-center gap-5 backdrop-blur-xl border border-white/30 hover:scale-110 transition-all duration-300"
            >
              <MessageCircle className="w-10 h-10" />
              Get Bulk Quote on WhatsApp NOW
            </motion.button>
          </>
        )}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          aria-label="Previous slide"
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-5 rounded-full backdrop-blur-xl transition-all hover:scale-110"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
        <button
          onClick={goToNext}
          aria-label="Next slide"
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-5 rounded-full backdrop-blur-xl transition-all hover:scale-110"
        >
          <ChevronRight className="w-10 h-10" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-3 rounded-full transition-all duration-500 ${
                i === current ? 'w-16 bg-gradient-to-r from-sky-400 to-cyan-500 shadow-lg' : 'w-3 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
