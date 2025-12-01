import ProductGrid from '../../../../../components/Product/ProductGrid';

export const metadata = {
  title: 'Lightning Cables - MFi Certified, 10ft, Fast Charging | Nexus Tech Hub',
  description: 'Original Apple Lightning cables, MFi certified, fast charging, braided nylon, 3ft to 10ft lengths.',
};

export default function LightningCablesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-8">Lightning Cables</h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          MFi Certified • Fast Charging • Braided • 3ft – 10ft • Apple Original
        </p>
        <ProductGrid subcategory="lightning-cables" showFilters={true} />
      </div>
    </div>
  );
}
