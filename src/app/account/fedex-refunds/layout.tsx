import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FedEx Shipping Refund Requests - Midas Technical Solutions',
  description: 'Request refunds for delayed FedEx shipments with money-back guarantee claims.',
};

export default function FedExRefundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
