import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Orbitron } from 'next/font/google'
import '@/styles/global.css'

// 1. Fonts ko top-level par define karo (Scope Fix)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Lavanya Joshi | Full Stack Developer',
    template: '%s | Lavanya Joshi',
  },
  description: 'Futuristic portfolio of Lavanya Joshi, Full Stack Developer.',
}

export const viewport: Viewport = {
  themeColor: '#050816',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 2. data-scroll-behavior attribute add kiya (Warning Fix)
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      
      {/* 3. Variables ab yahan safely accessible hain */}
      <body className={`${inter.variable} ${jetbrains.variable} ${orbitron.variable} font-sans antialiased bg-[#050816] text-slate-200 overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}