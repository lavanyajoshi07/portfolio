'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  GitCommit, 
  Flame, 
  Trophy, 
  Calendar, 
  Github, 
  Activity, 
  Quote, 
  Zap, 
  Award, 
  Terminal, 
  Code, 
  Cpu, 
  Sparkles, 
  Star, 
  Target, 
  Compass 
} from 'lucide-react'
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
  const [svgHtml, setSvgHtml] = useState<string>('')
  const [svgLoading, setSvgLoading] = useState<boolean>(true)
  const [viewBoxWidth, setViewBoxWidth] = useState<number>(663)

  const [liveStats, setLiveStats] = useState<{
    followers: number
    following: number
    public_repos: number
    totalContributions: number
    currentStreak: number
    longestStreak: number
    activeDays: number
  } | null>(null)

  useEffect(() => {
    let isCancelled = false
    fetch('/api/github')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dynamic github stats')
        return res.json()
      })
      .then((data) => {
        if (isCancelled) return
        setLiveStats(data)
      })
      .catch((err) => {
        console.error('Error fetching live GitHub stats:', err)
      })
    return () => {
      isCancelled = true
    }
  }, [])

  const settings = useMemo(() => {
    const base = dashboardSettings ? { ...dashboardSettings } : {
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

    if (liveStats) {
      base.followers = String(liveStats.followers)
      base.githubFollowers = String(liveStats.followers)
      base.githubFollowing = String(liveStats.following)
      base.publicRepos = String(liveStats.public_repos)
      base.githubRepos = String(liveStats.public_repos)
      base.contributions = String(liveStats.totalContributions)
      base.githubContributions = String(liveStats.totalContributions)
      base.totalContributions = String(liveStats.totalContributions)
      base.currentStreak = `${liveStats.currentStreak} days`
      base.githubCurrentStreak = `${liveStats.currentStreak} days`
      base.longestStreak = `${liveStats.longestStreak} days`
      base.activeDays = `${liveStats.activeDays} days`
    }

    return base
  }, [dashboardSettings, liveStats])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!settings.profileUsername || settings.profileUsername === 'username') {
      setSvgLoading(false)
      return
    }

    let isCancelled = false
    setSvgLoading(true)

    fetch(`/api/github-chart?username=${settings.profileUsername}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch contribution graph')
        return res.text()
      })
      .then((svgText) => {
        if (isCancelled) return
        
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(svgText, 'image/svg+xml')
          const svgElement = doc.querySelector('svg')
          
          if (svgElement) {
            const rects = Array.from(doc.querySelectorAll('rect'))
            let minX = Infinity
            
            rects.forEach((rect) => {
              const score = parseInt(rect.getAttribute('data-score') || '0', 10)
              const x = parseInt(rect.getAttribute('x') || '0', 10)
              if (score > 0 && x < minX) {
                minX = x
              }
              
              // Formatting to rounded corners
              rect.setAttribute('rx', '2.5')
              rect.setAttribute('ry', '2.5')
              
              let style = rect.getAttribute('style') || ''
              // Remove shape-rendering: crispedges so rounded corners are smooth and anti-aliased
              style = style.replace(/shape-rendering:\s*crispedges;?/gi, '')
              
              if (style.includes('fill:#EEEEEE') || style.includes('fill:#eeeeee') || score === 0) {
                style = style.replace(/fill:#EEEEEE/gi, 'fill:#20243c')
              }
              rect.setAttribute('style', style)
            })

            const viewBoxX = minX === Infinity ? 0 : Math.max(0, minX - 27)
            const calculatedWidth = 663 - viewBoxX
            setViewBoxWidth(calculatedWidth)

            svgElement.setAttribute('width', '100%')
            svgElement.setAttribute('height', 'auto')
            svgElement.setAttribute('viewBox', `${viewBoxX} 0 ${calculatedWidth} 104`)

            const texts = Array.from(doc.querySelectorAll('text'))
            texts.forEach((text) => {
              const xAttr = text.getAttribute('x')
              if (xAttr === '0') {
                text.setAttribute('x', String(viewBoxX))
                const style = text.getAttribute('style') || ''
                text.setAttribute('style', style.replace(/display:\s*none;?/g, ''))
              } else if (xAttr) {
                const xVal = parseInt(xAttr, 10)
                if (xVal < viewBoxX) {
                  text.remove()
                }
              }
            })

            const serializer = new XMLSerializer()
            const processedSvg = serializer.serializeToString(doc)
            setSvgHtml(processedSvg)
          } else {
            setSvgHtml('')
          }
        } catch (e) {
          console.error('Error parsing contribution graph SVG:', e)
          setSvgHtml('')
        }
        setSvgLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching contribution graph:', err)
        if (!isCancelled) {
          setSvgHtml('')
          setSvgLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [settings.profileUsername])

  const renderGraphPlaceholder = (message: string, showPulse = false) => (
    <div className={cn(
      "relative w-full rounded-2xl border border-cyan-500/10 bg-[#0A1020]/50 p-4 flex flex-col items-center justify-center gap-2 text-slate-500 select-none overflow-hidden",
      mounted && isTablet ? "h-auto aspect-[8/3]" : "min-h-[220px] h-[220px] md:h-[320px]"
    )}>
      <BarChart3 className={cn("w-8 h-8 text-slate-600", showPulse && "animate-pulse")} />
      <span className="text-xs font-mono uppercase tracking-widest">{message}</span>
    </div>
  )


  const overviewCards = useMemo(() => {
    return [
      { id: 'solved', label: 'Problems Solved', value: settings.problemsSolved, platformSource: settings.problemsSolvedSource },
      { id: 'contributions', label: 'Contributions', value: settings.contributions, platformSource: settings.contributionsSource },
      { id: 'repos', label: 'Public Repos', value: settings.publicRepos, platformSource: settings.publicReposSource },
      { id: 'followers', label: 'Followers', value: settings.followers, platformSource: settings.followersSource },
    ]
  }, [settings])

  const QuoteIcon = useMemo(() => {
    const iconMap: Record<string, any> = {
      Activity, Quote, Zap, Flame, Award, Terminal, Code, Cpu, Sparkles, Star, Trophy, Target, Compass
    }
    const iconName = settings.motivationalIcon || 'Activity'
    return iconMap[iconName] || Activity
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
                        <GitCommit className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-450">Contributions</span>
                      </div>
                      <div className="text-xl font-bold font-display text-white mt-1">
                        {settings.totalContributions}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-[#FF4FD8]">
                        <Flame className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-455">Current Streak</span>
                      </div>
                      <div className="text-xl font-bold font-display text-[#FF4FD8] mt-1">
                        {settings.currentStreak}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-violet-400">
                        <Trophy className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-460">Longest Streak</span>
                      </div>
                      <div className="text-xl font-bold font-display text-white mt-1">
                        {settings.longestStreak}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-465">Active Days</span>
                      </div>
                      <div className="text-xl font-bold font-display text-white mt-1">
                        {settings.activeDays}
                      </div>
                    </div>
                  </div>

                  {/* Graph Card */}
                  <div className="glass-card rounded-3xl p-6 bg-[#0A1020]/70 border border-cyan-500/10 backdrop-blur-xl hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.12)] transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-display font-bold text-base text-white uppercase tracking-wider">
                          Contributions Graph
                        </h3>
                        <p className="font-mono text-[10px] text-slate-500 mt-0.5">
                          {settings.profileUsername} activity in {new Date().getFullYear()}
                        </p>
                      </div>
                      <a 
                        href={settings.githubProfileUrl || `https://github.com/${settings.profileUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-[#5568FE] hover:underline"
                      >
                        @{settings.profileUsername}
                      </a>
                    </div>
                    
                    {/* Horizontally scrollable heatmap container */}
                    <div className="p-4 overflow-x-auto scrollbar-hide touch-pan-x bg-[#0A1020]/50 border border-cyan-500/10 rounded-2xl">
                      <div 
                        className="mx-auto flex items-center justify-center"
                        style={{
                          width: `${viewBoxWidth * 1.25}px`,
                          maxWidth: '100%',
                          minWidth: `${Math.min(viewBoxWidth * 1.25, 280)}px`
                        }}
                      >
                        {svgLoading ? (
                          <div className="w-full h-[120px] flex flex-col items-center justify-center gap-2 text-slate-500 select-none">
                            <BarChart3 className="w-8 h-8 text-slate-600 animate-pulse" />
                            <span className="text-xs font-mono uppercase tracking-widest">Syncing Live GitHub Graph...</span>
                          </div>
                        ) : svgHtml ? (
                          <div 
                            className="w-full [&>svg]:w-full [&>svg]:h-auto flex items-center justify-center" 
                            dangerouslySetInnerHTML={{ __html: svgHtml }} 
                          />
                        ) : (
                          <div className="w-full h-[120px] flex flex-col items-center justify-center gap-2 text-slate-500 select-none">
                            <BarChart3 className="w-8 h-8 text-slate-600" />
                            <span className="text-xs font-mono uppercase tracking-widest">
                              {!settings.profileUsername || settings.profileUsername === 'username'
                                ? 'GitHub username not configured'
                                : 'Failed to load GitHub Graph'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Legend & Stats Footer for Mobile */}
                    <div 
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-slate-500 font-mono mt-4 pt-4 border-t border-slate-900/60 select-none w-full mx-auto"
                      style={{ maxWidth: `${viewBoxWidth * 1.25}px` }}
                    >
                      <div>
                        <span>{settings.totalContributions || '0'} contributions in the last year</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>Less</span>
                        <span className="w-2.5 h-2.5 rounded-[3px] bg-[#20243c]" />
                        <span className="w-2.5 h-2.5 rounded-[3px] bg-[#5568fe]/30" />
                        <span className="w-2.5 h-2.5 rounded-[3px] bg-[#5568fe]/55" />
                        <span className="w-2.5 h-2.5 rounded-[3px] bg-[#5568fe]/80" />
                        <span className="w-2.5 h-2.5 rounded-[3px] bg-[#5568fe]" />
                        <span>More</span>
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
                        <Flame className="w-4 h-4 text-[#FF4FD8]" />
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
                        <Github className="w-4 h-4" />
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
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                        Contributions Graph
                      </h3>
                      <p className="font-mono text-xs text-slate-500 mt-1">
                        {settings.profileUsername} activity in {new Date().getFullYear()}
                      </p>
                    </div>
                    <a 
                      href={settings.githubProfileUrl || `https://github.com/${settings.profileUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-[#5568FE] hover:underline hover:text-[#5568FE]/80 transition-colors"
                    >
                      @{settings.profileUsername}
                    </a>
                  </div>

                  {/* Mini Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-cyan-400">
                        <GitCommit className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-450">Contributions</span>
                      </div>
                      <div className="text-xl font-bold font-display text-white mt-1">
                        {settings.totalContributions}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-[#FF4FD8]">
                        <Flame className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-455">Current Streak</span>
                      </div>
                      <div className="text-xl font-bold font-display text-[#FF4FD8] mt-1">
                        {settings.currentStreak}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-violet-400">
                        <Trophy className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-460">Longest Streak</span>
                      </div>
                      <div className="text-xl font-bold font-display text-white mt-1">
                        {settings.longestStreak}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4 bg-[#0A1020]/50 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 flex flex-col justify-between h-[90px]">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-465">Active Days</span>
                      </div>
                      <div className="text-xl font-bold font-display text-white mt-1">
                        {settings.activeDays}
                      </div>
                    </div>
                  </div>

                  {/* Graph Image Display */}
                  {svgLoading ? (
                    renderGraphPlaceholder('Syncing Live GitHub Graph...', true)
                  ) : svgHtml ? (
                    <div className="space-y-4">
                      <div className={cn(
                        "relative w-full rounded-2xl border border-cyan-500/10 bg-[#0A1020]/50 p-6 flex items-center justify-center overflow-hidden",
                        mounted && isTablet
                          ? "h-auto aspect-[8/3]"
                          : "min-h-[220px] h-[220px] md:h-[320px]"
                      )}>
                        <div 
                          className="w-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto"
                          style={{ maxWidth: `${viewBoxWidth * 1.25}px` }}
                          dangerouslySetInnerHTML={{ __html: svgHtml }} 
                        />
                      </div>
                      
                      {/* Legend & Stats Footer for Desktop */}
                      <div 
                        className="flex items-center justify-between text-xs text-slate-500 font-mono pt-2 px-1 select-none w-full mx-auto border-t border-slate-900/60"
                        style={{ maxWidth: `${viewBoxWidth * 1.25}px` }}
                      >
                        <div>
                          <span>{settings.totalContributions || '0'} contributions in the last year</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>Less</span>
                          <span className="w-2.5 h-2.5 rounded-[3px] bg-[#20243c]" />
                          <span className="w-2.5 h-2.5 rounded-[3px] bg-[#5568fe]/30" />
                          <span className="w-2.5 h-2.5 rounded-[3px] bg-[#5568fe]/55" />
                          <span className="w-2.5 h-2.5 rounded-[3px] bg-[#5568fe]/80" />
                          <span className="w-2.5 h-2.5 rounded-[3px] bg-[#5568fe]" />
                          <span>More</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    renderGraphPlaceholder(
                      !settings.profileUsername || settings.profileUsername === 'username'
                        ? 'GitHub username not configured'
                        : 'Failed to load GitHub Graph'
                    )
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
                        <Flame className="w-4 h-4 text-[#FF4FD8]" />
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
                        <Github className="w-4 h-4" />
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
