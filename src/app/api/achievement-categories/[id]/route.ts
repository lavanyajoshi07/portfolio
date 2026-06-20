import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { AchievementCategory, Achievement } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'
import { Types } from 'mongoose'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid category ID', 400)
    }

    const data = await req.json()
    await connectDB()

    const category = await AchievementCategory.findByIdAndUpdate(id, data, { new: true })

    if (!category) {
      return errorResponse('Category not found', 404)
    }

    revalidatePortfolio()
    return successResponse(category, 'Category updated successfully')
  } catch (error) {
    console.error('Error updating category:', error)
    return errorResponse('Failed to update category', 500)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid category ID', 400)
    }

    await connectDB()

    const url = new URL(req.url)
    const isPermanent = url.searchParams.get('permanent') === 'true'
    const mode = url.searchParams.get('mode')
    const targetId = url.searchParams.get('targetId')

    // Check for associated achievements
    // Only check active achievements or those in trash if permanent delete? Let's check both
    const achievementsCount = await Achievement.countDocuments({
      category: id,
      deletedAt: isPermanent ? { $exists: true } : null,
    })

    if (achievementsCount > 0 && !mode) {
      return NextResponse.json({
        success: false,
        error: `Category contains ${achievementsCount} achievements`,
        code: 'ASSOCIATED_ACHIEVEMENTS_EXIST',
        count: achievementsCount
      }, { status: 400 })
    }

    // Process associated achievements if mode is supplied
    if (achievementsCount > 0) {
      if (mode === 'cascade') {
        if (isPermanent) {
          await Achievement.deleteMany({ category: id })
        } else {
          await Achievement.updateMany({ category: id }, { deletedAt: new Date() })
        }
      } else if (mode === 'move') {
        if (!targetId || !Types.ObjectId.isValid(targetId)) {
          return errorResponse('Invalid target category ID for moving achievements', 400)
        }
        await Achievement.updateMany({ category: id }, { category: targetId })
      } else {
        return errorResponse('Invalid deletion mode', 400)
      }
    }

    let category
    if (isPermanent) {
      category = await AchievementCategory.findByIdAndDelete(id)
    } else {
      category = await AchievementCategory.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true }
      )
    }

    if (!category) {
      return errorResponse('Category not found', 404)
    }

    revalidatePortfolio()
    return successResponse({ id }, isPermanent ? 'Category permanently deleted' : 'Category moved to trash')
  } catch (error) {
    console.error('Error deleting category:', error)
    return errorResponse('Failed to delete category', 500)
  }
}

import { NextResponse } from 'next/server'
