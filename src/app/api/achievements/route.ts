import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Achievement } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const url = new URL(req.url)
    const showTrash = url.searchParams.get('trash') === 'true'

    const filter = showTrash
      ? { deletedAt: { $ne: null } }
      : { deletedAt: null }

    const achievements = await Achievement.find(filter)
      .populate('category')
      .sort({ displayOrder: 1, date: -1 })
      .lean()

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
    revalidatePortfolio()
    return successResponse(achievement, 'Achievement created successfully', 201)
  } catch (error) {
    console.error('Error creating achievement:', error)
    return errorResponse('Failed to create achievement', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    if (data.reorder && Array.isArray(data.items)) {
      const updates = data.items.map((item: any) =>
        Achievement.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
      )
      await Promise.all(updates)
      revalidatePortfolio()
      return successResponse({ success: true }, 'Achievements reordered successfully')
    }

    return errorResponse('Invalid request body', 400)
  } catch (error) {
    console.error('Error batch updating achievements:', error)
    return errorResponse('Failed to batch update achievements', 500)
  }
}


