import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Faq } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'
import { Types } from 'mongoose'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid FAQ ID', 400)
    }

    const faq = await Faq.findById(id).lean()

    if (!faq) {
      return errorResponse('FAQ not found', 404)
    }

    return successResponse(faq)
  } catch (error) {
    console.error('Error fetching FAQ:', error)
    return errorResponse('Failed to fetch FAQ', 500)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid FAQ ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const faq = await Faq.findByIdAndUpdate(id, data, { new: true })

    if (!faq) {
      return errorResponse('FAQ not found', 404)
    }

    revalidatePortfolio()
    return successResponse(faq, 'FAQ updated successfully')
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return errorResponse('Failed to update FAQ', 500)
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid FAQ ID', 400)
    }

    await connectDB()
    const faq = await Faq.findByIdAndDelete(id)

    if (!faq) {
      return errorResponse('FAQ not found', 404)
    }

    revalidatePortfolio()
    return successResponse({ id }, 'FAQ deleted successfully')
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return errorResponse('Failed to delete FAQ', 500)
  }
}
