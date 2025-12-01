import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Genuine Apple Parts - Manage Enrollment | Midas Technical Solutions',
  description: 'Access the Genuine Apple Parts program, manage your enrollment, view agreements, and download marketing materials for authorized service providers.',
};

export default function GenuineApplePartsLayout({
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
