import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';
import { getProductsByModel } from '../../../../lib/supabase';

export const metadata = {
  title: 'iPad Air 11" Parts - M2 Chip, Liquid Retina | Midas Technical Solutions',
  description: 'Premium Liquid Retina display, M2 chip components, cameras, batteries for iPad Air 11-inch.',
};

export default async function iPadAir11Page() {
  const products = await getProductsByModel('iPad Air 11');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Parts' },
          { label: 'iPad', href: '/parts/ipad' },
          { label: 'iPad Air 11"' }
        ]} />

        <div className="mt-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900">iPad Air 11"</h1>
          <p className="text-xl text-gray-600 mt-3">M2 Chip • Liquid Retina • All-Day Battery</p>
        </div>

        <div className="my-10">
          <img
            src="/images/models/ipad-air-11-hero.jpg"
            alt="iPad Air 11-inch Parts"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>

        <ProductGrid products={products} showFilters={true} />
      </div>
    </div>
  );
}
