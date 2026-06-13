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

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const events = await AnalyticsEvent.find({
      createdAt: { $gte: thirtyDaysAgo },
    }).lean()

    const messages = await ContactMessage.countDocuments()

    // Build chart data: last 14 days
    const chartData: { date: string; views: number; visitors: number }[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const dayStart = new Date(d.setHours(0, 0, 0, 0))
      const dayEnd = new Date(d.setHours(23, 59, 59, 999))
      const dayEvents = events.filter(e => {
        const t = new Date(e.createdAt as unknown as string)
        return t >= dayStart && t <= dayEnd
      })
      chartData.push({
        date: dateStr,
        views: dayEvents.filter(e => e.type === 'page_view').length,
        visitors: new Set(dayEvents.map(e => e.ip)).size,
      })
    }

    // CTA breakdown
    const ctaData = [
      { name: 'Resume DL', value: events.filter(e => e.type === 'resume_download').length, color: '#00E5FF' },
      { name: 'Audio', value: events.filter(e => e.type === 'audio_play').length, color: '#FF4FD8' },
      { name: 'Projects', value: events.filter(e => e.type === 'project_view').length, color: '#7C3AED' },
      { name: 'Contact', value: events.filter(e => e.type === 'contact_submit').length, color: '#10B981' },
    ]

    // Return the corrected shape
    return successResponse({
      pageViews: events.filter(e => e.type === 'page_view').length,
      uniqueVisitors: new Set(events.map(e => e.ip)).size,
      messages,
      downloads: events.filter(e => e.type === 'resume_download').length,
      plays: events.filter(e => e.type === 'audio_play').length,
      clicks: events.filter(e => e.type === 'cta_click').length,
      chartData,
      ctaData,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return errorResponse('Failed to fetch analytics', 500)
  }
}
