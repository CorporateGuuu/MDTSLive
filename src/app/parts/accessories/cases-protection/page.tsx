import { getProductsBySubcategory } from '../../../../lib/supabase';
import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';

const protectionTypes = [
  { name: 'iPhone Cases', slug: 'iphone-cases', description: 'Premium cases for all iPhone models' },
  { name: 'Samsung Cases', slug: 'samsung-cases', description: 'Galaxy cases and protection' },
  { name: 'Screen Protectors', slug: 'screen-protectors', description: 'Tempered glass and film protectors' },
  { name: 'Tempered Glass', slug: 'tempered-glass', description: '9H hardness screen protection' },
  { name: 'Camera Lens Protectors', slug: 'camera-lens-protectors', description: 'Lens protection for phone cameras' },
  { name: 'Privacy Glass', slug: 'privacy-glass', description: 'Anti-spy privacy screen protectors' },
];

export const metadata = {
  title: 'Cases & Protection - iPhone Cases, Screen Protectors | Midas Technical Solutions',
  description: 'Premium phone cases, tempered glass, screen protectors, camera protection for iPhone, Samsung, and all devices.',
};

export default async function CasesProtectionPage() {
  const featuredProducts = await getProductsBySubcategory('cases-protection');

  return (
    <>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Breadcrumb items={[
            { label: 'Parts' },
            { label: 'Accessories', href: '/parts/accessories' },
            { label: 'Cases & Protection' }
          ]} />

          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">Cases & Protection</h1>
          <p className="text-gray-600 mb-8">Premium cases, screen protectors, and protection for all your devices</p>

          {/* Subcategory Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {protectionTypes.map((type) => (
              <a
                key={type.slug}
                href={`/parts/accessories/cases-protection/${type.slug}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-blue-600 hover:shadow-lg transition group"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📱</span>
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
