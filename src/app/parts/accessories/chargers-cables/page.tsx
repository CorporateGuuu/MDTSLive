import { getProductsBySubcategory } from '../../../../lib/supabase';
import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';

const chargerTypes = [
  { name: 'USB-C Cables', slug: 'usb-c-cables', description: 'High-speed USB-C charging and data cables' },
  { name: 'Lightning Cables', slug: 'lightning-cables', description: 'Original Apple Lightning cables and adapters' },
  { name: 'Wall Chargers', slug: 'wall-chargers', description: 'Fast charging wall adapters and plugs' },
  { name: 'Car Chargers', slug: 'car-chargers', description: 'In-car charging solutions and adapters' },
  { name: 'Wireless Chargers', slug: 'wireless-chargers', description: 'Qi wireless charging pads and stands' },
  { name: 'Power Banks', slug: 'power-banks', description: 'Portable battery packs and power stations' },
];

export const metadata = {
  title: 'Chargers & Cables - USB-C, Lightning, Wireless | Midas Technical Solutions',
  description: 'Premium charging solutions including USB-C cables, Lightning cables, wall chargers, wireless chargers, and power banks.',
};

export default async function ChargersCablesPage() {
  const featuredProducts = await getProductsBySubcategory('chargers-cables');

  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[
            { label: 'Parts' },
            { label: 'Accessories', href: '/parts/accessories' },
            { label: 'Chargers & Cables' }
          ]} />

          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">Chargers & Cables</h1>
          <p className="text-gray-600 mb-8">Premium charging solutions for all your devices - USB-C, Lightning, wireless & more</p>

          {/* Subcategory Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {chargerTypes.map((type) => (
              <a
                key={type.slug}
                href={`/parts/accessories/chargers-cables/${type.slug}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-blue-600 hover:shadow-lg transition group"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🔌</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
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
