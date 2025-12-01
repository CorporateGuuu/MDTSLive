'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CheckCircle, Download, Star, Shield, Apple } from 'lucide-react';

export default function GenuineApplePartsPage() {
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleDownloadCertificate = () => {
    // Generate sample certificate data
    const userName = 'John Doe'; // In real app, get from user context
    const certificateNumber = `GAPP-${Date.now()}`;
    const enrollmentDate = new Date().toLocaleDateString();
    const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(); // 1 year from now

    const url = `/api/pdf/certificate?userName=${encodeURIComponent(userName)}&certificateNumber=${certificateNumber}&enrollmentDate=${encodeURIComponent(enrollmentDate)}&expiryDate=${encodeURIComponent(expiryDate)}`;
    window.open(url, '_blank');
  };

  const benefits = [
    'Access to genuine Apple parts and components',
    'Priority processing for core returns',
    'Quality assurance and warranty coverage',
    'Dedicated support for Apple device repairs',
    'Competitive pricing on premium components',
    'Fast shipping on in-stock items'
  ];

  const requirements = [
    'Active Midas Technical Solutions account',
    'Verified business or repair operation',
    'Commitment to quality repair standards',
    'Regular core return submissions'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-4 mb-6">
            <Apple className="h-12 w-12" />
            <div>
              <h1 className="text-4xl font-bold">Genuine Apple Parts Program</h1>
              <p className="text-xl text-blue-100 mt-2">Premium access to authentic Apple components</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Badge className="bg-green-500 text-white px-4 py-2">
              <Star className="h-4 w-4 mr-1" />
              Premium Program
            </Badge>
            <Badge className="bg-blue-500 text-white px-4 py-2">
              <Shield className="h-4 w-4 mr-1" />
              Quality Assured
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Program Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                Program Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Enrollment Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                Enrollment Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Enrollment Status & Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enrollment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`h-4 w-4 rounded-full ${isEnrolled ? 'bg-green-500' : 'bg-gray-400'}`} />
                <div>
                  <p className="font-semibold">
                    {isEnrolled ? 'Enrolled in GAPP' : 'Not enrolled'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isEnrolled
                      ? 'You have access to genuine Apple parts and premium services'
                      : 'Complete enrollment to access premium Apple components'
                    }
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                {!isEnrolled ? (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsEnrolled(true)}
                  >
                    Enroll Now
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                    onClick={handleDownloadCertificate}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Genuine Parts Available</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Priority Support</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                <div className="text-sm text-gray-600">Authenticity Guarantee</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
