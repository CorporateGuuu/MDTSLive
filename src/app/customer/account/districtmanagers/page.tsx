'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/dialog';
import { Loader2, ChevronDown, ChevronRight, Menu, X, User, Mail, Phone, MapPin, Settings, DollarSign, Package, Smartphone, Apple } from 'lucide-react';
import { toast } from 'sonner';

const schema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  role: z.string().min(1, 'Role required'),
  location: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ManageDistrictManagersPage() {
  const [managers, setManagers] = useState<(FormData & { id: number })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    myAccount: true, orderInfo: false, devices: false, wallet: false, services: false, genuineApple: false, contact: false,
  });
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const toggleSection = (section: string) => setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
    setManagers(prev => [...prev, { ...data, id: Date.now() }]);
    toast.success('Manager added successfully!');
    reset();
    setIsLoading(false);
  };

  const sidebarItems = [
    { title: 'My Account', icon: User, key: 'myAccount', sub: ['Account Dashboard', 'Account Information', 'Address Book', 'Manage Employee & Locations'] },
    { title: 'Saved Shopping Cart', icon: Package },
    { title: 'Order Info.', icon: Package, key: 'orderInfo', sub: ['My Orders', 'Reserve Orders', 'Request FedEx Refunds'] },
    { title: 'Devices', icon: Smartphone, key: 'devices', sub: ['My Devices', 'Device Grading Scale', 'Device Returns / RMA'] },
    { title: 'Wallet', icon: DollarSign, key: 'wallet', sub: ['Store Credit', 'Saved Payment Information', 'Balance Sheet'] },
    { title: 'Services', icon: Settings, key: 'services', sub: ['LCD BuyBack Program', 'Product Returns / RMA'] },
    { title: 'Genuine Apple Parts', icon: Apple, key: 'genuineApple', sub: ['Manage Enrollment', 'Core Returns', 'Marketing Materials'] },
    { title: 'Contact Us', icon: Mail, key: 'contact', sub: ['Support Ticket'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-bold text-blue-600">Midas Technical Solutions</h1>
          <input placeholder="What are you looking for?" className="flex-1 border rounded px-4 py-2" />
        </div>
        <div className="flex items-center gap-4">
          <span>🇺🇸</span> <span>MS Services</span> <span>My Account</span> <span>FedEx</span> <span className="bg-yellow-100 px-2 py-1 rounded">$182.34</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow p-4 space-y-4">
          {sidebarItems.map(item => (
            <div key={item.title}>
              <button onClick={() => item.key && toggleSection(item.key)} className="w-full flex items-center justify-between py-2">
                <span className="flex items-center gap-2">
                  <item.icon size={16} /> {item.title}
                </span>
                {item.key && (openSections[item.key as keyof typeof openSections] ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </button>
              {item.key && openSections[item.key as keyof typeof openSections] && item.sub && (
                <ul className="ml-6 space-y-1 text-sm text-gray-600">
                  {item.sub.map(sub => <li key={sub}>— {sub}</li>)}
                </ul>
              )}
            </div>
          ))}
          <Button className="w-full bg-red-500 text-white">Always Expand Submenu</Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">MANAGE DISTRICT MANAGERS</h1>
          {managers.length === 0 ? (
            <div className="bg-gray-100 p-8 rounded text-center text-gray-500">
              <p className="text-lg mb-4">You have no managers.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 text-white px-8 py-3">Add Manager</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Manager</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input {...register('firstName')} placeholder="First Name" />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                    <Input {...register('lastName')} placeholder="Last Name" />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                    <Input {...register('email')} type="email" placeholder="Email" />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    <Input {...register('phone')} placeholder="Phone" />
                    <Select onValueChange={(v: string) => setValue('role', v)}>
                      <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                      <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="manager">Manager</SelectItem></SelectContent>
                    </Select>
                    {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Add Manager'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="bg-white p-6 rounded shadow">
              <table className="w-full">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                <tbody>{managers.map(m => <tr key={m.id}><td>{m.firstName} {m.lastName}</td><td>{m.email}</td><td>{m.role}</td><td><Button variant="outline">Edit</Button> <Button variant="destructive">Delete</Button></td></tr>)}</tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-8 mt-12">
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div><h3>About</h3><p className="text-sm">About Us • Blog • Quality Policy</p></div>
          <div><h3>Services</h3><p className="text-sm">My Account • LCD Buyback • Pre-Owned Devices</p></div>
          <div><h3>Our Brands</h3><p className="text-sm">Apple • Google • OnePlus</p></div>
          <div><h3>Support</h3><p className="text-sm">Location • Live Chat • Phone App</p></div>
        </div>
        <div className="flex justify-center gap-4 mt-8 text-sm">VISA • PayPal • AMEX • Discover</div>
        <p className="text-center text-gray-400 mt-4">© 2025 Midas Technical Solutions</p>
      </footer>
    </div>
  );
}
