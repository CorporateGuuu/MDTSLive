import { getProductsBySubcategory } from '../../../lib/supabase';
import ProductGrid from '../../../components/Product/ProductGrid';
import Breadcrumb from '../../../components/Breadcrumb';

const toolCategories = [
  {
    name: 'Shop by Brand',
    slug: 'shop-by-brand',
    description: 'Professional tools from Midas Precision, Wiha, WRE Pair, DotterPodX, Qianli',
    icon: '🏷️',
    featured: true
  },
  {
    name: 'Essentials',
    slug: 'essentials',
    description: 'Screwdrivers, tweezers, tool kits, adhesive tapes, pry tools',
    icon: '🔧'
  },
  {
    name: 'OEM Service Tools',
    slug: 'oem-service-tools',
    description: 'Disassembly tools, repair fixtures, clamps, pliers, cleaning supplies',
    icon: '🔩'
  },
  {
    name: 'Testing Devices',
    slug: 'testing-devices',
    description: 'Screen testers, battery testers, TriStar, MFi testers, test cables',
    icon: '🧪'
  },
  {
    name: 'Microsoldering',
    slug: 'microsoldering',
    description: 'Hot air stations, soldering irons, board holders, power supplies',
    icon: '🔥'
  },
  {
    name: 'Refurbishing',
    slug: 'refurbishing',
    description: 'Glass separation, cutting tools, glue removal, alignment moulds',
    icon: '🔄'
  },
];

export const metadata = {
  title: 'Professional Repair Tools - Midas Precision, Wiha, OEM Tools | Midas Technical Solutions',
  description: 'Professional repair tools for technicians. Midas Precision, Wiha, WRE Pair tools, microsoldering equipment, testing devices, OEM service tools.',
};

export default async function ToolsPage() {
  const featuredProducts = await getProductsBySubcategory('tools');

  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[{ label: 'Parts' }, { label: 'Tools' }]} />

          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">Professional Repair Tools</h1>
          <p className="text-gray-600 mb-8">Premium tools for professional technicians - Midas Precision, Wiha, OEM equipment, microsoldering, testing devices</p>

          {/* Category Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {toolCategories.map((category) => (
              <a
                key={category.slug}
                href={`/parts/tools/${category.slug}`}
                className={`block bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-blue-600 hover:shadow-lg transition group ${
                  category.featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
                {category.featured && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Featured
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Featured Professional Tools */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Professional Tools</h2>
              <a
                href="/parts/tools/shop-by-brand"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Shop by Brand →
              </a>
            </div>
            <ProductGrid products={featuredProducts.slice(0, 12)} />
          </div>

          {/* Product Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Tools</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </div>
      </div>
    </>
  );
}
