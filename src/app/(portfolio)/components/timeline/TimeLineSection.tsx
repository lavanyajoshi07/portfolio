'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionWrapper from '../shared/SectionWrapper'
import { TimelineItem } from '@/types'

interface Props {
  items: TimelineItem[]
}

const timelineIcons: Record<string, string> = {
  education: '🎓',
  project: '🚀',
  achievement: '⭐',
  milestone: '📍',
  work: '💼',
}

const timelineColors: Record<string, { dot: string; line: string; bg: string }> = {
  education: { dot: 'bg-cyan-DEFAULT', line: 'from-cyan-DEFAULT/30', bg: 'from-cyan-DEFAULT/10' },
  project: { dot: 'bg-pink-DEFAULT', line: 'from-pink-DEFAULT/30', bg: 'from-pink-DEFAULT/10' },
  achievement: { dot: 'bg-violet-DEFAULT', line: 'from-violet-DEFAULT/30', bg: 'from-violet-DEFAULT/10' },
  milestone: { dot: 'bg-emerald-400', line: 'from-emerald-400/30', bg: 'from-emerald-400/10' },
  work: { dot: 'bg-amber-400', line: 'from-amber-400/30', bg: 'from-amber-400/10' },
}

export default function TimelineSection({ items }: Props) {
  if (!items.length) {
    return (
      <SectionWrapper id="timeline" title="Timeline">
        <p className="text-center text-slate-500">
          Timeline events will appear here once added.
        </p>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper
      id="timeline"
      title="Career Journey"
      subtitle="My learning path and milestones over time"
      accentColor="cyan"
    >
      <div className="relative">
        {/* Vertical line background */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 md:w-1 bg-gradient-to-b from-cyan-DEFAULT/30 via-violet-DEFAULT/30 to-pink-DEFAULT/30 md:-translate-x-1/2" />

        {/* Timeline items */}
        <div className="space-y-8 md:space-y-12">
          {items.map((item, index) => (
            <TimelineItemCard key={item._id} item={item} index={index} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

function TimelineItemCard({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const colors = timelineColors[item.type] || timelineColors.milestone
  const icon = timelineIcons[item.type] || '📌'

  const isLeft = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative flex items-center ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8`}
    >
      {/* Content Card */}
      <div className={`w-full md:w-[calc(50%-2rem)] flex ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
        <motion.div
          whileHover={{ y: -4 }}
          className={`glass-card rounded-2xl p-6 w-full max-w-md border border-cyan-DEFAULT/10 hover:border-cyan-DEFAULT/30 transition-all duration-300 bg-gradient-to-br ${colors.bg} to-transparent`}
        >
          {/* Type badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${colors.dot}/20 text-slate-300 capitalize`}>
            <span className="text-sm">{icon}</span>
            {item.type.replace('_', ' ')}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            {item.title}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-slate-300 mb-3 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {item.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-xs bg-slate-800/50 text-slate-300 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Date and actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
            {item.date && (
              <span className="text-xs text-slate-500 font-mono">{item.date}</span>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-DEFAULT hover:text-cyan-DEFAULT/80 transition-colors font-semibold"
              >
                Learn more →
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
        className="absolute left-0 md:left-1/2 w-6 h-6 md:w-8 md:h-8 md:-translate-x-1/2 z-10 flex items-center justify-center"
      >
        <div
          className={`absolute w-full h-full ${colors.dot} rounded-full shadow-lg`}
          style={{
            boxShadow: `0 0 20px ${
              colors.dot === 'bg-cyan-DEFAULT'
                ? 'rgba(0,229,255,0.5)'
                : colors.dot === 'bg-pink-DEFAULT'
                ? 'rgba(255,79,216,0.5)'
                : colors.dot === 'bg-violet-DEFAULT'
                ? 'rgba(124,58,237,0.5)'
                : 'rgba(16,185,129,0.5)'
            }`,
          }}
        />
        <div className="w-3 h-3 md:w-4 md:h-4 bg-bg-primary rounded-full border-2 border-cyan-DEFAULT/50" />
      </motion.div>
    </motion.div>
  )
}
