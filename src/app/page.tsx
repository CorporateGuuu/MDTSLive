'use client';
import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import HeroCarousel from '../components/HeroCarousel';
import WhatsAppButton from '../components/WhatsAppButton';
import Script from 'next/script';

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
  }
}







function QualityStandardsSection() {
  return (
    <>
      {/* QUALITY STANDARDS SECTION – STUNNING REAL IMAGES (2025 EDITION) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT: Discover Quality + Floating iPhone Stack */}
            <div className="text-center lg:text-left space-y-10">
              <div className="relative">
                <h2 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
                  Discover Our<br />
                  <span className="relative">
                    Quality Standards
                    <span className="absolute -top-10 -left-12 flex space-x-2">
                      <span className="w-5 h-5 bg-red-500 rounded-full animate-ping"></span>
                      <span className="w-4 h-4 bg-orange-400 rounded-full animate-ping delay-100"></span>
                      <span className="w-5 h-5 bg-cyan-500 rounded-full animate-ping delay-200"></span>
                      <span className="w-3 h-3 bg-gray-700 rounded-full animate-ping delay-300"></span>
                    </span>
                  </span>
                </h2>
              </div>

              <p className="text-xl text-gray-600 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Click here to explore all the qualities that set us apart.
              </p>

              {/* Floating iPhone Stack – REAL PHOTOS */}
              <div className="relative h-96 lg:h-[520px] mx-auto lg:mx-0">
                <img src="https://i.imgur.com/8YkR2fK.png" alt="iPhone 15 Pro Max floating"
                     className="absolute top-10 left-1/2 -translate-x-1/2 w-64 lg:w-80 drop-shadow-2xl animate-float" />
                <img src="https://i.imgur.com/3fM9n1P.png" alt="iPhone 15 Pro"
                     className="absolute top-0 left-1/4 w-60 lg:w-72 drop-shadow-2xl animate-float delay-300" />
                <img src="https://i.imgur.com/vL8xY9j.png" alt="iPhone 15"
                     className="absolute top-20 right-1/4 w-56 lg:w-68 drop-shadow-2xl animate-float delay-600" />
              </div>

              <a href="#" className="inline-block px-12 py-6 bg-gradient-to-r from-sky-600 to-blue-700 text-white font-black text-xl rounded-full shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 hover:scale-105">
                Explore Quality Standards
              </a>
            </div>

            {/* RIGHT: AQ7 Technology – PREMIUM LOOK */}
            <div className="space-y-10 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                {/* AQ7 Logo with glow */}
                <div className="relative">
                  <img src="https://i.imgur.com/5mK8vL2.png" alt="AQ7 Technology Logo"
                       className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl shadow-2xl animate-spin-slow" />
                  <div className="absolute inset-0 bg-cyan-400 rounded-3xl blur-3xl opacity-60 animate-pulse"></div>
                </div>

                <h3 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 bg-clip-text text-transparent leading-tight">
                  AQ7 TECHNOLOGY
                </h3>
              </div>

              <h4 className="text-4xl font-bold text-gray-900">Unmatched Quality and Reliability</h4>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Top-tier materials and rigorous quality control for reliable performance.
              </p>

              {/* Hero Phone with AQ7 badge */}
              <div className="relative mx-auto lg:mx-0 w-80 lg:w-96">
                <img src="https://i.imgur.com/Q8vR9Zm.png" alt="iPhone with AQ7 badge"
                     className="relative z-10 drop-shadow-3xl rounded-3xl" />
                <img src="https://i.imgur.com/X7kP3Lm.png" alt="AQ7 Badge"
                     className="absolute bottom-8 right-8 w-24 lg:w-32 animate-bounce" />
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-3xl blur-3xl opacity-50 animate-pulse"></div>
              </div>
            </div>

          </div>

          {/* BOTTOM BADGES – UPGRADED VISUALS */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5 11H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h4 className="font-black text-gray-900 text-lg">Lifetime Warranty</h4>
              <p className="text-gray-600">on all repair parts</p>
            </div>

            <div className="group bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <h4 className="font-black text-gray-900 text-lg">Ready to Sell</h4>
              <p className="text-gray-600">pre-owned devices</p>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h4 className="font-black text-gray-900 text-lg">Retail Ready</h4>
              <p className="text-gray-600">accessories & packaging</p>
            </div>

            <div className="group bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0l-4-4m4 4l4-4"/>
                </svg>
              </div>
              <h4 className="font-black text-gray-900 text-lg">Tools & Supplies</h4>
              <p className="text-gray-600">for your workshop</p>
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-30px) rotate(-4deg); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-600 { animation-delay: 0.6s; }
        .animate-spin-slow { animation: spin 30s linear infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </>
  );
}

function BackToTopButton() {
  return (
    <button
      id="back-to-top"
      className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-sky-600 to-blue-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:shadow-sky-500/50 transform hover:scale-110 transition-all duration-300 opacity-0 invisible"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
      </svg>
    </button>
  );
}

function PremiumFooter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setError(true);
      setTimeout(() => setError(false), 4000);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      // Fake API call (replace with real Mailchimp endpoint)
      await new Promise(resolve => setTimeout(resolve, 1200));

      setLoading(false);
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 6000);
    } catch (err) {
      setLoading(false);
      setError(true);
      setTimeout(() => setError(false), 4000);
    }
  };

  return (
    <>
      {/* STICKY BACK TO TOP BUTTON */}
      <BackToTopButton />

      {/* COMPACT PREMIUM FOOTER + NEWSLETTER */}
      <footer className="bg-gray-950 text-gray-400 pt-16 pb-8">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">

          {/* Newsletter + Logo Row */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-4xl font-black text-white mb-4">
                Midas<span className="text-sky-500">Technical Solutions</span>
              </h2>
              <p className="text-gray-500">Join 50,000+ repair shops getting exclusive deals weekly.</p>
            </div>

            {/* Newsletter Form */}
            <div>
              <form onSubmit={handleSubscribe} id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" target="_blank">
                <input type="hidden" name="u" value="YOUR_U_VALUE" />
                <input type="hidden" name="id" value="YOUR_ID_VALUE" />

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      name="EMAIL"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Your business email"
                      className="w-full px-6 py-4 bg-gray-900 border rounded-2xl focus:border-sky-500 focus:outline-none transition text-white"
                    />

                    {error && (
                      <div className="absolute inset-y-0 right-3 flex items-center text-red-400 text-sm">
                        Invalid email
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-10 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-2xl hover:shadow-xl transform hover:-translate-y-1 transition flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {!loading && !success && <span>Subscribe Now</span>}
                    {loading && <span>Subscribing...</span>}
                    {success && <span>Subscribed!</span>}
                  </button>
                </div>

                {success && (
                  <div className="mt-4 text-green-400 font-bold transition-opacity duration-300">
                    Thank you! Check your email for exclusive deals.
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Main Footer Grid – Super Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10">

            <div className="lg:col-span-3 space-y-6">
              <div className="flex gap-3">
                <select className="bg-gray-900 rounded-xl px-4 py-2 text-sm">
                  <option>United States</option>
                </select>
                <select className="bg-gray-900 rounded-xl px-4 py-2 text-sm">
                  <option>English</option>
                </select>
                <select className="bg-gray-900 rounded-xl px-4 py-2 text-sm">
                  <option>USD $</option>
                </select>
              </div>
              <div className="flex gap-4">
                <img src="https://i.imgur.com/5rVI1jP.png" alt="R2" className="h-10" />
                <img src="https://i.imgur.com/Kt3Ew1m.png" alt="ISO" className="h-10" />
                <img src="https://i.imgur.com/8nL2pXm.png" alt="ISO" className="h-10" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white">About</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white">Quality Standards</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Return Policy</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white">My Account</a></li>
                <li><a href="#" className="hover:text-white">LCD Buyback</a></li>
                <li><a href="#" className="hover:text-white">Pre-Owned</a></li>
              </ul>
            </div>

            <div className="space-y-4 lg:col-span-2">
              <h4 className="font-bold text-white">Support</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Location
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9 9 0 01-6.5-2.757"/>
                  </svg>
                  Live Chat
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  Phone
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                  </svg>
                  WhatsApp
                </li>
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h4 className="font-bold text-white mb-4">Authorized Distributor</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-white/20 transition">
                  <img src="https://i.imgur.com/7v6f7gN.png" className="h-7" />
                  Apple
                </div>
                <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-white/20 transition">
                  <img src="https://i.imgur.com/2jX5p8K.png" className="h-7" />
                  Google
                </div>
                <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-white/20 transition">
                  <img src="https://i.imgur.com/1pL9q3m.png" className="h-7" />
                  OnePlus
                </div>
                <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3 hover:bg-white/20 transition">
                  <img src="https://i.imgur.com/m9k2xLp.png" className="h-7" />
                  Motorola
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
            <div className="flex flex-wrap justify-center gap-6">
              <img src="https://i.imgur.com/3fG7p9k.png" className="h-7" alt="Visa" />
              <img src="https://i.imgur.com/9kLm2xP.png" className="h-7" alt="PayPal" />
              <img src="https://i.imgur.com/1pL9q3m.png" className="h-7" alt="Apple Pay" />
              <span className="text-gray-500">+ 12 more</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">Facebook</a>
              <a href="#" className="hover:text-white transition">Instagram</a>
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">YouTube</a>
              <a href="#" className="hover:text-white transition">LinkedIn</a>
            </div>
          </div>

          <p className="text-center text-gray-600 text-xs mt-8">
            © 2025 Midas Technical Solutions • All trademarks are property of their respective owners
          </p>
        </div>
      </footer>

      {/* BACK TO TOP SCRIPT */}
      <script dangerouslySetInnerHTML={{
        __html: `
          const backToTop = document.getElementById('back-to-top');
          window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
              backToTop.classList.remove('opacity-0', 'invisible');
              backToTop.classList.add('opacity-100', 'visible');
            } else {
              backToTop.classList.add('opacity-0', 'invisible');
              backToTop.classList.remove('opacity-100', 'visible');
            }
          });
        `
      }} />
    </>
  );
}



export default function Home() {
  return (
    <div className="min-h-screen bg-white pt-8">
      <NavBar />
      <HeroCarousel />
      <QualityStandardsSection />
      <PremiumFooter />
      <WhatsAppButton />

      {/* Kommunicate Chat Widget */}
      <Script
        src="https://widget.kommunicate.io/v2/kommunicate.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined') {
            (window as any).kommunicateSettings = {
              "appId": "YOUR_KM_WIDGET_ID",  // Replace with your Kommunicate widget ID
              "popupWidget": true,
              "automaticChatOpenOnNavigation": false,
              "welcomeMessage": "Hi! How can I help with parts today?",
              "branding": { "hideWidgetBranding": true },
              "dialogflow": { "enabled": true }  // Enables your Dialogflow agent
            };
          }
        }}
      />
    </div>
  );
}
