import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Balance Sheet - Account | Nexus Tech Hub',
  description: 'View your account balance sheet with transaction history, debits, credits, and current balance.',
};

export default function BalanceSheetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
