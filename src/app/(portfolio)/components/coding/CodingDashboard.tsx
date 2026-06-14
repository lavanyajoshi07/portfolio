'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionWrapper from '../shared/SectionWrapper'
import StatsCard from './StatsCard'
import ContributionHeatmap from './ContributionHeatmap'
import LanguageBar from './LanguageBar'
import { CodingProfile } from '@/types'

interface Props {
  profiles: CodingProfile[]
}

export default function CodingDashboard({ profiles }: Props) {
  const [isMounted, setIsMounted] = useState(false)

  // Wait for the client browser layout engine to stabilize before rendering charts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const stats = useMemo(() => {
    return profiles.reduce(
      (acc, profile) => {
        if (!profile.displayData) return acc

        return {
          totalSolved: acc.totalSolved + (profile.displayData.totalSolved || 0),
          contributions: acc.contributions + (profile.displayData.contributions || 0),
          followers: acc.followers + (profile.displayData.followers || 0),
          publicRepos: acc.publicRepos + (profile.displayData.publicRepos || 0),
          streak: Math.max(acc.streak, profile.displayData.streak || 0),
          ranking: profile.displayData.ranking || acc.ranking,
        }
      },
      { totalSolved: 0, contributions: 0, followers: 0, publicRepos: 0, streak: 0, ranking: 0 }
    )
  }, [profiles])

  const platformStats = profiles.map(p => ({
    name: p.platform,
    username: p.username,
    data: p.displayData,
  }))

  const heatmapData = profiles
    .find(p => p.displayData?.heatmapData)
    ?.displayData?.heatmapData || []

  const languageStats = profiles
    .find(p => p.displayData?.languageStats)
    ?.displayData?.languageStats || []

  if (!profiles.length) {
    return (
      <SectionWrapper id="coding" title="Coding Activity">
        <p className="text-center text-slate-500">Coding profiles will appear here once synced.</p>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper
      id="coding"
      title="Coding Activity"
      subtitle="Real-time stats from GitHub, LeetCode, and other platforms"
      accentColor="violet"
    >
      {/* Main stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard label="Problems Solved" value={stats.totalSolved} icon="🎯" />
        <StatsCard label="Contributions" value={stats.contributions} icon="📊" />
        <StatsCard label="Public Repos" value={stats.publicRepos} icon="📚" />
        <StatsCard label="Followers" value={stats.followers} icon="👥" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Contribution Heatmap - Safely guarded by client mount and dimension containment */}
        {heatmapData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2 min-w-0 w-full relative"
          >
            {isMounted ? (
              <ContributionHeatmap data={heatmapData} />
            ) : (
              <div className="w-full h-[300px] bg-bg-card/40 border border-violet-DEFAULT/5 animate-pulse rounded-2xl flex items-center justify-center">
                <span className="text-violet-DEFAULT/30 font-mono text-xs tracking-widest">LOADING HEATMAP...</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Language stats */}
        {languageStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-sm font-mono text-violet-DEFAULT mb-4 uppercase tracking-wider">
              Languages
            </h3>
            <div className="space-y-4">
              {languageStats.map((lang, i) => (
                <LanguageBar key={i} language={lang.language} percentage={lang.percentage} color={lang.color} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Platform profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platformStats.map((platform, i) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6 group hover:border-violet-DEFAULT/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-100 capitalize">
                {platform.name}
              </h3>
              <span className="text-2xl">
                {platform.name === 'github' ? '🐙' :
                 platform.name === 'leetcode' ? '⚡' :
                 platform.name === 'codeforces' ? '🏆' :
                 platform.name === 'codechef' ? '👨‍🍳' : '💻'}
              </span>
            </div>

            <p className="text-sm text-slate-400 mb-4">
              <a
                href={`https://${platform.name === 'github' ? 'github.com' :
                  platform.name === 'leetcode' ? 'leetcode.com' :
                  'example.com'}/${platform.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-DEFAULT hover:text-violet-DEFAULT/80 transition-colors"
              >
                @{platform.username}
              </a>
            </p>

            {platform.data && (
              <div className="grid grid-cols-2 gap-3">
                {platform.data.totalSolved && (
                  <div className="bg-bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Solved</p>
                    <p className="text-lg font-bold text-violet-DEFAULT">
                      {platform.data.totalSolved}
                    </p>
                  </div>
                )}
                {platform.data.ranking && (
                  <div className="bg-bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Ranking</p>
                    <p className="text-lg font-bold text-cyan-DEFAULT">
                      #{platform.data.ranking}
                    </p>
                  </div>
                )}
                {platform.data.contributions && (
                  <div className="bg-bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Contributions</p>
                    <p className="text-lg font-bold text-pink-DEFAULT">
                      {platform.data.contributions}
                    </p>
                  </div>
                )}
                {platform.data.streak && (
                  <div className="bg-bg-secondary/50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Streak</p>
                    <p className="text-lg font-bold text-emerald-400">
                      {platform.data.streak}d 🔥
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}