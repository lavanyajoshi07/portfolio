import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Technology } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    const technologies = await Technology.find({ deletedAt: null }).sort({ displayOrder: 1 }).lean()
    return successResponse(technologies)
  } catch (error) {
    console.error('Error fetching technologies:', error)
    return errorResponse('Failed to fetch technologies', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    const technology = await Technology.create(data)
    revalidatePortfolio()
    return successResponse(technology, 'Technology created successfully', 201)
  } catch (error) {
    console.error('Error creating technology:', error)
    return errorResponse('Failed to create technology', 500)
  }
}
