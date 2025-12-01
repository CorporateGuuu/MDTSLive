'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function NewsletterFooter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/about/story' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' }
  ];

  const categories = [
    { name: 'iPhone Parts', href: '/categories/iphone-parts' },
    { name: 'iPad Parts', href: '/categories/ipad-parts' },
    { name: 'MacBook Parts', href: '/categories/macbook-parts' },
    { name: 'Samsung Parts', href: '/categories/samsung-parts' },
    { name: 'Gaming', href: '/categories/gaming' }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/support' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Warranty', href: '/warranty' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/nexustechhub', color: '#1877f2' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/nexustechhub', color: '#1da1f2' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/nexustechhub', color: '#e4405f' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/nexustechhub', color: '#0077b5' }
  ];

  return (
    <footer style={{ height: '400px' }}>
      {/* Newsletter Section */}
      <div className="bg-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="d-flex align-items-center">
                <Mail className="text-primary me-3" size={24} />
                <div>
                  <h5 className="mb-1 text-dark font-weight-bold">Stay Updated</h5>
                  <p className="mb-0 text-muted">Subscribe to our newsletter for the latest updates and exclusive offers</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <form onSubmit={handleSubscribe} className="d-flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="form-control flex-grow-1"
                  required
                  style={{ borderRadius: '0.375rem' }}
                />
                <button
                  type="submit"
                  className="btn btn-primary px-4 d-flex align-items-center"
                  style={{ borderRadius: '0.375rem' }}
                >
                  {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                  {!isSubscribed && <ArrowRight className="ms-2" size={16} />}
                </button>
              </form>
              {isSubscribed && (
                <div className="text-success mt-2 small">
                  ✓ Thank you for subscribing! Check your email for confirmation.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-dark text-white py-5" style={{ height: '320px' }}>
        <div className="container mx-auto px-4 h-100">
          <div className="row h-100">
            {/* Company Links */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h6 className="text-uppercase font-weight-bold mb-3">Company</h6>
              <ul className="list-unstyled">
                {companyLinks.map((link) => (
                  <li key={link.name} className="mb-2">
                    <Link href={link.href} className="text-white text-decoration-none hover-primary">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h6 className="text-uppercase font-weight-bold mb-3">Categories</h6>
              <ul className="list-unstyled">
                {categories.map((category) => (
                  <li key={category.name} className="mb-2">
                    <Link href={category.href} className="text-white text-decoration-none hover-primary">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h6 className="text-uppercase font-weight-bold mb-3">Support</h6>
              <ul className="list-unstyled">
                {supportLinks.map((link) => (
                  <li key={link.name} className="mb-2">
                    <Link href={link.href} className="text-white text-decoration-none hover-primary">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h6 className="text-uppercase font-weight-bold mb-3">Contact Us</h6>
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <Phone className="me-2" size={16} />
                  <a href="tel:+971501234567" className="text-white text-decoration-none hover-primary">
                    +971 50 123 4567
                  </a>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <Mail className="me-2" size={16} />
                  <a href="mailto:support@nexustechhub.com" className="text-white text-decoration-none hover-primary">
                    support@nexustechhub.com
                  </a>
                </div>
                <div className="d-flex align-items-start mb-3">
                  <MapPin className="me-2 mt-1" size={16} />
                  <span className="text-white">
                    Dubai, UAE
                  </span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="d-flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover-scale"
                    style={{
                      transition: 'all 0.3s ease',
                      width: '30px',
                      height: '30px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                      e.currentTarget.style.color = social.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.color = 'white';
                    }}
                  >
                    <social.icon size={30} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-dark border-top border-secondary py-3">
        <div className="container mx-auto px-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 text-white small">
                © 2025 Midas Technical Solutions. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex justify-content-md-end gap-4 small">
                <Link href="/privacy" className="text-white text-decoration-none hover-primary">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-white text-decoration-none hover-primary">
                  Terms of Service
                </Link>
                <Link href="/sitemap" className="text-white text-decoration-none hover-primary">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-primary:hover {
          color: #007bff !important;
          transition: color 0.3s ease;
        }

        .hover-scale {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .hover-scale:hover {
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          footer {
            height: auto !important;
          }

          .bg-dark {
            height: auto !important;
          }
        }
      `}</style>
    </footer>
  );
}
