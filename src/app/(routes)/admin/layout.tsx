import Sidebar from './components/Sidebar';
import { getUserFromCookie, requireAdmin } from '../../../lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    const user = await getUserFromCookie();
    await requireAdmin(user.id);
  } catch (error) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
