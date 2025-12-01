'use client';

import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CategoriesGrid() {
  const categories = [
    { name: 'iPhone Parts', image: '/images/categories/iphone-parts.jpg', link: '/categories/iphone-parts' },
    { name: 'iPad Parts', image: '/images/categories/ipad-parts.jpg', link: '/categories/ipad-parts' },
    { name: 'MacBook Parts', image: '/images/categories/macbook-parts.jpg', link: '/categories/macbook-parts' },
    { name: 'Watch Parts', image: '/images/categories/watch-parts.jpg', link: '/categories/watch-parts' },
    { name: 'AirPods Parts', image: '/images/categories/airpods-parts.jpg', link: '/categories/airpods-parts' },
    { name: 'Samsung Parts', image: '/images/categories/samsung-parts.jpg', link: '/categories/samsung-parts' },
    { name: 'Game Console', image: '/images/categories/game-console.jpg', link: '/categories/game-console' },
    { name: 'Motorola Parts', image: '/images/categories/motorola-parts.jpg', link: '/categories/motorola-parts' },
    { name: 'Google Parts', image: '/images/categories/google-parts.jpg', link: '/categories/google-parts' },
    { name: 'OnePlus Parts', image: '/images/categories/oneplus-parts.jpg', link: '/categories/oneplus-parts' },
    { name: 'Sony Parts', image: '/images/categories/sony-parts.jpg', link: '/categories/sony-parts' },
    { name: 'Other Brands', image: '/images/categories/other-brands.jpg', link: '/categories/other-brands' }
  ];

  return (
    <section className="py-5" style={{ backgroundColor: 'white', height: '400px', margin: '20px' }}>
      <div className="container">
        <div className="row g-3">
          {categories.map((category, index) => (
            <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12">
              <div className="category-card h-100">
                <Link href={category.link} className="text-decoration-none">
                  <div
                    className="card border-0 shadow-sm h-100 category-card-inner"
                    style={{
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div
                      className="card-img-top d-flex align-items-center justify-content-center bg-light"
                      style={{
                        height: '200px',
                        width: '100%',
                        backgroundColor: '#f8f9fa',
                        borderTopLeftRadius: '0.375rem',
                        borderTopRightRadius: '0.375rem'
                      }}
                    >
                      <div
                        className="bg-secondary d-flex align-items-center justify-content-center text-white"
                        style={{
                          width: '300px',
                          height: '200px',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        {category.name} Image
                      </div>
                    </div>
                    <div className="card-body text-center p-3">
                      <h6
                        className="card-title mb-0"
                        style={{
                          color: '#007bff',
                          fontWeight: '600',
                          fontSize: '16px'
                        }}
                      >
                        {category.name}
                      </h6>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .category-card {
          margin-bottom: 1rem;
        }

        .category-card-inner {
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-radius: 0.375rem;
          overflow: hidden;
        }

        .category-card-inner:hover {
          text-decoration: none;
        }

        @media (max-width: 575.98px) {
          .category-card {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}
