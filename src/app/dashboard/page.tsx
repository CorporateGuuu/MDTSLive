import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="p-10">
        <h1 className="text-4xl font-black">Welcome to your Wholesale Dashboard</h1>
        {/* Only visible when logged in */}
      </div>
    </ProtectedRoute>
  );
}
