import Link from 'next/link';
import Breadcrumb from '../../../../components/Breadcrumb';

const requiredTools = [
  'iSclack Opening Tool',
  'Suction Cup',
  'Plastic Pry Tools',
  'Phillips Screwdriver (#000)',
  'Pentalobe Screwdriver (P2)',
  'Spudger',
  'Heat Gun or Hair Dryer',
  'Tweezers',
  'Magnetized Mat'
];

const compatibleModels = [
  'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
  'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
  'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini',
  'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini'
];

const steps = [
  {
    step: 1,
    title: 'Power Off & Heat Screen',
    description: 'Turn off your iPhone completely. Use a heat gun or hair dryer to gently heat the edges of the screen for 1-2 minutes. This softens the adhesive.',
    warning: 'Do not overheat - maximum 60°C (140°F)',
    image: 'heat-screen.jpg'
  },
  {
    step: 2,
    title: 'Remove Pentalobe Screws',
    description: 'Use P2 pentalobe screwdriver to remove the two screws at the bottom of the iPhone.',
    tools: ['Pentalobe Screwdriver (P2)'],
    image: 'pentalobe-screws.jpg'
  },
  {
    step: 3,
    title: 'Apply Suction Cup',
    description: 'Place suction cup near the bottom edge. For Face ID models, position it slightly off-center to avoid the TrueDepth camera.',
    tools: ['Suction Cup'],
    image: 'suction-cup.jpg'
  },
  {
    step: 4,
    title: 'Create Gap with Pry Tool',
    description: 'While pulling up on suction cup, insert plastic pry tool into the gap. Gently twist to separate adhesive.',
    tools: ['Plastic Pry Tools'],
    warning: 'Work slowly to avoid damaging flex cables',
    image: 'pry-gap.jpg'
  },
  {
    step: 5,
    title: 'Slide Opening Pick Around',
    description: 'Insert opening pick and slide it around the bottom edge. Reheat as needed to keep adhesive soft.',
    tools: ['Plastic Pry Tools', 'Heat Gun'],
    image: 'slide-pick.jpg'
  },
  {
    step: 6,
    title: 'Open Hinge with iSclack',
    description: 'Use iSclack opening tool to create a small gap. Place suction cups and gently open the phone like a book.',
    tools: ['iSclack Opening Tool'],
    warning: 'Open slowly - maximum 90° angle',
    image: 'isclack-open.jpg'
  },
  {
    step: 7,
    title: 'Remove Screen',
    description: 'Carefully lift the screen assembly. Be gentle with the flex cables connecting display to logic board.',
    warning: 'Do not pull flex cables - they are fragile',
    image: 'remove-screen.jpg'
  },
  {
    step: 8,
    title: 'Disconnect Cables',
    description: 'Use spudger to gently disconnect battery, display, and digitizer flex cables from logic board.',
    tools: ['Spudger'],
    image: 'disconnect-cables.jpg'
  },
  {
    step: 9,
    title: 'Remove Old Adhesive',
    description: 'Carefully remove old adhesive from frame using plastic tools. Clean surface thoroughly.',
    tools: ['Plastic Pry Tools'],
    image: 'remove-adhesive.jpg'
  },
  {
    step: 10,
    title: 'Install New Screen',
    description: 'Connect new display cables, position screen, and press firmly. Ensure proper alignment.',
    warning: 'Double-check cable connections before closing',
    image: 'install-screen.jpg'
  }
];

export const metadata = {
  title: 'iPhone Screen Replacement Guide - Step-by-Step Tutorial | Midas Technical Solutions',
  description: 'Complete iPhone screen replacement tutorial for iPhone 15, 14, 13, 12 series. Professional repair guide with photos, tools, and safety precautions.',
};

export default function IPhoneScreenReplacementPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb items={[
          { label: 'Repair Guides', href: '/repair-guides' },
          { label: 'iPhone', href: '/repair-guides/iphone' },
          { label: 'Screen Replacement' }
        ]} />

        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">📱</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">iPhone Screen Replacement</h1>
              <p className="text-gray-600">Complete step-by-step repair tutorial</p>
            </div>
            <div className="ml-auto text-right">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                Intermediate Level
              </div>
              <div className="text-sm text-gray-500">45-60 minutes</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Compatible Models</h3>
              <div className="flex flex-wrap gap-2">
                {compatibleModels.map((model) => (
                  <span key={model} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {model}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Required Tools</h3>
              <div className="flex flex-wrap gap-2">
                {requiredTools.slice(0, 5).map((tool) => (
                  <span key={tool} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {tool}
                  </span>
                ))}
                <span className="text-blue-600 text-xs font-medium">
                  +{requiredTools.length - 5} more
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Warning */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-red-800 mb-2">Safety Precautions</h3>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Work in a clean, static-free environment</li>
                <li>• Wear anti-static wrist strap</li>
                <li>• Power off device completely before starting</li>
                <li>• Handle components by edges only</li>
                <li>• Use proper tools to avoid damage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step-by-Step Guide */}
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.step} className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-700 mb-4">{step.description}</p>

                  {step.warning && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-yellow-800 text-sm font-medium">⚠️ {step.warning}</p>
                    </div>
                  )}

                  {step.tools && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Tools needed:</p>
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

        {/* Tools Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mt-8">
          <h2 className="text-2xl font-bold mb-6">Required Tools & Parts</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Tools</h3>
              <ul className="space-y-2">
                {requiredTools.map((tool) => (
                  <li key={tool} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-700">{tool}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Recommended Parts</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-700">Original OEM Screen Assembly</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-700">Screen Adhesive Strips</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-700">Replacement Screws</span>
                </li>
              </ul>
              <div className="mt-4">
                <Link
                  href="/parts"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Shop Parts →
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
              href="/repair-guides/iphone/battery-replacement"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 mb-2">iPhone Battery Replacement</h3>
              <p className="text-sm text-gray-600">Easy battery swap guide</p>
              <span className="text-xs text-blue-600 mt-2 block">Beginner • 20-30 min</span>
            </Link>
            <Link
              href="/repair-guides/iphone/charging-port"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Charging Port Repair</h3>
              <p className="text-sm text-gray-600">Fix charging issues</p>
              <span className="text-xs text-blue-600 mt-2 block">Advanced • 60-90 min</span>
            </Link>
            <Link
              href="/repair-guides/samsung/screen-replacement"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Samsung Screen Replacement</h3>
              <p className="text-sm text-gray-600">Galaxy series guide</p>
              <span className="text-xs text-blue-600 mt-2 block">Intermediate • 50-70 min</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
