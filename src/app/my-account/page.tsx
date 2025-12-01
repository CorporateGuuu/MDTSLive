'use client';

import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/button';

export default function MyAccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please log in to access your account');
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>;
  if (!user) return null; // Redirect handled above

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome back, {user.name || user.email}!</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Account Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Account Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-700">Name</label>
                  <p className="text-blue-900">{user.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700">Email</label>
                  <p className="text-blue-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700">Role</label>
                  <p className="text-blue-900 capitalize">{user.role || 'Customer'}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/account')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Full Account Dashboard
                </button>
                <button
                  onClick={() => router.push('/orders')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View My Orders
                </button>
                <Button asChild className="w-full">
                  <Link href="/my-account/edit">Edit Profile</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Welcome to Midas Technical Solutions! Your account is now active.</p>
                  <p className="text-xs text-gray-400">Just now</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Account security updated with latest authentication.</p>
                  <p className="text-xs text-gray-400">Today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Need help? Contact our support team.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push('/contact')}
                className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Contact Support
              </button>
              <button
                onClick={() => router.push('/help')}
                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Help Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
