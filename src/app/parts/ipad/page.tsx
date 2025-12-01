import { getProductsBySubcategory } from '../../../lib/supabase';
import ProductGrid from '../../../components/Product/ProductGrid';
import Breadcrumb from '../../../components/Breadcrumb';

const ipadModels = [
  { name: 'iPad Pro 13" (7th Gen)', slug: 'ipad-pro-13-7th-gen', description: 'M4 Chip • Tandem OLED • Ultra-Thin Design' },
  { name: 'iPad Pro 12.9" (6th Gen)', slug: 'ipad-pro-12.9-6th-gen', description: 'M4 Chip • Liquid Retina XDR • Ultra-Thin Design' },
  { name: 'iPad Air 11"', slug: 'ipad-air-11', description: 'M2 Chip • Liquid Retina • All-Day Battery' },
];

export const metadata = {
  title: 'iPad Parts - Screens, Batteries, Repairs | Midas Technical Solutions',
  description: 'Premium replacement parts for all iPad models. Screens, batteries, cameras, charging ports. Fast USA shipping.',
};

export default async function iPadPartsPage() {
  const featuredProducts = await getProductsBySubcategory('ipad');

  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'Parts' }, { label: 'iPad' }]} />

          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">iPad Parts</h1>
          <p className="text-gray-600 mb-8">Premium replacement screens, batteries, cameras & more for all iPad models</p>

          {/* Model Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {ipadModels.map((model) => (
              <a
                key={model.slug}
                href={`/parts/ipad/${model.slug}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-blue-600 hover:shadow-lg transition"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
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
