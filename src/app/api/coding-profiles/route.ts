import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { CodingProfile } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'
import { syncCodingProfile } from '@/lib/coding-fetchers'

export async function GET() {
  try {
    await connectDB()
    const profiles = await CodingProfile.find().sort({ platform: 1 }).lean()
    return successResponse(profiles)
  } catch (error) {
    console.error('Error fetching coding profiles:', error)
    return errorResponse('Failed to fetch coding profiles', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const { platform, username, enabled = true, profileUrl } = await req.json()

    if (!platform || !username) {
      return errorResponse('Platform and username are required', 400)
    }

    await connectDB()

    // Check for duplicate profile
    const existing = await CodingProfile.findOne({ platform, username })
    if (existing) {
      return errorResponse('Coding profile for this platform and username already exists', 400)
    }

    // Attempt to sync immediately
    let displayData = {}
    try {
      displayData = await syncCodingProfile(platform, username)
    } catch (syncError) {
      console.error('Initial sync failed on creation:', syncError)
    }

    const newProfile = await CodingProfile.create({
      platform,
      username,
      profileUrl: profileUrl || `https://${platform}.com/${username}`,
      enabled,
      displayData,
      lastSynced: new Date(),
    })

    return successResponse(newProfile, 'Coding profile created successfully', 201)
  } catch (error) {
    console.error('Error creating coding profile:', error)
    return errorResponse('Failed to create coding profile', 500)
  }
}
