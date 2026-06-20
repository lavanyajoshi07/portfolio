'use client'

import React from 'react'
import { Award } from 'lucide-react'

interface IssuerLogoProps {
  issuer: string
  logoMode?: 'auto' | 'custom'
  logo?: string
  logoAlt?: string
  className?: string
}

export default function IssuerLogo({
  issuer,
  logoMode = 'auto',
  logo,
  logoAlt,
  className = 'w-12 h-12',
}: IssuerLogoProps) {
  
  // 1. CUSTOM LOGO MODE PRIORITY
  if (logoMode === 'custom' && logo) {
    return (
      <div className={`flex items-center justify-center bg-[#0A1020]/40 rounded-xl border border-slate-800/80 overflow-hidden shrink-0 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt={logoAlt || `${issuer} Logo`}
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
    )
  }

  // 2. AUTO ISSUER LOGO MODE
  const name = (issuer || '').toLowerCase()

  // AWS Logo (Gold/Orange Cloud & Text)
  if (name.includes('aws') || name.includes('amazon web services')) {
    return (
      <div className={`flex items-center justify-center bg-[#232F3E] rounded-xl border border-[#FF9900]/30 shadow-[0_0_15px_rgba(255,153,0,0.15)] shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-2/3 h-2/3" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M78 57.5c0-10.8-8.2-19.6-18.4-19.6-1.5 0-2.9.2-4.3.7-3.2-8-10.7-13.6-19.3-13.6-10.9 0-19.9 8.9-20.9 20-4.8.9-8.4 5.3-8.4 10.6 0 6 4.7 10.9 10.5 10.9h50.3c5.8 0 10.5-4.9 10.5-10.9z" fill="#FF9900" fillOpacity="0.2"/>
          <text x="50" y="60" textAnchor="middle" fill="#FF9900" fontSize="22" fontWeight="900" fontFamily="monospace">AWS</text>
          <path d="M22 68c20 12 36 12 56 0" stroke="#FF9900" strokeWidth="4" strokeLinecap="round"/>
          <path d="M78 68l-3-6m3 6l-6-1" stroke="#FF9900" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      </div>
    )
  }

  // Google Logo (G Symbol in colored circles)
  if (name.includes('google')) {
    return (
      <div className={`flex items-center justify-center bg-[#0F172A] rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-2/3 h-2/3" xmlns="http://www.w3.org/2000/svg">
          <path d="M85 51.3c0-2.5-.2-5.1-.6-7.5H50v14.4h19.7c-.8 4.6-3.4 8.5-7.2 11.1v9.2h11.6C81 72 85 62.7 85 51.3z" fill="#4285F4"/>
          <path d="M50 87c10 0 18.4-3.3 24.5-9L62.9 68.8c-3.2 2.2-7.3 3.5-12.9 3.5-9.9 0-18.3-6.7-21.3-15.8H16.7v9.5C23 78.6 35.7 87 50 87z" fill="#34A853"/>
          <path d="M28.7 56.5c-.8-2.4-1.2-4.9-1.2-7.5s.4-5.1 1.2-7.5v-9.5H16.7C14.1 37.1 12.6 43.3 12.6 50s1.5 12.9 4.1 18.1l12-9.6z" fill="#FBBC05"/>
          <path d="M50 27.7c5.4 0 10.3 1.9 14.1 5.6l10.6-10.6C68.4 16.5 60 13 50 13 35.7 13 23 21.4 16.7 34l12 9.5c3-9.1 11.4-15.8 21.3-15.8z" fill="#EA4335"/>
        </svg>
      </div>
    )
  }

  // Microsoft / Azure
  if (name.includes('microsoft') || name.includes('azure') || name.includes('windows')) {
    return (
      <div className={`flex items-center justify-center bg-[#0F172A] rounded-xl border border-blue-500/10 shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="15" width="32" height="32" fill="#F25022"/>
          <rect x="53" y="15" width="32" height="32" fill="#7FBA00"/>
          <rect x="15" y="53" width="32" height="32" fill="#00A4EF"/>
          <rect x="53" y="53" width="32" height="32" fill="#FFB900"/>
        </svg>
      </div>
    )
  }

  // Coursera
  if (name.includes('coursera')) {
    return (
      <div className={`flex items-center justify-center bg-white rounded-xl border border-slate-200 shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5" xmlns="http://www.w3.org/2000/svg">
          <path d="M47.7 20c-15.6 0-28.3 12.7-28.3 28.3s12.7 28.3 28.3 28.3c7.2 0 13.8-2.7 18.9-7.2l-7.7-7.7c-3.1 2.3-7 3.7-11.2 3.7-10.1 0-18.3-8.2-18.3-18.3s8.2-18.3 18.3-18.3c4.2 0 8.1 1.4 11.2 3.7l7.7-7.7c-5.1-4.5-11.7-7.2-18.9-7.2z" fill="#0056D2"/>
        </svg>
      </div>
    )
  }

  // Meta
  if (name.includes('meta') || name.includes('facebook')) {
    return (
      <div className={`flex items-center justify-center bg-[#0F172A] rounded-xl border border-blue-500/10 shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-2/3 h-2/3" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.5 35c-5.8 0-11 2.3-14.8 6-3.8 3.8-6 9-6 14.8s2.3 11 6 14.8c3.8 3.8 9 6 14.8 6 6.8 0 13.3-3.2 17.5-8.7L50 63.8l3 4.1c4.2 5.5 10.7 8.7 17.5 8.7 5.8 0 11-2.3 14.8-6 3.8-3.8 6-9 6-14.8s-2.3-11-6-14.8c-3.8-3.8-9-6-14.8-6-6.8 0-13.3 3.2-17.5 8.7L50 49.6l-3-4.1c-4.2-5.5-10.7-8.7-17.5-8.7zm0 6c4.9 0 9.7 2.4 12.8 6.4L50 57.2l7.7-9.8c3.1-4 7.9-6.4 12.8-6.4 4.1 0 7.8 1.6 10.5 4.3 2.7 2.7 4.3 6.4 4.3 10.5s-1.6 7.8-4.3 10.5c-2.7 2.7-6.4 4.3-10.5 4.3-4.9 0-9.7-2.4-12.8-6.4L50 56.4l-7.7 9.8c-3.1 4-7.9 6.4-12.8 6.4-4.1 0-7.8-1.6-10.5-4.3-2.7-2.7-4.3-6.4-4.3-10.5s1.6-7.8 4.3-10.5c2.7-2.7 6.4-4.3 10.5-4.3z" fill="#0064E0"/>
        </svg>
      </div>
    )
  }

  // Amazon Logo (Amazon A with Arrow)
  if (name.includes('amazon')) {
    return (
      <div className={`flex items-center justify-center bg-[#131921] rounded-xl border border-[#FF9900]/20 shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-2/3 h-2/3" xmlns="http://www.w3.org/2000/svg">
          <path d="M46 32c-9 0-16 6-16 15 0 8 6 13 14 13 7 0 12-4 14-8v7h8V32H46zm-2 21c-5 0-8-3-8-7s3-7 8-7 8 3 8 7-3 7-8 7z" fill="#FFFFFF"/>
          <path d="M15 65c25 15 45 15 70 0" stroke="#FF9900" strokeWidth="5" strokeLinecap="round" fill="none"/>
          <path d="M85 65l-4-9m4 9l-9-2" stroke="#FF9900" strokeWidth="5" strokeLinecap="round"/>
        </svg>
      </div>
    )
  }

  // NPTEL Logo
  if (name.includes('nptel')) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-2/3 h-2/3" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" stroke="#00E5FF" strokeWidth="4" fill="#00E5FF" fillOpacity="0.1" strokeLinejoin="round"/>
          <text x="50" y="56" textAnchor="middle" fill="#00E5FF" fontSize="20" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">NPTEL</text>
        </svg>
      </div>
    )
  }

  // 3. FALLBACK DEFAULT CERTIFICATE ICON
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-violet-950/20 to-pink-950/20 rounded-xl border border-violet-500/20 shrink-0 ${className}`}>
      <Award className="w-1/2 h-1/2 text-violet-400" />
    </div>
  )
}
