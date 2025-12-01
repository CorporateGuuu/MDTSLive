'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Truck, ChevronDown, User, Mail, CreditCard, Award, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import FedExCountdownDemo from '../../components/FedExCountdownDemo';
import { useAuth } from '../../lib/auth';

export default function CustomerAccountPage() {
  const { user, logout } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access your account</h1>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const recentOrders = [
    {
      order: '1078717',
      date: '11/27/2025',
      shipTo: 'Midus Technical Solutions',
      location: 'Alexandria, VA',
      total: '$182.34',
      status: 'Shipped'
    },
    {
      order: '1078716',
      date: '11/25/2025',
      shipTo: 'Tech Solutions Inc',
      location: 'Washington, DC',
      total: '$245.67',
      status: 'Processing'
    },
    {
      order: '1078715',
      date: '11/23/2025',
      shipTo: 'Electronic Parts Co',
      location: 'Arlington, VA',
      total: '$89.12',
      status: 'Delivered'
    }
  ];

  const sidebarItems = [
    {
      title: 'My Account',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      expanded: true,
      items: [
        'Account Dashboard',
        'Address Book',
        'Account Information',
        'Newsletter Preferences'
      ]
    },
    {
      title: 'Shopping Cart',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" /></svg>,
      items: []
    },
    {
      title: 'Orders',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
      items: []
    },
    {
      title: 'Devices',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
      items: []
    },
    {
      title: 'RMA',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
      items: []
    },
    {
      title: 'Services',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      items: []
    },
    {
      title: 'Wallet',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
      items: []
    },
    {
      title: 'LCBuyback',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>,
      items: []
    },
    {
      title: 'Genuine Apple Parts',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
      items: []
    },
    {
      title: 'Contact Us',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      items: []
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">Midas Technical Solutions</h1>
            </div>

            {/* Search Bar and Categories */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Search products"
                  />
                </div>
                <select className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent" aria-label="Select category">
                  <option>All Categories</option>
                  <option>Apple</option>
                  <option>Samsung</option>
                  <option>Google</option>
                  <option>Gaming Consoles</option>
                  <option>Accessories</option>
                </select>
              </div>
            </div>

            {/* User, FedEx, and Cart */}
            <div className="flex items-center space-x-6">
              <button 
                onClick={logout}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600" 
                aria-label="User account"
              >
                <User className="h-5 w-5" />
                <span>Logout</span>
              </button>
              <div className="flex items-center space-x-2 text-gray-700">
                <Truck className="h-5 w-5 text-orange-500" aria-hidden="true" />
                <span className="text-sm font-medium">03:24:18</span>
                <span className="text-green-500 animate-pulse text-xs ml-1">Live FedEx Tracking</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                <span className="font-medium">$182.34 | 4</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={`${sidebarExpanded ? 'w-full lg:w-64' : 'w-16'} transition-all duration-300 order-2 lg:order-1`}>
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <nav className="p-4" role="navigation" aria-label="Account navigation">
                {sidebarItems.map((section, index) => (
                  <div key={index} className="mb-2">
                    <button
                      onClick={() => setSidebarExpanded(!sidebarExpanded)}
                      className="flex items-center justify-between w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
                      aria-expanded={section.expanded}
                      aria-controls={`submenu-${index}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600" aria-hidden="true">{section.icon}</span>
                        <span className={`${!sidebarExpanded && 'hidden'} font-medium text-gray-900`}>
                          {section.title}
                        </span>
                      </div>
                      {section.items.length > 0 && sidebarExpanded && (
                        <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
                      )}
                    </button>
                    {section.expanded && sidebarExpanded && section.items.length > 0 && (
                      <ul id={`submenu-${index}`} className="ml-8 mt-1 space-y-1" role="menu">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} role="menuitem">
                            <Link
                              href={`/account/${item.toLowerCase().replace(/ /g, '-')}`}
                              className="block py-1 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Expand/Collapse Button */}
            <div className="mt-4">
              <button
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {sidebarExpanded ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="flex-1 order-1 lg:order-2">
            {/* Dashboard Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My Dashboard</h1>

            {/* Welcome Message */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Hello {user.name || user.email}</span> | In this section you can instantly view and update your recent activities and account information.
              </p>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full" role="table" aria-label="Recent orders">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
                        Ship To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {recentOrders.map((order, index) => (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {order.order}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.shipTo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'Shipped' ? 'bg-green-100 text-green-800' :
                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Account Information */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{user.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">+1-202-914-1818</p>
                  </div>
                </div>
              </div>

              {/* Address Book */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Address Book</h3>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                    Manage Addresses
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Default Billing Address</h4>
                    <div className="text-gray-600 text-sm">
                      <p>{user.name || 'User'}</p>
                      <p>Unit A</p>
                      <p>Alexandria, VA 22310</p>
                      <p>T: +1-202-914-1818</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Default Shipping Address</h4>
                    <div className="text-gray-600 text-sm">
                      <p>{user.name || 'User'}</p>
                      <p>Unit A</p>
                      <p>Alexandria, VA 22310</p>
                      <p>T: +1-202-914-1818</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FedEx Live Tracking Demo */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
              <FedExCountdownDemo />
            </div>

            {/* Newsletter Signup */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Newsletter Preferences</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                  aria-describedby="newsletter-label"
                />
                <label id="newsletter-label" htmlFor="newsletter" className="text-gray-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                  Subscribe to our newsletter for updates on new products and special offers
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-300 py-12 px-6 mt-12" role="contentinfo">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* About */}
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">About</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Repair Services</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Technical Support</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Warranty</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Training</a></li>
              </ul>
            </div>

            {/* Our Brands */}
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Our Brands</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Apple</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Samsung</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Google</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Gaming Consoles</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Shipping Info</a></li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Facebook">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Twitter">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Instagram">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="YouTube">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Payment Methods and Certifications */}
          <div className="border-t border-slate-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <span className="text-sm text-gray-400">Payment Methods:</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-5 bg-blue-600 rounded text-xs text-white flex items-center justify-center font-bold">V</div>
                  <div className="w-8 h-5 bg-blue-800 rounded text-xs text-white flex items-center justify-center font-bold">PP</div>
                  <div className="w-8 h-5 bg-green-600 rounded text-xs text-white flex items-center justify-center font-bold">MC</div>
                  <div className="w-8 h-5 bg-red-600 rounded text-xs text-white flex items-center justify-center font-bold">AE</div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  <span className="text-sm text-gray-400">Certifications:</span>
                </div>
                <div className="flex space-x-2">
                  <div className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold rounded">R2</div>
                  <div className="px-2 py-1 bg-blue-400 text-white text-xs font-bold rounded">ISO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
