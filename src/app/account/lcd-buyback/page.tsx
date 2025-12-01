'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Search, Plus, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';

interface BuyBackRequest {
  id: string;
  requestedDate: string;
  shipTo: string;
  location: string;
  status: string;
  completedOn: string;
}

export default function LCDBuyBackPage() {
  const [requests, setRequests] = useState<BuyBackRequest[]>([]); // Empty initially
  const [openModal, setOpenModal] = useState(false);

  const handleNewRequest = () => {
    const newReq = {
      id: `BB${Date.now().toString().slice(-6)}`,
      requestedDate: new Date().toLocaleDateString(),
      shipTo: 'Fitzgerald Amarianpong',
      location: 'Midas Technical Solutions',
      status: 'Pending Review',
      completedOn: '-',
    };
    setRequests(prev => [newReq, ...prev]);
    toast.success(`BuyBack Request ${newReq.id} submitted! We'll review within 48 hours.`);
    setOpenModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-blue-600">Nexus Tech Hub</h1>
          <input
            placeholder="What are you looking for?"
            className="border rounded-lg px-4 py-2 w-64"
          />
          <select className="border rounded-lg px-3 py-2" aria-label="Product categories">
            <option>Apple/Samsung/Motorola</option>
            <option>Google/OnePlus</option>
            <option>Other Parts</option>
            <option>Game Console</option>
            <option>Accessories</option>
            <option>Tools & Supplies</option>
            <option>Refurbishing</option>
            <option>Board Components</option>
            <option>Pre-Owned Devices</option>
          </select>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>United States | USD</span>
          <span className="bg-yellow-100 px-2 py-1 rounded">$744.16 | 2</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar – Your existing one, with "LCD BuyBack Program" highlighted */}
        <aside className="w-64 bg-white shadow p-4 space-y-2">
          <ul className="space-y-1">
            <li className="font-bold text-blue-600">My Account</li>
            <li className="text-sm text-gray-600 pl-4">— Account Dashboard</li>
            <li className="text-sm text-gray-600 pl-4">— Account Information</li>
            <li className="text-sm text-gray-600 pl-4">— Address Book</li>
            <li className="text-sm text-gray-600 pl-4">— Manage Employee & Locations</li>
            <li className="text-sm text-gray-600 pl-4">— Notification</li>
            <li className="text-sm text-gray-600 pl-4">— Tax Forms</li>

            <li className="font-bold text-blue-600">Checkout</li>
            <li className="text-sm text-gray-600 pl-4">— Saved Shopping Cart</li>

            <li className="font-bold text-blue-600">Order Info.</li>
            <li className="text-sm text-gray-600 pl-4">— My Orders</li>
            <li className="text-sm text-gray-600 pl-4">— Reserve Orders</li>
            <li className="text-sm text-gray-600 pl-4">— Request FedEx Refunds</li>

            <li className="font-bold text-blue-600">Devices</li>
            <li className="text-sm text-gray-600 pl-4">— My Devices</li>
            <li className="text-sm text-gray-600 pl-4">— Device Grading Scale</li>
            <li className="text-sm text-gray-600 pl-4">— Device Returns RMA</li>

            <li className="font-bold text-blue-600">Wallet</li>
            <li className="text-sm text-gray-600 pl-4">— Store Credit</li>
            <li className="text-sm text-gray-600 pl-4">— Saved Payment Information</li>
            <li className="text-sm text-gray-600 pl-4">— Balance Sheet</li>

            <li className="font-bold text-blue-600 bg-blue-100 p-1 rounded">Services</li>
            <li className="text-sm text-gray-600 pl-4 bg-blue-50 p-1 rounded font-medium">— LCD BuyBack Program</li>
            <li className="text-sm text-gray-600 pl-4">— Product Returns / RMA</li>

            <li className="font-bold text-blue-600">Genuine Apple Parts</li>
            <li className="text-sm text-gray-600 pl-4">— Manage Enrollment</li>
            <li className="text-sm text-gray-600 pl-4">— Core Returns</li>
            <li className="text-sm text-gray-600 pl-4">— Marketing Materials</li>

            <li className="font-bold text-blue-600">Contact Us</li>
            <li className="text-sm text-gray-600 pl-4">— Support Ticket</li>
          </ul>
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
            Always Expand Submenu
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-red-600 mb-2">LCD BUYBACK PROGRAM</h1>
              <p className="text-lg text-gray-700">Hello, Fitzgerald Amarianpong!</p>
              <p className="text-gray-600 mt-2">
                Here you can view all of your buyback requests and check their status, completed dates, download reports and submit new requests.
              </p>
            </div>
            <Dialog open={openModal} onOpenChange={setOpenModal}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg">
                  <Plus className="mr-2" size={20} /> Start New BuyBack Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Start New LCD BuyBack Request</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <p className="text-sm text-gray-600">We'll guide you through selecting your broken screens and generating a free shipping label.</p>
                  <Button onClick={handleNewRequest} className="w-full bg-green-600">
                    Begin Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
              <Input placeholder="Request ID" className="col-span-1" />
              <div className="flex gap-2">
                <Input placeholder="From" className="w-full" />
                <Input placeholder="To" className="w-full" />
              </div>
              <Input placeholder="Ship To" />
              <Input placeholder="Location" />
              <Select defaultValue="all">
                <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">mm/dd/yyyy</span>
                <Button size="icon" variant="ghost"><Search size={18} /></Button>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="p-4 text-left">Request ID</th>
                  <th className="p-4 text-left">Requested Date</th>
                  <th className="p-4 text-left">Ship To</th>
                  <th className="p-4 text-left">Location</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Completed On</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-500">
                      No data found in last 184 days(s)
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium">{req.id}</td>
                      <td className="p-4">{req.requestedDate}</td>
                      <td className="p-4">{req.shipTo}</td>
                      <td className="p-4">{req.location}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4">{req.completedOn}</td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm">
                          <Eye size={16} className="mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
