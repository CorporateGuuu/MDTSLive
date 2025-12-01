import Link from 'next/link';

const chips = [
  { name: 'Tristar / Tigris', badge: 'BEST SELLER', models: 'iPhone 6–15 Series' },
  { name: 'Charging IC', badge: 'MOST POPULAR', models: 'U2, P13, SN2600' },
  { name: 'Audio IC', badge: '', models: '338S00411, 338S00248' },
  { name: 'Power IC', badge: 'PMIC', models: 'PMU for iPhone & Android' },
];

export const metadata = {
  title: 'IC Chips - Tristar, Tigris, Charging IC, Audio IC | Nexus Tech Hub',
  description: 'OEM-quality board-level ICs. 100% tested. Same-day shipping.',
};

export default function ICChipsPage() {
  return (
    <div className="bg-gradient-to-b from-red-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="bg-yellow-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
          48-HOUR REPLACEMENT GUARANTEE ON ALL ICs
        </div>
        <h1 className="text-7xl font-black mb-6">BOARD-LEVEL IC CHIPS</h1>
        <p className="text-2xl mb-12 max-w-4xl mx-auto">
          Original pulled • 100% tested • Zero DOA • Bulk pricing available
        </p>

        <div className="grid md:grid-cols-4 gap-10">
          {chips.map((chip) => (
            <Link
              key={chip.name.toLowerCase().replace(/[^a-z]/g, '-')}
              href={`/parts/board-components/ic-chips/${chip.name.toLowerCase().replace(/[^a-z]/g, '-')}`}
              className="group block bg-white/10 backdrop-blur rounded-3xl p-10 hover:bg-white/20 transition"
            >
              {chip.badge && (
                <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold inline-block mb-4">
                  {chip.badge}
                </div>
              )}
              <div className="bg-gray-400 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-2">{chip.name}</h3>
              <p className="text-gray-300">{chip.models}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
