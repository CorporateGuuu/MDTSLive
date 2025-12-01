'use client';

import { useState } from 'react';
import { Search, ShoppingCart, Truck, ChevronDown, User, Mail, Phone, MapPin, Edit, Save } from 'lucide-react';

export default function AccountInformationPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState({
    firstName: 'Fitzgerald',
    lastName: 'Amaranpong',
    email: 'fitzgerald@example.com',
    phone: '+1-202-914-1818',
    company: 'Midus Technical Solutions',
    title: 'IT Manager'
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
  };

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
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">Midas Technical Solutions</h1>
            </div>
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
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600" aria-label="User account">
                <User className="h-5 w-5" />
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
                      aria-expanded={section.expanded ? "true" : "false"}
                      aria-controls={`submenu-${index}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600" aria-hidden="true">{section.icon}</span>
                        <span className={`font-medium text-gray-900 ${!sidebarExpanded && 'hidden'}`}>
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
                            <a
                              href="#"
                              className="block py-1 px-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </nav>
            </div>
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

          {/* Main Content */}
          <div className="flex-1 order-1 lg:order-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Information</h1>

            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userInfo.firstName}
                      onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{userInfo.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userInfo.lastName}
                      onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{userInfo.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{userInfo.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{userInfo.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={userInfo.company}
                        onChange={(e) => setUserInfo({...userInfo, company: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{userInfo.company}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userInfo.title}
                      onChange={(e) => setUserInfo({...userInfo, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{userInfo.title}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Password & Security</h2>
              <div className="space-y-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Change Password
                </button>
                <p className="text-sm text-gray-600">
                  Last password change: 3 months ago
                </p>
              </div>
            </div>

            {/* Account Preferences */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="marketing"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="marketing" className="ml-2 text-gray-700">
                    Receive marketing communications and product updates
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="order-updates"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="order-updates" className="ml-2 text-gray-700">
                    Receive order status updates and shipping notifications
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-300 py-12 px-6 mt-12" role="contentinfo">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">About</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Repair Services</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Technical Support</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Warranty</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Training</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Our Brands</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Apple</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Samsung</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Google</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Gaming Consoles</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Shipping Info</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Facebook">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Twitter">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Instagram">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C8.396 0 7.996.014 6.79.067 5.584.12 4.785.25 4.086.47c-.713.226-1.317.52-1.93.933-.637.426-1.173.99-1.61 1.626C.52 3.675.226 4.28.001 4.993c-.22.7-.35 1.5-.403 2.705C-.414 8.905-.43 9.305 0 12.017c0 3.622.014 4.022.067 5.228.053 1.206.183 2.005.403 2.705.226.713.52 1.317.933 1.93.426.637.99 1.173 1.626 1.61.713.226 1.317.52 1.93.933.7.22 1.5.35 2.705.403C7.905 24.414 8.305 24.43 12.017 24c3.622 0 4.022-.014 5.228-.067 1.206-.053 2.005-.183 2.705-.403.713-.226 1.317-.52 1.93-.933.637-.426 1.173-.99 1.61-1.626.226-.713.52-1.317.933-1.93.22-.7.35-1.5.403-2.705.067-1.206.083-1.606.083-5.228 0-3.622-.016-4.022-.083-5.228-.053-1.206-.183-2.005-.403-2.705-.226-.713-.52-1.317-.933-1.93-.426-.637-.99-1.173-1.626-1.61C20.345.52 19.74.226 19.027.001c-.7-.22-1.5-.35-2.705-.403C16.095-.414 15.695-.43 12.017 0zm5.98 2.488c.77 0 1.526.03 2.276.086.213.014.433.037.646.08.435.086.653.202.853.352.4.3.75.683 1.05 1.083.15.2.266.418.352.853.043.213.066.433.08.646.056.75.086 1.506.086 2.276 0 .77-.03 1.526-.086 2.276-.014.213-.037.433-.08.646-.086.435-.202.653-.352.853a2.587 2.587 0 01-1.083 1.05c-.2.15-.418.266-.853.352-.213.043-.433.066-.646.08-.75.056-1.506.086-2.276.086-.77 0-1.526-.03-2.276-.086-.213-.014-.433-.037-.646-.08-.435-.086-.653-.202-.853-.352a2.587 2.587 0 01-1.05-1.083c-.15-.2-.266-.418-.352-.853-.043-.213-.066-.433-.08-.646-.056-.75-.086-1.506-.086-2.276 0-.77.03-1.526.086-2.276.014-.213.037-.433.08-.646.086-.435.202-.653.352-.853.3-.4.683-.75 1.083-1.05.2-.15.418-.266.853-.352.213-.043.433-.066.646-.08.75-.056 1.506-.086 2.276-.086zM12.017 5.8a6.217 6.217 0 100 12.434 6.217 6.217 0 000-12.434zm0 10.246a4.029 4.029 0 110-8.058 4.029 4.029 0 010 8.058zM19.846 5.595a1.455 1.455 0 11-2.91 0 1.455 1.455 0 012.91 0z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="YouTube">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
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
                  <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path><circle cx="12" cy="8" r="6"></circle></svg>
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
