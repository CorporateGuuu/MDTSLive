export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Midas Technical Solutions API Documentation</h1>
          <p className="text-gray-600 mt-1">
            Complete API reference for the Midas Technical Solutions e-commerce platform
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
          <p className="text-gray-600 mb-6">
            The API documentation is currently being updated. Please check back later or contact the development team for API details.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-3">Available Endpoints</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <code className="bg-gray-100 px-1 rounded">GET /api/products</code> - List products</li>
                <li>• <code className="bg-gray-100 px-1 rounded">POST /api/orders</code> - Create orders</li>
                <li>• <code className="bg-gray-100 px-1 rounded">GET /api/admin/orders</code> - Admin order management</li>
                <li>• <code className="bg-gray-100 px-1 rounded">GET /api/products/[id]/reviews</code> - Product reviews</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-3">Authentication</h3>
              <p className="text-sm text-gray-600 mb-3">
                Most API endpoints require authentication. Use the session token from NextAuth.
              </p>
              <p className="text-sm text-gray-600">
                Admin endpoints require admin role permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
