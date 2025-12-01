import Link from 'next/link';
import { getProductsBySubcategory } from '../../../../lib/supabase';
import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';

const onePlusNordParts = [
  {
    name: 'AMOLED Display Assembly',
    description: '6.74" AMOLED, 120Hz, Gorilla Glass 5',
    icon: '📱',
    price: '$249',
    category: 'Displays'
  },
  {
    name: 'Battery (5000mAh)',
    description: 'High capacity with 100W SuperVOOC charging',
    icon: '🔋',
    price: '$59',
    category: 'Batteries'
  },
  {
    name: 'Triple Camera System',
    description: '50MP main + ultrawide + macro assembly',
    icon: '📷',
    price: '$129',
    category: 'Cameras'
  },
  {
    name: 'Motherboard',
    description: 'Dimensity 7300, 8GB RAM, 128GB storage',
    icon: '🔧',
    price: '$299',
    category: 'Motherboards'
  },
];

export const metadata = {
  title: 'OnePlus Nord Parts - 6.74" AMOLED Screen, Battery, Camera | Midas Technical Solutions',
  description: 'Genuine OnePlus Nord parts and components. AMOLED display, battery, camera module, MediaTek Dimensity motherboard.',
};

export default async function OnePlusNordPage() {
  const featuredProducts = await getProductsBySubcategory('oneplus-nord');

  return (
    <>
      <div className="bg-gradient-to-b from-green-500 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Parts' },
            { label: 'OnePlus', href: '/parts/oneplus' },
            { label: 'OnePlus Nord' }
          ]} />

          <div className="text-center mt-8">
            <div className="bg-lime-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
              ONEPLUS NORD - VALUE CHAMPION
            </div>
            <h1 className="text-6xl font-black mb-6">ONEPLUS NORD</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Dimensity 7300 • 6.74" AMOLED • 100W SuperVOOC • Premium Value
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">📱</div>
                <div className="font-bold">6.74" Display</div>
                <div className="text-sm text-green-200">AMOLED, 120Hz</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">🧠</div>
                <div className="font-bold">Dimensity 7300</div>
                <div className="text-sm text-green-200">Premium Performance</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">📷</div>
                <div className="font-bold">Triple Camera</div>
                <div className="text-sm text-green-200">50MP Main Sensor</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">🔋</div>
                <div className="font-bold">100W SuperVOOC</div>
                <div className="text-sm text-green-200">Fast Charging</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {onePlusNordParts.map((part) => (
              <div
                key={part.name}
                className="group block bg-white/10 backdrop-blur rounded-3xl p-8 hover:bg-white/20 transition transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{part.icon}</div>
                <h3 className="text-xl font-bold mb-2">{part.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{part.description}</p>
                <div className="text-orange-400 font-bold text-lg">{part.price}</div>
                <div className="text-xs text-green-200 mt-2">{part.category}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6">OnePlus Nord Specifications</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold mb-4">Display & Design</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 6.74" AMOLED display</li>
                  <li>• 120Hz refresh rate</li>
                  <li>• Gorilla Glass 5</li>
                  <li>• Alert Slider</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Performance</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• MediaTek Dimensity 7300</li>
                  <li>• 8GB/12GB RAM</li>
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
                  <li>• 32MP front camera</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">OnePlus Nord Parts</h2>
            <ProductGrid products={featuredProducts?.slice(0, 12)} />
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All OnePlus Nord Parts</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </div>
    </>
  );
}
