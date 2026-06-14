'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis } from 'recharts'
import SectionWrapper from '../shared/SectionWrapper'
import { Skill, SkillCategory } from '@/types'

interface Props {
  skills: Skill[]
}

// Production-safe explicit mapped labels
const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  devops: 'DevOps',
  ai_ml: 'AI / ML',
  ai_models: 'AI / ML', // Handled fallback key variations
  tools: 'Tools',
  languages: 'Languages',
  mobile: 'Mobile',
  other: 'Other',
}

// Fallback background theme colors mapping object
const categoryColors: Record<string, string> = {
  frontend: '#00E5FF',
  backend: '#7C3AED',
  database: '#FF4FD8',
  devops: '#10B981',
  ai_ml: '#F59E0B',
  ai_models: '#F59E0B',
  tools: '#6366F1',
  languages: '#EC4899',
  mobile: '#14B8A6',
  other: '#94A3B8',
}

export default function SkillsSection({ skills }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const [containerWidth, setContainerWidth] = useState<number | string>('100%')
  const categories = [...new Set(skills.map(s => s.category))] as SkillCategory[]
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all')

  useEffect(() => {
    setIsMounted(true)
    
    // Set a solid numeric baseline immediately on mount to prevent Recharts layout loops
    if (typeof window !== 'undefined') {
      setContainerWidth(window.innerWidth < 768 ? 280 : 340)
    }
  }, [])

  const filtered = activeCategory === 'all'
    ? skills
    : skills.filter(s => s.category === activeCategory)

  // Radar data compilation: Added critical fallback mapping checks to completely avoid ReferenceErrors
  const radarData = categories.map(cat => {
    const rawCategoryKey = String(cat).toLowerCase();
    const cleanLabel = categoryLabels[rawCategoryKey] || String(cat).toUpperCase().replace('_', ' ');
    
    return {
      category: cleanLabel,
      value: Math.round(
        skills.filter(s => s.category === cat).reduce((sum, s) => sum + s.level, 0) /
        (skills.filter(s => s.category === cat).length || 1)
      ),
    }
  })

  if (!skills.length) {
    return (
      <SectionWrapper id="skills" title="Tech Stack">
        <p className="text-center text-slate-500">Skills will appear here once added.</p>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper
      id="skills"
      title="Tech Stack"
      subtitle="Technologies I work with to build scalable, intelligent applications"
      accentColor="violet"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Layout Pane: Radar chart node */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
            <h3 className="text-sm font-mono text-slate-400 mb-4 uppercase tracking-wider">
              Skills Radar
            </h3>
            
            <div style={{ width: '100%', height: 280, minWidth: 280 }} className="relative flex items-center justify-center">
              {isMounted ? (
                <ResponsiveContainer width={containerWidth} height={280}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid
                      stroke="rgba(0,229,255,0.1)"
                      radialLines={false}
                    />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'var(--font-orbitron, sans-serif)' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="#00E5FF"
                      fill="#00E5FF"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-[280px] bg-slate-900/40 border border-cyan-500/5 animate-pulse rounded-xl flex items-center justify-center">
                  <span className="text-cyan-400/40 font-mono text-xs tracking-widest">LOADING RADAR CONFIG...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Layout Pane: Dynamic grid maps */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Action category filter node tab line items */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 border border-slate-700 hover:border-slate-500'
              }`}
            >
              All
            </button>
            {categories.map(cat => {
              const themeColor = categoryColors[String(cat).toLowerCase()] || '#00E5FF';
              const label = categoryLabels[String(cat).toLowerCase()] || String(cat);
              
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? 'border'
                      : 'text-slate-400 border border-slate-700 hover:border-slate-500'
                  }`}
                  style={
                    activeCategory === cat
                      ? { color: themeColor, borderColor: themeColor, background: `${themeColor}15` }
                      : {}
                  }
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Render target metrics loops */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((skill, i) => {
              const currentThemeColor = categoryColors[String(skill.category).toLowerCase()] || '#00E5FF';
              
              return (
                <motion.div
                  key={skill._id ?? skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl p-4 group hover:scale-[1.02] transition-transform duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-200">{skill.name}</span>
                    <span
                      className="text-xs font-mono"
                      style={{ color: currentThemeColor }}
                    >
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.03 }}
                      viewport={{ once: true }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${currentThemeColor}, ${currentThemeColor}99)`,
                        boxShadow: `0 0 8px ${currentThemeColor}40`,
                      }}
                    />
                  </div>
                  {skill.yearsOfExperience && (
                    <p className="text-xs text-slate-500 mt-1">{skill.yearsOfExperience}y exp</p>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}