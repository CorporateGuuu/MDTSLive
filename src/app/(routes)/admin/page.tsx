import StatsCard from './components/StatsCard';
import { supabaseServer } from '../../../lib/supabase/server';

export default async function AdminDashboard() {
  const [users, products, orders, pending] = await Promise.all([
    supabaseServer.from('profiles').select('id', { count: 'exact' }),
    supabaseServer.from('products').select('id', { count: 'exact' }),
    supabaseServer.from('orders').select('id', { count: 'exact' }),
    supabaseServer.from('profiles').select('id', { count: 'exact' }).eq('role', 'pending'),
  ]);

  return (
    <div>
      <h1 className="text-xl mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value={users.count || 0} />
        <StatsCard title="Products" value={products.count || 0} />
        <StatsCard title="Orders" value={orders.count || 0} />
        <StatsCard title="Pending Approval" value={pending.count || 0} />
      </div>
    </div>
  );
}
