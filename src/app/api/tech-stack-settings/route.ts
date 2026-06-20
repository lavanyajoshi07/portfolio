import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { TechStackSettings } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    let settings = await TechStackSettings.findOne().lean()
    if (!settings) {
      settings = await TechStackSettings.create({
        badgeText: 'Tech Stack',
        title: 'Technologies & Tools',
        subtitle: 'My technical ecosystem for building intelligent, scalable systems.',
        quote: 'The right tool is important, but the mindset to build and solve problems is everything.',
        categoriesEnabled: true,
        statsEnabled: true,
        quoteEnabled: true,
        animationsEnabled: true,
      })
    }
    return successResponse(settings)
  } catch (error) {
    console.error('Error fetching tech stack settings:', error)
    return errorResponse('Failed to fetch settings', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    const settings = await TechStackSettings.findOneAndUpdate({}, data, { upsert: true, new: true })
    revalidatePortfolio()
    return successResponse(settings, 'Settings updated successfully')
  } catch (error) {
    console.error('Error updating tech stack settings:', error)
    return errorResponse('Failed to update settings', 500)
  }
}

export async function PUT(req: NextRequest) {
  return POST(req)
}
