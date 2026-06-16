import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { AnalyticsEvent, ContactMessage } from '@/models'
import { successResponse, errorResponse, requireAdmin, trackEvent } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    const { type, projectId } = await req.json()
    if (!type) return errorResponse('Event type is required', 400)

    await trackEvent(type, { projectId, path: req.headers.get('referer') || '/' }, req)
    return successResponse({ success: true }, 'Event tracked')
  } catch (error) {
    console.error('Analytics error:', error)
    return errorResponse('Failed to track event', 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    // Ensure only admins can access analytics
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    await connectDB()

    // Window boundaries (UTC) so the DB-side $dateToString buckets line up
    // with the keys we build below.
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30)

    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setUTCDate(fourteenDaysAgo.getUTCDate() - 13)
    fourteenDaysAgo.setUTCHours(0, 0, 0, 0)

    // A single aggregation does all the work on the database side (using the
    // { type, createdAt } / { createdAt } indexes) instead of streaming every
    // document into Node and scanning the array repeatedly.
    const aggregationPromise = AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $facet: {
          // Totals per event type over the 30 day window
          typeCounts: [{ $group: { _id: '$type', count: { $sum: 1 } } }],
          // Distinct visitor IPs over the 30 day window
          uniqueVisitors: [{ $group: { _id: '$ip' } }, { $count: 'count' }],
          // Per-day buckets for the last 14 days
          daily: [
            { $match: { createdAt: { $gte: fourteenDaysAgo } } },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                views: {
                  $sum: { $cond: [{ $eq: ['$type', 'page_view'] }, 1, 0] },
                },
                ips: { $addToSet: '$ip' },
              },
            },
            { $project: { _id: 0, date: '$_id', views: 1, visitors: { $size: '$ips' } } },
          ],
        },
      },
    ])

    // Run the unrelated message count in parallel with the aggregation.
    const [aggResult, messages] = await Promise.all([
      aggregationPromise,
      ContactMessage.countDocuments(),
    ])

    const facet = aggResult[0] ?? { typeCounts: [], uniqueVisitors: [], daily: [] }

    // type -> count lookup
    const counts: Record<string, number> = {}
    for (const row of facet.typeCounts as { _id: string; count: number }[]) {
      counts[row._id] = row.count
    }

    // date(YYYY-MM-DD) -> { views, visitors } lookup
    const dayMap = new Map<string, { views: number; visitors: number }>()
    for (const row of facet.daily as { date: string; views: number; visitors: number }[]) {
      dayMap.set(row.date, { views: row.views, visitors: row.visitors })
    }

    // Build a continuous 14-day series, filling gaps with zeros.
    const chartData: { date: string; views: number; visitors: number }[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setUTCDate(d.getUTCDate() - i)
      const key = d.toISOString().slice(0, 10) // YYYY-MM-DD (UTC)
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
      const entry = dayMap.get(key)
      chartData.push({
        date: label,
        views: entry?.views ?? 0,
        visitors: entry?.visitors ?? 0,
      })
    }

    const ctaData = [
      { name: 'Resume DL', value: counts['resume_download'] ?? 0, color: '#00E5FF' },
      { name: 'Audio', value: counts['audio_play'] ?? 0, color: '#FF4FD8' },
      { name: 'Projects', value: counts['project_view'] ?? 0, color: '#7C3AED' },
      { name: 'Contact', value: counts['contact_submit'] ?? 0, color: '#10B981' },
    ]

    return successResponse({
      pageViews: counts['page_view'] ?? 0,
      uniqueVisitors: (facet.uniqueVisitors[0]?.count as number) ?? 0,
      messages,
      downloads: counts['resume_download'] ?? 0,
      plays: counts['audio_play'] ?? 0,
      clicks: counts['cta_click'] ?? 0,
      chartData,
      ctaData,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return errorResponse('Failed to fetch analytics', 500)
  }
}
