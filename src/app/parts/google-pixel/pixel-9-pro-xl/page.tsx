import ProductGrid from '../../../../components/Product/ProductGrid';

export const metadata = {
  title: 'Google Pixel 9 Pro XL Parts - OLED Screens, Batteries, Cameras | Nexus Tech Hub',
  description: 'Original Google service pack displays, Tensor batteries, rear cameras. Same-day USA shipping.',
};

export default function Pixel9ProXL() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Google Pixel 9 Pro XL Parts",
        description: "Original Google Pixel 9 Pro XL OLED displays, batteries, cameras, motherboards",
        offers: { "@type": "Offer", price: "299.99", availability: "https://schema.org/InStock" }
      }) }} />
      <div className="bg-gradient-to-b from-purple-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-7xl font-black mb-6">Google Pixel 9 Pro XL</h1>
          <p className="text-3xl mb-12">All Original Parts • In Stock • Fast Shipping</p>

          <div className="flex gap-3 flex-wrap mb-8 justify-center">
            {['All', 'OLED', 'Incell', 'Original', 'Aftermarket'].map(f => (
              <button key={f} className="px-6 py-3 bg-white border rounded-full hover:bg-gray-100 transition-colors">
                {f}
              </button>
            ))}
          </div>

          <ProductGrid subcategory="pixel-9-pro-xl" showFilters />
        </div>
      </div>
    </>
  );
}
