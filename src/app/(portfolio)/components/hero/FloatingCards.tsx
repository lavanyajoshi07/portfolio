'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Profile } from '@/types'

interface Props {
  profile: Profile | null
}

// Colors selected strictly from the requested palette: magenta, cyan, violet, and blue
const colorThemes = {
  cyan: {
    text: 'text-[#00E5FF]',
    subtitle: 'text-[#00E5FF]/70',
    border: 'border-[#00E5FF]/20 hover:border-[#00E5FF]/60',
    glow: 'shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:shadow-[0_0_25px_rgba(0,229,255,0.3)]',
    pulse: 'bg-[#00E5FF]',
    hex: '#00E5FF',
  },
  magenta: {
    text: 'text-[#FF007F]',
    subtitle: 'text-[#FF007F]/70',
    border: 'border-[#FF007F]/20 hover:border-[#FF007F]/60',
    glow: 'shadow-[0_0_15px_rgba(255,0,127,0.1)] hover:shadow-[0_0_25px_rgba(255,0,127,0.3)]',
    pulse: 'bg-[#FF007F]',
    hex: '#FF007F',
  },
  violet: {
    text: 'text-[#7C3AED]',
    subtitle: 'text-[#7C3AED]/70',
    border: 'border-[#7C3AED]/20 hover:border-[#7C3AED]/60',
    glow: 'shadow-[0_0_15px_rgba(124,58,237,0.1)] hover:shadow-[0_0_25px_rgba(124,58,237,0.3)]',
    pulse: 'bg-[#7C3AED]',
    hex: '#7C3AED',
  },
  blue: {
    text: 'text-[#38BDF8]',
    subtitle: 'text-[#38BDF8]/70',
    border: 'border-[#38BDF8]/20 hover:border-[#38BDF8]/60',
    glow: 'shadow-[0_0_15px_rgba(56,189,248,0.1)] hover:shadow-[0_0_25px_rgba(56,189,248,0.3)]',
    pulse: 'bg-[#38BDF8]',
    hex: '#38BDF8',
  },
} as const

const cards = [
  {
    name: 'Java',
    subtitle: 'LANGUAGE',
    theme: 'magenta' as const,
    pos: { left: '50%', top: '12%' },
    delay: 0.1,
  },
  {
    name: 'C++',
    subtitle: 'LANGUAGE',
    theme: 'cyan' as const,
    pos: { left: '20%', top: '26.4%' },
    delay: 0.2,
  },
  {
    name: 'C',
    subtitle: 'LANGUAGE',
    theme: 'blue' as const,
    pos: { left: '80%', top: '26.4%' },
    delay: 0.3,
  },
  {
    name: 'Python',
    subtitle: 'CORE',
    theme: 'violet' as const,
    pos: { left: '13%', top: '58.4%' },
    delay: 0.4,
  },
  {
    name: 'MongoDB',
    subtitle: 'DATABASE',
    theme: 'cyan' as const,
    pos: { left: '87%', top: '58.4%' },
    delay: 0.5,
  },
  {
    name: 'PostgreSQL',
    subtitle: 'DATABASE',
    theme: 'blue' as const,
    pos: { left: '33.6%', top: '84.2%' },
    delay: 0.6,
  },
  {
    name: 'AI Models',
    subtitle: 'INTELLIGENCE',
    theme: 'magenta' as const,
    pos: { left: '66.4%', top: '84.2%' },
    delay: 0.7,
  },
]

// Glowing circuit lines using magenta, cyan, violet, and blue colors
const circuitLines = [
  // Core Connections (symmetric mathematically based on card positions)
  { id: 'java-line', d: 'M 250,160 L 250,84', color: '#FF007F', duration: 4.5 },
  { id: 'cpp-line', d: 'M 180,194 C 145,194 125,170 115,150', color: '#00E5FF', duration: 5 },
  { id: 'c-line', d: 'M 320,194 C 355,194 375,170 385,150', color: '#38BDF8', duration: 5.5 },
  { id: 'python-line', d: 'M 162,270 C 120,270 100,285 90,292', color: '#7C3AED', duration: 6 },
  { id: 'mongodb-line', d: 'M 338,270 C 380,270 400,285 410,292', color: '#00E5FF', duration: 4.8 },
  { id: 'postgresql-line', d: 'M 211,331 C 180,345 175,375 175,400', color: '#38BDF8', duration: 6.2 },
  { id: 'ai-line', d: 'M 289,331 C 320,345 325,375 325,400', color: '#FF007F', duration: 4.2 },

  // Secondary network connections flowing to the right (glowing neural trails aligned to right cards)
  { id: 'network-trail-1', d: 'M 385,150 C 420,150 440,160 470,160 C 500,160 510,180 550,180', color: '#00E5FF', duration: 8, delay: 0.5 },
  { id: 'network-trail-2', d: 'M 410,292 C 440,292 460,270 490,270 C 510,270 530,285 550,285', color: '#7C3AED', duration: 7, delay: 1.2 },
  { id: 'network-trail-3', d: 'M 325,400 C 370,400 400,380 440,380 C 480,380 500,390 550,390', color: '#FF007F', duration: 9, delay: 0 },
]

const consoleLines = [
  'SYSTEM: ACTIVE',
  'LINK: NEURAL_NET',
  'SYNC // JAVA',
  'SYNC // CPP',
  'SYNC // PYTHON',
  'PORT: 8080 // OK',
  'AI_MODEL // LOADED',
  'DB // REPLICATED',
  'INTEGRATION: 100%',
]

export default function FloatingCards({ profile }: Props) {
  const [consoleIndex, setConsoleIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [clientParticles, setClientParticles] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    const generated = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 1.5, // 1.5px to 4px
      x: Math.random() * 80 + 10, // keep inside center region
      y: Math.random() * 80 + 10,
      duration: Math.random() * 6 + 5, // 5s to 11s
      delay: Math.random() * 3,
      color: ['#00E5FF', '#FF007F', '#7C3AED', '#38BDF8'][i % 4],
    }))
    setClientParticles(generated)

    const interval = setInterval(() => {
      setConsoleIndex((prev) => (prev + 1) % consoleLines.length)
    }, 2800)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="relative w-full max-w-[520px] aspect-square flex items-center justify-center select-none z-10">
      
      {/* Soft glowing ambient backgrounds - set to low opacity to protect portrait clarity */}
      <div className="absolute top-1/4 left-1/4 w-[160px] h-[160px] rounded-full bg-violet-600/5 blur-[60px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[180px] h-[180px] rounded-full bg-cyan-600/5 blur-[70px] animate-pulse pointer-events-none" />
      
      {/* Floating Particle Lights for depth & elegance */}
      {mounted && clientParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none z-10"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: `${p.x}%`,
            top: `${p.y}%`,
            filter: 'blur(0.5px)',
            boxShadow: `0 0 8px ${p.color}`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 24 - 12, 0],
            opacity: [0.08, 0.45, 0.08],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}

      {/* Circuit lines rendering using SVG */}
      <svg
        viewBox="0 0 500 500"
        className="absolute w-full h-full pointer-events-none overflow-visible z-0"
      >
        <defs>
          {/* Jellyfish layered glow filter */}
          <filter id="jellyfish-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft layered gradients to achieve the organic jellyfish look */}
          <radialGradient id="jellyfish-radial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.15" />
            <stop offset="45%" stopColor="#7C3AED" stopOpacity="0.1" />
            <stop offset="85%" stopColor="#FF007F" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="jelly-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#FF007F" />
          </linearGradient>

          <linearGradient id="jelly-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF007F" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>

        {/* Central jellyfish body fill - soft glow, pulsating */}
        <motion.circle
          cx="250"
          cy="250"
          r="115"
          fill="url(#jellyfish-radial)"
          animate={{
            scale: [1, 1.06, 0.95, 1.03, 1],
            opacity: [0.7, 0.9, 0.6, 0.85, 0.7],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ originX: '250px', originY: '250px' }}
        />

        {/* Jellyfish inner bell - pulsating glow */}
        <motion.circle
          cx="250"
          cy="250"
          r="82"
          fill="none"
          stroke="url(#jelly-grad-1)"
          strokeWidth="1.5"
          filter="url(#jellyfish-glow-filter)"
          animate={{
            scale: [1, 1.05, 0.96, 1.03, 1],
            opacity: [0.55, 0.8, 0.45, 0.7, 0.55],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ originX: '250px', originY: '250px' }}
        />

        {/* Jellyfish middle ring - dashes and counter-rotation */}
        <motion.circle
          cx="250"
          cy="250"
          r="95"
          fill="none"
          stroke="url(#jelly-grad-2)"
          strokeWidth="1.2"
          strokeDasharray="25 15 5 15"
          filter="url(#jellyfish-glow-filter)"
          animate={{
            scale: [1, 0.96, 1.04, 0.98, 1],
            rotate: [360, 270, 180, 90, 0],
            opacity: [0.45, 0.7, 0.4, 0.6, 0.45],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ originX: '250px', originY: '250px' }}
        />

        {/* Jellyfish outer halo */}
        <motion.circle
          cx="250"
          cy="250"
          r="110"
          fill="none"
          stroke="url(#jelly-grad-1)"
          strokeWidth="0.8"
          strokeDasharray="10 20"
          animate={{
            scale: [1, 1.03, 0.97, 1.02, 1],
            rotate: [0, -360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ originX: '250px', originY: '250px' }}
          opacity="0.4"
        />

        {/* Static concentric circle helper rings */}
        <circle cx="250" cy="250" r="122" fill="none" stroke="rgba(56, 189, 248, 0.04)" strokeWidth="0.8" strokeDasharray="4 4" />
        <circle cx="250" cy="250" r="135" fill="none" stroke="rgba(255, 0, 127, 0.03)" strokeWidth="0.8" />

        {/* Base circuit lines (dormant tracks) */}
        {circuitLines.map((line) => (
          <path
            key={`base-${line.id}`}
            d={line.d}
            stroke={line.color}
            strokeWidth="1.2"
            fill="none"
            opacity="0.4"
          />
        ))}

        {/* Glowing active animated signal pulses */}
        {circuitLines.map((line) => (
          <motion.path
            key={`active-${line.id}`}
            d={line.d}
            stroke={line.color}
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="15 90"
            style={{
              filter: `drop-shadow(0 0 3px ${line.color}) drop-shadow(0 0 8px ${line.color})`,
            }}
            animate={{ strokeDashoffset: [0, -105] }}
            transition={{
              duration: line.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: line.delay || 0,
            }}
            opacity="0.95"
          />
        ))}
      </svg>

      {/* Faint matrix-style code console overlay in center - extremely transparent to keep face focal */}
      <div 
        className="absolute w-[150px] h-[150px] rounded-full overflow-hidden flex flex-col justify-center items-center text-[7px] font-mono text-[#00E5FF] leading-relaxed pointer-events-none select-none z-0"
        style={{
          maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
          WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
        }}
      >
        <div className="opacity-[0.06] text-center w-full flex flex-col gap-0.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={consoleIndex}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.6 }}
            >
              <div>{consoleLines[consoleIndex]}</div>
              <div className="text-[6.5px] text-[#FF007F]">
                {consoleLines[(consoleIndex + 1) % consoleLines.length]}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Centered System Integration Display text - transparent background to protect portrait face */}
      <div className="absolute text-center select-none pointer-events-none z-10 flex flex-col items-center justify-center w-[180px] h-[40px]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
          className="flex flex-row items-center font-display font-black text-[12px] md:text-[13px] tracking-wider text-slate-100 uppercase"
        >
          {Array.from("SYSTEM_INTEGRATION").map((char, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              style={{
                textShadow: '0 0 8px rgba(255,255,255,0.4)',
              }}
            >
              {char}
            </motion.span>
          ))}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'steps(2)' }}
            className="text-[#00E5FF] font-bold ml-1"
          >
            //
          </motion.span>
        </motion.div>
      </div>

      {/* Floating System Integration Cards - Glassmorphism, soft shadow & hover motion */}
      {cards.map((card, idx) => {
        const theme = colorThemes[card.theme]
        return (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: card.delay,
              type: 'spring',
              stiffness: 100,
            }}
            className="absolute z-20 group"
            style={{
              left: card.pos.left,
              top: card.pos.top,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Bobbing movement animation combined with smooth hover scaling */}
            <motion.div
              animate={{
                y: [0, idx % 2 === 0 ? -5 : 5, 0],
              }}
              transition={{
                duration: 5 + idx * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{
                scale: 1.05,
                y: idx % 2 === 0 ? -8 : 2,
                transition: { duration: 0.2 },
              }}
              className={`
                w-[110px] md:w-[130px] h-[48px] md:h-[52px]
                flex flex-col justify-center px-3 md:px-4
                bg-slate-950/30 backdrop-blur-md
                border rounded-xl transition-all duration-300 cursor-pointer
                ${theme.border} ${theme.glow}
              `}
            >
              {/* Card Title */}
              <div className={`font-sans font-extrabold text-xs md:text-sm tracking-wide ${theme.text}`}>
                {card.name}
              </div>
              
              {/* Card Subtitle - styled in all-small-caps */}
              <div 
                className={`font-mono text-[8px] md:text-[9px] tracking-widest font-bold ${theme.subtitle}`}
                style={{ fontVariant: 'all-small-caps' }}
              >
                {card.subtitle}
              </div>

              {/* Glowing micro pulse light dot inside each card */}
              <div className="absolute top-2 right-2 flex items-center justify-center">
                <span className={`w-1 h-1 rounded-full ${theme.pulse} opacity-70`} />
                <span className={`absolute w-2 h-2 rounded-full ${theme.pulse} opacity-30 animate-ping`} />
              </div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}