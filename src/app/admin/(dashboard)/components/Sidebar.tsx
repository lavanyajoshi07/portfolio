'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  User, 
  Code2, 
  Briefcase, 
  Award, 
  Trophy, 
  Calendar, 
  Terminal, 
  MessageSquare, 
  Image, 
  Settings, 
  LogOut,
  Cpu,
  FileText,
  Globe,
  Clock,
  Target,
  HelpCircle,
  Users,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Profile Info', icon: User, href: '/admin/profile' },
  { label: 'Resume', icon: FileText, href: '/admin/resume' },
  { label: 'Tech Stack', icon: Code2, href: '/admin/tech-stack' },
  { label: 'Projects', icon: Briefcase, href: '/admin/projects' },
  { label: 'Certifications', icon: Award, href: '/admin/certifications' },
  { label: 'Achievements', icon: Trophy, href: '/admin/achievements' },
  { label: 'Coding Activity', icon: Terminal, href: '/admin/coding-activity' },
  { label: 'Messages', icon: MessageSquare, href: '/admin/messages' },
  { label: 'Media Library', icon: Image, href: '/admin/media' },
  { label: 'SEO Settings', icon: Globe, href: '/admin/seo' },
  { label: 'Activity Logs', icon: Clock, href: '/admin/activity-logs' },
  { label: 'Future Goals', icon: Target, href: '/admin/future-goals' },
  { label: 'FAQs', icon: HelpCircle, href: '/admin/faqs' },
  { label: 'Community', icon: Users, href: '/admin/community' },
  { label: 'Site Settings', icon: Settings, href: '/admin/settings' },
]

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={cn(
        "w-64 border-r border-[#00E5FF]/15 bg-[#0A1020]/90 backdrop-blur-md flex flex-col h-screen shrink-0 fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
      {/* Top Border line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent" />
      
      {/* Header/Logo */}
      <div className="p-6 flex items-center justify-between border-b border-[#00E5FF]/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#7C3AED] p-0.5 flex items-center justify-center">
            <div className="w-full h-full rounded-[6px] bg-[#0A1020] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#00E5FF]" />
            </div>
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-widest text-white uppercase">
              Core CMS
            </h1>
            <p className="font-mono text-[9px] text-[#00E5FF] tracking-wider uppercase">
              V1.0 Operational
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden p-1 text-slate-400 hover:text-white"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all duration-300 relative group uppercase tracking-wider",
                isActive 
                  ? "text-[#00E5FF] bg-[#00E5FF]/5 border border-[#00E5FF]/20 shadow-[0_0_15px_rgba(0,229,255,0.05)]" 
                  : "text-slate-400 hover:text-white hover:bg-slate-900/40 border border-transparent"
              )}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 w-[2px] top-2 bottom-2 bg-[#00E5FF] rounded-r-md" />
              )}
              
              <item.icon className={cn(
                "w-4.5 h-4.5 transition-colors duration-300",
                isActive ? "text-[#00E5FF]" : "text-slate-500 group-hover:text-slate-300"
              )} />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-[#00E5FF]/10 shrink-0">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-red-400 hover:text-red-300 hover:bg-red-950/20 border border-transparent hover:border-red-500/20 transition-all duration-300 uppercase tracking-wider text-left"
        >
          <LogOut className="w-4.5 h-4.5 text-red-500" />
          <span className="text-xs">Power Down</span>
        </button>
      </div>
      </aside>
    </>
  )
}
