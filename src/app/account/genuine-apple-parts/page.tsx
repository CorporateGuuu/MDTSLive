'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function GenuineApplePartsPage() {
  const [enrollmentType, setEnrollmentType] = useState('With Core Return');

  const handleDownloadAll = () => {
    toast.success('Downloaded all marketing materials ZIP');
  };

  const handleChangeType = () => {
    // Simulate type change
    setEnrollmentType(enrollmentType === 'With Core Return' ? 'Without Core Return' : 'With Core Return');
    toast.success(`Enrollment type changed to ${enrollmentType === 'With Core Return' ? 'Without' : 'With'} Core Return`);
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
          <span>🇺🇸 | USD</span>
          <span>FedEx 03:24:18</span>
          <span className="bg-yellow-100 px-2 py-1 rounded">$182.34 | 4</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar – Your existing one, with "Manage Enrollment" highlighted */}
        <aside className="w-64 bg-white shadow p-4 space-y-2">
          <ul className="space-y-1">
            <li className="font-bold text-blue-600">My Account</li>
            {/* ... */}
            <li className="font-bold text-blue-600 bg-blue-100 p-1 rounded">Genuine Apple Parts</li>
            <li className="text-sm text-gray-600 pl-4 bg-blue-50 p-1 rounded">— Manage Enrollment</li>
            <li className="text-sm text-gray-600 pl-4">— Core Returns</li>
            <li className="text-sm text-gray-600 pl-4">— Marketing Materials</li>
            {/* ... */}
          </ul>
          <Button className="w-full bg-red-500 text-white">Always Expand Submenu</Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold text-red-600">GENUINE APPLE PARTS</h1>
            <Button onClick={handleChangeType} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2">
              Change Type
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Repair Parts with Genuine Apple Parts</h2>
            <p className="text-gray-600 mb-4">
              {enrollmentType} <span className="text-red-600 font-bold">✓</span>
            </p>
            <p className="text-gray-600">
              Hello, Fitzgerald Amaranpong! You have access to the Core Return Program system with Core Returns. Once you completed the agreement, you'll gain these Core Return Program. This purchase tracks your returns broken parts within 60 days of your purchase to avoid fees.
            </p>
          </div>

          {/* Agreements Section */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              Genuine Apple Parts Program Agreement
            </h2>
            <p className="text-gray-600 mb-4">
              Genuine Apple Parts Program Agreement (GAPP) outlines the requirements and benefits of accessing Apple-certified components for repairs. Review the guidelines to understand the terms.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <Badge className="bg-red-100 text-red-800">Agreement Signed</Badge>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Genuine Apple Parts Program Agreement</DialogTitle>
                  </DialogHeader>
                  <p>Full agreement text/PDF embed here...</p>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Credit Card Authorization */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              Credit Card Authorization
            </h2>
            <p className="text-gray-600 mb-4">
              Agreement signed at least 30 days before expiration. This maintains your consent for a valid credit card on file with the 60-day program. Expiration.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <Badge className="bg-red-100 text-red-800">Agreement Signed</Badge>
              <div className="text-sm">
                Credit Card Number <span className="font-mono">**** **** **** 7478</span> Expires on <span className="font-bold">04/2026</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Credit Card Authorization</DialogTitle>
                  </DialogHeader>
                  <p>Authorization details...</p>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Battery Agreement */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              Lithium-Ion Battery Handling & Disposal Agreement
            </h2>
            <p className="text-gray-600 mb-4">
              Gain access to Genuine Apple batteries by using proper handling and disposal terms. This ensures compliance with safety and environmental standards for recycling/disposal facilities for lithium-ion batteries, click.
            </p>
            <div className="flex items-center gap-4">
              <Badge className="bg-red-100 text-red-800">Agreement Signed</Badge>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Lithium-Ion Battery Handling Agreement</DialogTitle>
                  </DialogHeader>
                  <p>Battery handling terms...</p>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Marketing Materials */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Marketing Materials for Download</h2>
            <p className="text-gray-600 mb-4">
              iPhone & iPad program trademarks of Apple, registered in the U.S. and other countries.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="border rounded-lg p-4 text-center">
                <img src="/placeholder-marketing1.jpg" alt="Marketing Material 1" className="w-full h-32 bg-gray-200 rounded mb-2" />
                <p className="text-sm">Banner 1</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <img src="/placeholder-marketing2.jpg" alt="Marketing Material 2" className="w-full h-32 bg-gray-200 rounded mb-2" />
                <p className="text-sm">POP Display</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <img src="/placeholder-marketing3.jpg" alt="Marketing Material 3" className="w-full h-32 bg-gray-200 rounded mb-2" />
                <p className="text-sm">Counter Mat</p>
              </div>
            </div>
            <Button onClick={handleDownloadAll} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="mr-2" size={16} /> Download All
            </Button>
          </div>

          {/* Support Text */}
          <div className="bg-white rounded-xl shadow p-6 mt-6">
            <p className="text-gray-600">
              You can adjust these settings by contacting MobileSentrix support. Our team is available to assist you with any changes or questions regarding your account settings and services.
            </p>
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
