'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionWrapper from '../shared/SectionWrapper'
import { Profile } from '@/types'

interface Props {
  profile: Profile | null
}

export default function AboutSection({ profile }: Props) {
  const [showResume, setShowResume] = useState(false)

  if (!profile) {
    return (
      <SectionWrapper id="about" title="About Me">
        <p className="text-center text-slate-500">
          Profile information not available yet.
        </p>
      </SectionWrapper>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <SectionWrapper
      id="about"
      title="About Me"
      subtitle="My journey, education, and what drives my passion"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Bio, Career Goals, Learning Journey */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="space-y-6"
        >
          {profile.bio && (
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-mono text-cyan-DEFAULT mb-3 uppercase tracking-wider">
                Who I Am
              </h3>
              <div 
                className="text-slate-300 leading-relaxed text-lg prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: profile.bio }}
              />
            </motion.div>
          )}

          {profile.careerGoals && (
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-mono text-violet-DEFAULT mb-3 uppercase tracking-wider">
                Career Goals
              </h3>
              <div 
                className="text-slate-300 leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: profile.careerGoals }}
              />
            </motion.div>
          )}

          {profile.learningJourney && (
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-mono text-pink-DEFAULT mb-3 uppercase tracking-wider">
                Learning Journey
              </h3>
              <div 
                className="text-slate-300 leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: profile.learningJourney }}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Right: Education Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="space-y-4"
        >
          <h3 className="text-sm font-mono text-cyan-DEFAULT mb-6 uppercase tracking-wider">
            Education
          </h3>

          {profile.education?.length > 0 ? (
            profile.education.map((edu, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-card rounded-2xl p-6 relative pl-8 border-l-2 border-cyan-DEFAULT/30 hover:border-cyan-DEFAULT/60 transition-all duration-300"
              >
                <div className="absolute -left-2 top-8 w-3 h-3 rounded-full bg-cyan-DEFAULT border-2 border-bg-primary shadow-lg shadow-cyan-DEFAULT/50" />

                <div className="mb-2">
                  <h4 className="font-semibold text-slate-100">
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </h4>
                  <p className="text-sm text-cyan-DEFAULT/80 font-mono">{edu.institution}</p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                  <span>
                    {edu.startYear}
                    {edu.endYear ? ` — ${edu.endYear}` : edu.current ? ' — Present' : ''}
                  </span>
                  {edu.gpa && <span className="text-violet-DEFAULT">GPA: {edu.gpa}</span>}
                </div>

                {edu.description && (
                  <p className="text-sm text-slate-300 leading-relaxed">{edu.description}</p>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">Education information not added yet.</p>
          )}

          {profile.yearsOfExperience != null && (
            <motion.div
              variants={itemVariants}
              className="glass-card rounded-2xl p-6 mt-6 bg-gradient-to-br from-violet-DEFAULT/10 to-pink-DEFAULT/10 border-violet-DEFAULT/20"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl font-display gradient-text-pink">
                  {profile.yearsOfExperience}+
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Years of Experience</p>
                  <p className="text-xs text-slate-400">Continuously learning & growing</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Sleek full-width Resume Reader block with toggle button */}
      <div className="mt-16 flex flex-col items-center justify-center gap-6">
        <div className="flex flex-wrap gap-5 items-center justify-center">
          {/* View Resume Button (Blue Gradient Border / Background) */}
          <button
            onClick={() => setShowResume(!showResume)}
            className="relative p-[1.5px] rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500" />
            <span className={`relative block px-6 py-2.5 rounded-[10px] font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              showResume
                ? 'bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-slate-950 text-blue-400 group-hover:text-cyan-300'
            }`}>
              {showResume ? 'Hide Resume' : 'View Resume'}
            </span>
          </button>

          {/* View in Full Tab Button (Purple Gradient Border) */}
          <a
            href="/resume.html"
            target="_blank"
            rel="noopener noreferrer"
            className="relative p-[1.5px] rounded-xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-400 to-purple-500" />
            <span className="relative block px-6 py-2.5 rounded-[10px] bg-slate-950 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 group-hover:text-pink-300">
              View in Full Tab
            </span>
          </a>
        </div>

        {/* Embedded styled iframe inside a light background container for original styling */}
        <AnimatePresence>
          {showResume && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '550px' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full relative rounded-xl border border-slate-300 bg-white overflow-hidden shadow-2xl flex flex-col"
            >
              <iframe 
                src="/resume.html" 
                className="w-full h-full border-none"
                title="Resume Document Viewer"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  )
}
