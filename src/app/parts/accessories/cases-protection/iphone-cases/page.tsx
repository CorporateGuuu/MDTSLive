import ProductGrid from '../../../../../components/Product/ProductGrid';

export const metadata = {
  title: 'iPhone Cases - Premium Protection, All Models | Midas Technical Solutions',
  description: 'Premium iPhone cases for all models including iPhone 15, 14, 13 series. Shockproof, slim, wallet cases.',
};

export default function iPhoneCasesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-8">iPhone Cases</h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Premium Protection • All iPhone Models • Shockproof • Slim • Wallet Cases
        </p>
        <ProductGrid subcategory="iphone-cases" showFilters={true} />
      </div>
    </div>
  );
}
