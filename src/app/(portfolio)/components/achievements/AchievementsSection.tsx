'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, ArrowUpRight } from 'lucide-react'
import SectionWrapper from '../shared/SectionWrapper'
import EmptyState from '../shared/EmptyState'
import { Achievement, AchievementCategory, AchievementSettings } from '@/types'

interface Props {
  achievements: Achievement[]
  categories: AchievementCategory[]
  settings: AchievementSettings
}

export default function AchievementsSection({ achievements, categories, settings }: Props) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedCategory(prev => prev === id ? null : id)
  }

  // Enforce animations visibility parameter
  const anims = settings.animationsEnabled !== false

  // Filter out soft deleted items
  const activeAchievements = (achievements || []).filter(a => a.deletedAt === null)
  const activeCategories = (categories || []).filter(c => c.active && c.deletedAt === null)

  // Pre-calculate achievements per category
  const categoriesWithAchievements = activeCategories
    .map(cat => {
      const catAchs = activeAchievements.filter(a => {
        const catId = typeof a.category === 'string' ? a.category : a.category?._id
        return catId === cat._id && a.showInCategory
      })
      
      // Calculate latest date
      let latestYear = '—'
      if (catAchs.length > 0) {
        const years = catAchs.map(a => a.year).filter(Boolean)
        if (years.length > 0) {
          latestYear = [...years].sort((a, b) => b.localeCompare(a))[0]
        }
      }

      return {
        ...cat,
        achievements: catAchs,
        latestYear,
      }
    })
    .filter(cat => cat.achievements.length > 0)

  // Overall Section Visibility Checks
  const hasNoContent = categoriesWithAchievements.length === 0

  if (hasNoContent) {
    return (
      <SectionWrapper id="achievements" title={settings.title || "Achievements & Awards"} subtitle={settings.subtitle || "Recognitions, competitions, memberships, and engineering milestones."}>
        <EmptyState 
          title="No achievements available yet." 
          description="Check back soon for new milestones and accomplishments." 
          icon={Trophy}
          animationsEnabled={anims}
        />
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper
      id="achievements"
      title={settings.title || "Achievements & Awards"}
      subtitle={settings.subtitle || "Recognitions, competitions, memberships, and engineering milestones."}
      accentColor="pink"
    >
      <div className="space-y-6">
        {settings.showCategoryGrid && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoriesWithAchievements.map((cat) => {
                const isExpanded = expandedCategory === cat._id
                const catColor = cat.color || '#00E5FF'

                return (
                  <motion.div
                    key={cat._id}
                    initial={anims ? { opacity: 0, y: 20 } : false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5 }}
                    className={`glass-card rounded-3xl bg-[#0A1020]/70 border backdrop-blur-xl transition-all duration-500 overflow-hidden flex flex-col justify-between relative group ${
                      isExpanded 
                        ? 'lg:col-span-3 md:col-span-2 border-cyan-400/35 shadow-[0_0_35px_rgba(0,229,255,0.1)] p-6 md:p-8' 
                        : 'border-cyan-500/10 p-6 md:p-6 hover:translate-y-[-8px] hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)]'
                    }`}
                  >
                    <div>
                      {/* Cover Image banner */}
                      {cat.coverImage && (
                        <div className={`w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-900 shrink-0 mb-4 transition-all duration-500 ${
                          isExpanded ? 'h-36' : 'h-24'
                        }`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={cat.coverImage} alt={cat.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}

                      {/* Top layout info */}
                      <div className="flex gap-4 items-start mb-4">
                        <div 
                          className="w-10 h-10 rounded-xl bg-slate-900 border flex items-center justify-center text-lg shrink-0 mt-0.5"
                          style={{ borderColor: `${catColor}33` }}
                        >
                          {cat.icon || '🏆'}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-base text-white uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
                            {cat.name}
                          </h4>
                          {cat.description && (
                            <p className="text-xs text-slate-400 font-sans mt-0.5 line-clamp-2 leading-relaxed">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Category stats panel */}
                      <div className="grid grid-cols-2 gap-4 border-y border-slate-900 py-3 mb-4 font-mono text-[9px] uppercase text-slate-500 tracking-wider">
                        <div className="space-y-0.5">
                          <span className="block text-[8px] text-slate-500 font-mono">Count</span>
                          <span className="text-xs font-bold text-slate-200">{cat.achievements.length} Achievements</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="block text-[8px] text-slate-500 font-mono">Latest</span>
                          <span className="text-xs font-bold text-cyan-400">{cat.latestYear}</span>
                        </div>
                      </div>

                      {/* Top 3 list preview (hidden if expanded) */}
                      {!isExpanded && (
                        <div className="space-y-2 mb-4 py-1">
                          {cat.achievements.slice(0, 3).map((item) => (
                            <div key={item._id} className="flex items-center gap-2 text-xs font-mono text-slate-400">
                              <span className="text-[10px] text-cyan-500">✓</span>
                              <span className="truncate flex-1">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Expandable inline view content (Framer motion animation) */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden mt-2 pt-4 border-t border-slate-900"
                        >
                          <h5 className="font-mono text-[9px] uppercase tracking-wider text-slate-500 mb-4">Complete achievements index:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cat.achievements.map((item) => (
                              <div key={item._id} className="glass-card rounded-2xl bg-slate-950/40 border border-slate-900 p-4 space-y-3 flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shrink-0">
                                  {item.icon || '🏆'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-1">
                                    <div>
                                      <h6 className="font-bold text-xs text-white leading-tight">{item.title}</h6>
                                      <span className="text-[9px] text-slate-400 font-mono">{item.organization}</span>
                                    </div>
                                    <span className="font-mono text-[9px] text-slate-500 shrink-0">{item.date}</span>
                                  </div>
                                  
                                  {item.description && (
                                    <p className="text-[11px] text-slate-400 mt-1.5 font-sans leading-relaxed">{item.description}</p>
                                  )}

                                  {/* Metrics highlight block */}
                                  {item.metricValue && (
                                    <div className="inline-flex items-center gap-1.5 bg-cyan-500/5 border border-cyan-500/20 px-2 py-1 rounded-xl text-[9px] font-mono mt-2">
                                      <span className="font-bold text-[#00E5FF]">{item.metricValue}</span>
                                      <span className="text-slate-500 text-[8px] uppercase">{item.metricLabel}</span>
                                    </div>
                                  )}

                                  {/* Tags chips */}
                                  {item.tags && item.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {item.tags.map(t => (
                                        <span key={t} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 font-mono text-[8px] uppercase tracking-wider">
                                          #{t}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {item.achievementUrl && (
                                    <div className="pt-2">
                                      <a 
                                        href={item.achievementUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-1 text-[9px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors uppercase"
                                      >
                                        View Info
                                        <ArrowUpRight className="w-3 h-3" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* View All / Collapse toggle button */}
                    <div className="pt-4 border-t border-slate-950/20 mt-2 flex justify-end shrink-0">
                      <button
                        onClick={() => toggleExpand(cat._id!)}
                        className="font-mono text-[10px] uppercase font-bold text-cyan-400 hover:text-cyan-300 tracking-wider flex items-center gap-1 hover:scale-105 transition-all"
                      >
                        <span>{isExpanded ? 'Collapse List ↑' : 'View All →'}</span>
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
