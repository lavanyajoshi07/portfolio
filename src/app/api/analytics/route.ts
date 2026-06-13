import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { AnalyticsEvent } from '@/models'
import { successResponse, errorResponse, getClientIp, trackEvent } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    const { type, projectId } = await req.json()

    if (!type) {
      return errorResponse('Event type is required', 400)
    }

    // Track event
    await trackEvent(
      type,
      {
        projectId,
        path: req.headers.get('referer') || '/',
      },
      req
    )

    return successResponse({ success: true }, 'Event tracked')
  } catch (error) {
    console.error('Analytics error:', error)
    // Don't fail user requests on analytics errors
    return successResponse({ success: false })
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check if user is admin (in production, add proper auth)
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.includes('Bearer')) {
      return errorResponse('Unauthorized', 401)
    }

    await connectDB()

    const period = req.nextUrl.searchParams.get('period') || '30d'

    let dateFrom = new Date()
    switch (period) {
      case 'today':
        dateFrom.setHours(0, 0, 0, 0)
        break
      case '7d':
        dateFrom.setDate(dateFrom.getDate() - 7)
        break
      case '30d':
        dateFrom.setDate(dateFrom.getDate() - 30)
        break
      default:
        dateFrom = new Date(0)
    }

    const events = await AnalyticsEvent.find({
      createdAt: { $gte: dateFrom },
    }).lean()

    const summary = {
      totalVisitors: new Set(events.map(e => e.sessionId)).size,
      uniqueVisitors: new Set(events.map(e => e.ip)).size,
      resumeDownloads: events.filter(e => e.type === 'resume_download').length,
      audioPlays: events.filter(e => e.type === 'audio_play').length,
      projectViews: events.filter(e => e.type === 'project_view').length,
      contactSubmissions: events.filter(e => e.type === 'contact_submit').length,
      period,
    }

    return successResponse(summary)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return errorResponse('Failed to fetch analytics', 500)
  }
}