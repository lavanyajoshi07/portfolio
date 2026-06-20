'use client'

import { motion } from 'framer-motion'
import { Users, Globe, ExternalLink, Award, Code, Presentation, Calendar } from 'lucide-react'
import SectionWrapper from '../shared/SectionWrapper'
import { CommunityItem } from '@/types'

interface Props {
  items: CommunityItem[]
}

const categoryIcons: Record<string, any> = {
  hackathon: Award,
  open_source: Code,
  workshop: Presentation,
  event: Users,
  other: Globe,
}

const categoryColors: Record<string, string> = {
  hackathon: 'text-pink-400 bg-pink-950/20 border-pink-900/30',
  open_source: 'text-cyan-400 bg-cyan-950/20 border-cyan-900/30',
  workshop: 'text-violet-400 bg-violet-950/20 border-violet-900/30',
  event: 'text-emerald-400 bg-emerald-950/20 border-emerald-900/30',
  other: 'text-slate-400 bg-slate-950/20 border-slate-900/30',
}

export default function CommunitySection({ items }: Props) {
  const activeItems = items
    .filter((item) => item.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  if (!activeItems.length) return null

  return (
    <SectionWrapper
      id="community"
      title="Community & Hackathons"
      subtitle="Contributions, events, and developer engagement initiatives I partake in"
      accentColor="pink"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1280px] mx-auto">
        {activeItems.map((item, i) => {
          const IconComponent = categoryIcons[item.category] || Globe
          const colorClasses = categoryColors[item.category] || categoryColors.other

          return (
            <motion.div
              key={item._id || i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -8 }}
              className="glass-card rounded-3xl p-5 border border-cyan-500/10 flex flex-col hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] transition-all duration-300 bg-[#0A1020]/70 group"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${colorClasses}`}>
                  {item.category.replace('_', ' ')}
                </span>
                
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-pink-400 transition-colors p-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex gap-3 items-start mb-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500/5 border border-pink-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <IconComponent className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 font-display group-hover:text-white transition-colors">
                    {item.title}
                  </h4>
                  {item.date && (
                    <div className="flex items-center gap-1 font-mono text-[9px] text-slate-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.date}</span>
                    </div>
                  )}
                </div>
              </div>

              {item.description && (
                <p className="text-xs text-slate-400 leading-relaxed mt-2 font-sans flex-1">
                  {item.description}
                </p>
              )}
            </motion.div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
