import ProductCard from '../../../components/ProductCard';

const mockProducts = [
  { id: '1', name: 'iPhone 15 Pro Max Screen OLED', price: 299, originalPrice: 399, image: '/iphone-screen.jpg', brand: 'Apple', isSale: true },
  { id: '2', name: 'iPhone 15 Pro Screen Assembly', price: 349, image: '/iphone-15-pro-screen.jpg', brand: 'Apple', isNew: true },
  { id: '3', name: 'iPhone 15 Plus Battery 4382mAh', price: 89, image: '/iphone-battery.jpg', brand: 'Apple' },
  { id: '4', name: 'iPhone 14 Pro Max Face ID Sensor', price: 129, originalPrice: 159, image: '/face-id.jpg', brand: 'Apple', isSale: true },
  { id: '5', name: 'iPhone 15 Charging Port Assembly', price: 49, image: '/charging-port.jpg', brand: 'Apple' },
  { id: '6', name: 'iPhone 14 Series Taptic Engine', price: 39, image: '/taptic-engine.jpg', brand: 'Apple' },
  { id: '7', name: 'iPhone 15 Pro Max Rear Camera', price: 189, image: '/rear-camera.jpg', brand: 'Apple', inStock: false },
  { id: '8', name: 'iPhone 15 Logic Board A16 Bionic', price: 599, image: '/logic-board.jpg', brand: 'Apple', isNew: true },
];

export default function ApplePartsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-0">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Apple Parts</h1>
        <p className="text-xl opacity-90">Genuine & High-Quality Replacement Parts</p>
      </div>

      {/* Product Grid - Ultra Responsive */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="
          grid grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          gap-4 md:gap-6 lg:gap-8
        ">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
