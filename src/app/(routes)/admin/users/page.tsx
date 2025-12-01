import { supabaseServer } from '../../../../lib/supabase/server';

export default async function UsersPage() {
  const { data: users } = await supabaseServer
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-lg mb-4">User Management</h1>
      <div className="border border-gray-300">
        <table className="w-full">
          <thead className="border-b border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left text-sm">Name</th>
              <th className="px-4 py-2 text-left text-sm">Email</th>
              <th className="px-4 py-2 text-left text-sm">Role</th>
              <th className="px-4 py-2 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => (
              <tr key={u.id} className="border-b border-gray-200">
                <td className="px-4 py-2">{u.first_name} {u.last_name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role || 'retail'}</td>
                <td className="px-4 py-2">
                  {u.role !== 'admin' && (
                    <form action="/api/admin/users/role" method="POST" className="inline">
                      <input type="hidden" name="userId" value={u.id} />
                      <input type="hidden" name="role" value="approved" />
                      <button
                        type="submit"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Approve
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
