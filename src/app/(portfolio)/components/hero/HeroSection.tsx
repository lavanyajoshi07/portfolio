'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Profile } from '@/types'
import SocialLinks from './SocialLinks'
import FloatingCards from './FloatingCards'

interface Props {
  profile: Profile | null
}

export default function HeroSection({ profile }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window
      setMousePos({
        x: (e.clientX / w - 0.5) * 20,
        y: (e.clientY / h - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const toggleAudio = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio playback interrupted:", err))
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  const name = profile?.name || 'Jane Doe'
  const title = profile?.title || 'AI & FULL-STACK RESEARCH ENGINEER'
  const tagline = profile?.tagline || 'Architecting intelligent workflows, one model and application at a time.'
  const hasAudio = !!profile?.introAudio
  const hasResume = !!profile?.resumeUrl

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center overflow-hidden bg-[#020617]"
    >
      
      {hasAudio && (
        <audio 
          ref={audioRef}
          src={profile.introAudio}
          onEnded={handleAudioEnded}
          preload="auto"
          style={{ display: 'none' }}
        />
      )}

      {/* ================= PREMIUM CINEMATIC BACKGROUND LAYER ================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          src={profile?.heroVideo || "/videos/avatar.mp4"}
          className="w-full h-full object-cover lg:scale-110 lg:translate-x-8 xl:translate-x-16 opacity-60 brightness-110 contrast-105 saturate-110 transition-transform duration-500"
        />

        <div className="absolute inset-y-0 left-0 w-[50%] bg-gradient-to-r from-cyan-500/20 via-transparent to-transparent mix-blend-screen" />
        <div className="absolute inset-y-0 right-0 w-[50%] bg-gradient-to-l from-purple-500/20 via-transparent to-transparent mix-blend-screen" />

        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 45% 50%, transparent 20%, rgba(2, 6, 23, 0.3) 60%, #020617 90%)'
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-[0.05]" />
      </div>

      {/* FOREGROUND CONTENT VIEWPORT */}
      <motion.div
        ref={containerRef}
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[80vh]">

          <div className="flex flex-col gap-6 lg:col-span-6 lg:-translate-x-4 xl:-translate-x-12 transition-transform duration-300 relative z-20">
            {profile?.isAvailableForWork && (
              <div className="glass-card px-4 py-1.5 rounded-full flex items-center gap-2 w-fit border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono font-medium text-emerald-400 tracking-wider uppercase">
                  Available for Work
                </span>
              </div>
            )}

            <h1 className="font-display text-5xl md:text-6xl xl:text-7xl font-black leading-tight text-slate-100 tracking-tight">
              {name.split(' ')[0]}{' '}
              <span className="gradient-text-cyan drop-shadow-[0_2px_10px_rgba(6,182,212,0.15)]">
                {name.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <div className="flex items-center gap-3">
              <span className="w-6 h-px bg-cyan-500/50" />
              <span className="font-mono text-cyan-400 text-xs tracking-widest uppercase">
                {title}
              </span>
            </div>

            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
              {tagline}
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              {hasAudio && (
                <button
                  onClick={toggleAudio}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-3 transition-all duration-300 transform active:scale-95 shadow-lg ${
                    isPlaying 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20 border border-emerald-400/20' 
                      : 'btn-gradient text-white shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:scale-[1.02]'
                  }`}
                >
                  {isPlaying ? (
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-pulse">
                        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                      </svg>
                      <span>Playing Story...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                      </svg>
                      <span>Listen to My Story</span>
                    </div>
                  )}
                </button>
              )}

              {hasResume && (
                <a
                  href={profile?.resumeUrl}
                  download
                  className="btn-neon-cyan px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:scale-[1.02] transition-all duration-300"
                >
                  Download Resume
                </a>
              )}
            </div>

            {profile?.socialLinks && <div className="mt-4"><SocialLinks links={profile.socialLinks} /></div>}
          </div>

          <div className="relative flex items-center justify-center h-full min-h-[400px] lg:col-span-6 lg:translate-x-4 xl:translate-x-12 transition-transform duration-300 z-20">
            <FloatingCards profile={profile} />
          </div>

        </div>
      </motion.div>
    </section>
  )
}