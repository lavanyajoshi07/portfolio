'use client'

import React from 'react'

interface IssuerLogoProps {
  issuer: string
  className?: string
}

export default function IssuerLogo({ issuer, className = 'w-12 h-12' }: IssuerLogoProps) {
  const name = (issuer || '').toLowerCase()

  // AWS Logo (Gold/Orange Cloud & Text)
  if (name.includes('aws') || name.includes('amazon web services')) {
    return (
      <div className={`flex items-center justify-center bg-[#232F3E] rounded-xl border border-[#FF9900]/30 shadow-[0_0_15px_rgba(255,153,0,0.15)] ${className}`}>
        <svg viewBox="0 0 100 100" className="w-2/3 h-2/3" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cloud silhouette */}
          <path d="M78 57.5c0-10.8-8.2-19.6-18.4-19.6-1.5 0-2.9.2-4.3.7-3.2-8-10.7-13.6-19.3-13.6-10.9 0-19.9 8.9-20.9 20-4.8.9-8.4 5.3-8.4 10.6 0 6 4.7 10.9 10.5 10.9h50.3c5.8 0 10.5-4.9 10.5-10.9z" fill="#FF9900" fillOpacity="0.2"/>
          {/* AWS Text */}
          <text x="50" y="60" textAnchor="middle" fill="#FF9900" fontSize="22" fontWeight="900" fontFamily="monospace">AWS</text>
          {/* Arrow curve */}
          <path d="M22 68c20 12 36 12 56 0" stroke="#FF9900" strokeWidth="4" strokeLinecap="round"/>
          <path d="M78 68l-3-6m3 6l-6-1" stroke="#FF9900" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      </div>
    )
  }

  // Google Logo (G Symbol in colored circles)
  if (name.includes('google')) {
    return (
      <div className={`flex items-center justify-center bg-[#0F172A] rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] ${className}`}>
        <svg viewBox="0 0 100 100" className="w-2/3 h-2/3" xmlns="http://www.w3.org/2000/svg">
          <path d="M85 51.3c0-2.5-.2-5.1-.6-7.5H50v14.4h19.7c-.8 4.6-3.4 8.5-7.2 11.1v9.2h11.6C81 72 85 62.7 85 51.3z" fill="#4285F4"/>
          <path d="M50 87c10 0 18.4-3.3 24.5-9L62.9 68.8c-3.2 2.2-7.3 3.5-12.9 3.5-9.9 0-18.3-6.7-21.3-15.8H16.7v9.5C23 78.6 35.7 87 50 87z" fill="#34A853"/>
          <path d="M28.7 56.5c-.8-2.4-1.2-4.9-1.2-7.5s.4-5.1 1.2-7.5v-9.5H16.7C14.1 37.1 12.6 43.3 12.6 50s1.5 12.9 4.1 18.1l12-9.6z" fill="#FBBC05"/>
          <path d="M50 27.7c5.4 0 10.3 1.9 14.1 5.6l10.6-10.6C68.4 16.5 60 13 50 13 35.7 13 23 21.4 16.7 34l12 9.5c3-9.1 11.4-15.8 21.3-15.8z" fill="#EA4335"/>
        </svg>
      </div>
    )
  }

  // Amazon Logo (Amazon A with Arrow)
  if (name.includes('amazon')) {
    return (
      <div className={`flex items-center justify-center bg-[#131921] rounded-xl border border-[#FF9900]/20 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-2/3 h-2/3" xmlns="http://www.w3.org/2000/svg">
          {/* Stylized 'a' */}
          <path d="M46 32c-9 0-16 6-16 15 0 8 6 13 14 13 7 0 12-4 14-8v7h8V32H46zm-2 21c-5 0-8-3-8-7s3-7 8-7 8 3 8 7-3 7-8 7z" fill="#FFFFFF"/>
          {/* Yellow smile arrow */}
          <path d="M15 65c25 15 45 15 70 0" stroke="#FF9900" strokeWidth="5" strokeLinecap="round" fill="none"/>
          <path d="M85 65l-4-9m4 9l-9-2" stroke="#FF9900" strokeWidth="5" strokeLinecap="round"/>
        </svg>
      </div>
    )
  }

  // NPTEL Logo (Text / Hexagon structure representation)
  if (name.includes('nptel')) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] ${className}`}>
        <svg viewBox="0 0 100 100" className="w-2/3 h-2/3" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" stroke="#00E5FF" strokeWidth="4" fill="#00E5FF" fillOpacity="0.1" strokeLinejoin="round"/>
          <text x="50" y="56" textAnchor="middle" fill="#00E5FF" fontSize="20" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">NPTEL</text>
        </svg>
      </div>
    )
  }

  // Generic/Fallback Logo
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-violet-950/20 to-pink-950/20 rounded-xl border border-violet-500/20 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-1/2 h-1/2" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15c-19.3 0-35 15.7-35 35s15.7 35 35 35 35-15.7 35-35-15.7-35-35-35zm0 10c13.8 0 25 11.2 25 25s-11.2 25-25 25-25-11.2-25-25 11.2-25 25-25z" fill="#8B5CF6"/>
        <path d="M45 42l-8 8 13 13 25-25-8-8-17 17-5-7z" fill="#EC4899"/>
      </svg>
    </div>
  )
}
