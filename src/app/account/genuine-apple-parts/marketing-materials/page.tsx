'use client';

import { Button } from '../../../../components/ui/button';
import { Phone, Download } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function GAPPMarketingMaterials() {
  const handleDownload = (assetName: string) => {
    toast.success(`${assetName} downloaded successfully!`);
    // In real app: trigger file download
  };

  const handleDownloadAll = () => {
    toast.success('All marketing materials downloaded as ZIP!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-blue-600">Nexus Tech Hub</h1>
          <input placeholder="What are you looking for?" className="border rounded-lg px-4 py-2 w-64" />
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>United States | USD</span>
          <span className="bg-yellow-100 px-2 py-1 rounded">$744.16 | 2</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar – Highlight "Marketing Materials" */}
        <aside className="w-64 bg-white shadow p-4 space-y-2">
          <ul className="space-y-1">
            <li className="font-bold text-blue-600">My Account</li>
            {/* ... other items */}
            <li className="font-bold text-blue-600 bg-blue-100 p-1 rounded">Genuine Apple Parts</li>
            <li className="text-sm text-gray-600 pl-4">— Manage Enrollment</li>
            <li className="text-sm text-gray-600 pl-4">— Core Returns</li>
            <li className="text-sm text-gray-600 pl-4 bg-blue-50 p-1 rounded">— Marketing Materials</li>
          </ul>
          <Button className="w-full bg-red-500 text-white">Always Expand Submenu</Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Marketing Materials For GAPP
          </h1>
          <p className="text-gray-600 mb-8">
            In this section, you will find marketing materials to download and display in your repair shops for the Genuine Apple Parts Program.
          </p>

          <div className="bg-white rounded-xl shadow-sm p-12 mb-12 text-center">
            <div className="relative inline-block">
              <Image
                src="/gapp-marketing-hero.jpg"
                alt="Genuine Apple Parts Marketing Materials"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <p className="text-sm text-gray-500 mt-6 italic">
              iPhone® and iPad® are trademarks of Apple Inc., registered in the U.S. and other countries and regions.
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <Button
                onClick={() => handleDownload('GAPP Marketing Kit')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="mr-2" size={18} />
                Download
              </Button>
              <Button
                onClick={handleDownloadAll}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <Download className="mr-2" size={18} />
                Download All
              </Button>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-gray-300 my-12"></div>

          {/* Support Box */}
          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <p className="text-gray-700 mb-2">Have questions?</p>
            <p className="text-gray-600">
              Contact our customer support team
            </p>
            <a
              href="tel:2025409946"
              className="inline-flex items-center gap-2 mt-3 text-xl font-bold text-blue-600 hover:text-blue-800"
            >
              <Phone size={20} />
              202-540-9946
            </a>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
          <div><h3>About</h3><p className="text-sm">About Us • Blog • Quality Policy</p></div>
          <div><h3>Services</h3><p className="text-sm">My Account • LCD Buyback</p></div>
          <div><h3>Our Brands</h3><p className="text-sm">Apple • Google • OnePlus</p></div>
          <div><h3>Support</h3><p className="text-sm">Location • Live Chat • FAQs</p></div>
        </div>
        <p className="text-center text-gray-400 mt-8">© 2025 Nexus Tech Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
