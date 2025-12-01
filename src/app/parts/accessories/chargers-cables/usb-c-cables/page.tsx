import ProductGrid from '../../../../../components/Product/ProductGrid';

export const metadata = {
  title: 'USB-C Cables - Braided, 100W PD, 10ft | Midas Technical Solutions',
  description: 'Fast charging USB-C to USB-C, USB-C to Lightning, braided nylon, MFi, Anker, Belkin, OEM quality.',
};

export default function USBCablesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-8">USB-C Cables</h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          60W / 100W PD • Braided • 3ft – 10ft • MFi Certified • Bulk Pricing
        </p>
        <ProductGrid subcategory="usb-c-cables" showFilters={true} />
      </div>
    </div>
  );
}
