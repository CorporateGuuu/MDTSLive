'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { toast } from 'sonner';

export default function RMAManagementPage() {
  const [formData, setFormData] = useState({
    orderId: '',
    reason: '',
    description: '',
    photos: [] as File[],
  });

  const rmaList = [
    { id: 'RMA-2025-189', date: 'Nov 27, 2025', status: 'Received', items: 2 },
    { id: 'RMA-2025-174', date: 'Nov 20, 2025', status: 'Approved', items: 1 },
  ];

  const handleSubmit = () => {
    if (!formData.orderId || !formData.reason) {
      toast.error('Order ID and Reason are required!');
      return;
    }
    toast.success('RMA Request Submitted! Label emailed.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-5xl font-black mb-10">Return Merchandise Authorization (RMA)</h1>

        {/* Active RMAs */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <h2 className="text-3xl font-bold mb-6">Your Active RMAs</h2>
          <div className="space-y-4">
            {rmaList.map(rma => (
              <div key={rma.id} className="border rounded-lg p-6 flex justify-between items-center">
                <div>
                  <p className="font-bold text-xl">{rma.id}</p>
                  <p className="text-gray-600">Submitted {rma.date} • {rma.items} items</p>
                </div>
                <div className="text-right">
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">{rma.status}</span>
                  <Button className="ml-4">Print Label</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create New RMA */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8">Create New RMA Return</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block font-medium mb-2">Order Number <span className="text-red-500">*</span></label>
              <Input placeholder="ORD-2025-XXXX" value={formData.orderId} onChange={e => setFormData({...formData, orderId: e.target.value})} />
            </div>
            <div>
              <label className="block font-medium mb-2">Return Reason <span className="text-red-500">*</span></label>
              <Select onValueChange={v => setFormData({...formData, reason: v})}>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="defective">Defective / DOA</SelectItem>
                  <SelectItem value="wrong">Wrong Item Sent</SelectItem>
                  <SelectItem value="damaged">Damaged in Transit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-2">Description</label>
              <textarea className="w-full border rounded-lg p-4" rows={4} placeholder="Describe the issue..." />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-2">Upload Photos (Optional)</label>
              <input type="file" multiple accept="image/*" className="border rounded-lg p-4 w-full" />
            </div>
          </div>
          <div className="mt-8 text-right">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-12" onClick={handleSubmit}>
              Submit RMA Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
