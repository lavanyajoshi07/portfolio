'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

import SectionHeader from './SectionHeader'

interface Props {
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  accentColor?: 'cyan' | 'pink' | 'violet'
}

export default function SectionWrapper({
  id,
  title,
  subtitle,
  children,
  className = '',
  accentColor = 'cyan',
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [hasMounted, setHasMounted] = useState(false)

  // Avoid layout recalculation mismatches between server pass and initial client hydration
  useEffect(() => {
    setHasMounted(true)
  }, [])

  const colors = {
    cyan: { text: 'text-cyan-DEFAULT', line: 'bg-cyan-DEFAULT', glow: 'from-cyan-DEFAULT/20' },
    pink: { text: 'text-pink-DEFAULT', line: 'bg-pink-DEFAULT', glow: 'from-pink-DEFAULT/20' },
    violet: { text: 'text-violet-DEFAULT', line: 'bg-violet-DEFAULT', glow: 'from-violet-DEFAULT/20' },
  }

  const c = colors[accentColor]

  return (
    <section
      id={id}
      ref={ref}
      className={`relative py-24 px-6 lg:px-8 overflow-hidden ${className}`}
    >
      {/* Ambient glow at section top */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b ${c.glow} to-transparent`} />

      <div className="max-w-[1280px] mx-auto">
        {/* Unified Section Header */}
        <SectionHeader id={id} title={title} subtitle={subtitle} accentColor={accentColor} />

        {/* Section content container 
            CRITICAL FIX: Adding 'min-w-0' prevents flex/grid calculations from breaking child Recharts math paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full min-w-0 relative"
        >
          {hasMounted && children}
        </motion.div>
      </div>
    </section>
  )
}