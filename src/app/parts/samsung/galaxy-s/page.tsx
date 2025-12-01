import Link from 'next/link';
import { getProductsBySubcategory } from '../../../../lib/supabase';
import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';

const galaxySModels = [
  {
    name: 'Galaxy S24 Ultra',
    slug: 's24-ultra',
    description: 'S928B - Titanium frame, S Pen, 200MP camera',
    icon: '📱',
    featured: true,
    price: '$1,199'
  },
  {
    name: 'Galaxy S24+',
    slug: 's24-plus',
    description: 'S926B - Premium Android flagship with AI features',
    icon: '📱',
    price: '$999'
  },
  {
    name: 'Galaxy S23 Ultra',
    slug: 's23-ultra',
    description: 'S918B - S Pen included, 200MP camera, 5000mAh battery',
    icon: '📱',
    price: '$1,199'
  },
];

export const metadata = {
  title: 'Galaxy S Series Parts - S24 Ultra, S24+, S23 Ultra | Midas Technical Solutions',
  description: 'Genuine Samsung Galaxy S series parts and components. LCD screens, batteries, motherboards, cameras for S24 Ultra, S24+, S23 Ultra.',
};

export default async function GalaxySPage() {
  const featuredProducts = await getProductsBySubcategory('galaxy-s');

  return (
    <>
      <div className="bg-gradient-to-b from-purple-800 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Parts' },
            { label: 'Samsung', href: '/parts/samsung' },
            { label: 'Galaxy S' }
          ]} />

          <div className="text-center mt-8">
            <div className="bg-yellow-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
              GALAXY S SERIES - PREMIUM FLAGSHIPS
            </div>
            <h1 className="text-6xl font-black mb-6">GALAXY S SERIES</h1>
            <p className="text-xl mb-12 max-w-3xl mx-auto">
              S24 Ultra • S24+ • S23 Ultra • S22 Ultra • S21 Ultra
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {galaxySModels.map((model) => (
              <Link
                key={model.slug}
                href={`/parts/samsung/galaxy-s/${model.slug}`}
                className="group block bg-white/10 backdrop-blur rounded-3xl p-8 hover:bg-white/20 transition transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{model.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{model.description}</p>
                <div className="text-purple-200 font-semibold">{model.price}</div>
                {model.featured && (
                  <div className="mt-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold inline-block">
                    MOST POPULAR
                  </div>
                )}
              </Link>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6">Galaxy S Series Features</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold mb-4">Premium Build</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Titanium frames (S24 Ultra)</li>
                  <li>• Gorilla Glass Victus 2</li>
                  <li>• IP68 water resistance</li>
                  <li>• S Pen support (Ultra models)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Camera Excellence</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 200MP main camera</li>
                  <li>• 50MP periscope telephoto</li>
                  <li>• 10MP telephoto</li>
                  <li>• 12MP ultrawide</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Performance</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Snapdragon 8 Gen 3</li>
                  <li>• 5000mAh battery</li>
                  <li>• 45W fast charging</li>
                  <li>• AI processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Galaxy S Series Parts</h2>
            <ProductGrid products={featuredProducts?.slice(0, 12)} />
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Galaxy S Parts</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </div>
    </>
  );
}
