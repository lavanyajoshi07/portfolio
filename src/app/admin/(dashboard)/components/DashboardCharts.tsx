'use client'

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
import { TrendingUp } from 'lucide-react'

interface ChartDataPoint {
  date: string
  views: number
  visitors: number
}

interface CtaDataPoint {
  name: string
  value: number
  color: string
}

interface DashboardChartsProps {
  chartData: ChartDataPoint[]
  ctaData: CtaDataPoint[]
}

export default function DashboardCharts({ chartData, ctaData }: DashboardChartsProps) {
  return (
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
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            <BarChart data={ctaData} layout="vertical" margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
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
                {ctaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
