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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor Trend Area Chart */}
        <div className="lg:col-span-2 glass-card bg-[#0A1020]/60 border border-[#00E5FF]/10 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Traffic Stream Dynamics
              </h3>
              <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
                Operator access logs over time
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#101827] border border-slate-800 px-2.5 py-1 rounded font-mono text-[9px] text-[#00E5FF] uppercase tracking-wider">
              <TrendingUp className="w-3 h-3" />
              <span>Normal Flow</span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#101827" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#475569" 
                  fontSize={9} 
                  fontFamily="JetBrains Mono" 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={9} 
                  fontFamily="JetBrains Mono" 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0A1020', 
                    borderColor: 'rgba(0, 229, 255, 0.2)', 
                    borderRadius: '8px', 
                    fontFamily: 'JetBrains Mono', 
                    fontSize: '11px',
                    color: '#fff' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  name="Page Views"
                  stroke="#00E5FF" 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  name="Unique Visitors"
                  stroke="#7C3AED" 
                  fillOpacity={1} 
                  fill="url(#colorVisitors)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CTA Breakdown Bar Chart */}
        <div className="glass-card bg-[#0A1020]/60 border border-[#00E5FF]/10 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-1">
              Interactive CTA Logs
            </h3>
            <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
              Visitor button click triggers
            </p>
          </div>

          <div className="h-[280px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.ctaData || []} layout="vertical" margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#101827" horizontal={false} />
                <XAxis 
                  type="number" 
                  stroke="#475569" 
                  fontSize={9} 
                  fontFamily="JetBrains Mono" 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#94a3b8" 
                  fontSize={9} 
                  fontFamily="JetBrains Mono" 
                  tickLine={false} 
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0A1020', 
                    borderColor: 'rgba(255, 79, 216, 0.2)', 
                    borderRadius: '8px', 
                    fontFamily: 'JetBrains Mono', 
                    fontSize: '11px',
                    color: '#fff' 
                  }} 
                />
                <Bar dataKey="value" name="Trigger Count" radius={[0, 4, 4, 0]} barSize={12}>
                  {(data?.ctaData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
