import Link from 'next/link';
import { getProductsBySubcategory } from '../../../../lib/supabase';
import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';

const onePlusOpenParts = [
  {
    name: 'Foldable Display Assembly',
    description: '7.82" LTPO AMOLED inner + 6.31" cover, Gorilla Glass Victus 2',
    icon: '📱',
    price: '$899',
    category: 'Displays'
  },
  {
    name: 'Dual Battery System',
    description: '4805mAh total capacity with 67W charging',
    icon: '🔋',
    price: '$149',
    category: 'Batteries'
  },
  {
    name: 'Hasselblad Camera System',
    description: '48MP main + ultrawide + telephoto + cover cameras',
    icon: '📷',
    price: '$349',
    category: 'Cameras'
  },
  {
    name: 'Motherboard',
    description: 'Snapdragon 8 Gen 2, 16GB RAM, 512GB storage',
    icon: '🔧',
    price: '$799',
    category: 'Motherboards'
  },
];

export const metadata = {
  title: 'OnePlus Open Parts - Foldable Display, Dual Battery, Camera | Midas Technical Solutions',
  description: 'Genuine OnePlus Open foldable parts and components. Foldable display, dual battery, Hasselblad camera system.',
};

export default async function OnePlusOpenPage() {
  const featuredProducts = await getProductsBySubcategory('oneplus-open');

  return (
    <>
      <div className="bg-gradient-to-b from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Parts' },
            { label: 'OnePlus', href: '/parts/oneplus' },
            { label: 'OnePlus Open' }
          ]} />

          <div className="text-center mt-8">
            <div className="bg-orange-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
              ONEPLUS OPEN - PREMIUM FOLDABLE
            </div>
            <h1 className="text-6xl font-black mb-6">ONEPLUS OPEN</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Snapdragon 8 Gen 2 • 7.82" Foldable AMOLED • Dual Displays • Hasselblad Cameras
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">📱</div>
                <div className="font-bold">7.82" Inner Display</div>
                <div className="text-sm text-red-200">Foldable AMOLED</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">📱</div>
                <div className="font-bold">6.31" Cover Display</div>
                <div className="text-sm text-red-200">Always-On Display</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">📷</div>
                <div className="font-bold">Hasselblad System</div>
                <div className="text-sm text-red-200">Pro Photography</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">🔋</div>
                <div className="font-bold">Dual Battery</div>
                <div className="text-sm text-red-200">4805mAh Total</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {onePlusOpenParts.map((part) => (
              <div
                key={part.name}
                className="group block bg-white/10 backdrop-blur rounded-3xl p-8 hover:bg-white/20 transition transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{part.icon}</div>
                <h3 className="text-xl font-bold mb-2">{part.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{part.description}</p>
                <div className="text-orange-400 font-bold text-lg">{part.price}</div>
                <div className="text-xs text-red-200 mt-2">{part.category}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6">OnePlus Open Specifications</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold mb-4">Dual Display System</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 7.82" foldable inner AMOLED</li>
                  <li>• 6.31" cover AMOLED</li>
                  <li>• 120Hz refresh rate</li>
                  <li>• Gorilla Glass Victus 2</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Performance</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Snapdragon 8 Gen 2</li>
                  <li>• 16GB/24GB RAM</li>
                  <li>• 256GB/512GB storage</li>
                  <li>• OxygenOS 13</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Camera Excellence</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 48MP Hasselblad main</li>
                  <li>• 48MP ultrawide</li>
                  <li>• 64MP telephoto</li>
                  <li>• Under-display selfie</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">OnePlus Open Parts</h2>
            <ProductGrid products={featuredProducts?.slice(0, 12)} />
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All OnePlus Open Parts</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </div>
    </>
  );
}
