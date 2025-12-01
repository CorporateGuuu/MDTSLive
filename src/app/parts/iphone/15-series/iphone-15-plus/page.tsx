import ProductGrid from '../../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../../components/Breadcrumb';
import { getProductsByModel } from '../../../../../lib/supabase';

export const metadata = {
  title: 'iPhone 15 Plus Parts - Large Screen, Batteries, Cameras | Nexus Tech Hub',
  description: '6.7-inch displays, premium cameras, batteries, charging ports for iPhone 15 Plus. High-quality parts.',
};

export default async function iPhone15PlusPage() {
  const products = await getProductsByModel('iPhone 15 Plus');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Parts' },
          { label: 'iPhone', href: '/parts/iphone' },
          { label: '15 Series', href: '/parts/iphone/15-series' },
          { label: 'iPhone 15 Plus' }
        ]} />

        <div className="mt-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900">iPhone 15 Plus</h1>
          <p className="text-xl text-gray-600 mt-3">Large 6.7" Display • All-Day Battery • Premium Parts Available</p>
        </div>

        <div className="my-10">
          <img
            src="/images/models/iphone-15-plus-hero.jpg"
            alt="iPhone 15 Plus Parts"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>

        <ProductGrid products={products} showFilters={true} />
      </div>
    </div>
  );
}
