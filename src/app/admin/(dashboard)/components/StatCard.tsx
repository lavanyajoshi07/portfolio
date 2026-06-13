'use client'

import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  color?: 'cyan' | 'pink' | 'violet'
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  color = 'cyan',
}: StatCardProps) {
  const colorMap = {
    cyan: {
      border: 'border-[#00E5FF]/20 hover:border-[#00E5FF]/50',
      iconBg: 'bg-[#00E5FF]/10 text-[#00E5FF]',
      shadow: 'hover:shadow-[#00E5FF]/5',
      glow: 'bg-[#00E5FF]',
    },
    pink: {
      border: 'border-[#FF4FD8]/20 hover:border-[#FF4FD8]/50',
      iconBg: 'bg-[#FF4FD8]/10 text-[#FF4FD8]',
      shadow: 'hover:shadow-[#FF4FD8]/5',
      glow: 'bg-[#FF4FD8]',
    },
    violet: {
      border: 'border-[#7C3AED]/20 hover:border-[#7C3AED]/50',
      iconBg: 'bg-[#7C3AED]/10 text-[#7C3AED]',
      shadow: 'hover:shadow-[#7C3AED]/5',
      glow: 'bg-[#7C3AED]',
    },
  }

  const selectedColor = colorMap[color]

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`glass-card bg-[#0A1020]/60 backdrop-blur-md rounded-xl p-6 border ${selectedColor.border} transition-all duration-300 relative overflow-hidden group shadow-lg ${selectedColor.shadow}`}
    >
      {/* Decorative corner glow */}
      <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-10 blur-xl transition-all duration-500 group-hover:opacity-20 ${selectedColor.glow}`} />

      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-mono text-xs text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-display font-bold text-white tracking-wide">
            {value}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${selectedColor.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {description && (
        <p className="font-mono text-[10px] text-slate-500 mt-4 uppercase tracking-wider">
          {description}
        </p>
      )}
    </motion.div>
  )
}
