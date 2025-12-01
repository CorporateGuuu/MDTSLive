'use client';

import { useState } from 'react';
import { useFedExCountdown, parseFedExDeliveryTime } from '../../hooks/useFedExCountdown';
import { Truck, Clock, Package } from 'lucide-react';

export default function FedExCountdownDemo() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [fedExData, setFedExData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Parse delivery time from FedEx data
  const deliveryTime = parseFedExDeliveryTime(fedExData);

  // Use countdown hook
  const countdown = useFedExCountdown(deliveryTime);

  const handleTrack = async () => {
    if (!trackingNumber.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/fedex/track?trackingNumber=${trackingNumber}`);
      const data = await response.json();

      if (data.success) {
        setFedExData(data.data);
      } else {
        console.error('Tracking failed:', data.error);
        // For demo purposes, set mock data
        setFedExData({
          completeTrackResults: [{
            trackResults: [{
              estimatedDeliveryTimeWindow: {
                estimatedDeliveryDateTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() // 3 hours from now
              },
              latestStatusDetail: {
                description: 'On FedEx vehicle for delivery'
              }
            }]
          }]
        });
      }
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      // Fallback to demo data
      setFedExData({
        completeTrackResults: [{
          trackResults: [{
            estimatedDeliveryTimeWindow: {
              estimatedDeliveryDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
            },
            latestStatusDetail: {
              description: 'Out for delivery'
            }
          }]
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <Truck className="h-6 w-6 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">FedEx Live Tracking</h3>
      </div>

      {/* Tracking Input */}
      <div className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="FedEx tracking number"
          />
          <button
            onClick={handleTrack}
            disabled={loading || !trackingNumber.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : 'Track'}
          </button>
        </div>
      </div>

      {/* Live Countdown */}
      {deliveryTime && !countdown.isExpired && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-orange-600 animate-pulse" />
            <span className="text-sm font-medium text-orange-900">Estimated Delivery In:</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 font-mono">
              {countdown.hours}:{countdown.minutes}:{countdown.seconds}
            </div>
            <div className="text-xs text-orange-700 mt-1">
              Hours : Minutes : Seconds
            </div>
          </div>
        </div>
      )}

      {/* Status Information */}
      {fedExData && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {fedExData?.completeTrackResults?.[0]?.trackResults?.[0]?.latestStatusDetail?.description ||
               'Package in transit'}
            </span>
          </div>

          {deliveryTime && (
            <div className="text-xs text-gray-500">
              Estimated: {new Date(deliveryTime).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Demo Note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Demo:</strong> Try tracking number "123456" for live countdown demo.
          In production, this connects to real FedEx API.
        </p>
      </div>
    </div>
  );
}
