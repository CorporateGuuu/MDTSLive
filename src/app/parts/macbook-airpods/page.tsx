import { getProductsBySubcategory } from '../../../lib/supabase';
import ProductGrid from '../../../components/Product/ProductGrid';
import Breadcrumb from '../../../components/Breadcrumb';

const macbookAirpodsItems = [
  { name: 'MacBook Pro', slug: 'macbook-pro', description: 'M3/M4 Chips • Liquid Retina XDR • Pro Performance' },
  { name: 'AirPods Pro (2nd Gen)', slug: 'airpods-pro-2', description: 'Active Noise Cancellation • Spatial Audio • MagSafe Charging' },
];

export const metadata = {
  title: 'MacBook & AirPods Parts - Displays, Batteries, Accessories | Midas Technical Solutions',
  description: 'Premium replacement parts for MacBook and AirPods. Screens, batteries, charging cases, accessories.',
};

export default async function MacBookAirPodsPage() {
  const featuredProducts = await getProductsBySubcategory('macbook-airpods');

  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'Parts' }, { label: 'MacBook & AirPods' }]} />

          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">MacBook & AirPods Parts</h1>
          <p className="text-gray-600 mb-8">Premium replacement screens, batteries, accessories for MacBook and AirPods</p>

          {/* Product Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {macbookAirpodsItems.map((item) => (
              <a
                key={item.slug}
                href={`/parts/macbook-airpods/${item.slug}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-blue-600 hover:shadow-lg transition"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </a>
            ))}
          </div>

          {/* Product Grid */}
          <ProductGrid products={featuredProducts} />
        </div>
      </div>
    </>
  );
}
