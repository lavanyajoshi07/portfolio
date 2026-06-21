'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Profile } from '@/types'
import { useResponsive } from '@/hooks/useResponsive'
import { cn } from '@/lib/utils'

interface Props {
  profile: Profile | null
}

export default function Navbar({ profile }: Props) {
  const [activeSection, setActiveSection] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const { isMobile, isTablet, mounted } = useResponsive()

  // Unified menu links for all sections
  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#certifications', label: 'Certs' },
    { href: '#achievements', label: 'Achievements' },
    { href: '#contact', label: 'Contact' },
    { href: '#page-top', label: '' }, // placeholder to satisfy last item rule if needed, but let's keep it clean
  ].slice(0, 6)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) })
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: 'rgba(5, 8, 22, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo and Available Badge */}
        <div className="flex flex-col items-start justify-center relative">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/"
              className="font-display text-lg font-bold gradient-text-cyan select-none"
            >
              &lt;Portfolio &gt;
            </Link>
          </motion.div>
          {profile?.isAvailableForWork && (
            <div className={cn(
              "absolute top-[100%] left-0 mt-1 glass-card px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md transition-all",
              mounted ? ((isMobile || isTablet) ? "flex" : "hidden") : "md:hidden flex"
            )}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono font-medium text-emerald-400 tracking-wider uppercase whitespace-nowrap">
                Available for Work
              </span>
            </div>
          )}
        </div>

        {/* Desktop nav */}
        <nav 
          className={cn(
            "items-center gap-1 relative",
            mounted ? (isMobile ? "hidden" : "flex") : "hidden md:flex"
          )}
          onMouseLeave={() => setHoveredLink(null)}
        >
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.href)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 relative group uppercase tracking-wider ${
                activeSection === link.href.slice(1)
                  ? 'text-cyan-DEFAULT font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              style={
                activeSection === link.href.slice(1)
                  ? { textShadow: '0 0 12px rgba(0, 229, 255, 0.4)' }
                  : undefined
              }
            >
              {/* Active link underline indicator */}
              {activeSection === link.href.slice(1) && (
                <motion.span
                  layoutId="active-line"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-DEFAULT shadow-[0_0_8px_rgba(0,229,255,0.8)]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Sliding hover pill background */}
              {hoveredLink === link.href && (
                <motion.span
                  layoutId="hover-pill"
                  className="absolute inset-0 bg-white/[0.04] border border-white/[0.03] rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <span className="relative z-10">{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className={cn(
            "w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white rounded-lg transition-colors focus:outline-none",
            mounted ? (isMobile ? "flex" : "hidden") : "md:hidden flex"
          )}
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`h-0.5 w-full bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`h-0.5 w-full bg-current transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-full bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              "border-b",
              mounted ? (isMobile ? "block" : "hidden") : "md:hidden block"
            )}
            style={{
              background: 'rgba(5, 8, 22, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`py-4 text-sm font-medium transition-colors border-b border-white/5 last:border-0 uppercase tracking-wider ${
                    activeSection === link.href.slice(1)
                      ? 'text-cyan-DEFAULT font-bold'
                      : 'text-slate-300 hover:text-cyan-DEFAULT'
                  }`}
                  style={
                    activeSection === link.href.slice(1)
                      ? { textShadow: '0 0 10px rgba(0, 229, 255, 0.4)' }
                      : undefined
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}