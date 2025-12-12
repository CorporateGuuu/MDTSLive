import ProductGrid from '../../../../../components/Product/ProductGrid';

export const metadata = {
  title: 'Samsung Galaxy S24 Ultra Parts - AMOLED Screens, Batteries, Cameras | Midas Technical Solutions',
  description: 'Original Samsung service pack displays, batteries, back glass, cameras for S24 Ultra. Fast USA shipping.',
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Parts",
          "item": "https://midastechnical.com/parts"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Samsung",
          "item": "https://midastechnical.com/parts/samsung"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Galaxy S",
          "item": "https://midastechnical.com/parts/samsung/galaxy-s"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "S24 Ultra",
          "item": "https://midastechnical.com/parts/samsung/galaxy-s/s24-ultra"
        }
      ]
    },
    {
      "@type": "Product",
      "@id": "https://midastechnical.com/parts/samsung/galaxy-s/s24-ultra#product",
      "name": "Samsung Galaxy S24 Ultra Parts",
      "description": "Genuine Samsung Galaxy S24 Ultra replacement parts including displays, batteries, cameras, and components",
      "brand": {
        "@type": "Brand",
        "name": "Samsung"
      },
      "category": "Mobile Phone Parts",
      "offers": {
        "@type": "AggregateOffer",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "USD",
        "lowPrice": "29.99",
        "highPrice": "599.99"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1247"
      }
    }
  ]
};

export default function S24UltraPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-8">Galaxy S24 Ultra Parts</h1>

          {/* Filters */}
          <div className="flex gap-4 my-8 flex-wrap">
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
              aria-label="Filter by part grade"
            >
              <option>Grade: All</option>
              <option>Original</option>
              <option>OEM</option>
              <option>Refurbished</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
              aria-label="Filter by part type"
            >
              <option>Type: All</option>
              <option>Display</option>
              <option>Battery</option>
              <option>Camera</option>
              <option>Motherboard</option>
              <option>Charging Port</option>
              <option>Speaker</option>
            </select>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
              aria-label="Sort products"
            >
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Most Popular</option>
            </select>
          </div>

          <ProductGrid subcategory="s24-ultra" showFilters={true} />
        </div>
      </div>
    </>
  );
}
