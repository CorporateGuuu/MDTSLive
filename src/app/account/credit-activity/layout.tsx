import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Credit Activity - Store Credit Ledger | Nexus Tech Hub',
  description: 'View credit/debit transactions, export to PDF/CSV. Track your store credit balance and transaction history.',
};

export default function CreditActivityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
