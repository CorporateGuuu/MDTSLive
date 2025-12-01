'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Badge } from '../../../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../../components/ui/dialog';
import { ToastContainer, useToast } from '../../../../components/ui/toast';
import { useCart } from '../../../../../src/stores/cartStore';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import { supabase } from '../../../../../src/lib/supabase';
import {
  Search,
  User,
  Truck,
  ShoppingCart,
  Eye,
  Plus,
  Download,
  RotateCcw
} from 'lucide-react';
import Papa from 'papaparse';

interface Device {
  id: string;
  brand: string;
  model: string;
  size: string;
  color: string;
  condition: string;
  lcd: string;
  frame: string;
  buttons: string;
  price: number;
  inStock: boolean;
  images: string[];
}

export default function DeviceGradingPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [sortBy, setSortBy] = useState('price-low');
  const [filterInStock, setFilterInStock] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<Set<number>>(new Set());
  const [devices, setDevices] = useState<Device[]>([]);

  const { addItem } = useCart();
  const { showToast } = useToast();

  // Fetch devices from Supabase
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const { data, error } = await supabase
          .from('devices')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching devices:', error);
          showToast('Failed to load devices', 'error');
          return;
        }

        const formattedDevices: Device[] = data.map(device => ({
          id: device.id,
          brand: device.brand,
          model: device.model,
          size: device.size,
          color: device.color,
          condition: device.condition,
          lcd: device.lcd,
          frame: device.frame,
          buttons: device.buttons,
          price: parseFloat(device.price),
          inStock: device.in_stock,
          images: device.images || []
        }));

        setDevices(formattedDevices);
      } catch (error) {
        console.error('Error fetching devices:', error);
        showToast('Failed to load devices', 'error');
      }
    };

    fetchDevices();
  }, [showToast]);

  const conditionGrades = [
    { id: 'grade-a-plus', label: 'Pre-Condition Like New', desc: 'Perfect cosmetic condition, 95%+ battery', color: 'bg-green-100 text-green-800' },
    { id: 'grade-b', label: 'Grade B Good Condition', desc: 'Minor scratches, good functionality', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'grade-c', label: 'Grade C Fair Condition', desc: 'Visible wear, dents possible', color: 'bg-orange-100 text-orange-800' },
    { id: 'grade-d', label: 'Grade D Poor Condition', desc: 'Heavy damage, for parts only', color: 'bg-red-100 text-red-800' },
    { id: 'grade-a', label: 'Grade A Excellent', desc: 'Minimal wear, excellent battery', color: 'bg-blue-100 text-blue-800' },
    { id: 'grade-f', label: 'Grade F Parts Only', desc: 'Broken, iCloud locked', color: 'bg-gray-100 text-gray-800' },
  ];

  const faqs = [
    { question: 'Is there a minimum/maximum number of devices I can order at one time?', answer: 'There is no minimum order requirement. Maximum order quantity depends on availability and can be discussed with our sales team.' },
    { question: 'How long does it take to receive my devices after placing an order?', answer: 'Standard shipping takes 3-5 business days. Expedited shipping options are available for faster delivery.' },
    { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, wire transfers, and purchase orders for qualified accounts.' },
    { question: 'Do you offer bulk pricing discounts?', answer: 'Yes, we offer volume discounts starting at 10 units. Contact our sales team for custom pricing.' },
    { question: 'What is your return policy?', answer: 'Returns are accepted within 30 days with original packaging. Restocking fees may apply.' },
    { question: 'How do I track my order?', answer: 'You will receive tracking information via email once your order ships.' },
    { question: 'Are the devices unlocked?', answer: 'Device unlock status varies by model and condition. Please check product details or contact us.' },
    { question: 'Do you provide warranty on devices?', answer: 'All devices come with our standard 30-day warranty. Extended warranty options are available.' }
  ];

  const sidebarItems = [
    {
      title: 'My Account',
      items: [
        'Account Dashboard',
        'Account Information',
        'Address Book',
        'Manage Employee & Locations',
        'Notification',
        'Tax Forms'
      ]
    },
    {
      title: 'Checkout',
      items: [
        'Saved Shopping Cart'
      ]
    },
    {
      title: 'Order Info.',
      items: [
        'My Orders',
        'Reserve Orders',
        'Request FedEx Refunds'
      ]
    },
    {
      title: 'Devices',
      items: [
        'My Devices',
        'Device Grading Scale',
        'Device Returns RMA'
      ],
      active: 'Device Grading Scale'
    },
    {
      title: 'Wallet',
      items: [
        'Store Credit',
        'Saved Payment Information',
        'Balance Sheet'
      ]
    },
    {
      title: 'Services',
      items: [
        'LCD BuyBack Program',
        'Product Returns RMA'
      ]
    },
    {
      title: 'Genuine Apple Parts',
      items: [
        'Manage Enrollment',
        'Core Returns',
        'Marketing Materials'
      ]
    },
    {
      title: 'Contact Us',
      items: [
        'Support Ticket'
      ]
    }
  ];

  const categories = [
    'Apple', 'Samsung', 'Motorola', 'Google', 'Other Parts',
    'Game Console', 'Accessories', 'Tools & Supplies',
    'Refurbishing', 'Board Components', 'Pre-Owned Devices'
  ];

  // Filtered and sorted devices
  const filteredAndSortedDevices = useMemo(() => {
    let filtered = devices;

    if (filterInStock) {
      filtered = filtered.filter(device => device.inStock);
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'brand':
        filtered.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
      case 'model':
        filtered.sort((a, b) => a.model.localeCompare(b.model));
        break;
      default:
        break;
    }

    return filtered;
  }, [devices, sortBy, filterInStock]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleFilterInStockChange = (checked: boolean) => {
    setFilterInStock(checked);
  };

  const handleAddToCart = async () => {
    const selectedDeviceList = Array.from(selectedDevices);
    if (selectedDeviceList.length === 0) {
      showToast('Please select at least one device to add to cart', 'error');
      return;
    }

    for (const deviceId of selectedDeviceList) {
      const device = devices.find(d => d.id === deviceId);
      if (device) {
        addItem({
          id: device.id,
          name: `${device.brand} ${device.model} ${device.size} ${device.color}`,
          price: device.price,
          image: device.images[0] || '/placeholder.svg',
          condition: device.condition
        });
      }
    }

    setSelectedDevices(new Set());
    showToast(`Added ${selectedDeviceList.length} device(s) to cart`, 'success');
  };

  const handleViewDevice = (device: Device) => {
    setSelectedDevice(device);
    setDeviceModalOpen(true);
  };

  const handleExportCSV = () => {
    const csvData = filteredAndSortedDevices.map(device => ({
      Brand: device.brand,
      Model: device.model,
      Size: device.size,
      Color: device.color,
      Condition: device.condition,
      LCD: device.lcd,
      Frame: device.frame,
      Buttons: device.buttons,
      Price: `$${device.price.toFixed(2)}`,
      'In Stock': device.inStock ? 'Yes' : 'No'
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'device_grading_scale.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('CSV exported successfully', 'success');
  };

  const handleResetFilters = () => {
    setSortBy('price-low');
    setFilterInStock(false);
    setSelectedDevices(new Set());
  };

  const handleGridAddToCart = async (gradeId: string) => {
    // Find devices matching this grade condition
    const gradeDevices = devices.filter(d =>
      d.condition.toLowerCase().includes(gradeId.split('-')[1])
    );

    if (gradeDevices.length === 0) {
      showToast('No devices available for this condition', 'error');
      return;
    }

    // Add the first available device of this grade
    const device = gradeDevices[0];
    addItem({
      id: device.id,
      name: `${device.brand} ${device.model} ${device.size} ${device.color}`,
      price: device.price,
      image: device.images[0] || '/placeholder.svg',
      condition: device.condition
    });

    showToast(`Added ${device.brand} ${device.model} to cart`, 'success');
  };

  const toggleFaq = (index: number) => {
    const newOpen = new Set(faqOpen);
    if (newOpen.has(index)) {
      newOpen.delete(index);
    } else {
      newOpen.add(index);
    }
    setFaqOpen(newOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
      <ToastContainer />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="pt-20 flex">
        {/* Sidebar */}
        <div className={`${sidebarExpanded ? 'w-80' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 fixed left-0 top-20 h-[calc(100vh-5rem)] overflow-y-auto z-40`}>
          <div className="p-4">
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="w-full bg-red-500 text-white py-2 px-4 rounded text-sm font-medium hover:bg-red-600 transition-colors mb-4"
            >
              {sidebarExpanded ? 'Always Expand Submenu' : 'Expand'}
            </button>

            {sidebarExpanded && (
              <div className="space-y-2">
                {sidebarItems.map((section, idx) => (
                  <div key={idx} className="border border-gray-200 rounded">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium text-sm">
                      {section.title}
                    </div>
                    <div className="py-1">
                      {section.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                            item === section.active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`${sidebarExpanded ? 'ml-80' : 'ml-16'} flex-1 p-6 transition-all duration-300`}>
          {/* Search and Categories Bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="text-2xl font-bold text-gray-900">Nexus Tech Hub</div>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="What are you looking for?"
                  className="pl-10 w-full"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 6).map((cat) => (
                  <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-gray-100">
                    {cat}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <User className="w-6 h-6 text-gray-600 cursor-pointer" />
                <Truck className="w-6 h-6 text-gray-600 cursor-pointer" />
                <div className="flex items-center gap-2 cursor-pointer">
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                  <span className="text-sm font-medium">$182.34</span>
                </div>
              </div>
            </div>
          </div>

          {/* Device Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleAddToCart}>Add to Cart</Button>
                  <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50" onClick={handleExportCSV}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" className="text-gray-600 border-gray-600 hover:bg-gray-50" onClick={handleResetFilters}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Filters
                  </Button>
                </div>
                <div className="flex gap-4 items-center">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by Price Low to High" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-low">Price Low to High</SelectItem>
                      <SelectItem value="price-high">Price High to Low</SelectItem>
                      <SelectItem value="brand">Brand A-Z</SelectItem>
                      <SelectItem value="model">Model A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Checkbox id="in-stock" checked={filterInStock} onCheckedChange={handleFilterInStockChange} />
                    <label htmlFor="in-stock" className="text-sm">Availability In Stock</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto" role="region" aria-label="Device grading table" aria-live="polite">
              <table className="w-full min-w-full" role="table" aria-label="Device grading scale">
                <thead className="bg-gray-50">
                  <tr role="row">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900" role="columnheader" aria-sort="none">
                      <input
                        type="checkbox"
                        className="mr-2"
                        aria-label="Select all devices"
                        title="Select all devices"
                      />
                      Brand
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900" role="columnheader" aria-sort="none">Model</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900" role="columnheader" aria-sort="none">Size</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900" role="columnheader" aria-sort="none">Color</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900" role="columnheader" aria-sort="none">Condition</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900" role="columnheader" aria-sort="none">LCD</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900" role="columnheader" aria-sort="none">Frame</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900" role="columnheader" aria-sort="none">Buttons</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900" role="columnheader" aria-sort="none">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900" role="columnheader" aria-sort="none">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900" role="columnheader" aria-sort="none">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedDevices.map((device, index) => (
                    <tr
                      key={device.id}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} hover:bg-blue-25 transition-colors duration-150`}
                      role="row"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900" role="cell">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedDevices.has(device.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedDevices);
                            if (e.target.checked) {
                              newSelected.add(device.id);
                            } else {
                              newSelected.delete(device.id);
                            }
                            setSelectedDevices(newSelected);
                          }}
                          aria-label={`Select ${device.brand} ${device.model}`}
                          title={`Select ${device.brand} ${device.model}`}
                        />
                        {device.brand}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900" role="cell">{device.model}</td>
                      <td className="px-4 py-3 text-sm text-gray-900" role="cell">{device.size}</td>
                      <td className="px-4 py-3 text-sm text-gray-900" role="cell">{device.color}</td>
                      <td className="px-4 py-3 text-sm text-gray-900" role="cell">{device.condition}</td>
                      <td className="px-4 py-3 text-sm text-gray-900" role="cell">{device.lcd}</td>
                      <td className="px-4 py-3 text-sm text-gray-900" role="cell">{device.frame}</td>
                      <td className="px-4 py-3 text-sm text-gray-900" role="cell">{device.buttons}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium" role="cell">${device.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900" role="cell">
                        <span className={device.inStock ? 'text-green-600' : 'text-red-600'}>
                          {device.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900" role="cell">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => handleViewDevice(device)}
                          aria-label={`View details for ${device.brand} ${device.model}`}
                          title={`View details for ${device.brand} ${device.model}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Device Condition Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {conditionGrades.map((grade) => (
              <div key={grade.id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center border-2 border-gray-300">
                  <div className="text-3xl md:text-4xl font-bold text-gray-400">📱</div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm md:text-base">{grade.label}</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-4">{grade.desc}</p>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white" onClick={() => handleGridAddToCart(grade.id)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6" role="region" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 text-red-600">Frequently Asked Questions</h2>
            <div className="space-y-3 md:space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded" role="region" aria-labelledby={`faq-${idx}`}>
                  <button
                    id={`faq-${idx}`}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={faqOpen.has(idx) ? "true" : "false"}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
                    <span className="flex-shrink-0">
                      {faqOpen.has(idx) ? (
                        <span className="text-red-600 font-bold text-lg" aria-hidden="true">-</span>
                      ) : (
                        <span className="text-red-600 font-bold text-lg" aria-hidden="true">+</span>
                      )}
                    </span>
                  </button>
                  {faqOpen.has(idx) && (
                    <div id={`faq-answer-${idx}`} className="px-4 pb-3" role="region" aria-labelledby={`faq-${idx}`}>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Device Details Modal */}
      <Dialog open={deviceModalOpen} onOpenChange={setDeviceModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Device Details</DialogTitle>
            <DialogDescription>
              {selectedDevice && (
                <div className="space-y-2">
                  <p><strong>Brand:</strong> {selectedDevice.brand}</p>
                  <p><strong>Model:</strong> {selectedDevice.model}</p>
                  <p><strong>Size:</strong> {selectedDevice.size}</p>
                  <p><strong>Color:</strong> {selectedDevice.color}</p>
                  <p><strong>Condition:</strong> {selectedDevice.condition}</p>
                  <p><strong>LCD:</strong> {selectedDevice.lcd}</p>
                  <p><strong>Frame:</strong> {selectedDevice.frame}</p>
                  <p><strong>Buttons:</strong> {selectedDevice.buttons}</p>
                  <p><strong>Price:</strong> ${selectedDevice.price.toFixed(2)}</p>
                  <p><strong>Stock:</strong> {selectedDevice.inStock ? 'In Stock' : 'Out of Stock'}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
}
