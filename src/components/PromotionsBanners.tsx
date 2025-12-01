'use client';

import Link from 'next/link';
import { Phone, Mail, ArrowRight } from 'lucide-react';

export default function PromotionsBanners() {
  return (
    <section className="py-8">
      {/* Two-Column Promo Section */}
      <div className="bg-gray-100 py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="d-flex flex-column justify-content-center h-100">
                <h3 className="h4 font-weight-bold text-dark mb-3">Get in Touch</h3>
                <p className="text-muted mb-4">
                  Need help with your repair parts? Our expert team is here to assist you.
                </p>
                <div className="d-flex flex-column gap-3">
                  <a
                    href="tel:+971501234567"
                    className="text-decoration-none d-flex align-items-center text-primary hover:text-blue-700 transition-colors"
                  >
                    <Phone className="me-2" size={20} />
                    <span>+971 50 123 4567</span>
                  </a>
                  <a
                    href="mailto:support@nexustechhub.com"
                    className="text-decoration-none d-flex align-items-center text-primary hover:text-blue-700 transition-colors"
                  >
                    <Mail className="me-2" size={20} />
                    <span>support@nexustechhub.com</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-column justify-content-center align-items-center h-100">
                <div className="text-center">
                  <h3 className="h4 font-weight-bold text-dark mb-3">Access Wholesale Pricing</h3>
                  <p className="text-muted mb-4">
                    Login to your account to view exclusive wholesale prices and bulk discounts.
                  </p>
                  <Link
                    href="/login"
                    className="btn btn-success btn-lg px-5 py-3 font-weight-bold d-inline-flex align-items-center"
                  >
                    Login Now
                    <ArrowRight className="ms-2" size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Light Blue Banner */}
      <div
        className="py-8 mb-8"
        style={{
          backgroundColor: '#e3f2fd',
          height: '250px'
        }}
      >
        <div className="container mx-auto px-4 h-100">
          <div className="row h-100 align-items-center">
            <div className="col-lg-8">
              <h2 className="display-5 font-weight-bold text-dark mb-3">
                Discover Our Quality Standards
              </h2>
              <p className="lead text-muted mb-4">
                Every part undergoes rigorous testing and quality control to ensure reliability and performance.
                Trusted by professionals worldwide for over a decade.
              </p>
              <Link
                href="/about"
                className="btn btn-outline-primary btn-lg px-4 py-3 font-weight-bold d-inline-flex align-items-center"
              >
                Learn More
                <ArrowRight className="ms-2" size={20} />
              </Link>
            </div>
            <div className="col-lg-4 d-none d-lg-block">
              <div className="text-center">
                <div
                  className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto"
                  style={{
                    width: '150px',
                    height: '150px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div className="text-center text-muted">
                    <div className="h5 mb-1">Quality</div>
                    <div className="small">Assured</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Banner */}
      <div
        className="py-8 mb-8 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          height: '300px'
        }}
      >
        <div className="container mx-auto px-4 h-100">
          <div className="row h-100 align-items-center">
            <div className="col-lg-6">
              <div className="text-white">
                <h2 className="display-4 font-weight-bold mb-3">
                  | TECHNOLOGY
                </h2>
                <p className="lead mb-4">
                  Unmatched Quality in Every Component. Advanced repair solutions powered by cutting-edge technology
                  and industry-leading standards. Experience the difference that precision engineering makes.
                </p>
                <Link
                  href="/products"
                  className="btn btn-light btn-lg px-5 py-3 font-weight-bold text-primary d-inline-flex align-items-center"
                >
                  Explore Technology
                  <ArrowRight className="ms-2" size={20} />
                </Link>
              </div>
            </div>
            <div className="col-lg-6 position-relative">
              <div className="text-center">
                <div
                  className="bg-white bg-opacity-10 rounded-lg d-flex align-items-center justify-content-center mx-auto position-relative"
                  style={{
                    width: '250px',
                    height: '200px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <div className="text-center text-white">
                    <div className="h4 mb-2">Advanced</div>
                    <div className="h6">Technology</div>
                    <div className="small mt-2">250x200 Image</div>
                  </div>

                  {/* Red "NEW" Badge */}
                  <div
                    className="position-absolute badge bg-danger text-white font-weight-bold px-3 py-2"
                    style={{
                      top: '-10px',
                      right: '-10px',
                      fontSize: '12px',
                      borderRadius: '20px'
                    }}
                  >
                    NEW
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div
          className="position-absolute"
          style={{
            top: '20%',
            right: '10%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />
        <div
          className="position-absolute"
          style={{
            bottom: '10%',
            left: '5%',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />
      </div>

      <style jsx>{`
        .btn-outline-primary:hover {
          background-color: #007bff !important;
          border-color: #007bff !important;
          color: white !important;
        }

        .btn-success:hover {
          background-color: #28a745 !important;
          border-color: #28a745 !important;
        }

        .transition-colors {
          transition: color 0.3s ease;
        }

        @media (max-width: 768px) {
          .display-4 {
            font-size: 2.5rem !important;
          }

          .display-5 {
            font-size: 2rem !important;
          }

          .btn-lg {
            padding: 0.75rem 1.5rem !important;
            font-size: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
