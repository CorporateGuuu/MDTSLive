'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import {
  Search,
  User,
  ShoppingCart,
  Calendar,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Laptop
} from 'lucide-react';
import { toast } from 'sonner';

export default function ReserveOrdersPage() {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchBy, setSearchBy] = useState('Order #');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState('11/29/2025 - 12/29/2025');

  const orders = [
    { id: '1078717', type: 'Reserve', date: '11/27/25', shipTo: 'Fitzgerald Amaranpong', location: 'Midas Technical Solutions', method: 'Standard', total: '$182.86', status: 'Reserved' },
    { id: '1076804', type: 'Reserve', date: '11/26/25', shipTo: 'Fitzgerald Amaranpong', location: 'Midas Technical Solutions', method: 'Express', total: '$469.37', status: 'Reserved' },
    { id: '1076278', type: 'Reserve', date: '11/15/25', shipTo: 'Fitzgerald Amaranpong', location: 'Midas Technical Solutions', method: 'Standard', total: '$9.08', status: 'Reserved' },
    { id: '1075692', type: 'Reserve', date: '11/04/25', shipTo: 'Fitzgerald Amaranpong', location: 'Midas Technical Solutions', method: 'Standard', total: '$16.31', status: 'Reserved' },
    { id: '1070274', type: 'Reserve', date: '01/31/25', shipTo: 'Fitzgerald Amaranpong', location: 'Midas Technical Solutions', method: 'Express', total: '$231.57', status: 'Reserved' },
  ];

  const selectAllOrders = () => {
    setSelectedOrders(selectedOrders.length === orders.length ? [] : orders.map(o => o.id));
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleView = (order) => {
    toast.info(`Viewing reserve order ${order.id}`);
  };

  const handleCancel = () => {
    if (selectedOrders.length === 0) {
      toast.error('Select orders to cancel');
      return;
    }
    toast.warning(`Cancelled ${selectedOrders.length} orders`);
    setSelectedOrders([]);
  };

  const handleShip = () => {
    if (selectedOrders.length === 0) {
      toast.error('Select orders to ship');
      return;
    }
    toast.success(`Shipped ${selectedOrders.length} orders`);
    setSelectedOrders([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4" role="banner">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-blue-600">Midas Technical Solutions</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
              <Input
                placeholder="What are you looking for?"
                className="pl-10 w-80"
                aria-label="Search products"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex gap-4 text-sm" role="navigation" aria-label="Product categories">
              <span className="cursor-pointer hover:text-blue-600 transition-colors" role="link" tabIndex={0}>Apple</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors" role="link" tabIndex={0}>Samsung</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors" role="link" tabIndex={0}>Motorola</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors" role="link" tabIndex={0}>Google</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors" role="link" tabIndex={0}>Other Parts</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors" role="link" tabIndex={0}>Game Console</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors" role="link" tabIndex={0}>Accessories</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors" role="link" tabIndex={0}>Tools & Supplies</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors" role="link" tabIndex={0}>Refurbishing</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors" role="link" tabIndex={0}>Board Components</span>
              <span className="cursor-pointer hover:text-blue-600 transition-colors" role="link" tabIndex={0}>Pre-Owned Devices</span>
            </nav>
            <User className="w-6 h-6 text-gray-600 cursor-pointer" aria-label="User account" />
            <span className="text-sm text-gray-600" aria-label="Shipping service">FedEx</span>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-gray-600" aria-label="Shopping cart" />
              <span className="text-sm font-medium" aria-label="Cart total">$182.34</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm p-4" role="complementary" aria-label="Account navigation">
          <nav className="space-y-4" role="navigation" aria-label="Account sections">
            <div>
              <h3 className="font-bold text-blue-600 mb-2">My Account</h3>
              <ul className="space-y-1 text-sm" role="list">
                <li className="text-gray-600 pl-4" role="listitem">— Account Dashboard</li>
                <li className="text-gray-600 pl-4" role="listitem">— Account Information</li>
                <li className="text-gray-600 pl-4" role="listitem">— Address Book</li>
                <li className="text-gray-600 pl-4" role="listitem">— Manage Employee & Locations</li>
                <li className="text-gray-600 pl-4" role="listitem">— Notification</li>
                <li className="text-gray-600 pl-4" role="listitem">— Tax Forms</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Checkout</h3>
              <ul className="space-y-1 text-sm" role="list">
                <li className="text-gray-600 pl-4" role="listitem">— Saved Shopping Cart</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Order Info</h3>
              <ul className="space-y-1 text-sm" role="list">
                <li className="text-gray-600 pl-4" role="listitem">— My Orders</li>
                <li className="bg-blue-100 text-blue-600 pl-4 font-medium" role="listitem" aria-current="page">— Reserve Orders</li>
                <li className="text-gray-600 pl-4" role="listitem">— Request FedEx Refunds</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Devices</h3>
              <ul className="space-y-1 text-sm" role="list">
                <li className="text-gray-600 pl-4" role="listitem">— My Devices</li>
                <li className="text-gray-600 pl-4" role="listitem">— Device Grading Scale</li>
                <li className="text-gray-600 pl-4" role="listitem">— Device Returns RMA</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Wallet</h3>
              <ul className="space-y-1 text-sm" role="list">
                <li className="text-gray-600 pl-4" role="listitem">— Store Credit</li>
                <li className="text-gray-600 pl-4" role="listitem">— Saved Payment Info</li>
                <li className="text-gray-600 pl-4" role="listitem">— Balance Sheet</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Services</h3>
              <ul className="space-y-1 text-sm" role="list">
                <li className="text-gray-600 pl-4" role="listitem">— LCD BuyBack Program</li>
                <li className="text-gray-600 pl-4" role="listitem">— Product Returns RMA</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Genuine Apple Parts</h3>
              <ul className="space-y-1 text-sm" role="list">
                <li className="text-gray-600 pl-4" role="listitem">— Manage Enrollment</li>
                <li className="text-gray-600 pl-4" role="listitem">— Core Returns</li>
                <li className="text-gray-600 pl-4" role="listitem">— Marketing Materials</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-blue-600 mb-2">Contact Us</h3>
              <ul className="space-y-1 text-sm" role="list">
                <li className="text-gray-600 pl-4" role="listitem">— Support Ticket</li>
              </ul>
            </div>
          </nav>

          <Button className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white" aria-label="Toggle submenu expansion">
            Always Expand Submenu
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6" role="main">
          {/* Light Blue Banner */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-6 mb-6 flex items-center gap-4" role="banner">
            <div className="flex items-center gap-3" aria-hidden="true">
              <Laptop className="w-8 h-8 text-blue-600" />
              <Laptop className="w-8 h-8 text-blue-600" />
              <Laptop className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Reserve Orders</h1>
              <p className="text-gray-600">All your orders can be managed here</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6" role="search" aria-label="Order filters">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} aria-hidden="true" />
                <Input
                  placeholder="11/29/2025 - 12/29/2025"
                  className="pl-10 pr-10"
                  aria-label="Date range filter"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} aria-hidden="true" />
              </div>

              <Select>
                <SelectTrigger aria-label="Search by field">
                  <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order">Order #</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="shipTo">Ship To</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="shippingMethod">Shipping Method</SelectItem>
                  <SelectItem value="total">Total</SelectItem>
                </SelectContent>
              </Select>

              <Input placeholder="Company Name" aria-label="Company name filter" />

              <Select>
                <SelectTrigger aria-label="Order status filter">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Button variant="outline" aria-label="Open advanced filters">Manage Filters</Button>
              <div className="flex gap-2">
                <Button className="bg-red-500 hover:bg-red-600 text-white" aria-label="Cancel selected orders">
                  Cancel Order
                </Button>
                <Button className="bg-green-500 hover:bg-green-600 text-white" aria-label="Ship selected orders">
                  Ship Order
                </Button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto" role="region" aria-label="Orders table" aria-live="polite">
            <table className="w-full min-w-[800px]" role="table">
              <thead className="bg-blue-50">
                <tr role="row">
                  <th className="p-4 text-left border-b border-blue-100" role="columnheader">
                    <Checkbox
                      checked={selectedOrders.length === orders.length}
                      onCheckedChange={selectAllOrders}
                      aria-label="Select all orders"
                    />
                  </th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100" role="columnheader">Order #</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100" role="columnheader">Order Type</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100" role="columnheader">Date</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100" role="columnheader">Ship To</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100" role="columnheader">Location</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100" role="columnheader">Shipping Method</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100" role="columnheader">Total</th>
                  <th className="p-4 text-left font-semibold text-blue-700 border-b border-blue-100" role="columnheader">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(order => (
                  <tr key={order.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => handleView(order)}>
                    <td className="p-4"><Checkbox onCheckedChange={() => toggleOrderSelection(order.id)} /></td>
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4">{order.type}</td>
                    <td className="p-4">{order.date}</td>
                    <td className="p-4">{order.shipTo}</td>
                    <td className="p-4">{order.location}</td>
                    <td className="p-4">{order.method}</td>
                    <td className="p-4 font-bold text-green-600">{order.total}</td>
                    <td className="p-4"><Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); handleView(order); }}><Eye size={16} /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-4" role="navigation" aria-label="Orders pagination">
            <div className="text-sm text-gray-600">
              Showing 1 to {orders.length} of {orders.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                Previous
              </Button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded font-medium" aria-label={`Current page ${currentPage}`}>
                {currentPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                aria-label="Next page"
              >
                Next
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </nav>
        </main>
      </div>

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
