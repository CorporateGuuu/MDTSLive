'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Download, Eye, Plus, FileText, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';

export default function ProductReturnsPage() {
  const [requests, setRequests] = useState([
    {
      rmaNumber: 'PR123456',
      requestedDate: '05/30/25',
      shipTo: 'Fitzgerald Amaranpong',
      location: 'Midas Technical Solutions',
      status: 'Completed',
      trackNumber: '1Z12345',
    },
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('PDF');

  const handleNewRMA = () => {
    const newRMA = {
      rmaNumber: `PR${Date.now().toString().slice(-6)}`,
      requestedDate: new Date().toLocaleDateString(),
      shipTo: 'Fitzgerald Amaranpong',
      location: 'Midas Technical Solutions',
      status: 'Pending',
      trackNumber: '-',
    };
    setRequests(prev => [newRMA, ...prev]);
    toast.success(`RMA ${newRMA.rmaNumber} submitted! We'll review within 48 hours.`);
    setOpenModal(false);
  };

  const handleExport = () => {
    toast.success(`Exported RMAs as ${exportFormat}`);
  };

  const handleView = (rma) => {
    toast.info(`Viewing RMA ${rma.rmaNumber}`);
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
        {/* Sidebar – Your existing one, with "Product Returns / RMA" highlighted */}
        <aside className="w-64 bg-white shadow p-4 space-y-2">
          <ul className="space-y-1">
            <li className="font-bold text-blue-600">My Account</li>
            {/* ... */}
            <li className="font-bold text-blue-600 bg-blue-100 p-1 rounded">Services</li>
            <li className="text-sm text-gray-600 pl-4">— LCD BuyBack Program</li>
            <li className="text-sm text-gray-600 pl-4 bg-blue-50 p-1 rounded">— Product Returns / RMA</li>
            {/* ... */}
          </ul>
          <Button className="w-full bg-red-500 text-white">Always Expand Submenu</Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold text-red-600">PRODUCT RETURNS</h1>
            <Dialog open={openModal} onOpenChange={setOpenModal}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg">
                  <Plus className="mr-2" size={20} /> Submit RMA
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Submit New RMA Request</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <p className="text-sm text-gray-600">Select an order to return or report a defective product. We'll provide a free label.</p>
                  <Button onClick={handleNewRMA} className="w-full bg-green-600">
                    Begin RMA
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Recent Requests Subtitle */}
          <h2 className="text-xl font-bold mb-4">Recent Requests</h2>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
              <Input placeholder="RMA Number" className="col-span-1" />
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Track #" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">PDF/Excel/CSV</span>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF"><FileText size={16} /></SelectItem>
                    <SelectItem value="Excel"><FileSpreadsheet size={16} /></SelectItem>
                    <SelectItem value="CSV"><Download size={16} /></SelectItem>
                  </SelectContent>
                </Select>
                <Button size="icon" variant="ghost" onClick={handleExport}><Download size={18} /></Button>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-medium">RMA Number</th>
                  <th className="p-4 text-left font-medium">Requested Date</th>
                  <th className="p-4 text-left font-medium">Ship To</th>
                  <th className="p-4 text-left font-medium">Location</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Track #</th>
                  <th className="p-4 text-left font-medium">PDF</th>
                  <th className="p-4 text-left font-medium">Excel</th>
                  <th className="p-4 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-gray-500">
                      No data found
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.rmaNumber} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium">{req.rmaNumber}</td>
                      <td className="p-4">{req.requestedDate}</td>
                      <td className="p-4">{req.shipTo}</td>
                      <td className="p-4">{req.location}</td>
                      <td className="p-4">
                        <Badge variant="secondary" className={req.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {req.status}
                        </Badge>
                      </td>
                      <td className="p-4">{req.trackNumber}</td>
                      <td className="p-4"><Button variant="ghost" size="sm"><FileText size={16} /></Button></td>
                      <td className="p-4"><Button variant="ghost" size="sm"><FileSpreadsheet size={16} /></Button></td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" onClick={() => handleView(req)}>
                          <Eye size={16} className="mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="p-4 border-t text-center text-sm text-gray-600">
              {requests.length} items
            </div>
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
