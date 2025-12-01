import { supabaseServer } from '../../../../lib/supabase/server';

export default async function ProductsPage() {
  const { data: products } = await supabaseServer
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-lg mb-4">Products</h1>
      <div className="border border-gray-300">
        <table className="w-full">
          <thead className="border-b border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left text-sm">Name</th>
              <th className="px-4 py-2 text-left text-sm">Price</th>
              <th className="px-4 py-2 text-left text-sm">Category</th>
              <th className="px-4 py-2 text-left text-sm">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p: any) => (
              <tr key={p.id} className="border-b border-gray-200">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">${p.price}</td>
                <td className="px-4 py-2">{p.category}</td>
                <td className="px-4 py-2">{p.stock_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
