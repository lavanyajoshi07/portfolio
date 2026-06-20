import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { AchievementSettings } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    let settings = await AchievementSettings.findOne().lean()
    
    if (!settings) {
      settings = await AchievementSettings.create({
        title: 'ACHIEVEMENTS & AWARDS',
        subtitle: 'Recognitions, competitions, memberships, and engineering milestones.',
        showCategoryGrid: true,
        animationsEnabled: true,
      })
    }

    return successResponse(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return errorResponse('Failed to fetch settings', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    let settings = await AchievementSettings.findOne()

    if (!settings) {
      settings = await AchievementSettings.create(data)
    } else {
      settings = await AchievementSettings.findByIdAndUpdate(settings._id, data, { new: true })
    }

    revalidatePortfolio()
    return successResponse(settings, 'Settings updated successfully')
  } catch (error) {
    console.error('Error updating settings:', error)
    return errorResponse('Failed to update settings', 500)
  }
}
