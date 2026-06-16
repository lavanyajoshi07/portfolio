'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import { Cpu } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Safety net: if the session check stalls (e.g. cookies blocked inside a
  // cross-origin preview iframe), don't hang on the loading screen forever.
  // After a few seconds we treat it as "not signed in" and send the user to login.
  const [loadingTimedOut, setLoadingTimedOut] = useState(false)

  useEffect(() => {
    if (status !== 'loading') {
      setLoadingTimedOut(false)
      return
    }
    const timer = setTimeout(() => setLoadingTimedOut(true), 4000)
    return () => clearTimeout(timer)
  }, [status])

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'loading' && loadingTimedOut)) {
      router.push('/admin/login')
    }
  }, [status, loadingTimedOut, router])

  if (status === 'loading' && !loadingTimedOut) {
    return (
      <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#00E5FF]/15 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#7C3AED] p-0.5 animate-pulse">
              <div className="w-full h-full rounded-[10px] bg-[#0A1020] flex items-center justify-center">
                <Cpu className="w-8 h-8 text-[#00E5FF] animate-spin [animation-duration:3s]" />
              </div>
            </div>
            {/* Outer rings */}
            <div className="absolute -inset-2 rounded-xl border border-[#00E5FF]/20 animate-ping [animation-duration:2s]" />
          </div>
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#00E5FF]">
              Initializing Core...
            </h2>
            <p className="font-mono text-[10px] text-slate-500 mt-1">
              Verifying credentials clearance
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return null
  }

  return (
    <div className="flex h-screen bg-[#050816] overflow-hidden text-slate-200 font-sans">
      {/* Responsive Dashboard Sidebar */}
      <Sidebar />

      {/* Main Panel Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#050816] relative scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {/* Dashboard specific background mesh */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(to right, #00E5FF 1px, transparent 1px),
                linear-gradient(to bottom, #00E5FF 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
          <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-[#7C3AED]/5 blur-[150px] pointer-events-none" />
          <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-[#00E5FF]/5 blur-[150px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
