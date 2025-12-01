import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';
import { getProductsByModel } from '../../../../lib/supabase';

export const metadata = {
  title: 'Apple Watch SE (2024) Parts - Essential Features, Crash Detection | Midas Technical Solutions',
  description: 'Premium components for Apple Watch SE 2024. Essential features, crash detection, precision finding.',
};

export default async function WatchSE2024Page() {
  const products = await getProductsByModel('Watch SE');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Parts' },
          { label: 'Apple Watch', href: '/parts/watch' },
          { label: 'Apple Watch SE (2024)' }
        ]} />

        <div className="mt-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900">Apple Watch SE (2024)</h1>
          <p className="text-xl text-gray-600 mt-3">Essential Features • Crash Detection • Precision Finding</p>
        </div>

        <div className="my-10">
          <img
            src="/images/models/watch-se-2024-hero.jpg"
            alt="Apple Watch SE 2024 Parts"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>

        <ProductGrid products={products} showFilters={true} />
      </div>
    </div>
  );
}
