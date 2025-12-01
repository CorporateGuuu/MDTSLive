export const metadata = {
  title: 'Forward OCA Pro - 16" Vacuum Laminator + Autoclave Combo | Nexus Tech Hub',
  description: 'All-in-one OCA lamination machine with built-in defoaming. Supports up to iPhone 15 Pro Max & iPad Pro. 0 bubbles guaranteed.',
};

export default function ForwardOCAProPage() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <img src="/machines/forward-oca-pro-main.jpg" alt="Forward OCA Pro" className="rounded-2xl shadow-2xl w-full" />
          </div>
          <div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full inline-block font-bold text-sm mb-4">
              BEST SELLER • IN STOCK
            </div>
            <h1 className="text-5xl font-black mb-6">Forward OCA Pro</h1>
            <p className="text-4xl font-bold text-green-600 mb-8">$2,999.00</p>
            <ul className="space-y-4 text-lg mb-8">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <span>16" Large vacuum chamber – fits iPad Pro 12.9"</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <span>Built-in 30L autoclave (no separate bubble remover needed)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <span>0.1s precision temperature control</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <span>Free lifetime remote training</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <span>1-year full warranty + parts</span>
              </li>
            </ul>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors">
              Add to Cart - $2,999.00
            </button>

            <div className="mt-6 text-center text-gray-600">
              <p className="text-sm">✓ Free shipping • ✓ Professional installation included • ✓ 30-day return policy</p>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Forward OCA Pro?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">All-in-One Solution</h3>
              <p className="text-gray-600">Laminator + autoclave in one machine. No need for separate equipment.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">Industry Leading</h3>
              <p className="text-gray-600">Used by professional repair shops worldwide for flawless results.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-3">Quality Guaranteed</h3>
              <p className="text-gray-600">1-year warranty + lifetime support. 0 bubbles guaranteed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
