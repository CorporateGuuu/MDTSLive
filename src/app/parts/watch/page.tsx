import { getProductsBySubcategory } from '../../../lib/supabase';
import ProductGrid from '../../../components/Product/ProductGrid';
import Breadcrumb from '../../../components/Breadcrumb';

const watchModels = [
  { name: 'Apple Watch Ultra 2', slug: 'series-ultra-2', description: 'Titanium Case • Action Button • Rugged Design' },
  { name: 'Apple Watch Series 10', slug: 'series-10', description: 'Slimmer Design • Bigger Display • Always-On Retina' },
  { name: 'Apple Watch SE (2024)', slug: 'se-2024', description: 'Essential Features • Crash Detection • Precision Finding' },
];

export const metadata = {
  title: 'Apple Watch Parts - Screens, Batteries, Bands | Nexus Tech Hub',
  description: 'Premium replacement parts for all Apple Watch models. Screens, batteries, bands, sensors. Fast USA shipping.',
};

export default async function WatchPartsPage() {
  const featuredProducts = await getProductsBySubcategory('watch');

  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'Parts' }, { label: 'Apple Watch' }]} />

          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">Apple Watch Parts</h1>
          <p className="text-gray-600 mb-8">Premium replacement screens, batteries, bands & more for all Apple Watch models</p>

          {/* Model Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {watchModels.map((model) => (
              <a
                key={model.slug}
                href={`/parts/watch/${model.slug}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-blue-600 hover:shadow-lg transition"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{model.name}</h3>
                <p className="text-sm text-gray-600">{model.description}</p>
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
