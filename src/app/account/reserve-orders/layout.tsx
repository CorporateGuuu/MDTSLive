import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reserve Orders - Manage Holds | Nexus Tech Hub',
  description: 'View and manage your reserved orders with easy ship/cancel options.',
};

export default function ReserveOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
