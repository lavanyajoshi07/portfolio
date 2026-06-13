import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { ApiResponse } from '@/types'

// ============================================================
// RATE LIMITING (in-memory, use Redis in production)
// ============================================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000
): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (entry.count >= maxRequests) {
    return false
  }

  entry.count++
  return true
}

// ============================================================
// AUTH HELPERS
// ============================================================
export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { session: null, error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) }
  }
  return { session, error: null }
}

// ============================================================
// RESPONSE HELPERS
// ============================================================
export function successResponse<T>(data: T, message?: string, status = 200): NextResponse {
  const body: ApiResponse<T> = { success: true, data, message }
  return NextResponse.json(body, { status })
}

export function errorResponse(error: string, status = 400): NextResponse {
  const body: ApiResponse = { success: false, error }
  return NextResponse.json(body, { status })
}

// ============================================================
// IP EXTRACTION
// ============================================================
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0] ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

// ============================================================
// SLUG GENERATOR
// ============================================================
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ============================================================
// ANALYTICS TRACKING
// ============================================================
export async function trackEvent(
  type: string,
  data: Record<string, unknown>,
  req: NextRequest
) {
  try {
    const { AnalyticsEvent } = await import('@/models')
    const connectDB = (await import('./db')).default
    await connectDB()

    await AnalyticsEvent.create({
      type,
      ...data,
      ip: getClientIp(req),
      userAgent: req.headers.get('user-agent'),
      referrer: req.headers.get('referer'),
      sessionId: req.cookies.get('session_id')?.value ?? 'anonymous',
    })
  } catch (e) {
    // Fire-and-forget: don't fail user requests on analytics errors
    console.error('Analytics error:', e)
  }
}