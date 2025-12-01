'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { toast } from 'react-hot-toast';
import { Loader2, MailCheck, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user is already verified and handle URL parameters
  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUserEmail(session.user.email || null);

          // If user is already verified, redirect to dashboard
          if (session.user.email_confirmed_at) {
            setVerificationStatus('success');
            toast.success('Email already verified! Redirecting...');
            setTimeout(() => {
              const role = session.user.user_metadata?.role;
              router.push(role === 'admin' ? '/admin' : '/my-account');
            }, 2000);
            return;
          }
        }

        // Check URL parameters for verification status
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setVerificationStatus('error');
          toast.error(errorDescription || 'Verification failed. Please try again.');
        }

      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    };

    checkVerificationStatus();
  }, [router, searchParams]);

  const resendConfirmation = async () => {
    const emailToUse = email || userEmail;

    if (!emailToUse) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailToUse,
        options: {
          emailRedirectTo: `${window.location.origin}/my-account`
        },
      });

      if (error) {
        toast.error(error.message);
        console.error('Resend error:', error);
      } else {
        toast.success('Confirmation email sent! Check your inbox.');
        setVerificationStatus('pending');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show success state
  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-12">
        <Card className="w-full max-w-md shadow-xl border-green-200">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-green-700 text-2xl">Email Verified!</CardTitle>
            <CardDescription className="text-green-600">
              Your email has been successfully verified.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-sm text-gray-600">
              Welcome to Nexus Tech Hub! You can now access all features.
            </p>
            <p className="text-xs text-gray-500">
              Redirecting to your dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-12">
        <Card className="w-full max-w-md shadow-xl border-red-200">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-700 text-2xl">Verification Failed</CardTitle>
            <CardDescription className="text-red-600">
              We couldn't verify your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-sm text-gray-600">
              The verification link may be expired or invalid.
            </p>

            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email to resend"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
              <Button onClick={resendConfirmation} className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Confirmation Email
                  </>
                )}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Link href="/login">
                <Button variant="ghost" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default pending state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <MailCheck className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Check Your Email</h1>
          <p className="text-gray-600 mt-2">
            We sent a confirmation link to your inbox
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold">Verify Your Account</CardTitle>
            <CardDescription>
              Click the link in the email to activate your Nexus Tech Hub account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Email Preview */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium">📧 Check your inbox</p>
                <p>Look for an email from <strong>noreply@nexustechhub.com</strong></p>
                <p className="text-xs">Subject: &ldquo;Confirm your Nexus Tech Hub account&rdquo;</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600 space-y-3">
              <p>
                Didn't get the email? Check your spam folder or click below to resend.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Tip:</strong> The confirmation link expires in 24 hours.
                  Make sure to click it before it expires.
                </p>
              </div>
            </div>

            {/* Resend Section */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Need a new confirmation email?</p>
              </div>

              <Input
                type="email"
                placeholder="Enter your email address"
                value={email || userEmail || ''}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full h-12"
              />

              <Button
                onClick={resendConfirmation}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={loading || !email && !userEmail}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending Confirmation...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Resend Confirmation Email
                  </>
                )}
              </Button>
            </div>

            {/* Alternative Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Already verified your email?
              </p>

              <Link href="/login">
                <Button variant="outline" className="w-full h-12">
                  Continue to Login
                </Button>
              </Link>
            </div>

            {/* Support */}
            <div className="text-center pt-4">
              <p className="text-xs text-gray-500">
                Still having trouble?{' '}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            By verifying your email, you confirm your account and agree to our terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}
