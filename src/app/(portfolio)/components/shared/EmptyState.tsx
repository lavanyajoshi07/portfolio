'use client'

import { motion } from 'framer-motion'
import { AlertCircle, LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: LucideIcon
  animationsEnabled?: boolean
}

export default function EmptyState({
  title,
  description,
  icon: Icon = AlertCircle,
  animationsEnabled = true,
}: EmptyStateProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.03, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const content = (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-[#0A1020]/45 border border-cyan-550/15 backdrop-blur-xl relative overflow-hidden group min-h-[220px]">
      {/* Ambient Grid overlay backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00E5FF08_1px,transparent_1px),linear-gradient(to_bottom,#00E5FF08_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

      {/* Cyberpunk accent corner highlights */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/30 rounded-tl" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/30 rounded-br" />

      {/* Pulsing ambient glowing ring behind icon */}
      <div className="relative mb-4 flex items-center justify-center">
        {animationsEnabled ? (
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className="absolute w-12 h-12 rounded-full bg-cyan-500/10 blur-md pointer-events-none"
          />
        ) : (
          <div className="absolute w-12 h-12 rounded-full bg-cyan-500/10 blur-md pointer-events-none" />
        )}
        <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-center justify-center relative z-10">
          <Icon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
        </div>
      </div>

      <h4 className="font-display font-bold text-sm tracking-wider text-slate-200 uppercase mb-1.5 relative z-10">
        {title}
      </h4>
      <p className="text-xs text-slate-500 font-mono uppercase tracking-wide max-w-xs relative z-10 leading-relaxed">
        {description}
      </p>
    </div>
  )

  if (animationsEnabled) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="w-full"
      >
        {content}
      </motion.div>
    )
  }

  return <div className="w-full">{content}</div>
}
