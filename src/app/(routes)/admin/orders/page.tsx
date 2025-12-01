import { supabaseServer } from '../../../../lib/supabase/server';

export default async function OrdersPage() {
  const { data: orders } = await supabaseServer
    .from('orders')
    .select(`
      *,
      profiles:user_id (
        first_name,
        last_name,
        email
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-lg mb-4">Orders</h1>
      <div className="border border-gray-300">
        <table className="w-full">
          <thead className="border-b border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left text-sm">Order ID</th>
              <th className="px-4 py-2 text-left text-sm">Customer</th>
              <th className="px-4 py-2 text-left text-sm">Total</th>
              <th className="px-4 py-2 text-left text-sm">Status</th>
              <th className="px-4 py-2 text-left text-sm">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((o: any) => (
              <tr key={o.id} className="border-b border-gray-200">
                <td className="px-4 py-2">#{o.order_number}</td>
                <td className="px-4 py-2">{o.profiles?.first_name} {o.profiles?.last_name}</td>
                <td className="px-4 py-2">${o.total_amount}</td>
                <td className="px-4 py-2">{o.status}</td>
                <td className="px-4 py-2">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
