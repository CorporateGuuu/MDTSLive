import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Midas Technical Solutions - Premium Mobile Parts & Accessories',
  description: 'Your trusted source for iPhone, Samsung, Google Pixel, and gaming console parts. Professional repair tools, refurbished devices, and electronic components.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/favicon-32x32.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/favicon-16x16.svg" />
        <link rel="icon" type="image/jpeg" sizes="960x960" href="/favicon-960x960.jpg" />
        <link rel="icon" type="image/jpeg" href="/favicon-main.jpg" />
        <link rel="apple-touch-icon" href="/favicon-960x960.jpg" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
