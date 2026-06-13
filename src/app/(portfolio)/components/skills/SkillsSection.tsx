'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import SectionWrapper from '../shared/SectionWrapper'
import { Skill, SkillCategory } from '@/types'

interface Props {
  skills: Skill[]
}

const categoryLabels: Record<SkillCategory, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  devops: 'DevOps',
  ai_ml: 'AI / ML',
  tools: 'Tools',
  languages: 'Languages',
  mobile: 'Mobile',
  other: 'Other',
}

const categoryColors: Record<SkillCategory, string> = {
  frontend: '#00E5FF',
  backend: '#7C3AED',
  database: '#FF4FD8',
  devops: '#10B981',
  ai_ml: '#F59E0B',
  tools: '#6366F1',
  languages: '#EC4899',
  mobile: '#14B8A6',
  other: '#94A3B8',
}

export default function SkillsSection({ skills }: Props) {
  const categories = [...new Set(skills.map(s => s.category))] as SkillCategory[]
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all')

  const filtered = activeCategory === 'all'
    ? skills
    : skills.filter(s => s.category === activeCategory)

  // Radar data: avg level per category
  const radarData = categories.map(cat => ({
    category: categoryLabels[cat],
    value: Math.round(
      skills.filter(s => s.category === cat).reduce((sum, s) => sum + s.level, 0) /
      (skills.filter(s => s.category === cat).length || 1)
    ),
  }))

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
        {/* Left: Radar chart */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
            <h3 className="text-sm font-mono text-slate-400 mb-4 uppercase tracking-wider">
              Skills Radar
            </h3>
            <div className="flex-1 min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid
                    stroke="rgba(0,229,255,0.1)"
                    radialLines={false}
                  />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'Inter' }}
                  />
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
            </div>
          </div>
        </div>

        {/* Right: Skills list */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'bg-cyan-DEFAULT/20 text-cyan-DEFAULT border border-cyan-DEFAULT/30'
                  : 'text-slate-400 border border-slate-700 hover:border-slate-500'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
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
                    ? { color: categoryColors[cat], borderColor: categoryColors[cat], background: `${categoryColors[cat]}15` }
                    : {}
                }
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* Skills cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((skill, i) => (
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
                    style={{ color: categoryColors[skill.category] }}
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
                      background: `linear-gradient(90deg, ${categoryColors[skill.category]}, ${categoryColors[skill.category]}99)`,
                      boxShadow: `0 0 8px ${categoryColors[skill.category]}40`,
                    }}
                  />
                </div>
                {skill.yearsOfExperience && (
                  <p className="text-xs text-slate-500 mt-1">{skill.yearsOfExperience}y exp</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}