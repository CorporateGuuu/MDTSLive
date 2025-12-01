import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Tickets - Create & Track | Midas Technical Solutions',
  description: 'File support tickets for billing, orders, or technical issues. Track status and receive updates.',
};

export default function SupportTicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
