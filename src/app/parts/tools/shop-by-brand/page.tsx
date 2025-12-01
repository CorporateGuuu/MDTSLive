import Breadcrumb from '../../../../components/Breadcrumb';

const professionalBrands = [
  {
    name: 'iFixit',
    slug: 'ifixit',
    description: 'World-renowned repair tools and guides',
    logo: '🔧',
    specialties: ['Screwdrivers', 'Opening Tools', 'Repair Kits']
  },
  {
    name: 'Wiha',
    slug: 'wiha',
    description: 'Precision screwdrivers and professional tools',
    logo: '⚙️',
    specialties: ['Precision Drivers', 'ESD Safe', 'German Quality']
  },
  {
    name: 'WRE Pair',
    slug: 'wre-pair',
    description: 'Specialized iPhone repair tools and fixtures',
    logo: '📱',
    specialties: ['iPhone Tools', 'Repair Fixtures', 'Specialized Equipment']
  },
  {
    name: 'DotterPodX',
    slug: 'dotterpodx',
    description: 'Professional iPad and MacBook repair tools',
    logo: '💻',
    specialties: ['MacBook Tools', 'iPad Repair', 'Display Tools']
  },
  {
    name: 'Qianli',
    slug: 'qianli',
    description: 'Professional microsoldering and rework equipment',
    logo: '🔥',
    specialties: ['Hot Air Stations', 'Soldering Tools', 'BGA Rework']
  },
];

export const metadata = {
  title: 'Professional Repair Tools by Brand - iFixit, Wiha, OEM | Midas Technical Solutions',
  description: 'Shop professional repair tools by brand. iFixit, Wiha, WRE Pair, DotterPodX, Qianli - trusted brands for technicians.',
};

export default function ShopByBrandPage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Breadcrumb items={[
          { label: 'Parts' },
          { label: 'Tools', href: '/parts/tools' },
          { label: 'Shop by Brand' }
        ]} />

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Professional Repair Tools
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Trusted brands for professional technicians — iFixit, Wiha, WRE Pair, DotterPodX, Qianli
          </p>
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
            <span className="text-green-600 font-semibold">✓</span>
            <span className="text-gray-700">OEM Quality • Professional Grade • Technician Approved</span>
          </div>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {professionalBrands.map((brand) => (
            <a
              key={brand.slug}
              href={`/parts/tools/shop-by-brand/${brand.slug}`}
              className="group block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-8 text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {brand.logo}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-gray-600 mb-4">{brand.description}</p>

                <div className="flex flex-wrap gap-2 justify-center">
                  {brand.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="mt-6 text-blue-600 font-semibold group-hover:text-blue-800">
                  Shop {brand.name} Tools →
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Professional Guarantee */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Grade Guarantee</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="text-center">
              <div className="text-4xl mb-2">🔧</div>
              <h3 className="font-semibold text-gray-900 mb-2">OEM Quality</h3>
              <p className="text-gray-600 text-sm">Original equipment manufacturer quality tools and parts</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600 text-sm">Same-day shipping on in-stock professional tools</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🛠️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Technician Support</h3>
              <p className="text-gray-600 text-sm">Expert support for professional repair technicians</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
