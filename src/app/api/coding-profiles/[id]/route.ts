import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { CodingProfile } from '@/models'
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
      return errorResponse('Invalid profile ID', 400)
    }

    const profile = await CodingProfile.findById(id).lean()

    if (!profile) {
      return errorResponse('Coding profile not found', 404)
    }

    return successResponse(profile)
  } catch (error) {
    console.error('Error fetching coding profile:', error)
    return errorResponse('Failed to fetch coding profile', 500)
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
      return errorResponse('Invalid profile ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const profile = await CodingProfile.findByIdAndUpdate(id, data, { new: true })

    if (!profile) {
      return errorResponse('Coding profile not found', 404)
    }

    revalidatePortfolio()
    return successResponse(profile, 'Coding profile updated successfully')
  } catch (error) {
    console.error('Error updating coding profile:', error)
    return errorResponse('Failed to update coding profile', 500)
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
      return errorResponse('Invalid profile ID', 400)
    }

    await connectDB()
    const profile = await CodingProfile.findByIdAndDelete(id)

    if (!profile) {
      return errorResponse('Coding profile not found', 404)
    }

    revalidatePortfolio()
    return successResponse({ id }, 'Coding profile deleted successfully')
  } catch (error) {
    console.error('Error deleting coding profile:', error)
    return errorResponse('Failed to delete coding profile', 500)
  }
}
