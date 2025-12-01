import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';
import { getProductsByModel } from '../../../../lib/supabase';

export const metadata = {
  title: 'AirPods Pro (2nd Gen) Parts - Batteries, Cases, Drivers | Midas Technical Solutions',
  description: 'Premium replacement parts for AirPods Pro 2nd generation. Batteries, charging cases, drivers, sensors.',
};

export default async function AirPodsPro2Page() {
  const products = await getProductsByModel('AirPods Pro');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Parts' },
          { label: 'MacBook & AirPods', href: '/parts/macbook-airpods' },
          { label: 'AirPods Pro (2nd Gen)' }
        ]} />

        <div className="mt-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900">AirPods Pro (2nd Gen)</h1>
          <p className="text-xl text-gray-600 mt-3">Active Noise Cancellation • Spatial Audio • MagSafe Charging</p>
        </div>

        <div className="my-10">
          <img
            src="/images/models/airpods-pro-2-hero.jpg"
            alt="AirPods Pro 2nd Gen Parts"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>

        <ProductGrid products={products} showFilters={true} />
      </div>
    </div>
  );
}
