import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';

const repairCategories = [
  {
    name: 'iPhone Repairs',
    slug: 'iphone',
    description: 'Complete iPhone repair guides from iPhone 6 to iPhone 15 Pro Max',
    icon: '📱',
    guides: [
      { name: 'Screen Replacement', slug: 'screen-replacement', difficulty: 'Intermediate', time: '45-60 min' },
      { name: 'Battery Replacement', slug: 'battery-replacement', difficulty: 'Beginner', time: '20-30 min' },
      { name: 'Charging Port Repair', slug: 'charging-port', difficulty: 'Advanced', time: '60-90 min' },
      { name: 'Face ID Repair', slug: 'face-id-repair', difficulty: 'Expert', time: '90-120 min' }
    ],
    featured: true
  },
  {
    name: 'Samsung Repairs',
    slug: 'samsung',
    description: 'Galaxy S, A, Z Fold, and Note series repair tutorials',
    icon: '📱',
    guides: [
      { name: 'Battery Replacement', slug: 'battery-replacement', difficulty: 'Beginner', time: '25-35 min' },
      { name: 'Screen Replacement', slug: 'screen-replacement', difficulty: 'Intermediate', time: '50-70 min' },
      { name: 'Camera Repair', slug: 'camera-repair', difficulty: 'Advanced', time: '45-60 min' },
      { name: 'Motherboard Repair', slug: 'motherboard-repair', difficulty: 'Expert', time: '120-180 min' }
    ]
  },
  {
    name: 'LCD & Display',
    slug: 'display',
    description: 'Screen refurbishing, polarizer replacement, backlight repair',
    icon: '💻',
    guides: [
      { name: 'OCA Application', slug: 'oca-application', difficulty: 'Intermediate', time: '30-45 min' },
      { name: 'Polarizer Replacement', slug: 'polarizer-replacement', difficulty: 'Advanced', time: '60-90 min' },
      { name: 'Backlight Repair', slug: 'backlight-repair', difficulty: 'Expert', time: '90-120 min' }
    ]
  },
  {
    name: 'Board Level',
    slug: 'board-level',
    description: 'Component-level repairs, IC replacement, microsoldering',
    icon: '🔧',
    guides: [
      { name: 'IC Chip Replacement', slug: 'ic-chip-replacement', difficulty: 'Expert', time: '60-120 min' },
      { name: 'Microsoldering', slug: 'microsoldering', difficulty: 'Expert', time: '90-180 min' },
      { name: 'Component Identification', slug: 'component-id', difficulty: 'Advanced', time: '15-30 min' }
    ]
  }
];

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800',
  'Advanced': 'bg-orange-100 text-orange-800',
  'Expert': 'bg-red-100 text-red-800'
};

export const metadata = {
  title: 'Professional Phone Repair Guides - iPhone, Samsung, LCD | Midas Technical Solutions',
  description: 'Step-by-step repair tutorials for iPhone and Samsung devices. Screen replacement, battery repair, LCD refurbishing, board-level repairs. Professional technician guides.',
};

export default function RepairGuidesPage() {
  return (
    <>
      <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: 'Repair Guides' }]} />

          <div className="text-center mt-8 mb-12">
            <div className="bg-yellow-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
              PROFESSIONAL REPAIR TUTORIALS
            </div>
            <h1 className="text-6xl font-black mb-6">Repair Guides</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Comprehensive step-by-step tutorials for professional technicians.
              From beginner-friendly repairs to advanced board-level work.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white/20 px-4 py-2 rounded-full">✓ Detailed Photos</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">✓ Video Tutorials</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">✓ Tool Requirements</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">✓ Safety Precautions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid gap-8">
            {repairCategories.map((category) => (
              <div key={category.slug} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className={`p-8 ${category.featured ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{category.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold">{category.name}</h2>
                      <p className={`text-sm ${category.featured ? 'text-blue-100' : 'text-gray-600'}`}>
                        {category.description}
                      </p>
                    </div>
                    {category.featured && (
                      <span className="ml-auto bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                        MOST POPULAR
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.guides.map((guide) => (
                      <Link
                        key={guide.slug}
                        href={`/repair-guides/${category.slug}/${guide.slug}`}
                        className="group block bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl p-6 transition-all duration-200 hover:shadow-md"
                      >
                        <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-blue-700">
                          {guide.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[guide.difficulty as keyof typeof difficultyColors]}`}>
                            {guide.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">{guide.time}</span>
                        </div>
                        <div className="text-xs text-gray-600 group-hover:text-blue-600">
                          View Guide →
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-8">Repair Guide Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📸</span>
                </div>
                <h3 className="text-xl font-bold mb-2">High-Resolution Photos</h3>
                <p className="text-gray-600">Every step documented with detailed, high-quality images for clear understanding.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎥</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Video Tutorials</h3>
                <p className="text-gray-600">Complementary video guides showing complex procedures and techniques.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛠️</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Tool Recommendations</h3>
                <p className="text-gray-600">Specific tools required for each repair with links to our professional equipment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
