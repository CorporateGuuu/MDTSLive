import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StructuredData from './components/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Midas Technical Solutions | Wholesale Phone Parts, Screens & Repair Tools',
    template: '%s | Midas Technical Solutions'
  },
  description: 'Premium wholesale supplier of MidasGold 7.0 screens, MidasPower batteries, and precision tools. Lifetime warranty, fast shipping, authorized distributor.',
  keywords: [
    'wholesale phone parts',
    'iphone repair parts',
    'samsung screen replacement',
    'mobile repair tools',
    'MidasGold screens',
    'phone repair wholesale',
    'bulk electronics parts',
    'professional repair tools',
    'authorized distributor',
    'lifetime warranty',
    'phone parts bulk',
    'repair tools wholesale'
  ],
  authors: [{ name: 'Midas Technical Solutions' }],
  creator: 'Midas Technical Solutions',
  publisher: 'Midas Technical Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://midastechnicalsolutions.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Midas Technical Solutions | Wholesale Phone Parts, Screens & Repair Tools',
    description: 'Premium wholesale supplier of MidasGold 7.0 screens, MidasPower batteries, and precision tools. Lifetime warranty, fast shipping, authorized distributor.',
    url: 'https://midastechnicalsolutions.com',
    siteName: 'Midas Technical Solutions',
    images: [
      {
        url: '/logos/midas-logo-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Midas Technical Solutions - Premium Wholesale Phone Parts & Repair Tools',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Midas Technical Solutions | Wholesale Phone Parts, Screens & Repair Tools',
    description: 'Premium wholesale supplier of MidasGold 7.0 screens, MidasPower batteries, and precision tools. Lifetime warranty, fast shipping, authorized distributor.',
    images: ['/logos/midas-logo-twitter.jpg'],
    creator: '@MidasTechnical',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  category: 'e-commerce',
  classification: 'Business & Industrial > Wholesale & Distribution',
  other: {
    'theme-color': '#D4AF37',
    'msapplication-TileColor': '#D4AF37',
    'msapplication-config': '/browserconfig.xml',
    'application-name': 'Midas Technical Solutions',
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicons/favicon.ico',
    apple: [
      { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/favicons/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/favicons/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for third-party resources */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Global Structured Data */}
        <StructuredData type="global" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://midastechnicalsolutions.com" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
