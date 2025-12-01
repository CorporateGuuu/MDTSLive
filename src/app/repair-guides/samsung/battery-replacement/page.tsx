import Link from 'next/link';
import Breadcrumb from '../../../../components/Breadcrumb';

const requiredTools = [
  'Plastic Pry Tools',
  'Phillips Screwdriver (#00)',
  'Spudger',
  'Tweezers',
  'Heat Gun or Hair Dryer',
  'Magnetized Mat'
];

const compatibleModels = [
  'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
  'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
  'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
  'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21',
  'Galaxy Note 20 Ultra', 'Galaxy Note 20', 'Galaxy Note 10+'
];

const steps = [
  {
    step: 1,
    title: 'Power Off Device',
    description: 'Turn off your Samsung Galaxy completely. Remove SIM card if present.',
    warning: 'Ensure device is powered off to prevent electrical hazards',
    image: 'power-off.jpg'
  },
  {
    step: 2,
    title: 'Heat Back Cover',
    description: 'Use heat gun or hair dryer to gently warm the back cover for 1-2 minutes. This softens the adhesive.',
    warning: 'Do not overheat - maximum 50°C (122°F)',
    tools: ['Heat Gun or Hair Dryer'],
    image: 'heat-back.jpg'
  },
  {
    step: 3,
    title: 'Insert Opening Tool',
    description: 'Find the small gap near the charging port. Insert plastic pry tool and gently twist to create separation.',
    tools: ['Plastic Pry Tools'],
    warning: 'Work slowly to avoid cracking the back cover',
    image: 'insert-tool.jpg'
  },
  {
    step: 4,
    title: 'Slide Tool Around Edges',
    description: 'Carefully slide the opening tool around all edges of the phone. Reheat as needed to keep adhesive soft.',
    tools: ['Plastic Pry Tools', 'Heat Gun'],
    image: 'slide-around.jpg'
  },
  {
    step: 5,
    title: 'Remove Back Cover',
    description: 'Once all edges are separated, carefully lift and remove the back cover. Set aside safely.',
    warning: 'Back cover is fragile - handle with care',
    image: 'remove-back.jpg'
  },
  {
    step: 6,
    title: 'Disconnect Battery',
    description: 'Locate the battery connector on the motherboard. Use spudger to gently lift and disconnect the battery cable.',
    tools: ['Spudger'],
    warning: 'Do not puncture or bend the battery',
    image: 'disconnect-battery.jpg'
  },
  {
    step: 7,
    title: 'Remove Battery Adhesive',
    description: 'Carefully peel back the adhesive strips securing the battery. Work slowly to avoid damage.',
    tools: ['Plastic Pry Tools', 'Tweezers'],
    image: 'remove-adhesive.jpg'
  },
  {
    step: 8,
    title: 'Remove Old Battery',
    description: 'Gently lift the old battery from the phone. Dispose of properly - batteries are hazardous waste.',
    warning: 'Never reuse old lithium-ion batteries',
    image: 'remove-battery.jpg'
  },
  {
    step: 9,
    title: 'Install New Battery',
    description: 'Place new battery in position. Ensure proper alignment with connectors and adhesive.',
    tools: ['New Battery'],
    warning: 'Verify correct battery model for your device',
    image: 'install-battery.jpg'
  },
  {
    step: 10,
    title: 'Reconnect & Test',
    description: 'Reconnect battery cable to motherboard. Power on device and verify battery is recognized.',
    tools: ['Spudger'],
    image: 'reconnect-test.jpg'
  },
  {
    step: 11,
    title: 'Reassemble Device',
    description: 'Replace back cover and press firmly around edges. Power on and test all functions.',
    image: 'reassemble.jpg'
  }
];

export const metadata = {
  title: 'Samsung Galaxy Battery Replacement Guide - Step-by-Step Tutorial | Nexus Tech Hub',
  description: 'Complete Samsung Galaxy battery replacement tutorial for S24, S23, S22, S21, Note series. Easy guide for extending device life.',
};

export default function SamsungBatteryReplacementPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Repair Guides', href: '/repair-guides' },
          { label: 'Samsung', href: '/repair-guides/samsung' },
          { label: 'Battery Replacement' }
        ]} />

        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">🔋</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Samsung Galaxy Battery Replacement</h1>
              <p className="text-gray-600">Restore battery life and performance</p>
            </div>
            <div className="ml-auto text-right">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                Beginner Level
              </div>
              <div className="text-sm text-gray-500">25-35 minutes</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Compatible Models</h3>
              <div className="flex flex-wrap gap-2">
                {compatibleModels.slice(0, 8).map((model) => (
                  <span key={model} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                    {model}
                  </span>
                ))}
                <span className="text-purple-600 text-xs font-medium">
                  +{compatibleModels.length - 8} more
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Required Tools</h3>
              <div className="flex flex-wrap gap-2">
                {requiredTools.map((tool) => (
                  <span key={tool} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Safety Warning */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h3 className="font-bold text-orange-800 mb-2">Battery Safety</h3>
              <ul className="text-orange-700 text-sm space-y-1">
                <li>• Lithium-ion batteries can be dangerous if damaged</li>
                <li>• Never puncture, bend, or expose to heat</li>
                <li>• Dispose of old batteries at proper recycling centers</li>
                <li>• Use only genuine Samsung replacement batteries</li>
                <li>• Work in a well-ventilated area</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-bold text-blue-800 mb-2">Battery Replacement Benefits</h3>
              <div className="grid md:grid-cols-2 gap-4 text-blue-700 text-sm">
                <div>
                  <p className="font-medium mb-2">When to Replace:</p>
                  <ul className="space-y-1">
                    <li>• Battery drains quickly</li>
                    <li>• Phone shuts down unexpectedly</li>
                    <li>• Battery swells or bulges</li>
                    <li>• Over 2 years old</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">What You'll Get:</p>
                  <ul className="space-y-1">
                    <li>• Full day battery life</li>
                    <li>• Faster charging</li>
                    <li>• Better performance</li>
                    <li>• Extended device life</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.step} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-700 mb-3">{step.description}</p>

                  {step.warning && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-yellow-800 text-sm font-medium">⚠️ {step.warning}</p>
                    </div>
                  )}

                  {step.tools && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {step.tools.map((tool) => (
                          <span key={tool} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500">📷 Step {step.step} Photo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tools & Parts */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
          <h2 className="text-2xl font-bold mb-6">Tools & Replacement Batteries</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Required Tools</h3>
              <ul className="space-y-2">
                {requiredTools.map((tool) => (
                  <li key={tool} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-gray-700">{tool}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Genuine Samsung Batteries</h3>
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="font-medium text-gray-900">Galaxy S24 Ultra Battery</div>
                  <div className="text-sm text-gray-600">5000mAh • OEM Quality</div>
                  <div className="text-green-600 font-bold">$89.99</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="font-medium text-gray-900">Galaxy S23 Ultra Battery</div>
                  <div className="text-sm text-gray-600">5000mAh • OEM Quality</div>
                  <div className="text-green-600 font-bold">$79.99</div>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/parts/samsung"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  View All Samsung Parts →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Guides */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
          <h2 className="text-2xl font-bold mb-6">Related Repair Guides</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/repair-guides/samsung/screen-replacement"
              className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Samsung Screen Replacement</h3>
              <p className="text-sm text-gray-600">Complete LCD replacement</p>
              <span className="text-xs text-purple-600 mt-2 block">Intermediate • 50-70 min</span>
            </Link>
            <Link
              href="/repair-guides/iphone/battery-replacement"
              className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 mb-2">iPhone Battery Replacement</h3>
              <p className="text-sm text-gray-600">iPhone battery guide</p>
              <span className="text-xs text-purple-600 mt-2 block">Beginner • 20-30 min</span>
            </Link>
            <Link
              href="/repair-guides/samsung/camera-repair"
              className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Samsung Camera Repair</h3>
              <p className="text-sm text-gray-600">Fix camera issues</p>
              <span className="text-xs text-purple-600 mt-2 block">Advanced • 45-60 min</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
