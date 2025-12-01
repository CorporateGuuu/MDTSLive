import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';
import { getProductsBySubcategory } from '../../../../lib/supabase';

const models = [
  { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max' },
  { name: 'iPhone 15 Pro', slug: 'iphone-15-pro' },
  { name: 'iPhone 15 Plus', slug: 'iphone-15-plus' },
  { name: 'iPhone 15', slug: 'iphone-15' },
];

export const metadata = {
  title: 'iPhone 15 Series Parts - Screens, Batteries, Cameras | Nexus Tech Hub',
  description: 'Wholesale OEM & high-quality aftermarket parts for iPhone 15, 15 Plus, 15 Pro, 15 Pro Max. Same-day shipping from USA.',
};

export default async function iPhone15SeriesPage() {
  // You can also fetch featured/top-selling products here
  const featuredProducts = await getProductsBySubcategory('iphone-15-series');

  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'Parts' }, { label: 'iPhone' }, { label: '15 Series' }]} />

          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">iPhone 15 Series Parts</h1>
          <p className="text-gray-600 mb-8">Premium replacement screens, batteries, cameras, charging ports & more</p>

          {/* Model Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {models.map((model) => (
              <a
                key={model.slug}
                href={`/parts/iphone/15-series/${model.slug}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-blue-600 hover:shadow-lg transition"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
                <span className="font-medium text-gray-900">{model.name}</span>
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
