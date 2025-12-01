import Link from 'next/link';
import { getProductsBySubcategory } from '../../../lib/supabase';
import ProductGrid from '../../../components/Product/ProductGrid';
import Breadcrumb from '../../../components/Breadcrumb';

const samsungCategories = [
  {
    name: 'Galaxy S Series',
    slug: 'galaxy-s',
    description: 'Galaxy S24 Ultra, S24+, S23 Ultra, S22, S21 - Premium flagship devices',
    icon: '📱',
    featured: true,
    models: ['S24 Ultra', 'S24+', 'S23 Ultra', 'S22 Ultra']
  },
  {
    name: 'Galaxy A Series',
    slug: 'galaxy-a',
    description: 'Galaxy A54, A34, A24, A14 - Mid-range Android smartphones',
    icon: '📱'
  },
  {
    name: 'Galaxy Z Fold',
    slug: 'galaxy-z-fold',
    description: 'Galaxy Z Fold5, Z Flip5 - Premium foldable smartphones',
    icon: '📱'
  },
  {
    name: 'Galaxy Note',
    slug: 'galaxy-note',
    description: 'Galaxy Note20, Note10 - S Pen enabled productivity devices',
    icon: '📝'
  },
];

export const metadata = {
  title: 'Samsung Galaxy Parts - S24 Ultra, S23, A54, Z Fold | Midas Technical Solutions',
  description: 'Genuine Samsung Galaxy parts and components. LCD screens, batteries, motherboards, cameras. S24 Ultra, S23, A54, Z Fold, Note series.',
};

export default async function SamsungPage() {
  const featuredProducts = await getProductsBySubcategory('samsung');

  return (
    <>
      <div className="bg-gradient-to-b from-purple-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-yellow-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
            OFFICIAL SAMSUNG PARTS & COMPONENTS
          </div>
          <h1 className="text-7xl font-black mb-6">SAMSUNG GALAXY PARTS</h1>
          <p className="text-2xl mb-12 max-w-4xl mx-auto">
            Genuine OEM Parts • S24 Ultra • S23 Series • A54 • Z Fold • Note Series
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {samsungCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/parts/samsung/${category.slug}`}
                className="group block bg-white/10 backdrop-blur rounded-3xl p-8 hover:bg-white/20 transition transform hover:scale-105"
              >
                <div className="text-6xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                {category.models && (
                  <div className="text-xs text-purple-200">
                    {category.models.join(' • ')}
                  </div>
                )}
                {category.featured && (
                  <div className="mt-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}
              </Link>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6">Why Choose Samsung Parts?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold mb-4">Genuine OEM Quality</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Official Samsung parts</li>
                  <li>• Factory specifications</li>
                  <li>• Perfect compatibility</li>
                  <li>• Warranty covered</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Complete Coverage</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Galaxy S24/S23/S22/S21</li>
                  <li>• Galaxy A54/A34/A24/A14</li>
                  <li>• Galaxy Z Fold/Flip</li>
                  <li>• Galaxy Note series</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Professional Service</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Same-day shipping</li>
                  <li>• Technical support</li>
                  <li>• Bulk discounts</li>
                  <li>• 90-day warranty</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: 'Parts' }, { label: 'Samsung' }]} />

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Samsung Parts</h2>
            <ProductGrid products={featuredProducts?.slice(0, 12)} />
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Samsung Parts</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </div>
    </>
  );
}
