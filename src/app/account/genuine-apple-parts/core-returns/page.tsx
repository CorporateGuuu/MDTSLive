'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Phone, CreditCard, Calendar, Eye, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '../../../../components/ui/badge';

export default function CoreReturnsPage() {
  const [dateRange, setDateRange] = useState('Last 30 days');

  // Mock data for the chart - all $0 as specified
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
    { metric: 'On time', value: '0', percentage: '0%', progress: 0 },
    { metric: 'Late', value: '0', percentage: '0%', progress: 0 },
    { metric: 'Never arrived', value: '0', percentage: '0%', progress: 0 },
    { metric: 'Processing', value: '0', percentage: '0%', progress: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner - Light Blue */}
      <div className="bg-sky-200 rounded-lg p-6 mb-6 mx-6 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Phone className="h-8 w-8 text-gray-700" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Core Returns Program</h1>
              <p className="text-gray-600 mt-1">Manage your core returns and track processing status</p>
            </div>
          </div>
          <Button className="bg-black text-white hover:bg-gray-800 px-6 py-2">
            Create Core Return Shipment
          </Button>
        </div>
      </div>

      <div className="px-6">
        {/* Four Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statCards.map((card, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${card.color} mb-2`}>{card.value}</div>
                  <div className="text-sm text-gray-600">{card.title}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Billing Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Payment Method</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">**** **** **** 1234</span>
                    <Badge variant="secondary" className="text-xs">Visa</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Upcoming Core Returns Charges</span>
                  <span className="font-semibold text-lg">$0.00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processed Core Returns */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Processed Core Returns</CardTitle>
                <div className="flex items-center space-x-2">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Date range"
                  >
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                    <Calendar className="h-4 w-4 mr-1" />
                    Date Range
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processedReturns.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 text-sm">{item.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">{item.value}</span>
                        <span className="text-xs text-gray-500">({item.percentage})</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Billing Summary Chart */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-gray-600" />
                  Billing Summary
                </CardTitle>
                <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                  <Eye className="h-4 w-4 mr-1" />
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={billingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#2563eb' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Return Orders */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Return Orders</CardTitle>
                <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                  <Eye className="h-4 w-4 mr-1" />
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <div className="text-sm">No records found</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
