import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Project } from '@/models'
import { successResponse, errorResponse, requireAdmin, generateSlug } from '@/lib/api'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const status = req.nextUrl.searchParams.get('status')
    const featured = req.nextUrl.searchParams.get('featured')

    let query: any = { status: { $ne: 'archived' } }

    if (status) query.status = status
    if (featured === 'true') query.featured = true

    const projects = await Project.find(query).sort({ featured: -1, order: 1 }).lean()

    return successResponse(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return errorResponse('Failed to fetch projects', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = generateSlug(data.title)
    }

    const project = await Project.create(data)
    return successResponse(project, 'Project created successfully', 201)
  } catch (error) {
    console.error('Error creating project:', error)
    return errorResponse('Failed to create project', 500)
  }
}