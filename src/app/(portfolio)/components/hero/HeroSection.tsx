'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Profile } from '@/types'
import AudioPlayer from './AudioPlayer'
import FloatingCards from './FloatingCards'
import SocialLinks from './SocialLinks'

interface Props {
  profile: Profile | null
}

export default function HeroSection({ profile }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window
      setMousePos({
        x: (e.clientX / w - 0.5) * 30,
        y: (e.clientY / h - 0.5) * 30,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const name = profile?.name || 'Your Name'
  const title = profile?.title || 'Software Engineer & AI Enthusiast'
  const tagline = profile?.tagline || 'Building the future, one line of code at a time.'
  const hasAudio = !!profile?.introAudio
  const hasResume = !!profile?.resumeUrl
  const heroVideo = profile?.heroVideo

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background ambient glows */}
      <div
        className="ambient-blob w-[600px] h-[600px] bg-cyan-DEFAULT/10 -top-40 -left-40"
        style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
      />
      <div
        className="ambient-blob w-[500px] h-[500px] bg-violet-DEFAULT/10 top-1/2 right-0"
        style={{ transform: `translate(${-mousePos.x * 0.3}px, ${-mousePos.y * 0.3}px)` }}
      />
      <div className="ambient-blob w-[300px] h-[300px] bg-pink-DEFAULT/10 bottom-20 left-1/3" />

      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-DEFAULT to-transparent animate-scan-line" />
      </div>

      <motion.div
        ref={containerRef}
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* LEFT: Text content */}
          <div className="flex flex-col gap-6">
            {/* Status badge */}
            {profile?.isAvailableForWork && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2 w-fit"
              >
                <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-400 tracking-wide uppercase">
                    Available for Work
                  </span>
                </div>
              </motion.div>
            )}

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h1 className="font-display text-5xl md:text-6xl xl:text-7xl font-black leading-tight">
                <span className="text-slate-100">{name.split(' ')[0]}</span>{' '}
                <span className="gradient-text-cyan">
                  {name.split(' ').slice(1).join(' ')}
                </span>
              </h1>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <span className="w-8 h-px bg-cyan-DEFAULT" />
              <span className="font-mono text-cyan-DEFAULT text-sm tracking-widest uppercase">
                {title}
              </span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg"
            >
              {tagline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {/* Primary: Listen to story */}
              {hasAudio && (
                <button
                  onClick={() => setShowAudioPlayer(true)}
                  className="btn-gradient px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 group"
                >
                  <span className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-white ml-0.5" />
                  </span>
                  Listen to My Story
                </button>
              )}

              {/* Resume */}
              {hasResume && (
                <a
                  href={profile?.resumeUrl}
                  download
                  className="btn-neon-cyan px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
                  onClick={() => {
                    fetch('/api/analytics', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ type: 'resume_download' }),
                    })
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </a>
              )}

              {/* Contact */}
              <a
                href="#contact"
                className="btn-neon-pink px-6 py-3 rounded-xl font-semibold text-sm"
              >
                Get In Touch
              </a>
            </motion.div>

            {/* Social links */}
            {profile?.socialLinks && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <SocialLinks links={profile.socialLinks} />
              </motion.div>
            )}
          </div>

          {/* RIGHT: Video + floating elements */}
          <div className="relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 0.02}deg) rotateX(${-mousePos.y * 0.02}deg)`,
                transition: 'transform 0.1s ease-out',
              }}
              className="relative"
            >
              {/* Video container */}
              {heroVideo ? (
                <div className="relative rounded-2xl overflow-hidden neon-border shadow-cyan-glow w-full max-w-[520px]">
                  <video
                    src={heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto rounded-2xl"
                    aria-hidden="true"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/40 via-transparent to-transparent pointer-events-none" />
                </div>
              ) : profile?.profileImage ? (
                <div className="relative rounded-2xl overflow-hidden neon-border shadow-cyan-glow w-full max-w-[520px] aspect-video bg-bg-secondary flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.profileImage}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                /* Placeholder AI dashboard UI */
                <div className="relative rounded-2xl neon-border shadow-cyan-glow w-full max-w-[520px] aspect-video bg-bg-secondary/80 backdrop-blur overflow-hidden">
                  <PlaceholderDashboard />
                </div>
              )}

              {/* Floating stat cards */}
              <FloatingCards profile={profile} />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-500 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-cyan-DEFAULT/50 to-transparent animate-float" />
        </motion.div>
      </motion.div>

      {/* Audio player */}
      {showAudioPlayer && profile?.introAudio && (
        <AudioPlayer
          src={profile.introAudio}
          transcript={profile.transcript || []}
          onClose={() => setShowAudioPlayer(false)}
        />
      )}
    </section>
  )
}

function PlaceholderDashboard() {
  return (
    <div className="w-full h-full p-4 font-mono text-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-emerald-400" />
        <span className="text-slate-500 ml-2">ai_workspace.ts</span>
      </div>
      <div className="space-y-1 text-slate-500 animate-pulse">
        <div><span className="text-violet-DEFAULT">import</span> <span className="text-cyan-DEFAULT">{'{ AI }'}</span> <span className="text-violet-DEFAULT">from</span> <span className="text-emerald-400">&apos;@future&apos;</span></div>
        <div>&nbsp;</div>
        <div><span className="text-violet-DEFAULT">const</span> <span className="text-cyan-DEFAULT">engineer</span> = <span className="text-pink-DEFAULT">new</span> AI&#40;&#123;</div>
        <div>&nbsp;&nbsp;skills: <span className="text-emerald-400">[&apos;React&apos;, &apos;Python&apos;, &apos;ML&apos;]</span>,</div>
        <div>&nbsp;&nbsp;passion: <span className="text-emerald-400">&apos;building the future&apos;</span>,</div>
        <div>&nbsp;&nbsp;mode: <span className="text-emerald-400">&apos;always learning&apos;</span></div>
        <div>&#125;&#41;</div>
        <div>&nbsp;</div>
        <div><span className="text-violet-DEFAULT">await</span> engineer.<span className="text-cyan-DEFAULT">deploy</span>&#40;&#41; <span className="text-slate-600">// ✓ online</span></div>
      </div>
    </div>
  )
}