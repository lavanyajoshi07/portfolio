'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
  label: string
  value: number
  icon: string
  color?: 'cyan' | 'pink' | 'violet'
}

export default function StatsCard({ label, value, icon, color = 'cyan' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  const colorMap = {
    cyan: 'text-cyan-DEFAULT',
    pink: 'text-pink-DEFAULT',
    violet: 'text-violet-DEFAULT',
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6 group hover:border-cyan-DEFAULT/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-slate-400 font-mono uppercase tracking-wider">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>

      <div className="flex items-baseline gap-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className={`text-4xl font-bold font-display ${colorMap[color]}`}
        >
          {value > 999 ? `${(value / 1000).toFixed(1)}k` : value}
        </motion.div>
        {value > 999 && (
          <span className={`text-lg font-display ${colorMap[color]}`}>+</span>
        )}
      </div>

      {/* Animated bar */}
      <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: '100%' } : {}}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          className={`h-full rounded-full bg-gradient-to-r ${
            color === 'cyan' ? 'from-cyan-DEFAULT to-cyan-DEFAULT/40' :
            color === 'pink' ? 'from-pink-DEFAULT to-pink-DEFAULT/40' :
            'from-violet-DEFAULT to-violet-DEFAULT/40'
          }`}
          style={{
            boxShadow: color === 'cyan' ? '0 0 10px rgba(0,229,255,0.5)' :
                       color === 'pink' ? '0 0 10px rgba(255,79,216,0.5)' :
                       '0 0 10px rgba(124,58,237,0.5)',
          }}
        />
      </div>
    </motion.div>
  )
}