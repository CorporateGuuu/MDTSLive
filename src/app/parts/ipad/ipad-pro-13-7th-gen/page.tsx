import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';
import { getProductsByModel } from '../../../../lib/supabase';

export const metadata = {
  title: 'iPad Pro 13" (7th Gen) Parts - Tandem OLED, M4 Chip | Nexus Tech Hub',
  description: 'Premium Tandem OLED display, M4 chip components, cameras, batteries for iPad Pro 13" 7th generation.',
};

export default async function iPadPro13Page() {
  const products = await getProductsByModel('iPad Pro 13');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Parts' },
          { label: 'iPad', href: '/parts/ipad' },
          { label: 'iPad Pro 13" (7th Gen)' }
        ]} />

        <div className="mt-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900">iPad Pro 13" (7th Gen)</h1>
          <p className="text-xl text-gray-600 mt-3">Tandem OLED Display • M4 Chip • Ultra-Thin Design</p>
        </div>

        <div className="my-10">
          <img
            src="/images/models/ipad-pro-13-hero.jpg"
            alt="iPad Pro 13-inch Parts"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>

        <ProductGrid products={products} showFilters={true} />
      </div>
    </div>
  );
}
