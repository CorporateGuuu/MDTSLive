import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-300 p-6">
      <h2 className="text-lg font-normal mb-8">Admin Panel</h2>
      <nav className="space-y-1">
        <Link href="/admin" className="block py-1 text-blue-600 hover:underline">Dashboard</Link>
        <Link href="/admin/users" className="block py-1 text-blue-600 hover:underline">Users</Link>
        <Link href="/admin/products" className="block py-1 text-blue-600 hover:underline">Products</Link>
        <Link href="/admin/orders" className="block py-1 text-blue-600 hover:underline">Orders</Link>
      </nav>
    </aside>
  );
}
