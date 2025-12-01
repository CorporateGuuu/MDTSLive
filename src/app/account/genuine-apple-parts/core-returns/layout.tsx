import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Core Returns Program - Manage & Track | Nexus Tech Hub',
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
