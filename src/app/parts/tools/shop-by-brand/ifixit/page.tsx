import ProductGrid from '../../../../../components/Product/ProductGrid';

export const metadata = {
  title: 'iFixit Professional Repair Tools - Screwdrivers, Kits, Guides | Nexus Tech Hub',
  description: 'Official iFixit repair tools and kits. Professional screwdrivers, opening tools, repair guides, and complete tool kits.',
};

export default function iFixitPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Brand Header */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-4">🔧</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">iFixit Professional Tools</h1>
          <p className="text-xl text-gray-600 mb-6">World-renowned repair tools and comprehensive repair guides</p>
          <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-md">
            <span className="text-green-600 font-semibold">✓</span>
            <span className="text-gray-700">Right to Repair • Professional Quality • Lifetime Warranty</span>
          </div>
        </div>

        {/* Brand Info */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-gray-900 mb-2">Repair Guides</h3>
              <p className="text-gray-600 text-sm">Step-by-step repair manuals for thousands of devices</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="font-bold text-gray-900 mb-2">Precision Tools</h3>
              <p className="text-gray-600 text-sm">ESD-safe, magnetic, precision-engineered tools</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🛠️</div>
              <h3 className="font-bold text-gray-900 mb-2">Complete Kits</h3>
              <p className="text-gray-600 text-sm">Comprehensive tool kits for professional repairs</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">iFixit Tools & Kits</h2>
          <p className="text-gray-600">Professional-grade repair tools trusted by technicians worldwide</p>
        </div>

        <ProductGrid subcategory="ifixit-tools" showFilters={true} />
      </div>
    </div>
  );
}
