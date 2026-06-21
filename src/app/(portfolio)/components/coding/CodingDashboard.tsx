'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import SectionWrapper from '../shared/SectionWrapper'
import StatsCard from './StatsCard'
import { useResponsive } from '@/hooks/useResponsive'
import { cn } from '@/lib/utils'

interface CodingActivitySettings {
  title: string
  subtitle: string

  problemsSolved: string
  problemsSolvedSource: string
  contributions: string
  contributionsSource: string
  publicRepos: string
  publicReposSource: string
  followers: string
  followersSource: string

  contributionGraphImage: string
  contributionGraphAlt: string
  graphImageDisplayMode?: 'cover' | 'contain' | 'fill'

  totalContributions: string
  currentStreak: string
  longestStreak: string
  activeDays: string

  profileImage: string
  profileName: string
  profileUsername: string
  profileBio: string

  githubFollowers: string
  githubFollowing: string
  githubRepos: string
  githubContributions: string
  githubCurrentStreak: string
  githubProfileUrl: string

  motivationalQuote: string
  motivationalIcon: string
  motivationalEmoji: string

  showOverviewCards: boolean
  showContributionGraph: boolean
  showGithubProfile: boolean
  showMotivationalBanner: boolean
}

interface Props {
  dashboardSettings?: CodingActivitySettings
}

export default function CodingDashboard({ dashboardSettings }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const { isMobile, isTablet, mounted } = useResponsive()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const settings = useMemo(() => {
    if (dashboardSettings) return dashboardSettings
    return {
      title: 'Coding Activity',
      subtitle: 'Real-time stats from GitHub, LeetCode, and other platforms',
      problemsSolved: '312',
      problemsSolvedSource: 'LeetCode • Codeforces',
      contributions: '314',
      contributionsSource: 'Total Contributions',
      publicRepos: '15',
      publicReposSource: 'GitHub',
      followers: '128',
      followersSource: 'GitHub',
      contributionGraphImage: '',
      contributionGraphAlt: 'GitHub Contribution Graph',
      graphImageDisplayMode: 'cover',
      totalContributions: '314',
      currentStreak: '12 days',
      longestStreak: '25 days',
      activeDays: '150 days',
      profileImage: '',
      profileName: 'Your Name',
      profileUsername: 'username',
      profileBio: 'Software Engineer',
      githubFollowers: '128',
      githubFollowing: '45',
      githubRepos: '15',
      githubContributions: '314',
      githubCurrentStreak: '12 days',
      githubProfileUrl: 'https://github.com',
      motivationalQuote: 'Consistency compounds faster than talent.',
      motivationalIcon: 'Activity',
      motivationalEmoji: '⚡',
      showOverviewCards: true,
      showContributionGraph: true,
      showGithubProfile: true,
      showMotivationalBanner: true,
    } as CodingActivitySettings
  }, [dashboardSettings])

  const overviewCards = useMemo(() => {
    return [
      { id: 'solved', label: 'Problems Solved', value: settings.problemsSolved, platformSource: settings.problemsSolvedSource },
      { id: 'contributions', label: 'Contributions', value: settings.contributions, platformSource: settings.contributionsSource },
      { id: 'repos', label: 'Public Repos', value: settings.publicRepos, platformSource: settings.publicReposSource },
      { id: 'followers', label: 'Followers', value: settings.followers, platformSource: settings.followersSource },
    ]
  }, [settings])

  const QuoteIcon = useMemo(() => {
    const iconName = settings.motivationalIcon || 'Activity'
    const LucideIcon = (LucideIcons as any)[iconName]
    return LucideIcon ? LucideIcon : LucideIcons.Activity
  }, [settings.motivationalIcon])

  if (!isMounted) return null

  const showGraph = settings.showContributionGraph
  const showProfile = settings.showGithubProfile

  const leftColSpan = showProfile ? 'lg:col-span-7' : 'lg:col-span-10'
  const rightColSpan = showGraph ? 'lg:col-span-3' : 'lg:col-span-10'

  return (
    <SectionWrapper
      id="coding"
      title={settings.title}
      subtitle={settings.subtitle}
      accentColor="violet"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Row 1: Overview Stats */}
        {settings.showOverviewCards && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewCards.map((card) => (
              <StatsCard
                key={card.id}
                label={card.label}
                value={card.value}
                platformSource={card.platformSource}
              />
            ))}
          </div>
        )}

        {/* Row 2: Main Split layout */}
        {(showGraph || showProfile) && (
          <>
            {/* Mobile Layout */}
            <div className={cn(
              "space-y-6",
              mounted ? (isMobile ? "block" : "hidden") : "block md:hidden"
            )}>
              
              {/* Mobile Graph Card & Stats */}
              {showGraph && (
                <div className="space-y-6">
                  {/* Statistics Grid (2x2 responsive grid) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-cyan-400">
                        <LucideIcons.GitCommit className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-450">Contributions</span>
                      </div>
                      <div className="text-xl font-bold font-display text-white mt-1">
                        {settings.totalContributions}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-[#FF4FD8]">
                        <LucideIcons.Flame className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-455">Current Streak</span>
                      </div>
                      <div className="text-xl font-bold font-display text-[#FF4FD8] mt-1">
                        {settings.currentStreak}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-violet-400">
                        <LucideIcons.Trophy className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-460">Longest Streak</span>
                      </div>
                      <div className="text-xl font-bold font-display text-white mt-1">
                        {settings.longestStreak}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <LucideIcons.Calendar className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-465">Active Days</span>
                      </div>
                      <div className="text-xl font-bold font-display text-white mt-1">
                        {settings.activeDays}
                      </div>
                    </div>
                  </div>

                  {/* Graph Card */}
                  <div className="glass-card rounded-3xl p-6 bg-[#0A1020]/70 border border-cyan-500/10 backdrop-blur-xl hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] transition-all duration-300">
                    <h3 className="font-display font-bold text-base text-white uppercase tracking-wider mb-4">
                      Contribution Graph
                    </h3>
                    
                    {/* Horizontally scrollable heatmap container */}
                    <div className="p-4 overflow-x-auto scrollbar-hide touch-pan-x bg-[#0A1020]/50 border border-cyan-500/10 rounded-2xl">
                      <div className="min-w-[700px]">
                        {settings.contributionGraphImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={settings.contributionGraphImage}
                            alt={settings.contributionGraphAlt || 'GitHub Contribution Graph'}
                            className={`w-full h-[220px] ${
                              (settings.graphImageDisplayMode || 'cover') === 'contain' ? 'object-contain' :
                              (settings.graphImageDisplayMode || 'cover') === 'fill' ? 'object-fill' : 'object-cover'
                            }`}
                            style={{
                              objectPosition: (settings.graphImageDisplayMode || 'cover') === 'cover' ? 'top center' : 'center center'
                            }}
                          />
                        ) : (
                          <div className="w-full h-[220px] flex flex-col items-center justify-center gap-2 text-slate-500 select-none">
                            <LucideIcons.BarChart3 className="w-8 h-8 text-slate-600 animate-pulse" />
                            <span className="text-xs font-mono uppercase tracking-widest">No Graph Image Uploaded</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GitHub Profile Card for Mobile */}
              {showProfile && (
                <div className="flex flex-col justify-between glass-card rounded-3xl p-6 bg-[#0A1020]/70 border border-cyan-500/10 backdrop-blur-xl hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] transition-all duration-300">
                  <div className="flex flex-col items-center text-center h-full justify-between">
                    <h4 className="font-mono text-[11px] text-slate-500 uppercase tracking-widest mb-4 w-full text-left border-b border-slate-900 pb-2 select-none">
                      GitHub Profile
                    </h4>

                    {/* Avatar Ring */}
                    <div className="relative w-[120px] h-[120px] group shrink-0">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 animate-pulse blur-md opacity-40 group-hover:opacity-75 transition-all duration-300" />
                      <div className="relative w-full h-full rounded-full border-2 border-cyan-400/50 p-1 bg-[#0A1020] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={settings.profileImage || '/placeholder-avatar.png'}
                          alt={settings.profileUsername}
                          className="rounded-full object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-avatar.png'
                          }}
                        />
                      </div>
                      <span className="absolute bottom-1 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0A1020] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>

                    <div className="space-y-1 w-full mt-3">
                      <h3 className="font-display font-bold text-base text-white leading-tight uppercase tracking-wide">
                        {settings.profileName}
                      </h3>
                      <p className="font-mono text-xs text-cyan-400 select-all">
                        @{settings.profileUsername}
                      </p>
                      {settings.profileBio && (
                        <p className="text-xs text-slate-400 font-sans mt-2 px-1 leading-relaxed line-clamp-2">
                          {settings.profileBio}
                        </p>
                      )}
                    </div>

                    {/* Stats Layout */}
                    <div className="w-full grid grid-cols-2 gap-3 mt-4 text-xs font-mono text-slate-400 border-t border-slate-900/60 pt-4 text-left">
                      <div className="border border-cyan-500/5 bg-[#101827]/30 p-2 rounded-xl">
                        <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Followers</span>
                        <span className="text-sm font-bold text-white mt-0.5 block">{settings.githubFollowers}</span>
                      </div>
                      <div className="border border-cyan-500/5 bg-[#101827]/30 p-2 rounded-xl">
                        <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Following</span>
                        <span className="text-sm font-bold text-white mt-0.5 block">{settings.githubFollowing}</span>
                      </div>
                      <div className="border border-cyan-500/5 bg-[#101827]/30 p-2 rounded-xl">
                        <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Repos</span>
                        <span className="text-sm font-bold text-white mt-0.5 block">{settings.githubRepos}</span>
                      </div>
                      <div className="border border-cyan-500/5 bg-[#101827]/30 p-2 rounded-xl">
                        <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Contributions</span>
                        <span className="text-sm font-bold text-cyan-400 mt-0.5 block">{settings.githubContributions}</span>
                      </div>
                      <div className="border border-[#FF4FD8]/5 bg-[#101827]/30 p-2 rounded-xl col-span-2 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Current Streak</span>
                          <span className="text-sm font-bold text-[#FF4FD8] mt-0.5 block">{settings.githubCurrentStreak}</span>
                        </div>
                        <LucideIcons.Flame className="w-4 h-4 text-[#FF4FD8]" />
                      </div>
                    </div>

                    {/* CTA button */}
                    {settings.githubProfileUrl && (
                      <a
                        href={settings.githubProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-10 mt-4 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300 select-none shrink-0"
                      >
                        <LucideIcons.Github className="w-4 h-4" />
                        <span>View GitHub Profile</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Layout */}
            <div className={cn(
              "grid-cols-1 lg:grid-cols-10 gap-6 items-stretch",
              mounted ? (isMobile ? "hidden" : "grid") : "hidden md:grid"
            )}>
              
              {/* Left Panel: Contribution Heatmap */}
              {showGraph && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`${leftColSpan} flex flex-col justify-between h-auto lg:h-[620px] glass-card rounded-3xl p-6 bg-[#0A1020]/70 border border-cyan-500/10 backdrop-blur-xl hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] transition-all duration-300`}
                >
                  {/* Header */}
                  <div>
                    <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                      GitHub Contribution Activity
                    </h3>
                    <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mt-1">
                      Coding consistency and contribution history
                    </p>
                  </div>

                  {/* Mini Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-cyan-400">
                        <LucideIcons.GitCommit className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-450">Contributions</span>
                      </div>
                      <div className="text-xl font-bold font-display text-white mt-1">
                        {settings.totalContributions}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-[#FF4FD8]">
                        <LucideIcons.Flame className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-455">Current Streak</span>
                      </div>
                      <div className="text-xl font-bold font-display text-[#FF4FD8] mt-1">
                        {settings.currentStreak}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-violet-400">
                        <LucideIcons.Trophy className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-460">Longest Streak</span>
                      </div>
                      <div className="text-xl font-bold font-display text-white mt-1">
                        {settings.longestStreak}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <LucideIcons.Calendar className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-465">Active Days</span>
                      </div>
                      <div className="text-xl font-bold font-display text-white mt-1">
                        {settings.activeDays}
                      </div>
                    </div>
                  </div>

                  {/* Graph Image Display */}
                  {settings.contributionGraphImage ? (
                    <div className={cn(
                      "relative w-full rounded-2xl border border-cyan-500/10 bg-[#0A1020]/50 overflow-hidden",
                      mounted && isTablet
                        ? "h-auto aspect-[8/3]"
                        : "min-h-[320px] h-[320px] md:h-[400px]"
                    )}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={settings.contributionGraphImage}
                        alt={settings.contributionGraphAlt || 'GitHub Contribution Graph'}
                        className={cn(
                          "w-full h-full",
                          mounted && isTablet
                            ? "object-contain"
                            : ((settings.graphImageDisplayMode || 'cover') === 'contain' ? 'object-contain' :
                               (settings.graphImageDisplayMode || 'cover') === 'fill' ? 'object-fill' : 'object-cover')
                        )}
                        style={{
                          objectPosition: (settings.graphImageDisplayMode || 'cover') === 'cover' ? 'top center' : 'center center'
                        }}
                      />
                    </div>
                  ) : (
                    <div className={cn(
                      "relative w-full rounded-2xl border border-cyan-500/10 bg-[#0A1020]/50 p-4 flex flex-col items-center justify-center gap-2 text-slate-500 select-none overflow-hidden",
                      mounted && isTablet
                        ? "h-auto aspect-[8/3]"
                        : "min-h-[320px] h-[320px] md:h-[400px]"
                    )}>
                      <LucideIcons.BarChart3 className="w-8 h-8 text-slate-600 animate-pulse" />
                      <span className="text-xs font-mono uppercase tracking-widest">No Graph Image Uploaded</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Right Panel: GitHub Profile Card */}
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`${rightColSpan} flex flex-col justify-between h-auto lg:h-[620px] glass-card rounded-3xl p-6 bg-[#0A1020]/70 border border-cyan-500/10 backdrop-blur-xl hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] transition-all duration-300`}
                >
                  <div className="flex flex-col items-center text-center h-full justify-between">
                    {/* Header */}
                    <h4 className="font-mono text-[11px] text-slate-500 uppercase tracking-widest mb-4 w-full text-left border-b border-slate-900 pb-2 select-none">
                      GitHub Profile
                    </h4>

                    {/* Avatar Glow Ring container */}
                    <div className="relative w-[140px] h-[140px] group shrink-0">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 animate-pulse blur-md opacity-40 group-hover:opacity-75 transition-all duration-300" />
                      <div className="relative w-full h-full rounded-full border-2 border-cyan-400/50 p-1 bg-[#0A1020] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={settings.profileImage || '/placeholder-avatar.png'}
                          alt={settings.profileUsername}
                          className="rounded-full object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-avatar.png'
                          }}
                        />
                      </div>
                      {/* Online Indicator status dot */}
                      <span className="absolute bottom-1 right-2 w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-[#0A1020] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>

                    {/* Username / Bio */}
                    <div className="space-y-1 w-full mt-3 flex-1 flex flex-col justify-center">
                      <h3 className="font-display font-bold text-lg text-white leading-tight uppercase tracking-wide">
                        {settings.profileName}
                      </h3>
                      <p className="font-mono text-xs text-cyan-400 select-all">
                        @{settings.profileUsername}
                      </p>
                      {settings.profileBio && (
                        <p className="text-xs text-slate-400 font-sans mt-2 px-1 leading-relaxed line-clamp-2">
                          {settings.profileBio}
                        </p>
                      )}
                    </div>

                    {/* Stats Layout */}
                    <div className="w-full grid grid-cols-2 gap-3 mt-4 text-xs font-mono text-slate-400 border-t border-slate-900/60 pt-4 text-left">
                      <div className="border border-cyan-500/5 bg-[#101827]/30 p-2 rounded-xl">
                        <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Followers</span>
                        <span className="text-sm font-bold text-white mt-0.5 block">{settings.githubFollowers}</span>
                      </div>
                      <div className="border border-cyan-500/5 bg-[#101827]/30 p-2 rounded-xl">
                        <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Following</span>
                        <span className="text-sm font-bold text-white mt-0.5 block">{settings.githubFollowing}</span>
                      </div>
                      <div className="border border-cyan-500/5 bg-[#101827]/30 p-2 rounded-xl">
                        <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Repos</span>
                        <span className="text-sm font-bold text-white mt-0.5 block">{settings.githubRepos}</span>
                      </div>
                      <div className="border border-cyan-500/5 bg-[#101827]/30 p-2 rounded-xl">
                        <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Contributions</span>
                        <span className="text-sm font-bold text-cyan-400 mt-0.5 block">{settings.githubContributions}</span>
                      </div>
                      <div className="border border-[#FF4FD8]/5 bg-[#101827]/30 p-2 rounded-xl col-span-2 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase block tracking-wider">Current Streak</span>
                          <span className="text-sm font-bold text-[#FF4FD8] mt-0.5 block">{settings.githubCurrentStreak}</span>
                        </div>
                        <LucideIcons.Flame className="w-4 h-4 text-[#FF4FD8]" />
                      </div>
                    </div>

                    {/* CTA button */}
                    {settings.githubProfileUrl && (
                      <a
                        href={settings.githubProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-10 mt-4 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all duration-300 select-none shrink-0"
                      >
                        <LucideIcons.Github className="w-4 h-4" />
                        <span>View GitHub Profile</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

            </div>
          </>
        )}

        {/* Motivational Banner */}
        {settings.showMotivationalBanner && settings.motivationalQuote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl px-6 py-4 bg-[#0A1020]/70 border border-cyan-500/10 backdrop-blur-xl hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] transition-all duration-300 flex items-center justify-between h-auto lg:h-[90px]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <QuoteIcon className="w-5 h-5 animate-pulse" />
              </div>
              <p className="font-sans font-medium text-sm text-slate-200 leading-normal italic line-clamp-2">
                "{settings.motivationalQuote}"
              </p>
            </div>
            {settings.motivationalEmoji && (
              <span className="text-2xl shrink-0 select-none ml-4 animate-bounce">
                {settings.motivationalEmoji}
              </span>
            )}
          </motion.div>
        )}

      </div>
    </SectionWrapper>
  )
}