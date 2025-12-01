import ProductGrid from '../../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../../components/Breadcrumb';
import { getProductsByModel } from '../../../../../lib/supabase';

export const metadata = {
  title: 'iPhone 15 Pro Parts - OLED Screens, Batteries, Cameras | Midas Technical Solutions',
  description: 'Premium OLED displays, titanium frames, cameras, batteries for iPhone 15 Pro. Grade A+ quality parts.',
};

export default async function iPhone15ProPage() {
  const products = await getProductsByModel('iPhone 15 Pro');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Parts' },
          { label: 'iPhone', href: '/parts/iphone' },
          { label: '15 Series', href: '/parts/iphone/15-series' },
          { label: 'iPhone 15 Pro' }
        ]} />

        <div className="mt-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900">iPhone 15 Pro</h1>
          <p className="text-xl text-gray-600 mt-3">Premium Titanium • Pro Camera System • All Replacement Parts</p>
        </div>

        <div className="my-10">
          <img
            src="/images/models/iphone-15-pro-hero.jpg"
            alt="iPhone 15 Pro Parts"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>

        <ProductGrid products={products} showFilters={true} />
      </div>
    </div>
  );
}
