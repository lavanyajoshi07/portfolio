import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { SiteSettings } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    let settings = await SiteSettings.findOne().lean()

    if (!settings) {
      // Create default settings if none exist
      settings = await SiteSettings.create({
        siteName: 'AI Engineer Workspace',
        siteDescription: 'Portfolio of an AI Software Engineer & Researcher',
        siteKeywords: ['AI', 'Next.js', 'React', 'MongoDB', 'Python', 'Machine Learning'],
        maintenanceMode: false,
        allowChatbot: true,
        accentColor: '#00E5FF',
        secondaryColor: '#FF4FD8',
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

    let settings = await SiteSettings.findOne()

    if (!settings) {
      settings = await SiteSettings.create(data)
    } else {
      Object.assign(settings, data)
      await settings.save()
    }

    revalidatePortfolio()
    return successResponse(settings, 'Site settings updated successfully')
  } catch (error) {
    console.error('Error updating settings:', error)
    return errorResponse('Failed to update settings', 500)
  }
}
