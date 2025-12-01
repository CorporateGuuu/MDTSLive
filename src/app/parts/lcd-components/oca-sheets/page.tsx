import ProductGrid from '../../../../components/Product/ProductGrid';

export const metadata = {
  title: 'OCA Sheets - Mitsubishi 250um OCA for iPhone, Samsung, iPad | Midas Technical Solutions',
  description: 'Premium Mitsubishi OCA film 250um, 200um, 175um. Bubble-free lamination. Bulk rolls available.',
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Mitsubishi OCA Sheets 250um",
  "description": "Original Mitsubishi OCA adhesive film for screen refurbishing",
  "brand": { "@type": "Brand", "name": "Mitsubishi" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "89.99",
    "availability": "https://schema.org/InStock"
  }
};

export default function OCASheetsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-black mb-6">OCA Sheets</h1>
        <p className="text-xl text-gray-600 mb-12">Mitsubishi • 250um • 200um • 175um • iPhone & Samsung</p>

        <ProductGrid subcategory="oca-sheets" />
      </div>
    </>
  );
}
