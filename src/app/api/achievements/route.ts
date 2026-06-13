import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Achievement } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    const achievements = await Achievement.find().sort({ order: 1 }).lean()
    return successResponse(achievements)
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return errorResponse('Failed to fetch achievements', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    const achievement = await Achievement.create(data)
    return successResponse(achievement, 'Achievement created successfully', 201)
  } catch (error) {
    console.error('Error creating achievement:', error)
    return errorResponse('Failed to create achievement', 500)
  }
}