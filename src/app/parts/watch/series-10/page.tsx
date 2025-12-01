import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';
import { getProductsByModel } from '../../../../lib/supabase';

export const metadata = {
  title: 'Apple Watch Series 10 Parts - Slimmer Design, Bigger Display | Midas Technical Solutions',
  description: 'Premium components for Apple Watch Series 10. Slimmer design parts, bigger display, sensors.',
};

export default async function WatchSeries10Page() {
  const products = await getProductsByModel('Watch Series 10');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Parts' },
          { label: 'Apple Watch', href: '/parts/watch' },
          { label: 'Apple Watch Series 10' }
        ]} />

        <div className="mt-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900">Apple Watch Series 10</h1>
          <p className="text-xl text-gray-600 mt-3">Slimmer Design • Bigger Display • Always-On Retina</p>
        </div>

        <div className="my-10">
          <img
            src="/images/models/watch-series-10-hero.jpg"
            alt="Apple Watch Series 10 Parts"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>

        <ProductGrid products={products} showFilters={true} />
      </div>
    </div>
  );
}
