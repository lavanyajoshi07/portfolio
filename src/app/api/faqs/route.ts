import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Faq } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    const faqs = await Faq.find().sort({ order: 1 }).lean()
    return successResponse(faqs)
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return errorResponse('Failed to fetch FAQs', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    const faq = await Faq.create(data)
    revalidatePortfolio()
    return successResponse(faq, 'FAQ created successfully', 201)
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return errorResponse('Failed to create FAQ', 500)
  }
}
