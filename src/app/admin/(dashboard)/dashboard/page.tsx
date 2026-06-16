'use client'

import { useEffect, useState } from 'react'
import { 
  Users, 
  Eye, 
  MessageSquare, 
  Download, 
  Play, 
  MousePointerClick,
  TrendingUp,
  RefreshCw
} from 'lucide-react'
import StatCard from '../components/StatCard'
import dynamic from 'next/dynamic'

const DashboardCharts = dynamic(() => import('../components/DashboardCharts'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-card bg-[#0A1020]/60 border border-[#00E5FF]/10 rounded-xl p-6 h-[380px] animate-pulse flex items-center justify-center">
        <span className="text-slate-500 font-mono text-xs uppercase tracking-wider">Loading Analytics Chart...</span>
      </div>
      <div className="glass-card bg-[#0A1020]/60 border border-[#00E5FF]/10 rounded-xl p-6 h-[380px] animate-pulse flex items-center justify-center">
        <span className="text-slate-500 font-mono text-xs uppercase tracking-wider">Loading CTA Metrics...</span>
      </div>
    </div>
  )
})

interface AnalyticsSummary {
  pageViews: number
  uniqueVisitors: number
  messages: number
  downloads: number
  plays: number
  clicks: number
  chartData: { date: string; views: number; visitors: number }[]
  ctaData: { name: string; value: number; color: string }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics')
      const result = await res.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalytics()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-mono text-xs uppercase tracking-wider">
        <span className="w-8 h-8 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin mb-4" />
        <span>Loading analytical matrices...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            System Operations
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
             Realtime workspace diagnostics
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#101827] border border-slate-800 hover:border-[#00E5FF]/30 transition-all font-mono text-xs uppercase tracking-wider text-slate-400 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Recalculating...' : 'Refresh Logs'}</span>
        </button>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Hits (Page Views)"
          value={data?.pageViews ?? 0}
          icon={Eye}
          description="Accumulated server request views"
          color="cyan"
        />
        <StatCard
          title="Unique Operator IP"
          value={data?.uniqueVisitors ?? 0}
          icon={Users}
          description="Distinct visitor instances logged"
          color="violet"
        />
        <StatCard
          title="Inbound Transmissions"
          value={data?.messages ?? 0}
          icon={MessageSquare}
          description="Messages received in inbox"
          color="pink"
        />
        <StatCard
          title="Resume Decryptions"
          value={data?.downloads ?? 0}
          icon={Download}
          description="Operator file downloads"
          color="cyan"
        />
      </div>

      {/* Analytics Charts */}
      <DashboardCharts
        chartData={data?.chartData || []}
        ctaData={data?.ctaData || []}
      />
    </div>
  )
}
