import { getProductsBySubcategory } from '../../../lib/supabase';
import ProductGrid from '../../../components/Product/ProductGrid';
import Breadcrumb from '../../../components/Breadcrumb';

const machineCategories = [
  {
    name: 'OCA Machines',
    slug: 'oca-machines',
    description: 'Optical Clear Adhesive lamination systems for screen repair',
    icon: '🔧',
    priceRange: '$999 - $2,999',
    featured: true
  },
  {
    name: 'Bubble Removers',
    slug: 'bubble-removers',
    description: 'Automatic bubble removal and autoclave systems',
    icon: '💨',
    priceRange: '$1,299 - $2,499'
  },
  {
    name: 'Laser Machines',
    slug: 'laser-machines',
    description: 'Precision laser equipment for glass separation and cutting',
    icon: '⚡',
    priceRange: '$2,999 - $4,999'
  },
  {
    name: 'Separation Equipment',
    slug: 'separation',
    description: 'Freezer separators, hot plates, and wire cutting systems',
    icon: '🔥',
    priceRange: '$799 - $1,999'
  },
];

export const metadata = {
  title: 'Professional Repair Machines - OCA, Lasers, Separation Equipment | Midas Technical Solutions',
  description: 'Professional repair machines and equipment for repair shops. OCA laminators, bubble removers, laser machines, separation tools.',
};

export default async function MachinesPage() {
  const featuredProducts = await getProductsBySubcategory('machines');

  return (
    <>
      <div className="bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Breadcrumb items={[{ label: 'Parts' }, { label: 'Machines' }]} />

          <div className="text-center mb-16">
            <h1 className="text-6xl font-black mb-6">PROFESSIONAL REPAIR MACHINES</h1>
            <p className="text-2xl opacity-90 mb-8">
              Industrial-grade equipment for repair shops • OCA • Lasers • Separation • Automation
            </p>
            <div className="inline-flex items-center gap-4 bg-red-600 px-6 py-3 rounded-full">
              <span className="font-semibold">⚠️</span>
              <span className="text-white">Heavy Equipment • Professional Installation Required</span>
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {machineCategories.map((category) => (
              <a
                key={category.slug}
                href={`/parts/machines/${category.slug}`}
                className={`block bg-gray-800 rounded-xl p-8 hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 ${
                  category.featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-300 mb-4 text-sm">{category.description}</p>
                <div className="text-yellow-400 font-semibold text-sm">
                  {category.priceRange}
                </div>
                {category.featured && (
                  <div className="mt-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium inline-block">
                    Featured Equipment
                  </div>
                )}
              </a>
            ))}
          </div>

          {/* Professional Warning */}
          <div className="bg-red-900 border border-red-700 rounded-xl p-8 mb-16">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Professional Equipment Notice</h3>
                <p className="text-red-200 mb-4">
                  These machines require professional installation, training, and safety certifications.
                  Not suitable for home use or untrained operators.
                </p>
                <div className="text-sm text-red-300">
                  • 220V industrial power required • Professional setup included • Safety training mandatory
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Professional Equipment Available</h2>
          <ProductGrid products={featuredProducts} />
        </div>
      </div>
    </>
  );
}
