'use client'

import { motion } from 'framer-motion'

interface SectionHeaderProps {
  id: string
  title: string
  subtitle?: string
  accentColor?: 'cyan' | 'pink' | 'violet'
}

export default function SectionHeader({
  id,
  title,
  subtitle,
  accentColor = 'cyan',
}: SectionHeaderProps) {
  const colors = {
    cyan: { text: 'text-cyan-400', line: 'bg-cyan-400', glow: 'from-cyan-400/20' },
    pink: { text: 'text-pink-400', line: 'bg-pink-400', glow: 'from-pink-400/20' },
    violet: { text: 'text-violet-400', line: 'bg-violet-400', glow: 'from-violet-400/20' },
  }

  const c = colors[accentColor]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="mb-16 flex flex-col items-center text-center"
    >
      <div className="flex items-center gap-4 mb-4 select-none">
        <div className={`h-px w-12 ${c.line} opacity-30`} />
        <span className={`font-mono text-xs tracking-widest uppercase ${c.text}`}>
          {id.replace('-', '_')}.section
        </span>
        <div className={`h-px w-12 ${c.line} opacity-30`} />
      </div>

      <h2 className="section-heading text-white font-bold uppercase tracking-wide">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-slate-300 max-w-2xl text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
