import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Returns / RMA - Submit & Track | Nexus Tech Hub',
  description: 'Submit RMA requests for defective products, track status, download labels. Return merchandise authorization for electronics and tech parts.',
};

export default function ProductReturnsLayout({
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
