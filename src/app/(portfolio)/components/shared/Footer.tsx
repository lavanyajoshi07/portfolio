'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, ArrowUp, Mail, Github, Linkedin } from 'lucide-react'
import { Profile } from '@/types'

interface Props {
  profile: Profile | null
  copyrightText?: string
}

// Custom LeetCode SVG logo
function LeetCodeIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.77 9.77a1.375 1.375 0 0 0 0 1.942l4 4a1.375 1.375 0 0 0 1.94 0l9.77-9.77a1.375 1.375 0 0 0 0-1.942l-4-4A1.374 1.374 0 0 0 13.483 0zM22 14.355c0-.742-.601-1.346-1.34-1.346H10.676c-.738 0-1.34.604-1.34 1.346s.602 1.346 1.34 1.346h9.983c.739 0 1.341-.604 1.341-1.346zm-9.083-4.887c0-.742-.601-1.346-1.34-1.346H5.914c-.738 0-1.34.604-1.34 1.346s.602 1.346 1.34 1.346h5.663c.739 0 1.34-.604 1.34-1.346z" />
    </svg>
  )
}

// Custom Dev.to SVG logo
function DevToIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm4.35 4.31H5.47v9.38h1.88V7.31zm6.98 0h-3.41v9.38h3.41c1.37 0 2.21-.83 2.21-2.21V9.52c0-1.38-.84-2.21-2.21-2.21zm.33 2.05c.34 0 .52.18.52.52v4.21c0 .34-.18.52-.52.52h-.96V9.36h.96zm4.84-2.05h-1.88v5.63l-2.25-5.63h-1.88v9.38h1.88v-5.63l2.25 5.63h1.88V7.31z"/>
    </svg>
  )
}

// Custom Medium SVG logo
function MediumIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42zm3.04 0c0 3.24-.31 5.87-.7 5.87s-.7-2.63-.7-5.87.31-5.87.7-5.87.7 2.63.7 5.87z"/>
    </svg>
  )
}

export default function Footer({ profile, copyrightText }: Props) {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const name = profile?.name || 'Lavanya Joshi'
  const subtitle = profile?.title || 'Computer Science Student'
  const tagline = profile?.tagline || 'Building intelligent systems and scalable web experiences.'
  const email = profile?.email
  const resume = profile?.resumeUrl

  // Social node URLs directly from the database profile
  const githubUrl = profile?.socialLinks?.github
  const linkedinUrl = profile?.socialLinks?.linkedin
  const leetcodeUrl = profile?.socialLinks?.leetcode
  const devToUrl = profile?.socialLinks?.devto
  const mediumUrl = profile?.socialLinks?.medium

  // Determine if Column 4 (Profiles) should be visible
  const showProfilesColumn = !!(githubUrl || linkedinUrl || leetcodeUrl || devToUrl || mediumUrl)

  // Has at least one branding social link
  const hasBrandingSocials = !!(githubUrl || linkedinUrl || leetcodeUrl || devToUrl || mediumUrl || email)

  return (
    <footer 
      className="relative bg-[#020617] border-t border-slate-900 pt-16 pb-12 overflow-hidden z-10 font-sans"
      style={{
        backgroundImage: 'radial-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Visual Accents & Ambient Glows */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[130px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-violet-500/5 rounded-full blur-[130px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* ============================================================
            TOP LAYER: Dynamic Column main Grid
            ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-900/60">
          
          {/* Column 1: Personal Brand */}
          <div className={`${showProfilesColumn ? 'lg:col-span-4' : 'lg:col-span-6'} space-y-5`}>
            <div className="flex items-center gap-3">
              {/* Logo / Avatar Glow Ring */}
              <div className="relative w-11 h-11 shrink-0 group">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 blur-[8px] opacity-40 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                  <div className="w-full h-full rounded-[10px] bg-[#020617] flex items-center justify-center">
                    <Cpu className="w-5.5 h-5.5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white tracking-wide uppercase">{name}</h3>
                <p className="font-mono text-[10px] text-cyan-400/90 uppercase tracking-widest">{subtitle}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
              {tagline}
            </p>

            {/* Social Icons - Render only configured profile links */}
            {hasBrandingSocials && (
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {githubUrl && (
                  <a 
                    href={githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-slate-450 hover:text-cyan-400 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300"
                    aria-label="GitHub"
                  >
                    <Github className="w-4.5 h-4.5" />
                  </a>
                )}
                {linkedinUrl && (
                  <a 
                    href={linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-slate-450 hover:text-cyan-400 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4.5 h-4.5" />
                  </a>
                )}
                {leetcodeUrl && (
                  <a 
                    href={leetcodeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-slate-450 hover:text-cyan-400 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300"
                    aria-label="LeetCode"
                  >
                    <LeetCodeIcon />
                  </a>
                )}
                {devToUrl && (
                  <a 
                    href={devToUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-slate-450 hover:text-cyan-400 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300"
                    aria-label="Dev.to"
                  >
                    <DevToIcon />
                  </a>
                )}
                {mediumUrl && (
                  <a 
                    href={mediumUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-slate-450 hover:text-cyan-400 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300"
                    aria-label="Medium"
                  >
                    <MediumIcon />
                  </a>
                )}
                {email && (
                  <a 
                    href={`mailto:${email}`}
                    className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-center text-slate-450 hover:text-cyan-400 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300"
                    aria-label="Email"
                  >
                    <Mail className="w-4.5 h-4.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="text-slate-400 hover:text-cyan-450 transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-slate-400 hover:text-cyan-450 transition-colors">About</a>
              </li>
              <li>
                <a href="#skills" className="text-slate-400 hover:text-cyan-450 transition-colors">Skills</a>
              </li>
              <li>
                <a href="#projects" className="text-slate-400 hover:text-cyan-450 transition-colors">Projects</a>
              </li>
              <li>
                <a href="#achievements" className="text-slate-400 hover:text-cyan-450 transition-colors">Achievements</a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-cyan-450 transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Highlights */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">Highlights</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#projects" className="text-slate-400 hover:text-cyan-450 transition-colors">Projects</a>
              </li>
              <li>
                <a href="#certifications" className="text-slate-400 hover:text-cyan-450 transition-colors">Certifications</a>
              </li>
              <li>
                <a href="#achievements" className="text-slate-400 hover:text-cyan-450 transition-colors">Hackathons</a>
              </li>
              <li>
                <a href="#achievements" className="text-slate-400 hover:text-cyan-450 transition-colors">Research</a>
              </li>
              {resume && (
                <li>
                  <a href={resume} className="text-slate-400 hover:text-cyan-450 transition-colors">Resume</a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Profiles - Render only if at least one URL exists */}
          {showProfilesColumn && (
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">Profiles</h4>
              <ul className="space-y-2 text-xs">
                {githubUrl && (
                  <li>
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-450 transition-colors">GitHub</a>
                  </li>
                )}
                {linkedinUrl && (
                  <li>
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-450 transition-colors">LinkedIn</a>
                  </li>
                )}
                {leetcodeUrl && (
                  <li>
                    <a href={leetcodeUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-450 transition-colors">LeetCode</a>
                  </li>
                )}
                {devToUrl && (
                  <li>
                    <a href={devToUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-450 transition-colors">Dev.to</a>
                  </li>
                )}
                {mediumUrl && (
                  <li>
                    <a href={mediumUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-450 transition-colors">Medium</a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Column 5: Contact CTA */}
          <div className={`${showProfilesColumn ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
            <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">Let's Connect</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Open to internships, collaborations, hackathons, and innovative projects.
            </p>
            {/* Glowing Availability Status Card */}
            {profile?.isAvailableForWork !== undefined && (
              <div className={`inline-flex items-center gap-2 p-2.5 rounded-lg border ${
                profile.isAvailableForWork 
                  ? 'border-cyan-500/20 bg-cyan-950/20 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.05)]' 
                  : 'border-slate-800 bg-slate-900/40 text-slate-400'
              }`}>
                <span className="relative flex h-2 w-2">
                  {profile.isAvailableForWork && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    profile.isAvailableForWork ? 'bg-cyan-500' : 'bg-slate-650'
                  }`}></span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider">
                  {profile.isAvailableForWork ? 'Responds inside 24h' : 'Unavailable for Work'}
                </span>
              </div>
            )}
          </div>

        </div>

        {/* ============================================================
            BOTTOM LAYER: SUB-FOOTER + DIVIDER
            ============================================================ */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left copyright note */}
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest text-center md:text-left order-3 md:order-1">
            {copyrightText || `© ${currentYear} ${name}. All rights reserved.`}
          </div>

          {/* Center credits */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 uppercase tracking-wider order-1 md:order-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span>Designed & Developed by {name}</span>
          </div>

          {/* Right built-with stack list */}
          <div className="flex items-center gap-3 order-2 md:order-3">
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">Built with</span>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md font-mono text-[9px] bg-slate-950 border border-slate-900 text-slate-400">Next.js</span>
              <span className="px-2 py-0.5 rounded-md font-mono text-[9px] bg-slate-950 border border-slate-900 text-slate-400">TypeScript</span>
              <span className="px-2 py-0.5 rounded-md font-mono text-[9px] bg-slate-950 border border-slate-900 text-slate-400">MongoDB</span>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Back to Top button with neon glow */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-xl bg-[#0A1020]/90 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.15)] hover:border-cyan-400 hover:text-white hover:shadow-[0_0_35px_rgba(0,229,255,0.3)] hover:scale-110 transition-all duration-300 backdrop-blur-md cursor-pointer"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  )
}
