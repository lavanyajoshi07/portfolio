'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Activity, Shield, User } from 'lucide-react'

export default function Topbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Format title from pathname (e.g. /admin/coding-profiles -> Coding Profiles)
  const getPageTitle = () => {
    const segments = pathname.split('/')
    const lastSegment = segments[segments.length - 1]
    if (lastSegment === 'dashboard') return 'System Dashboard'
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <header className="h-20 border-b border-[#00E5FF]/15 bg-[#0A1020]/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 relative z-10">
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-lg text-white uppercase tracking-wider">
          {getPageTitle()}
        </h2>
        <div className="flex items-center gap-1.5 mt-1">
          <Activity className="w-3 h-3 text-[#00E5FF] animate-pulse" />
          <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
            Diagnostics: Nominal / Online
          </span>
        </div>
      </div>

      {/* User Status Card */}
      <div className="flex items-center gap-4">
        {/* Connection status dot */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#101827] border border-[#00E5FF]/10">
          <Shield className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span className="font-mono text-[10px] text-[#00E5FF] uppercase tracking-wider">
            Role: {(session?.user as any)?.role || 'operator'}
          </span>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="text-right">
            <p className="text-xs font-mono font-semibold text-slate-200">
              {session?.user?.name || 'Admin Operator'}
            </p>
            <p className="text-[10px] font-mono text-slate-500">
              {session?.user?.email}
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-slate-800 border border-[#00E5FF]/20 flex items-center justify-center overflow-hidden">
            {(session?.user as any)?.image ? (
              <img 
                src={(session?.user as any)?.image} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4.5 h-4.5 text-[#00E5FF]" />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
