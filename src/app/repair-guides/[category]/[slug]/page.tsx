import { Youtube } from 'lucide-react';

export const metadata = { title: 'iPhone 15 Pro Max Screen Replacement Guide | Nexus Tech Hub' };

export default function GuidePage() {
  return (
    <article className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-black mb-6">iPhone 15 Pro Max Screen Replacement</h1>
      <div className="flex items-center gap-6 text-gray-600 mb-8">
        <span>45 min</span> • <span>Difficulty: Hard</span> • <span>2.1M views</span>
      </div>

      {/* Embedded Video */}
      <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl mb-12">
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-4">Tools Needed</h2>
          <ul className="space-y-3">
            <li>iFixit Mako Driver Kit</li>
            <li>Heat Gun</li>
            <li>Forward OCA Pro</li>
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Parts Used</h2>
          <ul className="space-y-3">
            <li>OLED Display Assembly</li>
            <li>250um Mitsubishi OCA</li>
            <li>Waterproof Adhesive</li>
          </ul>
        </div>
      </div>
    </article>
  );
}
