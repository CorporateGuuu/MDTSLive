'use client';

import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, FileText, Download } from 'lucide-react';
import NavBar from '../../../../components/NavBar';
import Footer from '../../../../components/Footer';
import Link from 'next/link';

const schema = z.object({
  type: z.enum(['resale', 'tax-exempt']),
  businessName: z.string().min(1, 'Business name required'),
  address: z.string().min(1, 'Address required'),
  city: z.string().min(1, 'City required'),
  state: z.string().min(1, 'State required'),
  zipCode: z.string().min(5, 'ZIP code required'),
  certificate: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

export default function TaxFormsPage() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Complete US states data (abbreviated for brevity - all 50 states included)
  const states = [
    { state: 'Alabama', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Alaska', exempt: 'Exempt', result: 'Exempt', reject: 'View', action: 'View' },
    { state: 'Arizona', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Arkansas', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'California', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Colorado', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Connecticut', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Delaware', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Florida', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Georgia', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Hawaii', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Idaho', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Illinois', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Indiana', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Iowa', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Kansas', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Kentucky', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Louisiana', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Maine', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Maryland', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Massachusetts', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Michigan', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Minnesota', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Mississippi', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Missouri', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Montana', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Nebraska', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Nevada', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'New Hampshire', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'New Jersey', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'New Mexico', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'New York', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'North Carolina', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'North Dakota', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Ohio', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Oklahoma', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Oregon', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Pennsylvania', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Rhode Island', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'South Carolina', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'South Dakota', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Tennessee', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Texas', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Utah', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Vermont', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Virginia', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Washington', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'West Virginia', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Wisconsin', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
    { state: 'Wyoming', exempt: 'Exempt', result: 'Result', reject: 'Reject', action: 'View' },
  ];

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual implementation
      await new Promise(r => setTimeout(r, 1500));
      toast.success('Certificate created and saved!');
      reset();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to create certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <NavBar />

      {/* Main Content */}
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar */}
            <div className="lg:w-80">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">My Account</h2>

                <nav className="space-y-1">
                  <Link href="/customer/account/dashboard" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Account Dashboard
                  </Link>
                  <Link href="/customer/account/edit" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Account Information
                  </Link>
                  <Link href="/customer/address" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Address Book
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Manage Employee & Locations
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md font-medium">
                    Notification
                  </Link>
                  <Link href="/customer/account/tax-forms" className="block px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md font-medium">
                    Tax Forms
                  </Link>
                </nav>

                <div className="border-t border-gray-200 my-6"></div>

                <h3 className="text-sm font-semibold text-gray-900 mb-3">Saved Shopping Cart</h3>

                <div className="border-t border-gray-200 my-6"></div>

                <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Info</h3>
                <nav className="space-y-1 ml-3">
                  <Link href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    My Orders
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Reserve Orders
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Request FedEx Refunds
                  </Link>
                </nav>

                <div className="border-t border-gray-200 my-6"></div>

                <h3 className="text-sm font-semibold text-gray-900 mb-3">Devices</h3>
                <nav className="space-y-1 ml-3">
                  <Link href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    My Devices
                  </Link>
                  <Link href="/account/devices/grading" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Device Grading Scale
                  </Link>
                  <Link href="/account/rma" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Device Returns RMA
                  </Link>
                </nav>

                <div className="border-t border-gray-200 my-6"></div>

                <h3 className="text-sm font-semibold text-gray-900 mb-3">Wallet</h3>
                <nav className="space-y-1 ml-3">
                  <Link href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Store Credit
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Saved Payment Information
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Balance Sheet
                  </Link>
                </nav>

                <div className="border-t border-gray-200 my-6"></div>

                <h3 className="text-sm font-semibold text-gray-900 mb-3">Services</h3>
                <nav className="space-y-1 ml-3">
                  <Link href="/lcbuyback" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    LCD BuyBack Program
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Product Returns RMA
                  </Link>
                </nav>

                <div className="border-t border-gray-200 my-6"></div>

                <h3 className="text-sm font-semibold text-gray-900 mb-3">Genuine Apple Parts</h3>
                <nav className="space-y-1 ml-3">
                  <Link href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Manage Enrollment
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Core Returns
                  </Link>
                  <Link href="#" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Marketing Materials
                  </Link>
                </nav>

                <div className="border-t border-gray-200 my-6"></div>

                <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Us</h3>
                <nav className="space-y-1 ml-3">
                  <Link href="/contact-us" className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    Support Ticket
                  </Link>
                </nav>

                <div className="mt-6">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Always Expand Submenu
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-6">TAX FORMS</h1>

                {/* Yellow Gradient Banner */}
                <div className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-lg p-6 mb-8 flex items-center gap-4 shadow-lg border border-yellow-200">
                  <div className="text-4xl animate-bounce">📞</div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">Call us for assistance</div>
                    <div className="text-2xl font-bold text-gray-900">$1,318 savings</div>
                  </div>
                </div>

                {/* Subtitle */}
                <h2 className="text-xl font-semibold text-gray-900 mb-6">TAX CERTIFICATE FORMS</h2>

                {/* Explanatory Text */}
                <div className="bg-white rounded-xl shadow p-6 mb-8 space-y-4">
                  <p>In order to comply with state and local sales tax requirements, Nexus Tech Hub must retain a copy of your resale certificate. If not retained, sales tax will be collected on the sale. If the buyer fails to provide a resale certificate or send it to Nexus Tech Hub, the buyer shall pay any sales tax due on the purchase. The buyer shall be responsible for obtaining a resale certificate from the state that provides the buyer with an exemption from the sales tax.</p>
                  <p>Resale Certificate - This form is for those who have a business or institution. Tax Exempt Certificate - This form is for those who have a government agency or institution.</p>
                  <p>Nexus Tech Hub collects tax in the states below. If not listed, we will not collect on your behalf.</p>
                </div>

                {/* States Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-4 text-left font-bold">State</th>
                          <th className="p-4 text-left font-bold">Exempt</th>
                          <th className="p-4 text-left font-bold">Result</th>
                          <th className="p-4 text-left font-bold text-red-600">Reject</th>
                          <th className="p-4 text-left font-bold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {states.map((row, i) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="p-4">{row.state}</td>
                            <td className="p-4">Exempt</td>
                            <td className="p-4">Result</td>
                            <td className="p-4 text-red-600">{row.reject}</td>
                            <td className="p-4">
                              <Button variant="outline" size="sm" className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100">
                                <Download className="mr-1" size={16} /> {row.action}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center md:hidden">
                    ← Swipe horizontally to view all columns →
                  </p>
                </div>

                {/* Create Certificate Button */}
                <div className="flex justify-center">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold">
                        <FileText className="mr-2" /> Create Certificate
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create Tax Certificate</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Certificate Type</label>
                          <Select
                            value={watch('type')}
                            onValueChange={(value) => setValue('type', value as 'resale' | 'tax-exempt')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select certificate type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="resale">Resale Certificate</SelectItem>
                              <SelectItem value="tax-exempt">Tax Exempt Certificate</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Business Name *</label>
                          <Input {...register('businessName')} placeholder="Enter business name" />
                          {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Address *</label>
                          <Input {...register('address')} placeholder="Business address" />
                          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">City *</label>
                            <Input {...register('city')} placeholder="City" />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">State *</label>
                            <Select
                              value={watch('state')}
                              onValueChange={(value) => setValue('state', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="State" />
                              </SelectTrigger>
                              <SelectContent>
                                {states.map((state) => (
                                  <SelectItem key={state.state} value={state.state}>
                                    {state.state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">ZIP Code *</label>
                          <Input {...register('zipCode')} placeholder="ZIP Code" />
                          {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Upload Certificate (PDF)</label>
                          <Input
                            type="file"
                            {...register('certificate')}
                            accept=".pdf"
                            className="mt-1"
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
                            {loading ? <Loader2 className="animate-spin mr-2" /> : null} Save Certificate
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
