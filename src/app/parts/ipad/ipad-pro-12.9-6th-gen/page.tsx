import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';
import { getProductsByModel } from '../../../../lib/supabase';

export const metadata = {
  title: 'iPad Pro 12.9" (6th Gen) Parts - Liquid Retina XDR, M4 Chip | Midas Technical Solutions',
  description: 'Premium Liquid Retina XDR display, M4 chip components, cameras, batteries for iPad Pro 12.9" 6th generation.',
};

export default async function iPadPro129Page() {
  const products = await getProductsByModel('iPad Pro 12.9');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Parts' },
          { label: 'iPad', href: '/parts/ipad' },
          { label: 'iPad Pro 12.9" (6th Gen)' }
        ]} />

        <div className="mt-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900">iPad Pro 12.9" (6th Gen)</h1>
          <p className="text-xl text-gray-600 mt-3">Liquid Retina XDR • M4 Chip • Ultra-Thin Design</p>
        </div>

        <div className="my-10">
          <img
            src="/images/models/ipad-pro-12.9-hero.jpg"
            alt="iPad Pro 12.9-inch Parts"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>

        <ProductGrid products={products} showFilters={true} />
      </div>
    </div>
  );
}
