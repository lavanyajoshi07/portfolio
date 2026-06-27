'use client'

import { useRef, memo } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
  label: string
  value: string | number
  platformSource?: string
}

function StatsCard({ label, value, platformSource }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="glass-card rounded-3xl p-5 bg-[#0A1020]/70 border border-cyan-500/10 backdrop-blur-xl hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] transition-all duration-300 flex flex-col justify-between h-[140px]"
    >
      <p className="text-xs uppercase tracking-widest text-slate-400 font-mono">
        {label}
      </p>

      <div className="text-5xl font-bold text-white tracking-tight leading-none my-1">
        {value}
      </div>

      {platformSource ? (
        <p className="text-[10px] text-slate-500 font-mono tracking-wide uppercase select-none">
          {platformSource}
        </p>
      ) : (
        <div className="h-3" />
      )}
    </motion.div>
  )
}

export default memo(StatsCard)