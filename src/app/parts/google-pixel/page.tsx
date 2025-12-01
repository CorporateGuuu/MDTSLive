import Link from 'next/link';
import { getProductsBySubcategory } from '../../../lib/supabase';
import ProductGrid from '../../../components/Product/ProductGrid';
import Breadcrumb from '@/components/Breadcrumb';

const pixelCategories = [
  {
    name: 'Pixel 9 Pro XL',
    slug: 'pixel-9-pro-xl',
    description: 'Google\'s flagship with 6.8" LTPO OLED, Tensor G4, 50MP cameras',
    icon: '📱',
    featured: true,
    price: '$999',
    specs: 'Tensor G4 • 50MP Camera • 6.8" OLED'
  },
  {
    name: 'Pixel 9 Pro',
    slug: 'pixel-9-pro',
    description: 'Premium Pixel with 6.3" LTPO OLED, Tensor G4, pro camera system',
    icon: '📱',
    price: '$899',
    specs: 'Tensor G4 • 50MP Camera • 6.3" OLED'
  },
  {
    name: 'Pixel 8 Pro',
    slug: 'pixel-8-pro',
    description: 'Previous flagship with 6.7" LTPO OLED, Tensor G3, 50MP camera',
    icon: '📱',
    price: '$699',
    specs: 'Tensor G3 • 50MP Camera • 6.7" OLED'
  },
  {
    name: 'Pixel 7a',
    slug: 'pixel-7a',
    description: 'Affordable Pixel with 6.1" OLED, Tensor G2, great camera performance',
    icon: '📱',
    price: '$349',
    specs: 'Tensor G2 • 64MP Camera • 6.1" OLED'
  },
];

export const metadata = {
  title: 'Google Pixel Parts - 9 Pro XL, 9 Pro, 8 Pro, 7a | Nexus Tech Hub',
  description: 'Genuine Google Pixel parts and components. LCD screens, batteries, motherboards, cameras. Pixel 9 Pro XL, 9 Pro, 8 Pro, 7a series.',
};

export default async function GooglePixelPage() {
  const featuredProducts = await getProductsBySubcategory('google-pixel');

  return (
    <>
      <div className="bg-gradient-to-b from-blue-600 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-green-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
            OFFICIAL GOOGLE PIXEL PARTS & COMPONENTS
          </div>
          <h1 className="text-7xl font-black mb-6">GOOGLE PIXEL PARTS</h1>
          <p className="text-2xl mb-12 max-w-4xl mx-auto">
            Genuine OEM Parts • Pixel 9 Pro XL • 9 Pro • 8 Pro • 7a Series
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {pixelCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/parts/google-pixel/${category.slug}`}
                className="group block bg-white/10 backdrop-blur rounded-3xl p-8 hover:bg-white/20 transition transform hover:scale-105"
              >
                <div className="text-6xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                <div className="text-xs text-blue-200 mb-3">
                  {category.specs}
                </div>
                <div className="text-lg font-bold text-green-400 mb-2">
                  From {category.price}
                </div>
                {category.featured && (
                  <div className="mt-4 bg-green-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                    NEWEST MODEL
                  </div>
                )}
              </Link>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6">Why Choose Pixel Parts?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold mb-4">Pure Android Experience</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Stock Android OS</li>
                  <li>• Timely updates</li>
                  <li>• Google integration</li>
                  <li>• Clean interface</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Camera Excellence</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Computational photography</li>
                  <li>• Magic Eraser</li>
                  <li>• Night Sight</li>
                  <li>• Portrait mode</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Premium Components</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Tensor processors</li>
                  <li>• OLED displays</li>
                  <li>• Gorilla Glass</li>
                  <li>• Fast charging</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: 'Parts' }, { label: 'Google Pixel' }]} />

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Google Pixel Parts</h2>
            <ProductGrid products={featuredProducts?.slice(0, 12)} />
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Google Pixel Parts</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </div>
    </>
  );
}
