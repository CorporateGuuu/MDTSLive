import { getProductsBySubcategory } from '../../../lib/supabase';
import ProductGrid from '../../../components/Product/ProductGrid';
import Breadcrumb from '@/components/Breadcrumb';

const accessoryCategories = [
  {
    name: 'Chargers & Cables',
    slug: 'chargers-cables',
    description: 'USB-C, Lightning, Wall Chargers, Car Chargers, Wireless Chargers, Power Banks',
    icon: '🔌'
  },
  {
    name: 'Cases & Protection',
    slug: 'cases-protection',
    description: 'Phone Cases, Screen Protectors, Tempered Glass, Camera Protection',
    icon: '📱'
  },
  {
    name: 'Audio',
    slug: 'audio',
    description: 'Earphones, Earbuds, Headphones, Speakers, Adapters',
    icon: '🎧'
  },
  {
    name: 'Mounts & Holders',
    slug: 'mounts-holders',
    description: 'Car Mounts, Desk Stands, Bike Mounts, Wallet Cases, PopSockets',
    icon: '📎'
  },
  {
    name: 'Gaming & Others',
    slug: 'gaming-others',
    description: 'Controllers, Gaming Headsets, Smartwatch Bands, Stylus Pens, Memory Cards',
    icon: '🎮'
  },
];

export const metadata = {
  title: 'Phone Accessories - Cases, Chargers, Audio, Mounts | Nexus Tech Hub',
  description: 'Premium phone accessories including cases, chargers, cables, audio gear, mounts, and gaming accessories. Fast USA shipping.',
};

export default async function AccessoriesPage() {
  const featuredProducts = await getProductsBySubcategory('accessories');

  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'Parts' }, { label: 'Accessories' }]} />

          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">Phone Accessories</h1>
          <p className="text-gray-600 mb-8">Premium cases, chargers, cables, audio gear, mounts & more for all your devices</p>

          {/* Category Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {accessoryCategories.map((category) => (
              <a
                key={category.slug}
                href={`/parts/accessories/${category.slug}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-blue-600 hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </a>
            ))}
          </div>

          {/* Featured Recently Added */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recently Added</h2>
              <a
                href="/parts/accessories/recently-added"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All →
              </a>
            </div>
            <ProductGrid products={featuredProducts.slice(0, 8)} />
          </div>

          {/* Product Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Accessories</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </div>
    </>
  );
}
