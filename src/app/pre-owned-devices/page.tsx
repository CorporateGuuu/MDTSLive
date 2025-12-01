'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useCart } from '../../stores/cartStore';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { supabase } from '../../../src/lib/supabase';
import { ShoppingCart, Eye } from 'lucide-react';

interface Device {
  id: string;
  brand: string;
  model: string;
  size: string;
  color: string;
  condition: string;
  price: number;
  inStock: boolean;
  images: string[];
}

export default function PreOwnedDevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const { data, error } = await supabase
          .from('devices')
          .select('*')
          .eq('in_stock', true)
          .order('created_at', { ascending: false })
          .limit(12);

        if (error) {
          console.error('Error fetching devices:', error);
          return;
        }

        const formattedDevices: Device[] = data.map(device => ({
          id: device.id,
          brand: device.brand,
          model: device.model,
          size: device.size,
          color: device.color,
          condition: device.condition,
          price: parseFloat(device.price),
          inStock: device.in_stock,
          images: device.images || []
        }));

        setDevices(formattedDevices);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const handleAddToCart = (device: Device) => {
    addItem({
      id: device.id,
      name: `${device.brand} ${device.model} ${device.size} ${device.color}`,
      price: device.price,
      image: device.images[0] || '/placeholder.svg',
      condition: device.condition
    });
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'a+':
      case 'a plus':
        return 'bg-green-100 text-green-800';
      case 'a':
      case 'excellent':
        return 'bg-blue-100 text-blue-800';
      case 'b':
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'c':
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      case 'd':
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Pre-Owned Devices</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Certified pre-owned devices with warranty and quality guarantee.
              All devices are thoroughly tested and come with our standard 30-day warranty.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {/* Devices Grid */}
          {!loading && (
            <>
              {devices.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No devices available</h3>
                  <p className="text-gray-600">Check back later for new pre-owned device listings.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {devices.map((device) => (
                    <div key={device.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Device Image */}
                      <div className="relative aspect-square">
                        <Image
                          src={device.images[0] || '/placeholder.svg'}
                          alt={`${device.brand} ${device.model}`}
                          fill
                          className="object-cover"
                        />
                        <Badge
                          className={`absolute top-2 left-2 ${getConditionColor(device.condition)}`}
                        >
                          {device.condition}
                        </Badge>
                      </div>

                      {/* Device Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {device.brand} {device.model}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {device.size} • {device.color}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mb-4">
                          ${device.price.toFixed(2)}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddToCart(device)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View More Link */}
              {devices.length > 0 && (
                <div className="text-center mt-8">
                  <Link
                    href="/account/devices/grading"
                    className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    View All Devices & Grading Scale
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
