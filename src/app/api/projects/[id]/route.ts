import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Project } from '@/models'
import { successResponse, errorResponse, requireAdmin, trackEvent } from '@/lib/api'
import { Types } from 'mongoose'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid project ID', 400)
    }

    const project = await Project.findById(id).lean()

    if (!project) {
      return errorResponse('Project not found', 404)
    }

    // Track view
    await trackEvent('project_view', { projectId: id }, req)

    return successResponse(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return errorResponse('Failed to fetch project', 500)
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
      return errorResponse('Invalid project ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const project = await Project.findByIdAndUpdate(id, data, { new: true })

    if (!project) {
      return errorResponse('Project not found', 404)
    }

    return successResponse(project, 'Project updated successfully')
  } catch (error) {
    console.error('Error updating project:', error)
    return errorResponse('Failed to update project', 500)
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
      return errorResponse('Invalid project ID', 400)
    }

    await connectDB()
    const project = await Project.findByIdAndDelete(id)

    if (!project) {
      return errorResponse('Project not found', 404)
    }

    return successResponse({ id }, 'Project deleted successfully')
  } catch (error) {
    console.error('Error deleting project:', error)
    return errorResponse('Failed to delete project', 500)
  }
}