import SignInForm from '../../../components/Auth/SignInForm';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <SignInForm />
        <p className="mt-6 text-center text-sm text-gray-600">
          Need wholesale access?{' '}
          <Link href="/auth/apply" className="text-blue-600 hover:underline">
            Apply here
          </Link>
        </p>
      </div>
    </div>
  );
}
