'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Head from 'next/head';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Loader2, ChevronDown, ChevronRight, Menu as MenuIcon, X, Search, User, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../../lib/supabase';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  additionalInfo: z.string().optional(),
  manageLocations: z.string().optional(),
  storeLocation: z.string().optional(),
  language: z.string().default('en'),
  currency: z.string().default('usd'),
});

interface NotificationGroup {
  label: string;
  email: boolean;
  sms: boolean;
}

export default function EditAccountPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    myAccount: true,
    orderInfo: false,
    devices: false,
    wallet: false,
    services: false,
    genuineApple: false,
    contactUs: false
  });

  const [notifications, setNotifications] = useState<Record<string, NotificationGroup>>({
    outOfStock: { label: 'Out of stock Subscribers (Product)', email: true, sms: false },
    orderSubmit: { label: 'Sales Order Submit', email: true, sms: false },
    orderCancel: { label: 'Sales Order Cancel', email: true, sms: false },
    orderApproval: { label: 'Sales Order Approval', email: true, sms: false },
    orderShipment: { label: 'Sales Order Shipment', email: true, sms: true },
    rmaCreate: { label: 'Product Returns / RMA Create', email: true, sms: false },
    rmaComplete: { label: 'Product Returns / RMA Complete', email: true, sms: false },
    deviceRmaCreate: { label: 'Devices Returns / RMA Create', email: true, sms: false },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      additionalInfo: '',
      manageLocations: '',
      storeLocation: '',
      language: 'en',
      currency: 'usd',
    }
  });

  const toggleNotif = (key: string, type: 'email' | 'sms') => {
    setNotifications(prev => ({
      ...prev,
      [key]: { ...prev[key], [type]: !prev[key][type] }
    }));
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = async (data: any) => {
    setIsLoading(true);

    try {
      // Update user profile data
      const { error: updateError } = await supabase.auth.updateUser({
        email: data.email,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          additional_info: data.additionalInfo,
          manage_locations: data.manageLocations,
          store_location: data.storeLocation,
          language: data.language,
          currency: data.currency,
          notifications: notifications,
        }
      });

      if (updateError) {
        console.error('Error updating user:', updateError);
        toast.error('Failed to update account information');
        return;
      }

      // Update user profile in database
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }

      toast.success('Account & notifications saved successfully!');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    toast.info('Changes cancelled');
  };

  return (
    <>
      <Head>
        <title>Edit Account Information - Nexus Tech Hub</title>
        <meta name="description" content="Update your account information, manage notifications, and customize your regional settings at Nexus Tech Hub." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <div className="min-h-screen bg-gray-50 font-['Inter']">
        {/* Header */}
        <header className="bg-white shadow-[0_2px_4px_rgba(0,0,0,0.06)] px-6 py-5 flex justify-between items-center sticky top-0 z-50 border-b border-gray-100" role="banner">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen ? "true" : "false"}
            >
              {mobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </button>
            <h1 className="text-3xl font-bold text-blue-600">Nexus Tech Hub</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
              <Input
                type="text"
                placeholder="What are you looking for?"
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md"
                aria-label="Search products"
              />
            </div>
            <div className="hidden md:flex items-center gap-6">
              <span className="text-sm font-medium">Apple</span>
              <span className="text-sm font-medium">Samsung</span>
              <span className="text-sm font-medium">Google</span>
              <span className="text-sm font-medium">OnePlus</span>
              <User className="text-gray-600" size={24} aria-label="User account" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium">FedEx</span>
            <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full font-bold" aria-label="Shopping cart with $182.34">
              <ShoppingCart size={16} aria-hidden="true" />
              $182.34
            </div>
          </div>
        </header>

      <div className="flex">
        {/* Sidebar – same as before with expandable menus */}
        <aside className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-white shadow-xl overflow-y-auto transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} pt-20 md:pt-6`}>
          <div className="px-6">
            <div className="mb-3">
              <button onClick={() => toggleSection('myAccount')} className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 font-medium text-gray-800">
                <span className="flex items-center gap-3">
                  <span>User</span>
                  <span>My Account</span>
                </span>
                {openSections.myAccount ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {openSections.myAccount && (
                <ul className="ml-12 mt-1 space-y-1">
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Account Dashboard</li>
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600 font-medium">— Account Information</li>
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Address Book</li>
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Manage Employee & Locations</li>
                </ul>
              )}
            </div>

            <div className="mb-3">
              <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 font-medium text-gray-800">
                <span className="flex items-center gap-3">
                  <span>ShoppingCart</span>
                  <span>Saved Shopping Cart</span>
                </span>
              </button>
            </div>

            <div className="mb-3">
              <button onClick={() => toggleSection('orderInfo')} className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 font-medium text-gray-800">
                <span className="flex items-center gap-3">
                  <span>Package</span>
                  <span>Order Info.</span>
                </span>
                {openSections.orderInfo ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {openSections.orderInfo && (
                <ul className="ml-12 mt-1 space-y-1">
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— My Orders</li>
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Reserve Orders</li>
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Request FedEx Refunds</li>
                </ul>
              )}
            </div>

            <div className="mb-3">
              <button onClick={() => toggleSection('devices')} className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 font-medium text-gray-800">
                <span className="flex items-center gap-3">
                  <span>Smartphone</span>
                  <span>Devices</span>
                </span>
                {openSections.devices ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {openSections.devices && (
                <ul className="ml-12 mt-1 space-y-1">
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— My Devices</li>
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Device Grading Scale</li>
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Device Returns / RMA</li>
                </ul>
              )}
            </div>

            <div className="mb-3">
              <button onClick={() => toggleSection('wallet')} className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 font-medium text-gray-800">
                <span className="flex items-center gap-3">
                  <span>Wallet</span>
                  <span>Wallet</span>
                </span>
                {openSections.wallet ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {openSections.wallet && (
                <ul className="ml-12 mt-1 space-y-1">
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Store Credit</li>
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Saved Payment Information</li>
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Balance Sheet</li>
                </ul>
              )}
            </div>

            <div className="mb-3">
              <button onClick={() => toggleSection('services')} className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 font-medium text-gray-800">
                <span className="flex items-center gap-3">
                  <span>Settings</span>
                  <span>Services</span>
                </span>
                {openSections.services ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {openSections.services && (
                <ul className="ml-12 mt-1 space-y-1">
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— LCD BuyBack Program</li>
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Product Returns / RMA</li>
                </ul>
              )}
            </div>

            <div className="mb-3">
              <button onClick={() => toggleSection('genuineApple')} className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 font-medium text-gray-800">
                <span className="flex items-center gap-3">
                  <span>Apple</span>
                  <span>Genuine Apple Parts</span>
                </span>
                {openSections.genuineApple ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {openSections.genuineApple && (
                <ul className="ml-12 mt-1 space-y-1">
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Manage Enrollment</li>
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Core Returns</li>
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Marketing Materials</li>
                </ul>
              )}
            </div>

            <div className="mb-3">
              <button onClick={() => toggleSection('contactUs')} className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 font-medium text-gray-800">
                <span className="flex items-center gap-3">
                  <span>Phone</span>
                  <span>Contact Us</span>
                </span>
                {openSections.contactUs ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {openSections.contactUs && (
                <ul className="ml-12 mt-1 space-y-1">
                  <li className="text-gray-600 py-1 text-sm hover:text-blue-600">— Support Ticket</li>
                </ul>
              )}
            </div>

            <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold mt-6 hover:bg-red-700 transition">
              Always Expand Submenu
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-5xl mx-auto">
          <h1 className="text-4xl font-black mb-10">EDIT ACCOUNT INFORMATION</h1>

          <form onSubmit={handleSubmit(handleSave)} className="space-y-10">

            {/* Account Info Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Account Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-2">First Name <span style={{ color: '#fb923c' }}>*</span></label>
                  <Input
                    {...register('firstName')}
                    className={`h-12 ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">First name is required</p>}
                </div>
                <div>
                  <label className="block font-medium mb-2">Last Name <span style={{ color: '#fb923c' }}>*</span></label>
                  <Input
                    {...register('lastName')}
                    className={`h-12 ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">Last name is required</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block font-medium mb-2">Email Address <span style={{ color: '#fb923c' }}>*</span></label>
                  <Input
                    type="email"
                    {...register('email')}
                    className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block font-medium mb-2">Additional Information</label>
                  <Textarea {...register('additionalInfo')} rows={4} placeholder="Notes about your business..." />
                </div>
                <div>
                  <label className="block font-medium mb-2">Manage Your Locations</label>
                  <Select defaultValue="">
                    <SelectTrigger>
                      <SelectValue placeholder="-- Manage Your Locations --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="location1">Location 1</SelectItem>
                      <SelectItem value="location2">Location 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block font-medium mb-2">Store Location</label>
                  <Input className="h-12" placeholder="Enter store location" />
                </div>
              </div>
            </div>

            {/* Notification Preferences – FULLY WORKING */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Manage Your Notifications</h2>
              <p className="text-gray-600 mb-6">Turn on notification you wish to receive</p>
              <div className="space-y-5">
                {Object.entries(notifications).map(([key, { label, email, sms }]) => (
                  <div key={key} className="py-4 border-b last:border-0">
                    <span className="font-medium text-gray-800 block mb-3">{label}</span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={email} onCheckedChange={() => toggleNotif(key, 'email')} />
                        <span className="text-sm">Email</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={sms} onCheckedChange={() => toggleNotif(key, 'sms')} />
                        <span className="text-sm">Text Message</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Settings */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Regional Settings</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-2">Language</label>
                  <Select defaultValue="en">
                    <SelectTrigger><SelectValue placeholder="English (English)" /></SelectTrigger>
                    <SelectContent><SelectItem value="en">English (English)</SelectItem></SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block font-medium mb-2">Currency</label>
                  <Select defaultValue="usd">
                    <SelectTrigger><SelectValue placeholder="US Dollar" /></SelectTrigger>
                    <SelectContent><SelectItem value="usd">US Dollar</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Opt-in Checkbox */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <Checkbox id="opt-in" className="mt-1" />
                <div>
                  <label htmlFor="opt-in" className="font-medium cursor-pointer">
                    Opt in to receive Mobile Text Notifications from Nexus Tech Hub
                  </label>
                  <p className="text-sm text-gray-600 mt-2">
                    By opting in, you agree to receive text messages from Nexus Tech Hub. Message frequency varies.
                    Message and data rates may apply. Reply STOP to opt out or HELP for help.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons – CANCEL BUTTON FIXED */}
            <div className="flex justify-end gap-6 py-8">
              <Button
                type="button"
                variant="outline"
                size="lg"
                style={{ borderColor: '#ef4444', color: '#ef4444' }}
                className="px-12 hover:bg-red-50"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                className="px-12 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16" role="contentinfo">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Nexus Tech Hub</h3>
              <p className="text-gray-300 text-sm">
                Your trusted partner for premium mobile device repairs, parts, and refurbishing solutions.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Device Repair</a></li>
                <li><a href="#" className="hover:text-white">Parts Replacement</a></li>
                <li><a href="#" className="hover:text-white">Refurbishing</a></li>
                <li><a href="#" className="hover:text-white">LCD BuyBack</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Support Ticket</a></li>
                <li><a href="#" className="hover:text-white">RMA Process</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Quality Standards</a></li>
                <li><a href="#" className="hover:text-white">Career Opportunities</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Nexus Tech Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
