import { getServerSession } from 'next-auth';
import { authOptions } from 'src/lib/auth';
import WholesaleApplyForm from '../../../components/Auth/WholesaleApplyForm';
import { redirect } from 'next/navigation';

export default async function ApplyPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Apply for Wholesale Account</h2>
        <WholesaleApplyForm />
      </div>
    </div>
  );
}
