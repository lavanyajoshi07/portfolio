import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { MediaAsset } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    await connectDB()
    const query = type ? { type } : {}
    const assets = await MediaAsset.find(query).sort({ createdAt: -1 }).lean()

    return successResponse(assets)
  } catch (error) {
    console.error('Error fetching media assets:', error)
    return errorResponse('Failed to fetch media assets', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return errorResponse('No file provided in form data', 400)
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Determine type
    let resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
    let mediaType: 'image' | 'video' | 'audio' | 'document' = 'document'

    if (file.type.startsWith('image/')) {
      resourceType = 'image'
      mediaType = 'image'
    } else if (file.type.startsWith('video/')) {
      resourceType = 'video'
      mediaType = 'video'
    } else if (file.type.startsWith('audio/')) {
      resourceType = 'video' // Cloudinary handles audio files under video resource type
      mediaType = 'audio'
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, {
      folder: 'portfolio',
      resourceType,
    })

    await connectDB()
    const asset = await MediaAsset.create({
      name: file.name,
      type: mediaType,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      size: uploadResult.size,
      mimeType: file.type,
      dimensions: uploadResult.width && uploadResult.height 
        ? { width: uploadResult.width, height: uploadResult.height } 
        : undefined,
      duration: uploadResult.duration,
    })

    return successResponse(asset, 'Media uploaded successfully', 201)
  } catch (error) {
    console.error('Error uploading media:', error)
    return errorResponse('Failed to upload media', 500)
  }
}
