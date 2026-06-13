'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface Props {
  language: string
  percentage: number
  color: string
}

export default function LanguageBar({ language, percentage, color }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-200">{language}</span>
        <span className="text-xs text-slate-500 font-mono">{percentage}%</span>
      </div>

      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${percentage}%` } : {}}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
          className="h-full rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
      </div>
    </motion.div>
  )
}