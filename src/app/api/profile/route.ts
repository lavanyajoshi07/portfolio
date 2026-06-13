import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Profile } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'

export async function GET() {
  try {
    await connectDB()
    const profile = await Profile.findOne().lean()

    if (!profile) {
      return successResponse(null, 'No profile found')
    }

    return successResponse(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return errorResponse('Failed to fetch profile', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Check auth
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const data = await req.json()
    await connectDB()

    let profile = await Profile.findOne()

    if (!profile) {
      profile = await Profile.create(data)
    } else {
      Object.assign(profile, data)
      await profile.save()
    }

    return successResponse(profile, 'Profile updated successfully')
  } catch (error) {
    console.error('Error updating profile:', error)
    return errorResponse('Failed to update profile', 500)
  }
}