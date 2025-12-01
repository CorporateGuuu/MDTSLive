'use client';

import Link from 'next/link';

export default function Categories() {
  const categories = [
    {
      name: 'iPhone Parts',
      description: 'iPhone 5 to iPhone 16 series',
      image: '/images/categories/iphone-parts.jpg',
      count: '500+ products',
      link: '/products/iphone-parts',
      color: '#007AFF'
    },
    {
      name: 'Samsung Parts',
      description: 'Galaxy S, A, Note, Tab series',
      image: '/images/categories/samsung-parts.jpg',
      count: '600+ products',
      link: '/products/samsung-parts',
      color: '#00D4AA'
    },
    {
      name: 'iPad Parts',
      description: 'iPad, iPad Air, iPad Pro',
      image: '/images/categories/ipad-parts.jpg',
      count: '200+ products',
      link: '/products/ipad-parts',
      color: '#5856D6'
    },
    {
      name: 'Repair Tools',
      description: 'Professional equipment',
      image: '/images/categories/repair-tools.jpg',
      count: '150+ products',
      link: '/products/repair-tools',
      color: '#FF9500'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Product Range</h2>
          <p className="text-gray-600">Complete range of repair parts for all major brands</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={category.link} className="group">
              <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {category.name.split(' ')[0][0]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-red-600 transition">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                  <span className="text-red-600 font-medium text-sm">{category.count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
