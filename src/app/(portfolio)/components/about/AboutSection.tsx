'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ExternalLink, GraduationCap } from 'lucide-react'
import SectionWrapper from '../shared/SectionWrapper'
import { Profile } from '@/types'
import { useResponsive } from '@/hooks/useResponsive'
import { cn } from '@/lib/utils'

interface Props {
  profile: Profile | null
  education?: {
    degree: string
    institution: string
    duration?: string
    coursework?: string
    description?: string
    bullets?: string[]
  }[]
}

export default function AboutSection({ profile, education = [] }: Props) {
  const [showResume, setShowResume] = useState(false)
  const { isMobile, isTablet, isDesktop, mounted } = useResponsive()

  const valueCards = [
    {
      title: 'Curiosity',
      description: 'Constantly exploring emerging technologies and new ways of solving problems.',
      color: 'border-cyan-500/20 text-cyan-400 glow-cyan',
      glowBg: 'bg-cyan-500/5',
      icon: '🧠',
    },
    {
      title: 'Innovation',
      description: 'Combining creativity and engineering to build intelligent solutions.',
      color: 'border-violet-500/20 text-violet-400 glow-violet',
      glowBg: 'bg-violet-500/5',
      icon: '⚡',
    },
    {
      title: 'Impact',
      description: 'Creating technology that delivers real value and meaningful outcomes.',
      color: 'border-pink-500/20 text-pink-400 glow-pink',
      glowBg: 'bg-pink-500/5',
      icon: '🎯',
    },
    {
      title: 'Growth',
      description: 'Embracing continuous learning, experimentation, and self-improvement.',
      color: 'border-emerald-500/20 text-emerald-400 glow-emerald',
      glowBg: 'bg-emerald-500/5',
      icon: '🚀',
    },
  ]

  return (
    <SectionWrapper
      id="about"
      title="Human Behind The Models"
      subtitle="The mindset, curiosity, and purpose behind the systems I build."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-8 max-w-[1280px] mx-auto items-start mt-12">
        
        {/* Left Column: Narrative Card */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full flex"
        >
          <div className="glass-card rounded-3xl border border-cyan-500/10 p-8 flex flex-col gap-8 w-full relative overflow-hidden bg-[#0A1020]/70 group">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-500" />
            
            {/* Body Text */}
            <div className="space-y-6 text-slate-300 text-sm md:text-base leading-relaxed font-sans max-w-2xl">
              <p className="text-slate-200 text-lg font-medium leading-relaxed">
                While AI can automate tasks and generate insights, meaningful products still require human creativity, critical thinking, and empathy.
              </p>
              <p>
                My passion lies in bridging that gap—building intelligent systems that empower people rather than replace them.
              </p>
              <p>
                I enjoy exploring how autonomous agents, modern software architecture, and human-centered design can work together to create impactful solutions.
              </p>
              <p>
                I approach every project with curiosity, experimentation, and a desire to create technology that solves real problems.
              </p>
            </div>

            {/* Integrated Card Action Buttons */}
            <div className={cn(
              "flex-wrap gap-4 items-center",
              mounted ? (isMobile ? "hidden" : "flex") : "hidden md:flex"
            )}>
              {/* View/Hide Resume Action (Only for Tablet Portrait / when not desktop) */}
              {(!mounted || isTablet) && (
                <button
                  id="about-view-resume-btn"
                  onClick={() => setShowResume(!showResume)}
                  className="relative p-[1.5px] rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500" />
                  <span className={`relative flex items-center gap-2 px-5 py-2.5 rounded-[10px] font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    showResume
                      ? 'bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-950 text-blue-400 group-hover:text-cyan-300'
                  }`}>
                    {showResume ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    <span>{showResume ? 'Hide Resume' : 'View Resume'}</span>
                  </span>
                </button>
              )}

              {/* View in Full Tab Link */}
              <a
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="relative p-[1.5px] rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-400 to-purple-500" />
                <span className="relative flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-slate-950 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 group-hover:text-pink-300">
                  <ExternalLink className="w-4.5 h-4.5" />
                  <span>{mounted && isDesktop ? 'View Resume' : 'View in Full Tab'}</span>
                </span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Values Stack */}
        <div className={cn(
          "w-full grid gap-4",
          mounted 
            ? (isMobile ? "grid-cols-1" : (isTablet ? "grid-cols-2" : "grid-cols-1"))
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-1"
        )}>
          <h3 className={cn(
            "font-mono text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-2 ml-1 select-none",
            mounted 
              ? (isMobile ? "col-span-1" : (isTablet ? "col-span-2" : "col-span-1"))
              : "col-span-1 md:col-span-2 lg:col-span-1"
          )}>
            What Drives Me
          </h3>
          {valueCards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className={`glass-card rounded-3xl p-5 border ${card.color} bg-[#0A1020]/70 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] relative overflow-hidden transition-all duration-300 group`}
            >
              {/* Pulsing card ambient background glow */}
              <div className={`absolute top-0 right-0 w-24 h-24 ${card.glowBg} rounded-full blur-xl -z-10 group-hover:scale-125 transition-transform duration-500`} />
              
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-base select-none leading-none">{card.icon}</span>
                <h4 className="font-display font-bold text-sm tracking-wide uppercase text-white">
                  {card.title}
                </h4>
              </div>
              <p className="text-xs text-slate-405 font-sans leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Resume Card */}
      <div 
        id="mobile-resume-card"
        className={cn(
          "mt-8 w-full max-w-sm mx-auto px-4",
          mounted ? (isMobile ? "block" : "hidden") : "block md:hidden"
        )}
      >
        <div className="glass-card rounded-3xl border border-cyan-500/10 p-6 flex flex-col items-center text-center gap-4 w-full relative overflow-hidden bg-[#0A1020]/70 group">
          {/* Ambient background glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-500" />
          
          <div className="text-3xl mt-2 select-none">📄</div>
          
          <h4 className="font-display font-bold text-base tracking-widest text-white uppercase">
            Resume
          </h4>
          
          <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-xs px-2">
            View my complete resume, projects, skills, and experience.
          </p>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-full sm:w-auto p-[1.5px] rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] inline-block mt-2"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500" />
            <span className="relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-slate-950 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 group-hover:text-cyan-300 w-full">
              Resume
            </span>
          </a>
        </div>
      </div>

      {/* Embedded Collapsible Resume Iframe Container */}
      <div className={cn(
        mounted ? (isMobile ? "hidden" : "block") : "hidden md:block"
      )}>
        <AnimatePresence>
          {showResume && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: '600px', marginTop: '24px' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full max-w-7xl mx-auto relative rounded-2xl border border-slate-300 bg-white overflow-hidden shadow-2xl flex flex-col z-20"
            >
              <iframe
                src="/resume.html"
                className="w-full h-full border-none"
                title="Resume Document Viewer"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Education Timeline */}
      {education.length > 0 && (
        <div className="max-w-[1280px] mx-auto mt-16 pt-16 border-t border-slate-900/60">
          <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-8 ml-1 select-none">
            Academic Pathway
          </h3>
          
          <div className="relative pl-10 sm:pl-12 space-y-12">
            {/* Timeline vertical connector line */}
            <div className="absolute left-[20px] sm:left-[22px] top-3 bottom-3 w-[1px] bg-gradient-to-b from-cyan-500/30 via-violet-500/30 to-transparent" />
            
            {education.map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Timeline Node circular icon container */}
                <div className="absolute -left-[38px] sm:-left-[49px] top-1 sm:top-1.5 w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/10 z-10">
                  <div className="w-full h-full rounded-[10px] bg-[#0A1020] flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  </div>
                </div>
                
                {/* Timeline card */}
                <div className="glass-card rounded-3xl border border-cyan-500/10 p-6 sm:p-8 bg-[#0A1020]/60 backdrop-blur-xl hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-500" />
                  
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-base sm:text-lg text-white leading-snug uppercase tracking-wide">
                        {edu.degree}
                      </h4>
                      <p className="text-sm text-slate-405 font-sans">
                        {edu.institution}
                      </p>
                    </div>
                    {edu.duration && (
                      <span className="px-3 py-1 rounded-full border border-slate-800 bg-slate-950/60 font-mono text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider shrink-0 self-start">
                        {edu.duration}
                      </span>
                    )}
                  </div>
                  
                  {/* Card Description */}
                  {edu.description && (
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mt-4 max-w-3xl">
                      {edu.description}
                    </p>
                  )}
                  
                  {/* Core Outcomes bullets block */}
                  {edu.bullets && edu.bullets.filter(Boolean).length > 0 && (
                    <div className="mt-5 space-y-2">
                      <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-semibold block mb-2 select-none">
                        Core Outcomes
                      </span>
                      <ul className="space-y-2.5">
                        {edu.bullets.filter(Boolean).map((bullet, bulletIdx) => (
                          <li key={bulletIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-2 shadow-[0_0_8px_rgba(196,181,253,0.8)]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Coursework listing */}
                  {edu.coursework && (
                    <div className="mt-4 pt-4 border-t border-slate-900/60">
                      <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest font-semibold block mb-1">
                        Relevant Coursework
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {edu.coursework}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

    </SectionWrapper>
  )
}
