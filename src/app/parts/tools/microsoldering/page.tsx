import ProductGrid from '../../../../components/Product/ProductGrid';

export const metadata = {
  title: 'Microsoldering Tools - Hot Air Stations, Board Holders, Thermal Cameras | Midas Technical Solutions',
  description: 'Professional microsoldering equipment: Quick 861DW, JC Aixun T3A, Qianli board holders, FLIR thermal cameras. Full kits available.',
};

export default function MicrosolderingPage() {
  return (
    <div className="bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-6xl font-black mb-6">MICROSOLDERING</h1>
        <p className="text-2xl mb-12 opacity-90">
          Pro-grade tools for board-level repair • Qianli • JC • Mechanic • Aixun
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-16">
          {[
            { name: 'Hot Air Stations', slug: 'hot-air-stations' },
            { name: 'Soldering Stations', slug: 'soldering-stations' },
            { name: 'Board Holders', slug: 'board-holders' },
            { name: 'Power Supply Units', slug: 'power-supply-units' },
            { name: 'Thermal Cameras', slug: 'thermal-cameras' }
          ].map((item) => (
            <a
              key={item.slug}
              href={`/parts/tools/microsoldering/${item.slug}`}
              className="bg-gray-900 rounded-xl p-8 hover:bg-gray-800 transition block"
            >
              <div className="bg-gray-700 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
              <p className="font-bold text-lg">{item.name}</p>
            </a>
          ))}
        </div>

        <ProductGrid subcategory="microsoldering" showFilters={true} />
      </div>
    </div>
  );
}
