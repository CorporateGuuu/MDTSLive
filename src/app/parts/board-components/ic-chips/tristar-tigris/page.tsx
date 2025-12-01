export const metadata = {
  title: 'Tristar & Tigris IC - iPhone 6 to 15 Pro Max | Midas Technical Solutions',
  description: 'Genuine pulled Tristar (1610A3, 1612A1, 1614A1) and Tigris ICs. Fixes no charge, no power, USB issues.',
};

export default function TristarPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <img src="/ic/tristar-main.jpg" alt="Tristar IC" className="rounded-2xl shadow-2xl w-full" />
          </div>
          <div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full inline-block font-bold text-sm mb-4">
              IN STOCK – SAME DAY SHIP
            </div>
            <h1 className="text-5xl font-black mb-6">Tristar / Tigris Charging IC</h1>
            <div className="text-4xl font-bold text-green-600 mb-8">$9.99 – $24.99</div>
            <ul className="space-y-3 text-lg mb-8">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <span>Compatible: iPhone 6 → 15 Pro Max</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <span>1610A3, 1612A1, 1614A1, 1616A0, 1618A1</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <span>100% tested before shipping</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                <span>Fixes: No charge, USB device not recognized, battery loop</span>
              </li>
            </ul>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors">
              Add to Cart - $9.99
            </button>

            <div className="mt-6 text-center text-gray-600">
              <p className="text-sm">✓ 48-hour replacement guarantee • ✓ Free shipping on orders over $50 • ✓ Bulk pricing available</p>
            </div>
          </div>
        </div>

        {/* Additional Technical Details */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8">Technical Specifications</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Supported Models</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• iPhone 6, 6 Plus, 6s, 6s Plus</li>
                <li>• iPhone 7, 7 Plus, 8, 8 Plus</li>
                <li>• iPhone X, XR, XS, XS Max</li>
                <li>• iPhone 11, 11 Pro, 11 Pro Max</li>
                <li>• iPhone 12, 12 mini, 12 Pro, 12 Pro Max</li>
                <li>• iPhone 13, 13 mini, 13 Pro, 13 Pro Max</li>
                <li>• iPhone 14, 14 Plus, 14 Pro, 14 Pro Max</li>
                <li>• iPhone 15, 15 Plus, 15 Pro, 15 Pro Max</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Common Issues Fixed</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• No charging / no power</li>
                <li>• USB device not recognized</li>
                <li>• Battery charging loop</li>
                <li>• iTunes connection issues</li>
                <li>• Baseband communication errors</li>
                <li>• Cellular connectivity problems</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
