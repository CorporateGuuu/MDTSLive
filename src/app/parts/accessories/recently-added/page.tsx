import ProductGrid from '../../../../components/Product/ProductGrid';
import { getRecentProducts } from '../../../../lib/supabase/products';

export const metadata = {
  title: 'Recently Added Products - New Arrivals | Midas Technical Solutions',
  description: 'Latest chargers, cases, cables, Casper tempered glass, AmpSentrix batteries, OEM accessories and more added daily.',
};

export default async function RecentlyAddedPage() {
  const products = await getRecentProducts(48); // Last 48 products

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Recently Added Products
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          New stock arrives daily — Casper, AmpSentrix, OEM Accessories, Console Parts & more
        </p>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-16">
          {['Casper', 'AmpSentrix', 'OEM Accessories', 'Console', 'Memory', 'Skins'].map((brand) => (
            <div key={brand} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 mx-auto mb-3" />
              <p className="font-semibold">{brand}</p>
            </div>
          ))}
        </div>

        <ProductGrid products={products} showNewBadge={true} />
      </div>
    </div>
  );
}
