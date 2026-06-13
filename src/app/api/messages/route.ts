import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { ContactMessage } from '@/models'
import { successResponse, errorResponse, getClientIp } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, source = 'contact_form' } = await req.json()

    // Validation
    if (!name || !email || !message) {
      return errorResponse('Name, email, and message are required', 400)
    }

    if (email.length > 255 || !email.includes('@')) {
      return errorResponse('Invalid email address', 400)
    }

    if (message.length < 10 || message.length > 5000) {
      return errorResponse('Message must be between 10 and 5000 characters', 400)
    }

    await connectDB()

    // Create message
    const newMessage = await ContactMessage.create({
      name,
      email,
      message,
      source,
      ip: getClientIp(req),
      userAgent: req.headers.get('user-agent'),
    })

    // Track analytics
    try {
      const { trackEvent } = await import('@/lib/api')
      await trackEvent('contact_submit', { email, source }, req)
    } catch (e) {
      // Silent fail on analytics
      console.error('Analytics error:', e)
    }

    return successResponse(
      { id: newMessage._id },
      'Message sent successfully! I will get back to you soon.',
      201
    )
  } catch (error) {
    console.error('Error creating message:', error)
    return errorResponse('Failed to send message', 500)
  }
}

export async function GET() {
  // Only for admin - would require auth in production
  try {
    await connectDB()
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(10).lean()
    return successResponse(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return errorResponse('Failed to fetch messages', 500)
  }
}