'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionWrapper from '../shared/SectionWrapper'
import { Profile } from '@/types'

interface Props {
  profile: Profile | null
}

export default function AboutSection({ profile }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

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
      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Bio, Career Goals, Learning Journey */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
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
          animate={inView ? 'visible' : 'hidden'}
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

          {profile.yearsOfExperience && (
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
    </SectionWrapper>
  )
}
