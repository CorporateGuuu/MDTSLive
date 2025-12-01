import ProductGrid from '../../../../components/Product/ProductGrid';
import Breadcrumb from '../../../../components/Breadcrumb';
import { getProductsByModel } from '../../../../lib/supabase';

export const metadata = {
  title: 'MacBook Pro Parts - M3/M4 Chips, Displays, Batteries | Nexus Tech Hub',
  description: 'Premium replacement parts for MacBook Pro. Liquid Retina XDR displays, M3/M4 chips, batteries, keyboards.',
};

export default async function MacBookProPage() {
  const products = await getProductsByModel('MacBook Pro');

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Parts' },
          { label: 'MacBook & AirPods', href: '/parts/macbook-airpods' },
          { label: 'MacBook Pro' }
        ]} />

        <div className="mt-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900">MacBook Pro</h1>
          <p className="text-xl text-gray-600 mt-3">M3/M4 Chips • Liquid Retina XDR • Pro Performance</p>
        </div>

        <div className="my-10">
          <img
            src="/images/models/macbook-pro-hero.jpg"
            alt="MacBook Pro Parts"
            className="w-full max-w-6xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>

        <ProductGrid products={products} showFilters={true} />
      </div>
    </div>
  );
}
