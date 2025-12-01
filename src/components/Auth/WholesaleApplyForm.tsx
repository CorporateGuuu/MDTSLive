// src/components/Auth/WholesaleApplyForm.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function WholesaleApplyForm() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    businessName: '',
    license: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/wholesale/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        userId: session?.user?.id,
        email: session?.user?.email,
      }),
    });

    if (res.ok) {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-bold text-green-600">Application Submitted!</h3>
        <p>We’ll review your request within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Business Name"
        value={form.businessName}
        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="text"
        placeholder="Trade License #"
        value={form.license}
        onChange={(e) => setForm({ ...form, license: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
        required
      />
      <textarea
        placeholder="Tell us about your business..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg h-24"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        {loading ? 'Submitting...' : 'Apply for Wholesale'}
      </button>
    </form>
  );
}
