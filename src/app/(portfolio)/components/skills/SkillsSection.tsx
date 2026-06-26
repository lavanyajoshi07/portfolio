'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as Lucide from 'lucide-react'
import { TechStackSettings, TechnologyCategory, Technology, TechStats } from '@/types'

// Dynamic Lucide resolver for generic library icons
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  if (!name) return <Lucide.Cpu className={className} />
  
  // Format string name (e.g., 'bookOpen' or 'book-open' -> 'BookOpen')
  const pascalName = name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
  
  const IconComponent = (Lucide as any)[pascalName] || (Lucide as any)[name] || Lucide.Cpu
  return <IconComponent className={className} />
}

// Premium custom SVGs for key technologies
function TechLogo({ name, className }: { name: string; className?: string }) {
  const normalized = name.toLowerCase().trim()

  if (normalized === 'python') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.0001 2C8.74011 2 9.06012 3.41 9.06012 3.41L9.07012 4.88H12.1001V5.32H7.83012C7.83012 5.32 5.00012 5.02 5.00012 9.04C5.00012 13.06 7.42011 12.83 7.42011 12.83L8.86012 12.84V10.82C8.86012 10.82 8.65012 8.35 11.2301 8.35H15.0101C15.0101 8.35 17.8501 8.12 17.8501 5.37C17.8501 2.62 15.2601 2 12.0001 2Z" fill="#3776AB"/>
        <path d="M12.0001 22C15.2601 22 14.9401 20.59 14.9401 20.59L14.9301 19.12H11.9001V18.68H16.1701C16.1701 18.68 19.0001 18.98 19.0001 14.96C19.0001 10.94 16.5801 11.17 16.5801 11.17L15.1401 11.16V13.18C15.1401 13.18 15.3501 15.65 12.7701 15.65H8.99012C8.99012 15.65 6.15012 15.88 6.15012 18.63C6.15012 21.38 8.74011 22 12.0001 22Z" fill="#FFE873"/>
      </svg>
    )
  }

  if (normalized === 'typescript') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#3178C6"/>
        <path d="M14.28 17.15c.34.22.84.38 1.36.38.7 0 1.13-.35 1.13-.9 0-1.42-3.47-.98-3.47-3.47 0-1.32.99-2.31 2.87-2.31.86 0 1.58.21 2 .46l-.42 1.25c-.32-.17-.81-.31-1.28-.31-.69 0-1.02.34-1.02.77 0 1.28 3.47.88 3.47 3.48 0 1.41-1.07 2.45-3.07 2.45-1.02 0-1.83-.31-2.18-.55l.58-1.18zM12.03 12.02H9.86v6.94H8.4v-6.94H6.2v-1.17h5.83v1.17z" fill="white"/>
      </svg>
    )
  }

  if (normalized === 'nextjs') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="black"/>
        <path d="M18.7 18.45L11.53 9.4H10.15v5.82h1.16v-4.45l6.02 7.68h1.37zM15.42 15.22h1.16V9.4h-1.16v5.82z" fill="white"/>
      </svg>
    )
  }

  if (normalized === 'fastapi') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 12H11L9 22L20 10H13L16 2H12Z" fill="#009688"/>
      </svg>
    )
  }

  if (normalized === 'mongodb') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.0001 2.5C12.0001 2.5 10.3701 5.37 9.87012 8C9.37012 10.63 9.87012 13.88 10.8701 16.5C11.3701 17.81 12.0001 20 12.0001 20C12.0001 20 12.6301 17.81 13.1301 16.5C14.1301 13.88 14.6301 10.63 14.1301 8C13.6301 5.37 12.0001 2.5 12.0001 2.5Z" fill="#47A248"/>
        <path d="M12 2.5V20C12 20 11.37 17.81 10.87 16.5C9.87 13.88 9.37 10.63 9.87 8C10.37 5.37 12 2.5 12 2.5Z" fill="#3F9142"/>
        <path d="M12.0001 20C12.0001 20 11.7501 20.75 11.7501 21.25C11.7501 21.75 12.0001 22.5 12.0001 22.5C12.0001 22.5 12.2501 21.75 12.2501 21.25C12.2501 20.75 12.0001 20 12.0001 20Z" fill="#A4B4A9"/>
      </svg>
    )
  }

  if (normalized === 'aws') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.23 8.35c.17.22.25.53.25.93v2.85h-1.61c-.57 0-.96-.13-1.18-.38-.22-.25-.33-.61-.33-1.07 0-.46.12-.81.36-1.06.24-.25.62-.38 1.15-.38.56 0 1.01.21 1.36.71zm3.89 4.39h1.61v-6.3h-1.61v4.36l-3.32-4.36H9.7v6.3h1.62V8.34l3.8 5.4c.17.22.25.53.25.93V12.74zM12 18c-3.31 0-6-1.79-6-4h1.5c0 1.38 2.01 2.5 4.5 2.5s4.5-1.12 4.5-2.5h1.5c0 2.21-2.69 4-6 4zm7-5.5l1.5-1.5L22 12.5H19z" fill="#FF9900"/>
      </svg>
    )
  }

  if (normalized === 'langchain') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" fill="#F25F22"/>
      </svg>
    )
  }

  // Fallback to a smart default icon if it's not custom SVG
  return <Lucide.Cpu className={className} />
}

// In-view count up resolver for premium numeric animations
function ProficiencyCounter({ target, color }: { target: number; color: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = target
    if (start === end) {
      setCount(end)
      return
    }
    
    const duration = 1200 // 1.2s total count animation
    const incrementTime = Math.abs(Math.floor(duration / end))
    
    const timer = setInterval(() => {
      start += 1
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref} style={{ color }} className="font-bold tracking-wider font-mono">
      {count}%
    </span>
  )
}

// Dynamic tag mapper for reducing cognitive load and rendering concise chips
function getTechTags(name: string, description: string): string[] {
  const normalized = name.toLowerCase().trim()
  if (normalized === 'python') return ['Backend', 'AI', 'Automation']
  if (normalized === 'typescript') return ['Frontend', 'APIs', 'Full Stack']
  if (normalized === 'next.js' || normalized === 'nextjs') return ['SSR', 'React', 'Performance']
  if (normalized === 'langchain') return ['LLMs', 'Agents', 'RAG']
  if (normalized === 'fastapi') return ['APIs', 'Backend', 'Speed']
  if (normalized === 'aws') return ['Cloud', 'DevOps', 'Serverless']
  if (normalized === 'mongodb') return ['NoSQL', 'Database', 'Storage']

  if (description) {
    const cleanWords = description
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['with', 'your', 'that', 'this', 'from', 'using', 'robust', 'flexible'].includes(w.toLowerCase()))
    if (cleanWords.length > 0) {
      return cleanWords.slice(0, 3).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    }
  }
  return ['Technology', 'Development']
}

interface Props {
  settings: TechStackSettings | null
  categories: TechnologyCategory[]
  technologies: Technology[]
  stats: TechStats[]
}

export default function SkillsSection({ settings, categories, technologies, stats }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>('all')

  const badgeText = settings?.badgeText || 'Tech Stack'
  const titleText = settings?.title || 'Technologies & Tools'
  const subtitleText = settings?.subtitle || 'My technical ecosystem'
  
  const isCategoriesEnabled = settings?.categoriesEnabled !== false && categories.length > 0
  const isStatsEnabled = settings?.statsEnabled !== false && stats.length > 0
  const isQuoteEnabled = settings?.quoteEnabled !== false && !!settings?.quote
  const isAnimationsEnabled = settings?.animationsEnabled !== false

  // Filtered tech items
  const filteredTech = useMemo(() => {
    if (!isCategoriesEnabled || activeSlug === 'all') return technologies
    return technologies.filter((tech) => {
      const cat = categories.find((c) => c._id === tech.categoryId)
      return cat?.slug === activeSlug
    })
  }, [technologies, categories, activeSlug, isCategoriesEnabled])

  // Framer Motion staggered grid layout variants
  const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 240, 
        damping: 24 
      } 
    }
  }

  return (
    <section id="skills" className="w-full bg-[#030712] py-24 relative overflow-hidden">
      {/* Visual cyber glow highlights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E5FF]/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7C3AED]/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Section Container */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 relative z-10 space-y-14">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <motion.span 
            {...(isAnimationsEnabled ? {
              initial: { opacity: 0, scale: 0.95 },
              whileInView: { opacity: 1, scale: 1 },
              viewport: { once: true },
              transition: { duration: 0.4 }
            } : {})}
            className="inline-block px-3.5 py-1 text-[10px] font-mono font-bold tracking-widest text-[#00E5FF] uppercase border border-[#00E5FF]/30 rounded-full bg-[#00E5FF]/5 shadow-[0_0_12px_rgba(0,229,255,0.1)] select-none"
          >
            &lt;{badgeText}&gt;
          </motion.span>

          <motion.h2 
            {...(isAnimationsEnabled ? {
              initial: { opacity: 0, y: 10 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.5 }
            } : {})}
            className="text-3xl md:text-4xl font-display font-black tracking-tight text-white uppercase"
          >
            {titleText}
          </motion.h2>

          {subtitleText && (
            <motion.p 
              {...(isAnimationsEnabled ? {
                initial: { opacity: 0, y: 10 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.5, delay: 0.1 }
              } : {})}
              className="text-slate-300 max-w-xl mx-auto text-sm md:text-base font-normal leading-relaxed"
            >
              {subtitleText}
            </motion.p>
          )}
        </div>

        {/* Categories Pills Filter with Layout sliding animation */}
        {isCategoriesEnabled && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto border-y border-[#00E5FF]/5 py-4 select-none">
            <button
              type="button"
              onClick={() => setActiveSlug('all')}
              className="relative px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-colors duration-300 outline-none"
            >
              {activeSlug === 'all' && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-[#00E5FF]/10 border border-[#00E5FF]/40 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${activeSlug === 'all' ? 'text-[#00E5FF]' : 'text-slate-400 hover:text-slate-200'}`}>
                All
              </span>
            </button>
            
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => setActiveSlug(activeSlug === cat.slug ? 'all' : cat.slug)}
                className="relative px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-colors duration-300 outline-none"
              >
                {activeSlug === cat.slug && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-[#00E5FF]/10 border border-[#00E5FF]/40 rounded-full shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${activeSlug === cat.slug ? 'text-[#00E5FF]' : 'text-slate-400 hover:text-slate-200'}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Technology Cards Grid */}
        <motion.div 
          key={activeSlug}
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredTech.map((tech) => {
              const displayColor = tech.color || '#00E5FF'
              const techTags = getTechTags(tech.name, tech.description || '')
              return (
                <motion.div
                  key={tech._id || tech.name}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  layout
                  className="group relative bg-[#0A1020]/70 border border-cyan-500/10 backdrop-blur-md transition-all duration-300 rounded-3xl p-5 flex flex-col justify-between min-h-[190px] select-none cursor-pointer hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)]"
                >
                  {/* Logo & Name */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#00E5FF]/40 group-hover:bg-slate-850/80 transition-all duration-300">
                      {tech.iconType === 'upload' ? (
                        <img 
                          src={tech.icon} 
                          alt={tech.name} 
                          className="w-6 h-6 object-contain group-hover:scale-110 transition-transform duration-300" 
                        />
                      ) : (
                        <TechLogo 
                          name={tech.icon} 
                          className="w-6 h-6 object-contain group-hover:scale-110 transition-transform duration-300" 
                        />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-sm text-white tracking-wider uppercase group-hover:text-[#00E5FF] transition-colors duration-300">
                          {tech.name}
                        </h3>
                        {tech.featured && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4FD8] animate-pulse" title="Featured Technology" />
                        )}
                      </div>
                      {tech.experience && (
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
                          {tech.experience}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Skill Tag list instead of long paragraphs */}
                  <div className="text-xs font-mono font-medium tracking-wide mt-4 mb-5 flex flex-wrap gap-x-1.5 gap-y-1 items-center">
                    {techTags.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-1.5">
                        {idx > 0 && <span className="text-[#00E5FF]/40 select-none">•</span>}
                        <span className="text-slate-350 group-hover:text-[#00E5FF] transition-colors">{tag}</span>
                      </span>
                    ))}
                  </div>

                  {/* Percentage & Progress Bar */}
                  <div className="space-y-1.5 mt-auto">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400 uppercase tracking-widest font-medium">Proficiency</span>
                      <ProficiencyCounter target={tech.proficiency} color={displayColor} />
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800/40">
                      <motion.div
                        {...(isAnimationsEnabled ? {
                          initial: { width: 0 },
                          whileInView: { width: `${tech.proficiency}%` },
                          viewport: { once: true },
                          transition: { duration: 1.2, ease: 'easeOut' }
                        } : {
                          style: { width: `${tech.proficiency}%` }
                        })}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${displayColor}, ${displayColor}CC)`,
                          boxShadow: `0 0 6px ${displayColor}40`,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* Measurable Stats Row */}
        {isStatsEnabled && (
          <motion.div 
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-14 border-t border-[#00E5FF]/5"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat._id || stat.label}
                variants={cardVariants}
                className="bg-[#0A1020]/70 border border-cyan-500/10 backdrop-blur-md rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 w-full group hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] cursor-pointer min-h-[130px]"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-center text-[#00E5FF] mb-3 group-hover:text-white group-hover:bg-[#00E5FF]/10 group-hover:scale-110 transition-all duration-300">
                  {stat.iconType === 'upload' ? (
                    <img src={stat.icon} alt={stat.label} className="w-5 h-5 object-contain" />
                  ) : (
                    <DynamicIcon name={stat.icon || ''} className="w-4 h-4" />
                  )}
                </div>
                <p className="text-xl md:text-2xl font-display font-black text-white leading-none mb-1 group-hover:text-[#00E5FF] transition-colors duration-300">
                  {stat.value}
                </p>
                <p className="text-[9px] font-mono text-slate-300 uppercase tracking-wider font-semibold">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Quote Block */}
        {isQuoteEnabled && (
          <motion.div
            {...(isAnimationsEnabled ? {
              initial: { opacity: 0, y: 15 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.5, delay: 0.2 }
            } : {})}
            className="text-center pt-8 border-t border-[#00E5FF]/5 max-w-2xl mx-auto"
          >
            <div className="inline-block relative">
              <span className="absolute -top-6 -left-8 text-6xl text-[#00E5FF]/10 font-serif pointer-events-none select-none">“</span>
              <p className="text-slate-300 text-xs md:text-sm italic font-normal leading-relaxed relative z-10 px-4">
                {settings.quote}
              </p>
              <span className="absolute -bottom-10 -right-8 text-6xl text-[#00E5FF]/10 font-serif pointer-events-none select-none">”</span>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  )
}