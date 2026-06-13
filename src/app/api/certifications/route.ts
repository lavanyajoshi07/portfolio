import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Certification } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    const certifications = await Certification.find().sort({ order: 1 }).lean()
    return successResponse(certifications)
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return errorResponse('Failed to fetch certifications', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    const certification = await Certification.create(data)
    return successResponse(certification, 'Certification created successfully', 201)
  } catch (error) {
    console.error('Error creating certification:', error)
    return errorResponse('Failed to create certification', 500)
  }
}