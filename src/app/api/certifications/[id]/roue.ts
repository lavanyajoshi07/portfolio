import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Certification } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'
import { Types } from 'mongoose'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    if (!Types.ObjectId.isValid(params.id)) {
      return errorResponse('Invalid certification ID', 400)
    }

    const certification = await Certification.findById(params.id).lean()

    if (!certification) {
      return errorResponse('Certification not found', 404)
    }

    return successResponse(certification)
  } catch (error) {
    console.error('Error fetching certification:', error)
    return errorResponse('Failed to fetch certification', 500)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(params.id)) {
      return errorResponse('Invalid certification ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const certification = await Certification.findByIdAndUpdate(params.id, data, { new: true })

    if (!certification) {
      return errorResponse('Certification not found', 404)
    }

    return successResponse(certification, 'Certification updated successfully')
  } catch (error) {
    console.error('Error updating certification:', error)
    return errorResponse('Failed to update certification', 500)
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(params.id)) {
      return errorResponse('Invalid certification ID', 400)
    }

    await connectDB()
    const certification = await Certification.findByIdAndDelete(params.id)

    if (!certification) {
      return errorResponse('Certification not found', 404)
    }

    return successResponse({ id: params.id }, 'Certification deleted successfully')
  } catch (error) {
    console.error('Error deleting certification:', error)
    return errorResponse('Failed to delete certification', 500)
  }
}