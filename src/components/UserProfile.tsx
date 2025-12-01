'use client';

import { useSession } from 'next-auth/react';

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in</div>;
  }

  const { user } = session;

  return (
    <div className="user-profile">
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Bulk Discount: {(user.bulkDiscount * 100).toFixed(0)}%</p>

      {user.role === 'wholesale' && (
        <div className="wholesale-notice">
          <p>🏪 You have access to wholesale pricing!</p>
        </div>
      )}

      {user.role === 'dealer' && (
        <div className="dealer-notice">
          <p>🚛 You have access to dealer pricing with maximum discounts!</p>
        </div>
      )}
    </div>
  );
}
