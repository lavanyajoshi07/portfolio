import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Project } from '@/models'
import { successResponse, errorResponse } from '@/lib/api'
import { Types } from 'mongoose'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid project ID', 400)
    }

    await connectDB()
    const project = await Project.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )

    if (!project) {
      return errorResponse('Project not found', 404)
    }

    return successResponse({ id, viewCount: project.viewCount }, 'Project view count incremented')
  } catch (error) {
    console.error('Error incrementing project view count:', error)
    return errorResponse('Failed to increment view count', 500)
  }
}
