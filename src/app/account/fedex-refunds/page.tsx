'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Dialog, DialogContent } from '../../../components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Eye, Truck, Search, User, ShoppingCart } from 'lucide-react';

const schema = z.object({
  orderId: z.string().min(1, 'Order # required'),
  tracking: z.string().min(1, 'Tracking # required'),
  method: z.string().min(1, 'Shipping method required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface RequestItem {
  id: number;
  orderId: string;
  tracking: string;
  method: string;
  description?: string;
  date: string;
  shipTo: string;
  charges: string;
  status: string;
}

interface ClaimItem {
  id: number;
  claimDate: string;
  trackingNumber: string;
  claimStatus: string;
  refundAmount: string;
}

export default function FedExRefundsPage() {
  const [open, setOpen] = useState(true); // Modal open by default
  const [formOpen, setFormOpen] = useState(false);
  const [requests, setRequests] = useState<RequestItem[]>([]); // Empty initially
  const [claims] = useState<ClaimItem[]>([]); // Empty initially
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API
    setRequests(prev => [...prev, {
      ...data,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      shipTo: 'Fitzgerald Amaranpong',
      charges: '$25.00',
      status: 'Pending'
    }]);
    toast.success('Refund request submitted! We\'ll review within 48 hours.');
    reset();
    setFormOpen(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-blue-600">Midas Technical Solutions</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="What are you looking for?"
              className="pl-10 w-80 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <nav className="flex gap-4 text-sm">
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Apple</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Samsung</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Motorola</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Google</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Other Parts</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Game Console</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Accessories</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Tools & Supplies</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Refurbishing</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Board Components</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Pre-Owned Devices</span>
          </nav>
          <User className="w-6 h-6 text-gray-600 cursor-pointer" />
          <span className="text-sm text-gray-600">FedEx</span>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            <span className="text-sm font-medium">$182.34</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm p-4 space-y-4">
          <nav className="space-y-4">
            <div>
              <h3 className="font-bold text-blue-600 mb-2">My Account</h3>
              <ul className="space-y-1 text-sm">
                <li className="text-gray-600 pl-4">— Account Dashboard</li>
                <li className="text-gray-600 pl-4">— Account Information</li>
                <li className="text-gray-600 pl-4">— Address Book</li>
                <li className="text-gray-600 pl-4">— Manage Employee & Locations</li>
                <li className="text-gray-600 pl-4">— Notification</li>
                <li className="text-gray-600 pl-4">— Tax Forms</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Checkout</h3>
              <ul className="space-y-1 text-sm">
                <li className="text-gray-600 pl-4">— Saved Shopping Cart</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Order Info</h3>
              <ul className="space-y-1 text-sm">
                <li className="text-gray-600 pl-4">— My Orders</li>
                <li className="text-gray-600 pl-4">— Reserve Orders</li>
                <li className="bg-blue-100 text-blue-600 pl-4 font-medium">— Request FedEx Refunds</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Devices</h3>
              <ul className="space-y-1 text-sm">
                <li className="text-gray-600 pl-4">— My Devices</li>
                <li className="text-gray-600 pl-4">— Device Grading Scale</li>
                <li className="text-gray-600 pl-4">— Device Returns RMA</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Wallet</h3>
              <ul className="space-y-1 text-sm">
                <li className="text-gray-600 pl-4">— Store Credit</li>
                <li className="text-gray-600 pl-4">— Saved Payment Info</li>
                <li className="text-gray-600 pl-4">— Balance Sheet</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Services</h3>
              <ul className="space-y-1 text-sm">
                <li className="text-gray-600 pl-4">— LCD BuyBack Program</li>
                <li className="text-gray-600 pl-4">— Product Returns RMA</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Genuine Apple Parts</h3>
              <ul className="space-y-1 text-sm">
                <li className="text-gray-600 pl-4">— Manage Enrollment</li>
                <li className="text-gray-600 pl-4">— Core Returns</li>
                <li className="text-gray-600 pl-4">— Marketing Materials</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Contact Us</h3>
              <ul className="space-y-1 text-sm">
                <li className="text-gray-600 pl-4">— Support Ticket</li>
              </ul>
            </div>
          </nav>

          <Button className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white">
            Always Expand Submenu
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Banner */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-6 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-blue-600" />
                <Truck className="w-8 h-8 text-blue-600" />
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">SHIPMENT REFUND REQUEST</h1>
                <p className="text-gray-600">Request refunds for delayed FedEx shipments</p>
              </div>
            </div>
            <Button
              onClick={() => setFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              Request Refund
            </Button>
          </div>

          {/* Request History Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto mb-6">
            <div className="p-6 border-b bg-gray-50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Truck size={20} /> REQUEST HISTORY
              </h2>
            </div>
            <table className="w-full min-w-[800px]">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100">Order #</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100">Date</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100">Ship To</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100">Tracking Number</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100">Shipping Charges</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100">Shipping Method</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">No data found</td>
                  </tr>
                ) : (
                  requests.map(req => (
                    <tr key={req.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium">{req.orderId}</td>
                      <td className="p-4">{req.date}</td>
                      <td className="p-4">{req.shipTo}</td>
                      <td className="p-4">{req.tracking}</td>
                      <td className="p-4 font-bold text-green-600">{req.charges}</td>
                      <td className="p-4">{req.method}</td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm">
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Claim History Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto mb-6">
            <div className="p-6 border-b bg-gray-50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Truck size={20} /> CLAIM HISTORY
              </h2>
            </div>
            <table className="w-full min-w-[600px]">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100">Claim Date</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100">Tracking Number</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100">Claim Status</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100">Refund Amount</th>
                </tr>
              </thead>
              <tbody>
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No data found</td>
                  </tr>
                ) : (
                  claims.map(claim => (
                    <tr key={claim.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">{claim.claimDate}</td>
                      <td className="p-4">{claim.trackingNumber}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          claim.claimStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                          claim.claimStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {claim.claimStatus}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-green-600">{claim.refundAmount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Black Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md bg-black text-white border-0">
          <div className="text-center mb-4">
            <h2 className="text-white text-lg font-bold">
              FEDEX MONEY-BACK GUARANTEE CLAIMS
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              Claims can be filed for shipments that were not delayed due to weather, business being FedEx closed, national holidays if they were not a known dangerous goods shipment.
            </p>

            <div className="flex justify-center">
              <div className="text-white font-bold text-xl">FedEx</div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-300">Services include up to 14 days of delivery.</p>
              <ul className="text-sm text-gray-300 mt-2">
                <li>• Priority Overnight</li>
              </ul>
            </div>

            <p className="text-xs text-gray-400 text-center italic">
              As soon as the claim is approved, the fee will be credited to your internal credit. Thank you for your business.
            </p>

            <div className="flex justify-center pt-4">
              <Button
                onClick={() => setOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-2"
                style={{ backgroundColor: '#ef4444' }}
              >
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Refund Form Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-md">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Request FedEx Refund</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number *
                </label>
                <Input
                  id="orderId"
                  {...register('orderId')}
                  placeholder="Enter order number"
                  className={errors.orderId ? 'border-red-500' : ''}
                />
                {errors.orderId && (
                  <p className="text-red-500 text-xs mt-1">{errors.orderId.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking Number *
                </label>
                <Input
                  id="tracking"
                  {...register('tracking')}
                  placeholder="Enter tracking number"
                  className={errors.tracking ? 'border-red-500' : ''}
                />
                {errors.tracking && (
                  <p className="text-red-500 text-xs mt-1">{errors.tracking.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Method *
                </label>
                <Select onValueChange={(value) => setValue('method', value)}>
                  <SelectTrigger className={errors.method ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select shipping method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Express">Express</SelectItem>
                    <SelectItem value="Priority Overnight">Priority Overnight</SelectItem>
                    <SelectItem value="Ground">Ground</SelectItem>
                  </SelectContent>
                </Select>
                {errors.method && (
                  <p className="text-red-500 text-xs mt-1">{errors.method.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe the issue with your shipment..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormOpen(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
          <div>
            <h3 className="font-bold mb-2">About</h3>
            <p className="text-sm text-gray-300">About Us • Blog • Quality Policy</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Services</h3>
            <p className="text-sm text-gray-300">My Account • LCD Buyback</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Our Brands</h3>
            <p className="text-sm text-gray-300">Apple • Google • OnePlus</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Support</h3>
            <p className="text-sm text-gray-300">Location • Live Chat • FAQs</p>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-8 text-sm text-gray-400">
          VISA • PayPal • AMEX • Discover
        </div>
        <p className="text-center text-gray-500 mt-4">© 2025 Midas Technical Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}
