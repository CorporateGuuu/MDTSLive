import Link from 'next/link';
import { getProductsBySubcategory } from '../../../lib/supabase';
import ProductGrid from '../../../components/Product/ProductGrid';
import Breadcrumb from '../../../components/Breadcrumb';

const onePlusCategories = [
  {
    name: 'OnePlus 13',
    slug: 'oneplus-13',
    description: '2025 flagship with Snapdragon 8 Elite, 120Hz OLED, 50MP cameras',
    icon: '📱',
    featured: true,
    price: '$799',
    specs: 'Snapdragon 8 Elite • 50MP Camera • 120Hz OLED'
  },
  {
    name: 'OnePlus 12',
    slug: 'oneplus-12',
    description: 'Previous flagship with Snapdragon 8 Gen 3, Hasselblad cameras',
    icon: '📱',
    price: '$599',
    specs: 'Snapdragon 8 Gen 3 • Hasselblad • 100W Charge'
  },
  {
    name: 'OnePlus 12R',
    slug: 'oneplus-12r',
    description: 'Gaming-focused with Snapdragon 8 Gen 2, 150W charging',
    icon: '📱',
    price: '$499',
    specs: 'Snapdragon 8 Gen 2 • 150W Charge • 120Hz'
  },
  {
    name: 'OnePlus Open',
    slug: 'oneplus-open',
    description: 'Premium foldable with Snapdragon 8 Gen 2, dual displays',
    icon: '📱',
    price: '$1,699',
    specs: 'Foldable • Dual Display • Hasselblad'
  },
  {
    name: 'OnePlus Nord',
    slug: 'oneplus-nord',
    description: 'Mid-range series with great value, fast charging, clean OxygenOS',
    icon: '📱',
    price: '$349',
    specs: 'Fast Charge • OxygenOS • Good Value'
  },
];

export const metadata = {
  title: 'OnePlus Parts - 13, 12, 12R, Open, Nord | Nexus Tech Hub',
  description: 'Genuine OnePlus parts and components. OLED screens, batteries, cameras, motherboards. 13, 12, 12R, Open, Nord series.',
};

export default async function OnePlusPage() {
  const featuredProducts = await getProductsBySubcategory('oneplus');

  return (
    <>
      <div className="bg-gradient-to-b from-red-500 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-orange-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
            OFFICIAL ONEPLUS PARTS & COMPONENTS
          </div>
          <h1 className="text-7xl font-black mb-6">ONEPLUS PARTS</h1>
          <p className="text-2xl mb-12 max-w-4xl mx-auto">
            Genuine OEM Parts • OnePlus 13 • 12 Series • Open Foldable • Nord Series
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {onePlusCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/parts/oneplus/${category.slug}`}
                className="group block bg-white/10 backdrop-blur rounded-3xl p-8 hover:bg-white/20 transition transform hover:scale-105"
              >
                <div className="text-6xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                <div className="text-xs text-red-200 mb-3">
                  {category.specs}
                </div>
                <div className="text-lg font-bold text-orange-400 mb-2">
                  From {category.price}
                </div>
                {category.featured && (
                  <div className="mt-4 bg-orange-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                    2025 FLAGSHIP
                  </div>
                )}
              </Link>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6">Why Choose OnePlus Parts?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold mb-4">OxygenOS Experience</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Clean Android experience</li>
                  <li>• Regular updates</li>
                  <li>• Smooth performance</li>
                  <li>• No bloatware</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Fast Charging Tech</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 100W+ SuperVOOC</li>
                  <li>• 80W AirVOOC wireless</li>
                  <li>• Quick charge capability</li>
                  <li>• Extended battery life</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Premium Components</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Hasselblad cameras</li>
                  <li>• AMOLED displays</li>
                  <li>• Snapdragon processors</li>
                  <li>• Premium build quality</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: 'Parts' }, { label: 'OnePlus' }]} />

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured OnePlus Parts</h2>
            <ProductGrid products={featuredProducts?.slice(0, 12)} />
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All OnePlus Parts</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </div>
    </>
  );
}
