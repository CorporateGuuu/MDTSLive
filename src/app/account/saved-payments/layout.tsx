import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Payment Information - Credit Cards | Nexus Tech Hub',
  description: 'Manage saved payment methods for quick checkout. Add Visa, Mastercard securely.',
};

export default function SavedPaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
