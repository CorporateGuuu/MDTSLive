import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';
import { getProductsByModel } from '../../../../lib/supabase';

export const metadata = {
  title: 'Apple Watch Ultra 2 Parts - Titanium Case, Action Button | Midas Technical Solutions',
  description: 'Premium titanium components, action button, rugged case parts for Apple Watch Ultra 2.',
};

export default async function WatchUltra2Page() {
  const products = await getProductsByModel('Watch Ultra 2');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Parts' },
          { label: 'Apple Watch', href: '/parts/watch' },
          { label: 'Apple Watch Ultra 2' }
        ]} />

        <div className="mt-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900">Apple Watch Ultra 2</h1>
          <p className="text-xl text-gray-600 mt-3">Titanium Case • Action Button • Rugged Design</p>
        </div>

        <div className="my-10">
          <img
            src="/images/models/watch-ultra-2-hero.jpg"
            alt="Apple Watch Ultra 2 Parts"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>

        <ProductGrid products={products} showFilters={true} />
      </div>
    </div>
  );
}
