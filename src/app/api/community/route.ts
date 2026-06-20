import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { CommunityItem } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    const items = await CommunityItem.find().sort({ order: 1 }).lean()
    return successResponse(items)
  } catch (error) {
    console.error('Error fetching community items:', error)
    return errorResponse('Failed to fetch community items', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    const item = await CommunityItem.create(data)
    revalidatePortfolio()
    return successResponse(item, 'Community item created successfully', 201)
  } catch (error) {
    console.error('Error creating community item:', error)
    return errorResponse('Failed to create community item', 500)
  }
}
