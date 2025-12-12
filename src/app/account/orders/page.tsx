'use client';
import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import NavBar from '../../../components/NavBar';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../../contexts/AuthContext';
import Papa from 'papaparse';
import jsPDF from 'jspdf';

export default function OrdersPage() {
  const { user } = useAuth();

  // State for filters and data
  const [startDate, setStartDate] = useState(new Date('2025-10-29'));
  const [endDate, setEndDate] = useState(new Date('2025-11-29'));
  const [searchType, setSearchType] = useState('order-id');
  const [companyName, setCompanyName] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth guard - redirect if not logged in
  useEffect(() => {
    if (!user) {
      // In a real app, this would redirect to login
      toast.error('Please log in to view orders');
      return;
    }
    fetchOrders();
  }, [user]);

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, sku)
          ),
          profiles (first_name, last_name)
        `)
        .eq('user_id', user?.id || '')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match our component structure
      const transformedOrders = (data || []).map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        date: new Date(order.created_at).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: '2-digit'
        }),
        time: new Date(order.created_at).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        shipTo: `${order.shipping_full_name}`,
        companyName: order.profiles?.first_name && order.profiles?.last_name
          ? `${order.profiles.first_name} ${order.profiles.last_name}`
          : 'N/A',
        total: `$${order.total_amount.toFixed(2)}`,
        status: order.status,
        items: (order.order_items || []).map((item: any) => ({
          name: item.products?.name || 'Unknown Product',
          qty: item.quantity,
          price: `$${item.unit_price.toFixed(2)}`
        })),
        tracking: order.tracking_number || null,
        summary: `Order ${order.order_number} containing ${order.order_items?.length || 0} items`
      }));

      setAllOrders(transformedOrders);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Unapproved orders for modal
  const unapprovedOrders = [
    { id: '1078718', company: 'Tech Solutions Inc', total: '$299.99', reason: 'Payment verification required' },
    { id: '1078719', company: 'Mobile Repair Co', total: '$145.50', reason: 'Credit limit exceeded' },
    { id: '1078720', company: 'Device Experts', total: '$89.99', reason: 'Account verification pending' }
  ];

  // Auth guard - don't render if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to view your orders.</p>
        </div>
      </div>
    );
  }

  // Filtered orders based on search and filters
  const filteredOrders = allOrders.filter(order => {
    // Search filter
    let searchMatch = true;
    if (searchType === 'order-id' && !order.id.toLowerCase().includes(companyName.toLowerCase())) {
      searchMatch = false;
    } else if (searchType === 'sku' && !order.items.some(item => item.name.toLowerCase().includes(companyName.toLowerCase()))) {
      searchMatch = false;
    }

    // Status filter
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;

    return searchMatch && statusMatch;
  });

  // Pagination
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle checkbox selection
  const handleOrderSelect = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === paginatedOrders.length
        ? []
        : paginatedOrders.map(order => order.id)
    );
  };

  // Handle view order
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
    toast.success('Opening order details');
  };

  // CSV Export using PapaParse
  const exportToCSV = () => {
    const selectedOrderData = allOrders.filter(order => selectedOrders.includes(order.id));
    const csvData = selectedOrderData.map(order => ({
      'Order ID': order.id,
      'Order Number': order.orderNumber,
      'Date': order.date,
      'Time': order.time,
      'Ship To': order.shipTo,
      'Company Name': order.companyName,
      'Total': order.total,
      'Status': order.status,
      'Tracking': order.tracking || 'N/A',
      'Items': order.items.map(item => `${item.name} (${item.qty})`).join('; ')
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully');
  };

  // PDF Export using jsPDF
  const exportToPDF = () => {
    const selectedOrderData = allOrders.filter(order => selectedOrders.includes(order.id));
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Midas Technical Solutions - Order Export', 20, 30);

    doc.setFontSize(12);
    let yPosition = 50;

    selectedOrderData.forEach((order, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }

      doc.text(`Order #${order.id} - ${order.date}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Customer: ${order.companyName}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Total: ${order.total}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Status: ${order.status}`, 20, yPosition);
      yPosition += 10;

      if (order.tracking) {
        doc.text(`Tracking: ${order.tracking}`, 20, yPosition);
        yPosition += 10;
      }

      yPosition += 10; // Space between orders
    });

    doc.save(`orders_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF exported successfully');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <NavBar />

      {/* Main Content */}
      <div className="pt-32 pb-12">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1" role="complementary" aria-label="Account navigation">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* My Account Section */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">My Account</h3>
                  <nav className="space-y-2" role="navigation" aria-label="My Account">
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Account Dashboard">Account Dashboard</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Account Information">Account Information</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Address Book">Address Book</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Employee & Locations Management">Manage Employee & Locations</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Notifications">Notification</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Tax Forms">Tax Forms</a>
                  </nav>
                </div>

                {/* Saved Shopping Cart */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Saved Shopping Cart</h3>
                </div>

                {/* Order Info Section */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Order Info</h3>
                  <nav className="space-y-2" role="navigation" aria-label="Order Information">
                    <a href="#" className="block px-3 py-2 bg-blue-50 text-blue-700 font-medium rounded" aria-current="page">My Orders</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Reserve Orders">Reserve Orders</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to FedEx Refunds">Request FedEx Refunds</a>
                  </nav>
                </div>

                {/* Devices Section */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Devices</h3>
                  <nav className="space-y-2" role="navigation" aria-label="Device Management">
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to My Devices">My Devices</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Device Grading Scale">Device Grading Scale</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Device Returns RMA">Device Returns RMA</a>
                  </nav>
                </div>

                {/* Wallet Section */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Wallet</h3>
                  <nav className="space-y-2" role="navigation" aria-label="Wallet Management">
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Store Credit">Store Credit</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Saved Payment Info">Saved Payment Info</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Balance Sheet">Balance Sheet</a>
                  </nav>
                </div>

                {/* Services Section */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Services</h3>
                  <nav className="space-y-2" role="navigation" aria-label="Services">
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to LCD BuyBack Program">LCD BuyBack Program</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Product Returns RMA">Product Returns RMA</a>
                  </nav>
                </div>

                {/* Genuine Apple Parts */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Genuine Apple Parts</h3>
                  <nav className="space-y-2" role="navigation" aria-label="Apple Parts Management">
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Manage Enrollment">Manage Enrollment</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Core Returns">Core Returns</a>
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Marketing Materials">Marketing Materials</a>
                  </nav>
                </div>

                {/* Contact Us */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Contact Us</h3>
                  <nav className="space-y-2" role="navigation" aria-label="Support">
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors" aria-label="Go to Support Ticket">Support Ticket</a>
                  </nav>
                </div>

                {/* Always Expand Submenu Button */}
                <div className="p-6">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white" aria-label="Expand all submenu items">
                    Always Expand Submenu
                  </Button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Blue Banner */}
              <div className="bg-blue-600 text-white rounded-lg p-8 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <div>
                      <h2 className="text-2xl font-bold">All your orders in one place.</h2>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {selectedOrders.length > 0 && (
                      <>
                        <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50" onClick={exportToCSV}>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          CSV ({selectedOrders.length})
                        </Button>
                        <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50" onClick={exportToPDF}>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          PDF ({selectedOrders.length})
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Date Filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-medium">Orders from</span>
                  <div className="flex gap-2">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date || new Date())}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded font-medium border-none outline-none cursor-pointer"
                      dateFormat="MMMM d, yyyy"
                    />
                    <span className="text-gray-500">-</span>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date || new Date())}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded font-medium border-none outline-none cursor-pointer"
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>
                </div>
              </div>

              {/* Search and Filter Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center" role="search" aria-label="Order search and filters">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span className="text-gray-700 font-medium">Search by</span>
                    <Select value={searchType} onValueChange={setSearchType}>
                      <SelectTrigger className="w-full sm:w-32" aria-label="Select search type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order-id">Order ID</SelectItem>
                        <SelectItem value="sku">SKU</SelectItem>
                        <SelectItem value="imei">IMEI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Input
                    placeholder="Search..."
                    className="w-full sm:w-48"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    aria-label="Search orders"
                  />

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-32" aria-label="Filter by status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto" aria-label="Open filter management">
                    Manage Filters
                  </Button>
                </div>
              </div>

              {/* Red Pill Alert */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 cursor-pointer hover:bg-red-100 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-red-700 font-medium">
                        Review Unapproved Orders (10)
                      </span>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        View
                      </Button>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Unapproved Orders</DialogTitle>
                    <DialogDescription>
                      These orders require approval before processing.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {unapprovedOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{order.id}</h4>
                            <p className="text-sm text-gray-600">{order.company}</p>
                          </div>
                          <span className="text-green-600 font-medium">{order.total}</span>
                        </div>
                        <p className="text-sm text-red-600">{order.reason}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            Deny
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Loading/Error States */}
              {loading && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                    <div>
                      <h3 className="text-red-800 font-medium">Error loading orders</h3>
                      <p className="text-red-600 text-sm mt-1">{error}</p>
                      <Button
                        size="sm"
                        className="mt-3 bg-red-600 hover:bg-red-700"
                        onClick={fetchOrders}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Table */}
              {!loading && !error && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" role="table" aria-label="Orders list">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">
                            <Checkbox
                              checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                              onCheckedChange={handleSelectAll}
                              aria-label="Select all orders"
                            />
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">Order ID</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">Time</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">Ship To</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">Company Name</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">Total</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900" scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginatedOrders.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                              </svg>
                              <p className="text-lg font-medium">No orders found</p>
                              <p className="text-sm">Try adjusting your search filters or date range.</p>
                            </td>
                          </tr>
                        ) : (
                          paginatedOrders.map((order: any, index: number) => (
                            <tr
                              key={order.id}
                              className={`hover:bg-blue-50 cursor-pointer transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                              }`}
                              onClick={() => handleViewOrder(order)}
                              role="row"
                              tabIndex={0}
                              aria-label={`Order ${order.id} from ${order.companyName}`}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleViewOrder(order);
                                }
                              }}
                            >
                              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                  checked={selectedOrders.includes(order.id)}
                                  onCheckedChange={() => handleOrderSelect(order.id)}
                                  aria-label={`Select order ${order.id}`}
                                />
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{order.time}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{order.shipTo}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{order.companyName}</td>
                              <td className="px-6 py-4 text-sm font-medium text-green-600">{order.total}</td>
                              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewOrder(order)}
                                  aria-label={`View details for order ${order.id}`}
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                    setItemsPerPage(parseInt(value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="ml-2">items</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Back
                  </Button>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                    1
                  </span>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Order placed on {selectedOrder?.date} at {selectedOrder?.time}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Ship To:</span>
                  <p className="font-medium">{selectedOrder?.shipTo}</p>
                </div>
                <div>
                  <span className="text-gray-600">Company:</span>
                  <p className="font-medium">{selectedOrder?.companyName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedOrder?.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    selectedOrder?.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedOrder?.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Total:</span>
                  <p className="font-medium text-green-600">{selectedOrder?.total}</p>
                </div>
              </div>
              {selectedOrder?.tracking && (
                <div className="mt-4">
                  <span className="text-gray-600">Tracking Number:</span>
                  <p className="font-mono text-sm">{selectedOrder.tracking}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {selectedOrder?.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                    </div>
                    <p className="font-medium">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Notes */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Order Notes</h3>
              <p className="text-gray-700">{selectedOrder?.summary}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <p className="text-gray-300 text-sm">
                Midas Technical Solutions is your trusted partner for mobile device parts and repair solutions.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Products</a></li>
                <li><a href="#" className="hover:text-white">Services</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Apple Parts</a></li>
                <li><a href="#" className="hover:text-white">Samsung Parts</a></li>
                <li><a href="#" className="hover:text-white">Tools & Supplies</a></li>
                <li><a href="#" className="hover:text-white">Accessories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Info</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>support@midastechnical.com</p>
                <p>1-800-MIDAS-01</p>
                <p>Mon-Fri: 9AM-6PM EST</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Midas Technical Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Toaster for notifications */}
      <Toaster position="top-right" />
    </div>
  );
}
