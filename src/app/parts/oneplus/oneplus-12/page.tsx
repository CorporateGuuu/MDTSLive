import Link from 'next/link';
import { getProductsBySubcategory } from '../../../../lib/supabase';
import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';

const onePlus12Parts = [
  {
    name: 'AMOLED Display Assembly',
    description: '6.7" LTPO AMOLED, 120Hz, Gorilla Glass Victus',
    icon: '📱',
    price: '$349',
    category: 'Displays'
  },
  {
    name: 'Battery (5400mAh)',
    description: 'High capacity with 100W SuperVOOC 3.0 charging',
    icon: '🔋',
    price: '$79',
    category: 'Batteries'
  },
  {
    name: 'Hasselblad Camera System',
    description: '64MP main + ultrawide + telephoto assembly',
    icon: '📷',
    price: '$199',
    category: 'Cameras'
  },
  {
    name: 'Motherboard',
    description: 'Snapdragon 8 Gen 3, 16GB RAM, 512GB storage',
    icon: '🔧',
    price: '$549',
    category: 'Motherboards'
  },
];

export const metadata = {
  title: 'OnePlus 12 Parts - 6.7" AMOLED Screen, Battery, Camera | Midas Technical Solutions',
  description: 'Genuine OnePlus 12 parts and components. AMOLED display, battery, Hasselblad camera module, Snapdragon 8 Gen 3 motherboard.',
};

export default async function OnePlus12Page() {
  const featuredProducts = await getProductsBySubcategory('oneplus-12');

  return (
    <>
      <div className="bg-gradient-to-b from-red-500 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Parts' },
            { label: 'OnePlus', href: '/parts/oneplus' },
            { label: 'OnePlus 12' }
          ]} />

          <div className="text-center mt-8">
            <div className="bg-red-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
              ONEPLUS 12 - PREMIUM FLAGSHIP
            </div>
            <h1 className="text-6xl font-black mb-6">ONEPLUS 12</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Snapdragon 8 Gen 3 • 6.7" LTPO AMOLED • Hasselblad Cameras • 100W SuperVOOC
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">📱</div>
                <div className="font-bold">6.7" Display</div>
                <div className="text-sm text-red-200">LTPO AMOLED, 120Hz</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">🧠</div>
                <div className="font-bold">Snapdragon 8 Gen 3</div>
                <div className="text-sm text-red-200">Premium Performance</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">📷</div>
                <div className="font-bold">Hasselblad Camera</div>
                <div className="text-sm text-red-200">Professional Photos</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">🔋</div>
                <div className="font-bold">100W SuperVOOC</div>
                <div className="text-sm text-red-200">Fast Charging</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {onePlus12Parts.map((part) => (
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
            <h2 className="text-3xl font-bold mb-6">OnePlus 12 Specifications</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold mb-4">Display & Design</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 6.7" LTPO AMOLED display</li>
                  <li>• 120Hz refresh rate</li>
                  <li>• Gorilla Glass Victus</li>
                  <li>• Alert Slider</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Performance</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Snapdragon 8 Gen 3</li>
                  <li>• 16GB/24GB RAM</li>
                  <li>• 256GB/512GB storage</li>
                  <li>• OxygenOS 14</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Camera System</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 64MP Hasselblad main</li>
                  <li>• 48MP ultrawide</li>
                  <li>• 32MP telephoto</li>
                  <li>• 4K 120fps recording</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">OnePlus 12 Parts</h2>
            <ProductGrid products={featuredProducts?.slice(0, 12)} />
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All OnePlus 12 Parts</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </div>
    </>
  );
}
