import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { Profile } from '@/models'
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api'

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
    // 1. Verify administrative authorization
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    // 2. Parse the request body
    const data = await req.json()
    await connectDB()

    // 3. Update the profile document
    // Using findOneAndUpdate with $set ensures nested structures are correctly persisted
    const profile = await Profile.findOneAndUpdate(
      {}, // Empty filter targets the first existing document
      { $set: data }, // $set forces an overwrite of the specified fields
      { 
        new: true,          // Returns the updated document
        upsert: true,       // Creates the document if it does not exist
        runValidators: true // Enforces schema validation during the update
      }
    )

    // 4. Trigger revalidation to update the static/cached portfolio site
    revalidatePortfolio()
    
    return successResponse(profile, 'Profile updated successfully')
  } catch (error) {
    console.error('Error updating profile:', error)
    return errorResponse('Failed to update profile', 500)
  }
}   