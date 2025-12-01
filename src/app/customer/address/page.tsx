// app/customer/address/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Checkbox } from '../../../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Truck, Plus } from 'lucide-react';

const schema = z.object({
  company: z.string().min(1, 'Company name required'),
  contact: z.string().min(1, 'Contact name required'),
  phone: z.string().min(10, 'Valid phone required'),
  address1: z.string().min(1, 'Address required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City required'),
  state: z.string().min(2, 'State required'),
  zip: z.string().min(5, 'ZIP required'),
});

type FormData = z.infer<typeof schema>;

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState([
    { id: 1, company: 'Midas Technical Solutions', contact: 'John Doe', phone: '+12029146818', address1: '7020 POINT PLEASANT LN', address2: 'Unit 5', city: 'Bakersfield', state: 'CA', zip: '22020', defaultShipping: true, defaultBilling: true },
    { id: 2, company: 'Midas Technical Solutions', contact: 'Jane Smith', phone: '+12029146818', address1: '6167 Fuller Ct', address2: 'Unit A', city: 'Alexandria', state: 'VA', zip: '22310', defaultShipping: false, defaultBilling: false },
    { id: 3, company: 'Midas Technical Solutions', contact: 'Mike Ross', phone: '+12029146818', address1: '1527 BALLINGER DR', city: 'Lawrenceville', state: 'GA', zip: '30043', defaultShipping: false, defaultBilling: false },
    { id: 4, company: 'Midas Technical Solutions', contact: 'Sarah Lee', phone: '+12029146818', address1: '1749 Blue Spruce St', city: 'Dumfries', state: 'VA', zip: '22026', defaultShipping: false, defaultBilling: false },
  ]);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setAddresses(prev => [...prev, { id: Date.now(), ...data, defaultShipping: false, defaultBilling: false }]);
    toast.success('Address added successfully!');
    reset();
    setOpen(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header – reuse your existing one */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-blue-600">Nexus Tech Hub</h1>
          <input placeholder="What are you looking for?" className="border rounded-lg px-4 py-2 w-96" />
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span>FedEx 03:24:18</span>
          <span className="bg-amber-100 px-4 py-2 rounded-full font-bold">$1,823.94 | 12 items</span>
        </div>
      </header>

      <div className="flex">
        {/* Your existing sidebar component here – "Address Book" active */}

        <main className="flex-1 p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-blue-50 rounded-2xl p-8 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Truck className="w-16 h-16 text-blue-600" />
              <div>
                <h1 className="text-4xl font-black text-gray-800">Address Book</h1>
                <p className="text-gray-600 mt-2">Manage your shipping & billing addresses</p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-red-600 text-2xl">Warning</span>
              <p className="font-medium">Reduce shipping delays! Add delivery information to your saved address.</p>
              <span className="text-red-600 font-bold">(4 of 4 pending)</span>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg font-bold">
                  <Plus className="mr-2" /> Add Address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-medium">Company Name *</label>
                      <Input {...register('company')} placeholder="Midas Technical Solutions" />
                      {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>}
                    </div>
                    <div>
                      <label className="font-medium">Contact Name *</label>
                      <Input {...register('contact')} placeholder="John Doe" />
                      {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-medium">Phone *</label>
                      <Input {...register('phone')} placeholder="+12025550123" />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-medium">Address Line 1 *</label>
                      <Input {...register('address1')} />
                      {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-medium">Address Line 2</label>
                      <Input {...register('address2')} />
                    </div>
                    <div>
                      <label className="font-medium">City *</label>
                      <Input {...register('city')} />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="font-medium">State *</label>
                      <Input {...register('state')} placeholder="CA" />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className="font-medium">ZIP Code *</label>
                      <Input {...register('zip')} placeholder="90210" />
                      {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip.message}</p>}
                    </div>
                  </div>

                  <div className="flex gap-8 mt-6">
                    <label className="flex items-center gap-3">
                      <Checkbox defaultChecked />
                      <span>Set as Default Shipping Address</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <Checkbox />
                      <span>Set as Default Billing Address</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-4 mt-8">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                      {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                      Save Address
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Address Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">{addr.company}</h3>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button className="text-red-600 hover:underline text-sm">Delete</button>
                </div>
              </div>
              <p className="text-gray-700">{addr.contact}<br />
                {addr.address1}<br />
                {addr.address2 && <>{addr.address2}<br /></>}
                {addr.city}, {addr.state} {addr.zip}<br />
                {addr.phone}
              </p>
              <div className="flex gap-6 mt-6">
                <label className="flex items-center gap-2">
                  <Checkbox checked={addr.defaultShipping} className="data-[state=checked]:bg-green-600" />
                  <span className="text-sm">Default Shipping Address</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox checked={addr.defaultBilling} className="data-[state=checked]:bg-green-600" />
                  <span className="text-sm">Default Billing Address</span>
                </label>
              </div>
              <div className="mt-4 p-3 border-2 border-dashed border-red-300 rounded-lg text-center">
                <p className="text-red-600 font-medium text-sm">Reduce shipping delays here!</p>
                <Button size="sm" className="mt-2 bg-red-600 hover:bg-red-700"><Plus size={16} /> </Button>
              </div>
            </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
