import Link from 'next/link';
import ProductGrid from '../../../../components/Product/ProductGrid';

const machines = [
  { name: 'Forward OCA Pro', price: '$2,999', badge: 'BEST SELLER', img: 'forward-oca-pro' },
  { name: 'TBK-578', price: '$1,299', badge: 'MOST POPULAR', img: 'tbk-578' },
  { name: 'Mini Laminators', price: '$499 – $899', badge: 'BUDGET CHOICE', img: 'mini-laminator' },
];

export const metadata = {
  title: 'OCA Machines & Laminators - Forward OCA Pro, TBK-578 | Nexus Tech Hub',
  description: 'Professional OCA lamination machines with vacuum, bubble-free results. Forward OCA Pro, TBK-578, mini laminators. Free training + 1-year warranty.',
};

export default function OCAMachinesPage() {
  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-yellow-400 text-black px-6 py-2 rounded-full inline-block font-bold text-lg mb-6">
          FREE SHIPPING + INSTALLATION TRAINING
        </div>
        <h1 className="text-7xl font-black text-white mb-6">
          PROFESSIONAL OCA MACHINES
        </h1>
        <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
          Bubble-free lamination • Built-in vacuum • Perfect alignment • Trusted by 5,000+ shops
        </p>

        <div className="grid md:grid-cols-3 gap-10 mb-16">
          {machines.map((m) => (
            <Link
              key={m.img}
              href={`/parts/machines/oca-machines/${m.img}`}
              className="group relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 border border-white/20"
            >
              <div className="p-10">
                <div className="absolute top-6 right-6 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                  {m.badge}
                </div>
                <div className="bg-gray-300 border-2 border-dashed rounded-2xl w-full h-64 mb-6" />
                <h3 className="text-3xl font-bold text-white mb-3">{m.name}</h3>
                <p className="text-4xl font-black text-yellow-400 mb-6">{m.price}</p>
                <button className="w-full bg-yellow-400 text-black hover:bg-yellow-300 py-3 px-6 rounded-full font-bold text-lg transition-colors">
                  View Details →
                </button>
              </div>
            </Link>
          ))}
        </div>

        <ProductGrid subcategory="oca-machines" showFilters={true} />
      </div>
    </div>
  );
}
