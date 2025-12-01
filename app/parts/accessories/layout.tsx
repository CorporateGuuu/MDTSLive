// app/parts/accessories/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessories - Nexus Tech Hub",
  description: "Phone accessories, cases, chargers, cables and more",
};

export default function AccessoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
