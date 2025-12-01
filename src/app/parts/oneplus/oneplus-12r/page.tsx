import Link from 'next/link';
import { getProductsBySubcategory } from '../../../../lib/supabase';
import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';

const onePlus12RParts = [
  {
    name: 'AMOLED Display Assembly',
    description: '6.78" LTPO AMOLED, 120Hz, Gorilla Glass 5',
    icon: '📱',
    price: '$299',
    category: 'Displays'
  },
  {
    name: 'Battery (5500mAh)',
    description: 'Massive capacity with 150W SuperVOOC charging',
    icon: '🔋',
    price: '$69',
    category: 'Batteries'
  },
  {
    name: 'Triple Camera System',
    description: '50MP main + ultrawide + macro assembly',
    icon: '📷',
    price: '$149',
    category: 'Cameras'
  },
  {
    name: 'Motherboard',
    description: 'Snapdragon 8 Gen 2, 16GB RAM, 256GB storage',
    icon: '🔧',
    price: '$399',
    category: 'Motherboards'
  },
];

export const metadata = {
  title: 'OnePlus 12R Parts - 6.78" AMOLED Screen, Battery, Camera | Nexus Tech Hub',
  description: 'Genuine OnePlus 12R parts and components. AMOLED display, battery, camera module, Snapdragon 8 Gen 2 motherboard.',
};

export default async function OnePlus12RPage() {
  const featuredProducts = await getProductsBySubcategory('oneplus-12r');

  return (
    <>
      <div className="bg-gradient-to-b from-red-400 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Parts' },
            { label: 'OnePlus', href: '/parts/oneplus' },
            { label: 'OnePlus 12R' }
          ]} />

          <div className="text-center mt-8">
            <div className="bg-red-300 text-black px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
              ONEPLUS 12R - GAMING POWERHOUSE
            </div>
            <h1 className="text-6xl font-black mb-6">ONEPLUS 12R</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Snapdragon 8 Gen 2 • 6.78" LTPO AMOLED • 150W SuperVOOC • Gaming Optimized
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">📱</div>
                <div className="font-bold">6.78" Display</div>
                <div className="text-sm text-red-200">LTPO AMOLED, 120Hz</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">🧠</div>
                <div className="font-bold">Snapdragon 8 Gen 2</div>
                <div className="text-sm text-red-200">Gaming Performance</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">📷</div>
                <div className="font-bold">Triple Camera</div>
                <div className="text-sm text-red-200">50MP Main Sensor</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">🔋</div>
                <div className="font-bold">150W SuperVOOC</div>
                <div className="text-sm text-red-200">Ultra Fast Charging</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {onePlus12RParts.map((part) => (
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
            <h2 className="text-3xl font-bold mb-6">OnePlus 12R Specifications</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold mb-4">Display & Design</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 6.78" LTPO AMOLED display</li>
                  <li>• 120Hz refresh rate</li>
                  <li>• Gorilla Glass 5</li>
                  <li>• Alert Slider</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Performance</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Snapdragon 8 Gen 2</li>
                  <li>• 8GB/16GB RAM</li>
                  <li>• 128GB/256GB storage</li>
                  <li>• OxygenOS 13</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Camera System</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 50MP main camera</li>
                  <li>• 8MP ultrawide</li>
                  <li>• 2MP macro</li>
                  <li>• 4K 60fps recording</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">OnePlus 12R Parts</h2>
            <ProductGrid products={featuredProducts?.slice(0, 12)} />
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All OnePlus 12R Parts</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </div>
    </>
  );
}
