import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { SeoSettings } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    let settings = await SeoSettings.findOne().lean()
    if (!settings) {
      // Create defaults
      settings = await SeoSettings.create({
        metaTitle: 'AI Engineer Portfolio',
        metaDescription: 'Futuristic AI portfolio with a premium cyberpunk aesthetic.',
        keywords: ['AI', 'Generative AI', 'Deep Learning'],
        ogImage: '',
        twitterImage: '',
        canonicalUrl: '',
      })
    }
    return successResponse(settings)
  } catch (error) {
    console.error('Error fetching SEO settings:', error)
    return errorResponse('Failed to fetch SEO settings', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    let settings = await SeoSettings.findOne()
    if (settings) {
      settings = await SeoSettings.findByIdAndUpdate(settings._id, data, { new: true })
    } else {
      settings = await SeoSettings.create(data)
    }

    revalidatePortfolio()
    return successResponse(settings, 'SEO settings updated successfully')
  } catch (error) {
    console.error('Error updating SEO settings:', error)
    return errorResponse('Failed to update SEO settings', 500)
  }
}
