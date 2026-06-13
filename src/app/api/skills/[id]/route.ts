import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Skill } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'
import { Types } from 'mongoose'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid skill ID', 400)
    }

    const skill = await Skill.findById(id).lean()

    if (!skill) {
      return errorResponse('Skill not found', 404)
    }

    return successResponse(skill)
  } catch (error) {
    console.error('Error fetching skill:', error)
    return errorResponse('Failed to fetch skill', 500)
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
      return errorResponse('Invalid skill ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const skill = await Skill.findByIdAndUpdate(id, data, { new: true })

    if (!skill) {
      return errorResponse('Skill not found', 404)
    }

    return successResponse(skill, 'Skill updated successfully')
  } catch (error) {
    console.error('Error updating skill:', error)
    return errorResponse('Failed to update skill', 500)
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
      return errorResponse('Invalid skill ID', 400)
    }

    await connectDB()
    const skill = await Skill.findByIdAndDelete(id)

    if (!skill) {
      return errorResponse('Skill not found', 404)
    }

    return successResponse({ id }, 'Skill deleted successfully')
  } catch (error) {
    console.error('Error deleting skill:', error)
    return errorResponse('Failed to delete skill', 500)
  }
}