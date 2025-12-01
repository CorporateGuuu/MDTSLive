import Link from 'next/link';
import { getProductsBySubcategory } from '../../../../lib/supabase';
import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';

// Force dynamic rendering since this page fetches data from Supabase
export const dynamic = 'force-dynamic';

const pixel9ProParts = [
  {
    name: 'OLED Display Assembly',
    description: '6.3" LTPO OLED, 120Hz, Gorilla Glass Victus 2',
    icon: '📱',
    price: '$299',
    category: 'Displays'
  },
  {
    name: 'Battery (4700mAh)',
    description: 'Optimized Li-ion with wireless charging',
    icon: '🔋',
    price: '$69',
    category: 'Batteries'
  },
  {
    name: 'Pro Camera System',
    description: '50MP main + ultrawide + telephoto assembly',
    icon: '📷',
    price: '$169',
    category: 'Cameras'
  },
  {
    name: 'Motherboard',
    description: 'Tensor G4, 12GB RAM, 256GB storage',
    icon: '🔧',
    price: '$499',
    category: 'Motherboards'
  },
];

export const metadata = {
  title: 'Pixel 9 Pro Parts - 6.3" OLED Screen, Battery, Camera | Midas Technical Solutions',
  description: 'Genuine Google Pixel 9 Pro parts and components. OLED display, battery, camera module, motherboard. Tensor G4 chipset.',
};

export default async function Pixel9ProPage() {
  const featuredProducts = await getProductsBySubcategory('pixel-9-pro');

  return (
    <>
      <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: 'Parts' },
            { label: 'Google Pixel', href: '/parts/google-pixel' },
            { label: 'Pixel 9 Pro' }
          ]} />

          <div className="text-center mt-8">
            <div className="bg-blue-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
              GOOGLE PIXEL 9 PRO - 2024 PREMIUM
            </div>
            <h1 className="text-6xl font-black mb-6">PIXEL 9 PRO</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Tensor G4 • 6.3" LTPO OLED • 50MP Cameras • Premium Experience
            </p>

            {/* Hero Image */}
            <div className="mb-12">
              <img
                src="https://i.imgur.com/placeholder-pixel9pro.png"
                alt="Google Pixel 9 Pro"
                className="mx-auto max-w-md rounded-3xl shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x800/34a853/ffffff?text=Pixel+9+Pro';
                }}
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">📱</div>
                <div className="font-bold">6.3" Display</div>
                <div className="text-sm text-blue-200">LTPO OLED, 120Hz</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">🧠</div>
                <div className="font-bold">Tensor G4</div>
                <div className="text-sm text-blue-200">AI Processing</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">📷</div>
                <div className="font-bold">50MP Camera</div>
                <div className="text-sm text-blue-200">Pro Photography</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="text-3xl mb-2">🔋</div>
                <div className="font-bold">4700mAh</div>
                <div className="text-sm text-blue-200">All-day Battery</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {pixel9ProParts.map((part) => (
              <div
                key={part.name}
                className="group block bg-white/10 backdrop-blur rounded-3xl p-8 hover:bg-white/20 transition transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{part.icon}</div>
                <h3 className="text-xl font-bold mb-2">{part.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{part.description}</p>
                <div className="text-green-400 font-bold text-lg">{part.price}</div>
                <div className="text-xs text-blue-200 mt-2">{part.category}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-6">Pixel 9 Pro Specifications</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold mb-4">Display & Design</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 6.3" LTPO OLED display</li>
                  <li>• 120Hz refresh rate</li>
                  <li>• Gorilla Glass Victus 2</li>
                  <li>• Aluminum frame</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Performance</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Google Tensor G4</li>
                  <li>• 12GB RAM</li>
                  <li>• 128GB/256GB/512GB/1TB</li>
                  <li>• Android 15</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Camera System</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 50MP main camera</li>
                  <li>• 48MP ultrawide</li>
                  <li>• 48MP telephoto (5x zoom)</li>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pixel 9 Pro Parts</h2>
            <ProductGrid products={featuredProducts?.slice(0, 12)} />
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Pixel 9 Pro Parts</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </div>
    </>
  );
}
