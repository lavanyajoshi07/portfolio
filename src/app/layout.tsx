import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/global.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Premium Portfolio | AI Engineer',
    template: '%s | Portfolio',
  },
  description: 'Futuristic portfolio of an AI-powered software engineer. Explore projects, skills, and achievements.',
  keywords: ['portfolio', 'software engineer', 'AI', 'machine learning', 'full-stack'],
  authors: [{ name: 'Portfolio Owner' }],
  creator: 'Next.js 15',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourportfolio.com',
    siteName: 'Premium Portfolio',
    title: 'Premium Portfolio | AI Engineer',
    description: 'Futuristic portfolio of an AI-powered software engineer.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#050816' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-bg-primary text-slate-200 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}