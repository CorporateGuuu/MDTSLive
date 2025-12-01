'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, CreditCard, Calendar, Eye, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

const CoreReturnsDashboard = () => {
  const [dateRange, setDateRange] = useState('Last 30 days');

  // Mock data for the chart
  const billingData = [
    { month: 'Jun', amount: 0 },
    { month: 'Jul', amount: 0 },
    { month: 'Aug', amount: 0 },
    { month: 'Sep', amount: 0 },
    { month: 'Oct', amount: 0 },
    { month: 'Nov', amount: 0 },
  ];

  const statCards = [
    { title: 'Pending Core Returns', value: '0', color: 'text-gray-600' },
    { title: 'New This Week', value: '0', color: 'text-gray-600' },
    { title: 'Core Return Due in', value: 'N/A', color: 'text-gray-600' },
    { title: 'Free shipping label available', value: 'Yes', color: 'text-green-600' },
  ];

  const processedReturns = [
    { metric: 'On time', value: '0', percentage: '0%' },
    { metric: 'Late', value: '0', percentage: '0%' },
    { metric: 'Never arrived', value: '0', percentage: '0%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Banner */}
      <div className="bg-sky-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Phone className="h-8 w-8 text-gray-700" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Core Returns Program</h1>
              <p className="text-gray-600 mt-1">Manage your core returns and track processing status</p>
            </div>
          </div>
          <div className="flex space-x-4">
          <Button className="bg-black text-white hover:bg-gray-800">
            Create Core Return Shipment
          </Button>
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => {
              // Generate sample tracking data
              const trackingNumber = `1Z${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
              const url = `/api/pdf/label?trackingNumber=${trackingNumber}&serviceType=FedEx%20Ground&weight=2%20lbs&shipDate=${new Date().toLocaleDateString()}&fromName=John%20Doe&fromCompany=Nexus%20Tech%20Hub&fromAddress=123%20Main%20St&fromCity=Anytown&fromState=CA&fromZip=12345&toName=Nexus%20Returns&toCompany=Nexus%20Tech%20Hub&toAddress=456%20Return%20Ln&toCity=Return%20City&toState=CA&toZip=67890&reference=CORE-001`;
              window.open(url, '_blank');
            }}
          >
            Download Shipping Label
          </Button>
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Stat Cards */}
        {statCards.map((card, index) => (
          <Card key={index} className="p-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
              <div className="text-sm text-gray-600 mt-1">{card.title}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Billing Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Billing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Method</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">**** **** **** 1234</span>
                  <Badge variant="secondary">Visa</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Upcoming Core Returns Charges</span>
                <span className="font-semibold">$0.00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processed Core Returns */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Processed Core Returns</CardTitle>
              <div className="flex items-center space-x-2">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                  aria-label="Date range"
                >
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Date Range
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedReturns.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{item.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{item.value}</span>
                    <span className="text-sm text-gray-500">({item.percentage})</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Billing Summary Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Billing Summary
              </CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={billingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Return Orders */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Return Orders</CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              No records found
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { CoreReturnsDashboard };
