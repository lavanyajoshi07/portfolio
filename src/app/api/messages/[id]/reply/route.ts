import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { ContactMessage } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'
import { Types } from 'mongoose'

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
    if (!replyText || replyText.trim().length < 1) {
      return errorResponse('Reply text is required', 400)
    }

    await connectDB()
    const message = await ContactMessage.findById(id)
    if (!message) {
      return errorResponse('Message not found', 404)
    }

    // Send email via Brevo
    const brevoApiKey = process.env.BREVO_API_KEY
    const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL || 'support@lavanyajoshi.in'
    const brevoTemplateIdVal = process.env.BREVO_TEMPLATE_ID_REPLY

    if (!brevoApiKey) {
      return errorResponse('Brevo API key is not configured', 500)
    }

    let requestBody: any = {
      sender: { email: brevoSenderEmail },
      to: [{ email: message.email, name: message.name }],
    }

    if (brevoTemplateIdVal) {
      const templateId = /^\d+$/.test(brevoTemplateIdVal)
        ? parseInt(brevoTemplateIdVal, 10)
        : brevoTemplateIdVal

      requestBody.templateId = templateId
      requestBody.params = {
        name: message.name,
        reply_text: replyText,
        replyText: replyText,
      }
    } else {
      const emailHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0A1020;color:#E2E8F0;border-radius:12px;border:1px solid rgba(0,229,255,0.2)">
          <h2 style="color:#00E5FF;font-size:1.25rem;margin-bottom:8px">Reply from Lavanya Joshi</h2>
          <p style="color:#94A3B8;font-size:0.875rem;margin-bottom:20px">Hi ${message.name},</p>
          <div style="background:#101827;border-left:3px solid #00E5FF;padding:16px;border-radius:8px;white-space:pre-wrap;color:#CBD5E1">
            ${replyText}
          </div>
          <hr style="border-color:rgba(0,229,255,0.1);margin:24px 0"/>
          <p style="color:#475569;font-size:0.75rem;">This is a reply to your message: "${message.message.slice(0, 100)}..."</p>
        </div>
      `
      requestBody.subject = `Re: Your message to Lavanya Joshi`
      requestBody.htmlContent = emailHtml
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Brevo reply email sending failed: ${response.status} - ${errorText}`)
      return errorResponse('Failed to send reply email via Brevo', 500)
    }

    // Mark as read
    await ContactMessage.findByIdAndUpdate(id, { read: true })

    return successResponse({ id }, 'Reply sent successfully')
  } catch (error) {
    console.error('Error sending reply:', error)
    return errorResponse('Failed to send reply email', 500)
  }
}