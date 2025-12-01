import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Core Returns Program - Manage & Track | Midas Technical Solutions',
  description: 'Track pending core returns, billing, and processed shipments for Apple GAPP. Avoid fees with timely returns.',
};

export default function CoreReturnsLayout({
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
