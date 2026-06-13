'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionWrapper from '../shared/SectionWrapper'
import { Achievement } from '@/types'

interface Props {
  achievements: Achievement[]
}

const achievementIcons: Record<string, string> = {
  hackathon: '🏆',
  competition: '🥇',
  leadership: '👑',
  academic: '🎓',
  award: '⭐',
  other: '🌟',
}

export default function AchievementsSection({ achievements }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  if (!achievements.length) {
    return (
      <SectionWrapper id="achievements" title="Achievements">
        <p className="text-center text-slate-500">Achievements will appear here once added.</p>
      </SectionWrapper>
    )
  }

  const featured = achievements.filter(a => a.featured)
  const rest = achievements.filter(a => !a.featured)

  return (
    <SectionWrapper
      id="achievements"
      title="Achievements & Awards"
      subtitle="Recognitions, competitions, and milestones"
      accentColor="pink"
    >
      <div ref={ref}>
        {/* Featured */}
        {featured.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-pink-DEFAULT mb-6 flex items-center gap-2">
              <span className="text-2xl">✨</span> Featured Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((achievement, i) => (
                <AchievementCard key={achievement._id} achievement={achievement} index={i} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Achievements */}
        {rest.length > 0 && (
          <div>
            {featured.length > 0 && (
              <h3 className="text-lg font-semibold text-slate-300 mb-6">More Achievements</h3>
            )}
            <div className="space-y-4">
              {rest.map((achievement, i) => (
                <AchievementRow key={achievement._id} achievement={achievement} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

function AchievementCard({
  achievement,
  index,
  featured = false,
}: {
  achievement: Achievement
  index: number
  featured?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl overflow-hidden p-6 group transition-all duration-300"
    >
      {achievement.image && (
        <div className="relative rounded-lg overflow-hidden mb-4 h-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={achievement.image}
            alt={achievement.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl flex-shrink-0">
          {achievementIcons[achievement.type] || '🌟'}
        </span>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-100 group-hover:text-pink-DEFAULT transition-colors">
            {achievement.title}
          </h3>
          {achievement.organizer && (
            <p className="text-sm text-slate-400">{achievement.organizer}</p>
          )}
        </div>
      </div>

      {achievement.position && (
        <p className="text-sm text-pink-DEFAULT/80 font-semibold mb-2">
          {achievement.position}
        </p>
      )}

      {achievement.description && (
        <p className="text-sm text-slate-300 mb-3 line-clamp-2">
          {achievement.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        {achievement.date && (
          <span className="text-xs text-slate-500 font-mono">{achievement.date}</span>
        )}
        {achievement.url && (
          <a
            href={achievement.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-pink-DEFAULT hover:text-pink-DEFAULT/80 transition-colors"
          >
            Learn more →
          </a>
        )}
      </div>
    </motion.div>
  )
}

function AchievementRow({
  achievement,
  index,
}: {
  achievement: Achievement
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className="glass-card rounded-xl p-4 group hover:border-pink-DEFAULT/30 transition-all duration-300 flex items-start gap-4"
    >
      <div className="text-2xl flex-shrink-0 mt-1">
        {achievementIcons[achievement.type] || '🌟'}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between mb-1">
          <h4 className="font-semibold text-slate-100 group-hover:text-pink-DEFAULT transition-colors">
            {achievement.title}
          </h4>
          {achievement.date && (
            <span className="text-xs text-slate-500 font-mono whitespace-nowrap ml-2">
              {achievement.date}
            </span>
          )}
        </div>

        <p className="text-sm text-slate-400 mb-1">
          {achievement.organizer}
          {achievement.position && ` • ${achievement.position}`}
        </p>

        {achievement.description && (
          <p className="text-sm text-slate-300 line-clamp-1">
            {achievement.description}
          </p>
        )}
      </div>

      {achievement.url && (
        <a
          href={achievement.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-pink-DEFAULT/10 text-pink-DEFAULT border border-pink-DEFAULT/20 hover:bg-pink-DEFAULT/20 transition-all"
        >
          View
        </a>
      )}
    </motion.div>
  )
}
