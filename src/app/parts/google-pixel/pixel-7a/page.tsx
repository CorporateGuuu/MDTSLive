import Link from 'next/link';
import { getProductsBySubcategory } from '../../../../lib/supabase';
import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '@/components/Breadcrumb';

// Force dynamic rendering since this page fetches data from Supabase
export const dynamic = 'force-dynamic';

const pixel7aParts = [
  {
    name: 'OLED Display Assembly',
    description: '6.1" OLED, 90Hz, Gorilla Glass 3',
    icon: '📱',
    price: '$189',
    category: 'Displays'
  },
  {
    name: 'Battery (4385mAh)',
    description: 'Large capacity Li-ion with wireless charging',
    icon: '🔋',
    price: '$49',
    category: 'Batteries'
  },
  {
    name: 'Camera System',
    description: '64MP main + ultrawide camera assembly',
    icon: '📷',
    price: '$99',
    category: 'Cameras'
  },
  {
    name: 'Motherboard',
    description: 'Tensor G2, 8GB RAM, 128GB storage',
    icon: '🔧',
    price: '$299',
    category: 'Motherboards'
  },
];

export const metadata = {
  title: 'Pixel 7a Parts - 6.1" OLED Screen, Battery, Camera | Midas Technical Solutions',
  description: 'Genuine Google Pixel 7a parts and components. OLED display, battery, camera module, motherboard. Tensor G2 chipset.',
};

export default async function Pixel7aPage() {
  const featuredProducts = await getProductsBySubcategory('pixel-7a');

  return (
    <>
      <div className="bg-gradient-to-b from-green-500 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Parts' },
            { label: 'Google Pixel', href: '/parts/google-pixel' },
            { label: 'Pixel 7a' }
          ]} />

          <div className="text-center mt-8">
            <div className="bg-lime-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
              GOOGLE PIXEL 7A - AFFORDABLE EXCELLENCE
            </div>
            <h1 className="text-6xl font-black mb-6">PIXEL 7A</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Tensor G2 • 6.1" OLED • 64MP Camera • Value for Money
            </p>

            {/* Hero Image */}
            <div className="mb-12">
              <img
                src="https://i.imgur.com/placeholder-pixel7a.png"
                alt="Google Pixel 7a"
                className="mx-auto max-w-md rounded-3xl shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x800/fbbc04/000000?text=Pixel+7a';
                }}
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">📱</div>
                <div className="font-bold">6.1" Display</div>
                <div className="text-sm text-green-200">OLED, 90Hz</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">🧠</div>
                <div className="font-bold">Tensor G2</div>
                <div className="text-sm text-green-200">AI Processing</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">📷</div>
                <div className="font-bold">64MP Camera</div>
                <div className="text-sm text-green-200">Great Photography</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">🔋</div>
                <div className="font-bold">4385mAh</div>
                <div className="text-sm text-green-200">All-day Battery</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {pixel7aParts.map((part) => (
              <div
                key={part.name}
                className="group block bg-white/10 backdrop-blur rounded-3xl p-8 hover:bg-white/20 transition transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{part.icon}</div>
                <h3 className="text-xl font-bold mb-2">{part.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{part.description}</p>
                <div className="text-green-400 font-bold text-lg">{part.price}</div>
                <div className="text-xs text-green-200 mt-2">{part.category}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6">Pixel 7a Specifications</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold mb-4">Display & Design</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 6.1" OLED display</li>
                  <li>• 90Hz refresh rate</li>
                  <li>• Gorilla Glass 3</li>
                  <li>• Aluminum frame</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Performance</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Google Tensor G2</li>
                  <li>• 8GB RAM</li>
                  <li>• 128GB storage</li>
                  <li>• Android 13</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Camera System</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 64MP main camera</li>
                  <li>• 13MP ultrawide</li>
                  <li>• 13MP front camera</li>
                  <li>• Magic Eraser, Night Sight</li>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pixel 7a Parts</h2>
            <ProductGrid products={featuredProducts?.slice(0, 12)} />
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Pixel 7a Parts</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </div>
    </>
  );
}
