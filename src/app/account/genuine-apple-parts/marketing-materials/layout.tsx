import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketing Materials - Genuine Apple Parts Program | Nexus Tech Hub',
  description: 'Download official Apple GAPP marketing banners, posters, and displays for your repair shop.',
};

export default function MarketingMaterialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
