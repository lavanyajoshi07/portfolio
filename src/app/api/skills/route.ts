import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Skill } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    const skills = await Skill.find().sort({ order: 1 }).lean()
    return successResponse(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return errorResponse('Failed to fetch skills', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    const skill = await Skill.create(data)
    revalidatePortfolio()
    return successResponse(skill, 'Skill created successfully', 201)
  } catch (error) {
    console.error('Error creating skill:', error)
    return errorResponse('Failed to create skill', 500)
  }
}
