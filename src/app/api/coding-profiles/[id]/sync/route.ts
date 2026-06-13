import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { CodingProfile } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'
import { syncCodingProfile } from '@/lib/coding-fetchers'
import { Types } from 'mongoose'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid profile ID', 400)
    }

    await connectDB()
    const profile = await CodingProfile.findById(id)

    if (!profile) {
      return errorResponse('Coding profile not found', 404)
    }

    // Sync external data
    let displayData = {}
    try {
      displayData = await syncCodingProfile(profile.platform, profile.username)
    } catch (syncError) {
      console.error(`Sync failed for platform ${profile.platform} username ${profile.username}:`, syncError)
      return errorResponse(`Failed to sync data from ${profile.platform}`, 502)
    }

    // Update profile
    profile.displayData = displayData
    profile.lastSynced = new Date()
    await profile.save()

    return successResponse(profile, `${profile.platform} profile synchronized successfully`)
  } catch (error) {
    console.error('Error in coding profile sync route:', error)
    return errorResponse('Failed to synchronize profile', 500)
  }
}
