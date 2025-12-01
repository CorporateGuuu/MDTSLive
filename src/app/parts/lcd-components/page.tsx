import Link from 'next/link';

const lcdComponents = [
  { name: 'OCA Sheets', description: 'Mitsubishi 250um, 200um, 175um', icon: '📄', category: 'oca-sheets' },
  { name: 'Polarizers', description: 'LCD polarizer films for screens', icon: '🔆', category: 'polarizers' },
  { name: 'Backlights', description: 'LED backlight strips and modules', icon: '💡', category: 'backlights' },
  { name: 'Touch Panels', description: 'Digitizer assemblies', icon: '👆', category: 'touch-panels' },
  { name: 'Flex Cables', description: 'Display flex cables and connectors', icon: '🔌', category: 'flex-cables' },
];

export const metadata = {
  title: 'LCD Components - OCA Sheets, Polarizers, Backlights | Nexus Tech Hub',
  description: 'Complete LCD refurbishment components. Mitsubishi OCA, polarizers, backlights, touch panels. Bulk wholesale pricing.',
};

export default function LCDComponentsPage() {
  return (
    <div className="bg-gradient-to-b from-blue-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="bg-yellow-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
          COMPLETE LCD REFURBISHMENT SOLUTIONS
        </div>
        <h1 className="text-7xl font-black mb-6">LCD COMPONENTS</h1>
        <p className="text-2xl mb-12 max-w-4xl mx-auto">
          Premium Mitsubishi OCA • Polarizers • Backlights • Touch Panels • Flex Cables
        </p>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
          {lcdComponents.map((component) => (
            <Link
              key={component.category}
              href={`/parts/lcd-components/${component.category}`}
              className="group block bg-white/10 backdrop-blur rounded-3xl p-8 hover:bg-white/20 transition transform hover:scale-105"
            >
              <div className="text-6xl mb-4">{component.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{component.name}</h3>
              <p className="text-gray-300 text-sm">{component.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-white/10 backdrop-blur rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-6">Why Choose Our LCD Components?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="text-xl font-bold mb-4">Premium Quality</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Genuine Mitsubishi OCA film</li>
                <li>• High-clarity polarizers</li>
                <li>• Bright LED backlights</li>
                <li>• OEM touch panels</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Perfect Fit</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• iPhone 6 to 15 series</li>
                <li>• Samsung Galaxy S/Note/A series</li>
                <li>• iPad Pro/Air/Mini</li>
                <li>• Bulk rolls available</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Professional Grade</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Bubble-free lamination</li>
                <li>• Zero light bleed</li>
                <li>• Long-lasting performance</li>
                <li>• Wholesale pricing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
