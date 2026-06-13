'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { HeatmapEntry } from '@/types'

interface Props {
  data: HeatmapEntry[]
}

export default function ContributionHeatmap({ data }: Props) {
  const { weeks, maxCount } = useMemo(() => {
    const weekMap = new Map<number, HeatmapEntry[]>()

    data.forEach(entry => {
      const date = new Date(entry.date)
      const weekStart = date.getTime() - date.getDay() * 86400000
      const week = Math.floor(weekStart / (7 * 86400000))

      if (!weekMap.has(week)) {
        weekMap.set(week, [])
      }
      weekMap.get(week)!.push(entry)
    })

    const weeks = Array.from(weekMap.values())
    const max = Math.max(...data.map(d => d.count), 1)

    return { weeks, maxCount: max }
  }, [data])

  const getColor = (count: number) => {
    if (count === 0) return 'heatmap-0'
    const intensity = Math.ceil((count / maxCount) * 5)
    return `heatmap-${Math.min(intensity, 5)}`
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-sm font-mono text-violet-DEFAULT mb-4 uppercase tracking-wider">
        Contribution Activity
      </h3>

      <div className="overflow-x-auto">
        <div className="flex gap-1 pb-4 min-w-min">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pr-2">
            {dayLabels.map((day, i) => (
              <div
                key={i}
                className="h-3 w-3 text-xs text-slate-500 flex items-center justify-center"
              >
                {day[0]}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIdx) => (
              <motion.div
                key={weekIdx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: weekIdx * 0.02 }}
                viewport={{ once: true }}
                className="flex flex-col gap-1"
              >
                {week.map((entry, dayIdx) => (
                  <motion.div
                    key={`${weekIdx}-${dayIdx}`}
                    whileHover={{ scale: 1.2 }}
                    title={`${entry.date}: ${entry.count} contributions`}
                    className={`h-3 w-3 rounded cursor-pointer transition-all duration-200 ${getColor(entry.count)}`}
                  />
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className={`h-3 w-3 rounded heatmap-${i}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}