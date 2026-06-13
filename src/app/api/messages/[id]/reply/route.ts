import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { ContactMessage } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'
import { Types } from 'mongoose'
import nodemailer from 'nodemailer'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid message ID', 400)
    }

    const { replyText } = await req.json()
    if (!replyText || replyText.trim().length < 5) {
      return errorResponse('Reply text is required (min 5 characters)', 400)
    }

    await connectDB()
    const message = await ContactMessage.findById(id)
    if (!message) {
      return errorResponse('Message not found', 404)
    }

    // Send email via Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    })

    await transporter.sendMail({
      from: `"Lavanya Joshi Portfolio" <${process.env.NODEMAILER_EMAIL}>`,
      to: message.email,
      subject: `Re: Your message to Lavanya Joshi`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0A1020;color:#E2E8F0;border-radius:12px;border:1px solid rgba(0,229,255,0.2)">
          <h2 style="color:#00E5FF;font-size:1.25rem;margin-bottom:8px">Reply from Lavanya Joshi</h2>
          <p style="color:#94A3B8;font-size:0.875rem;margin-bottom:20px">Hi ${message.name},</p>
          <div style="background:#101827;border-left:3px solid #00E5FF;padding:16px;border-radius:8px;white-space:pre-wrap;color:#CBD5E1">
            ${replyText}
          </div>
          <hr style="border-color:rgba(0,229,255,0.1);margin:24px 0"/>
          <p style="color:#475569;font-size:0.75rem;">This is a reply to your message: "${message.message.slice(0, 100)}..."</p>
        </div>
      `,
    })

    // Mark as read
    await ContactMessage.findByIdAndUpdate(id, { read: true })

    return successResponse({ id }, 'Reply sent successfully')
  } catch (error) {
    console.error('Error sending reply:', error)
    return errorResponse('Failed to send reply email', 500)
  }
}