import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { Profile } from '@/models'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const profile = (await Profile.findOne().lean()) as any
    
    if (profile?.resumeUrl) {
      // Redirect to the configured resume URL (typically a Cloudinary or PDF link)
      return NextResponse.redirect(profile.resumeUrl, 307)
    }
  } catch (error) {
    console.error('Error retrieving resume URL:', error)
  }
  
  // Fallback to the local resume.html if the resumeUrl is not configured or an error occurs
  const baseUrl = request.nextUrl.origin
  return NextResponse.redirect(`${baseUrl}/resume.html`, 307)
}
