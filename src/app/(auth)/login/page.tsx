'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { toast } from 'react-hot-toast';
import { Loader2, Mail, Chrome, Apple, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  const router = useRouter();

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome back!');
        // Check user role and redirect accordingly
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/my-account');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'apple') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const sendRecoveryEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent! Check your inbox.');
        setIsRecoveryMode(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">
            {isRecoveryMode ? 'Reset your password' : 'Sign in to your Midas Technical Solutions account'}
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">
              {isRecoveryMode ? 'Password Recovery' : 'Sign In'}
            </CardTitle>
            <CardDescription>
              {isRecoveryMode
                ? 'Enter your email to receive a password reset link'
                : 'Choose your preferred sign-in method'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isRecoveryMode && (
              <>
                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 hover:bg-gray-50 transition-colors"
                    onClick={() => signInWithProvider('google')}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Chrome className="mr-2 h-5 w-5 text-red-500" />
                    )}
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 hover:bg-gray-50 transition-colors"
                    onClick={() => signInWithProvider('apple')}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Apple className="mr-2 h-5 w-5" />
                    )}
                    Continue with Apple
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-500 font-medium">Or continue with email</span>
                  </div>
                </div>
              </>
            )}

            {/* Email Form */}
            <form onSubmit={isRecoveryMode ? sendRecoveryEmail : signInWithEmail} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="h-12"
                />
              </div>

              {!isRecoveryMode && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                      className="h-12 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={loading || !email || (!isRecoveryMode && !password)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isRecoveryMode ? 'Sending...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-5 w-5" />
                    {isRecoveryMode ? 'Send Reset Link' : 'Sign In with Email'}
                  </>
                )}
              </Button>
            </form>

            {/* Recovery Mode Toggle */}
            {!isRecoveryMode ? (
              <div className="text-center space-y-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsRecoveryMode(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  disabled={loading}
                >
                  Forgot your password?
                </button>

                {/* Resend Confirmation Email */}
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) {
                      toast.error('Please enter your email first');
                      return;
                    }
                    setLoading(true);
                    const { error } = await supabase.auth.resend({
                      type: 'signup',
                      email,
                      options: {
                        emailRedirectTo: `${window.location.origin}/my-account`,
                      },
                    });
                    if (error) {
                      toast.error(error.message);
                    } else {
                      toast.success('Confirmation email sent! Check your inbox.');
                    }
                    setLoading(false);
                  }}
                  className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline transition-colors block"
                  disabled={loading}
                >
                  Didn't receive confirmation email? Resend
                </button>

                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                    Sign up for free
                  </Link>
                </p>
              </div>
            ) : (
              <div className="text-center space-y-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsRecoveryMode(false)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  disabled={loading}
                >
                  Back to sign in
                </button>
                <p className="text-xs text-gray-500">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRecoveryMode(false)}
                    className="text-blue-600 font-medium hover:underline"
                    disabled={loading}
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            )}

            {/* Terms and Privacy */}
            <div className="text-center pt-4">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
