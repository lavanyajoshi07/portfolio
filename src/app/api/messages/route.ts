import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { ContactMessage } from '@/models'
import { successResponse, errorResponse, getClientIp, requireAdmin } from '@/lib/api'
import nodemailer from 'nodemailer'

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
      console.error('Analytics error:', e)
    }

    // Send email notification to admin
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASS,
        },
      })

      await transporter.sendMail({
        from: `"Lavanya Joshi Portfolio" <${process.env.NODEMAILER_EMAIL}>`,
        to: process.env.NODEMAILER_EMAIL,
        subject: `New Contact Message from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:16px;background:#0A1020;color:#E2E8F0;border-radius:8px">
            <h2 style="color:#00E5FF;margin-bottom:12px">New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background:#101827;padding:12px;border-radius:6px;color:#CBD5E1;white-space:pre-wrap">${message}</div>
          </div>
        `,
      })
    } catch (mailError) {
      console.error('Email notification error:', mailError)
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
  try {
    // SECURITY: Ensure only administrators can access this endpoint
    await requireAdmin()
    
    await connectDB()
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(10).lean()
    return successResponse(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return errorResponse('Unauthorized or Failed to fetch messages', 401)
  }
}