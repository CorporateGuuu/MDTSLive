import ProductGrid from '../../../../components/Product/ProductGrid';

export const metadata = {
  title: 'OnePlus 13 Parts - AMOLED Display, 6000mAh Battery, 100W Charger | Midas Technical Solutions',
  description: 'Original OnePlus 13 screens, batteries, cameras, charging ports. Hasselblad triple camera modules.',
};

export default function OnePlus13Page() {
  return (
    <div className="bg-gradient-to-b from-red-600 to-black text-white py-24">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-8xl font-black mb-6 tracking-tight">ONEPLUS 13</h1>
        <p className="text-3xl mb-4">Snapdragon 8 Elite • 6000mAh • 120Hz AMOLED</p>
        <p className="text-2xl mb-12 opacity-90">All Original Parts • In Stock • Same-Day Ship</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-16">
          {['AMOLED Display', '6000mAh Battery', 'Hasselblad Camera', '100W SUPERVOOC'].map(item => (
            <div key={item} className="bg-white/10 backdrop-blur rounded-2xl py-8">
              <div className="bg-gray-300 border-2 border-dashed rounded-xl w-20 h-20 mx-auto mb-4" />
              <p className="font-bold text-lg">{item}</p>
            </div>
          ))}
        </div>

        <ProductGrid subcategory="oneplus-13" showFilters />
      </div>
    </div>
  );
}
