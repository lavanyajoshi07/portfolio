'use client'

import { motion } from 'framer-motion'
import { Target, CheckCircle2, Circle } from 'lucide-react'
import SectionWrapper from '../shared/SectionWrapper'
import { FutureGoal } from '@/types'

interface Props {
  goals: FutureGoal[]
}

export default function FutureGoalsSection({ goals }: Props) {
  const activeGoals = goals
    .filter((g) => g.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  if (!activeGoals.length) return null

  return (
    <SectionWrapper
      id="future-goals"
      title="Upcoming Milestones"
      subtitle="Roadmap of my targets, certifications, and technical concepts I am working towards next"
      accentColor="cyan"
    >
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeGoals.map((goal, i) => (
          <motion.div
            key={goal._id || i}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            whileHover={{ y: -8 }}
            className={`glass-card rounded-3xl p-4 border flex items-start gap-3 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] transition-all duration-300 ${
              goal.completed 
                ? 'border-emerald-500/10 bg-emerald-950/20' 
                : 'border-cyan-500/10 bg-[#0A1020]/70'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {goal.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Circle className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <div className="space-y-1">
              <span className={`block text-sm font-medium ${
                goal.completed ? 'text-slate-400 line-through' : 'text-slate-200'
              }`}>
                {goal.text}
              </span>
              {goal.category && (
                <span className="inline-block font-mono text-[8px] uppercase tracking-wider text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/30">
                  {goal.category}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
