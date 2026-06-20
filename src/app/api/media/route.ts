import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { MediaAsset } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'
import { uploadToCloudinary } from '@/lib/cloudinary'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

function isCloudinaryConfigured() {
  const name = process.env.CLOUDINARY_CLOUD_NAME
  const key = process.env.CLOUDINARY_API_KEY
  const secret = process.env.CLOUDINARY_API_SECRET

  if (!name || !key || !secret) return false
  if (
    secret.includes('*') || 
    secret.includes('your-') || 
    name.includes('your-') || 
    key.includes('your-') ||
    secret === 'your_api_secret'
  ) {
    return false
  }
  return true
}

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
  let filename = 'unknown'
  let size = 0
  let mimeType = 'unknown'
  
  try {
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      console.log('[Media Upload] Upload Failure: No file provided')
      return errorResponse('No file provided in form data', 400)
    }

    filename = file.name
    size = file.size
    mimeType = file.type

    // Validate size: limit to 10MB
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    if (size > MAX_SIZE) {
      console.log(`[Media Upload] Upload Failure: File too large (${size} bytes)`)
      return errorResponse('File too large', 400)
    }

    // Validate MIME types: support image (jpg/jpeg/png/webp), pdf, audio
    const isImage = mimeType.startsWith('image/')
    const isPdf = mimeType === 'application/pdf'
    const isAudio = mimeType.startsWith('audio/')
    const isVideo = mimeType.startsWith('video/')

    if (!isImage && !isPdf && !isAudio && !isVideo) {
      console.log(`[Media Upload] Upload Failure: Unsupported format (${mimeType})`)
      return errorResponse('Unsupported format', 400)
    }

    if (isImage && !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(mimeType)) {
      console.log(`[Media Upload] Upload Failure: Unsupported image format (${mimeType})`)
      return errorResponse('Unsupported format', 400)
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Determine type
    let resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
    let mediaType: 'image' | 'video' | 'audio' | 'document' = 'document'

    if (isImage) {
      resourceType = 'image'
      mediaType = 'image'
    } else if (isVideo) {
      resourceType = 'video'
      mediaType = 'video'
    } else if (isAudio) {
      resourceType = 'video'
      mediaType = 'audio'
    }

    const isCloudinaryActive = isCloudinaryConfigured()
    let storageProviderUsed = isCloudinaryActive ? 'Cloudinary' : 'Local Disk'

    console.log(`[Media Upload] Starting upload protocol.
  Filename: ${filename}
  Size: ${size} bytes
  Mime Type: ${mimeType}
  Storage Provider Target: ${storageProviderUsed}`)

    // Resizing variables
    let originalUrl = ''
    let mediumUrl = ''
    let thumbnailUrl = ''
    let publicId = ''
    let width: number | undefined
    let height: number | undefined
    let duration: number | undefined

    let uploadSuccess = false

    if (isCloudinaryActive) {
      try {
        if (isImage) {
          // Optimize and resize via sharp
          const mediumBuffer = await sharp(buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .toBuffer()

          const thumbnailBuffer = await sharp(buffer)
            .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
            .toBuffer()

          // Upload all three versions to Cloudinary
          const uploadOrig = await uploadToCloudinary(buffer, { folder: 'portfolio', resourceType })
          const uploadMed = await uploadToCloudinary(mediumBuffer, { folder: 'portfolio', resourceType })
          const uploadThumb = await uploadToCloudinary(thumbnailBuffer, { folder: 'portfolio', resourceType })

          originalUrl = uploadOrig.url
          mediumUrl = uploadMed.url
          thumbnailUrl = uploadThumb.url
          publicId = uploadOrig.publicId
          width = uploadOrig.width
          height = uploadOrig.height
        } else {
          // Non-images
          const uploadResult = await uploadToCloudinary(buffer, { folder: 'portfolio', resourceType })
          originalUrl = uploadResult.url
          mediumUrl = uploadResult.url
          thumbnailUrl = uploadResult.url
          publicId = uploadResult.publicId
          duration = uploadResult.duration
        }
        uploadSuccess = true
      } catch (err: any) {
        console.error('[Media Upload] Cloudinary upload failed. Attempting local storage fallback. Error:', err)
        const errMsg = err.message || ''
        
        if (errMsg.includes('ENOTFOUND') || errMsg.includes('ETIMEDOUT') || errMsg.includes('timeout') || errMsg.includes('fetch failed')) {
          console.log('[Media Upload] Detected Network error during Cloudinary upload.')
        } else if (errMsg.includes('api_key') || errMsg.includes('api_secret') || errMsg.includes('cloud_name')) {
          console.log('[Media Upload] Detected Storage configuration missing / invalid credentials.')
        }
        
        storageProviderUsed = 'Local Disk (Fallback)'
      }
    }

    // Local Disk storage logic if Cloudinary is not active or failed
    if (!uploadSuccess) {
      try {
        const fileExt = path.extname(filename) || `.${mimeType.split('/')[1]}`
        const sanitizedBase = filename
          .replace(fileExt, '')
          .replace(/[^a-zA-Z0-9_-]/g, '_')
        const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`

        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }

        if (isImage) {
          const origName = `orig-${uniqueId}-${sanitizedBase}${fileExt}`
          const medName = `med-${uniqueId}-${sanitizedBase}${fileExt}`
          const thumbName = `thumb-${uniqueId}-${sanitizedBase}${fileExt}`

          const mediumBuffer = await sharp(buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .toBuffer()

          const thumbnailBuffer = await sharp(buffer)
            .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
            .toBuffer()

          await fs.promises.writeFile(path.join(uploadDir, origName), buffer)
          await fs.promises.writeFile(path.join(uploadDir, medName), mediumBuffer)
          await fs.promises.writeFile(path.join(uploadDir, thumbName), thumbnailBuffer)

          // Measure dimensions of original image
          const metadata = await sharp(buffer).metadata()
          width = metadata.width
          height = metadata.height

          originalUrl = `/uploads/${origName}`
          mediumUrl = `/uploads/${medName}`
          thumbnailUrl = `/uploads/${thumbName}`
          publicId = `local_uploads/${origName}`
        } else {
          const uniqueName = `${uniqueId}-${sanitizedBase}${fileExt}`
          await fs.promises.writeFile(path.join(uploadDir, uniqueName), buffer)

          originalUrl = `/uploads/${uniqueName}`
          mediumUrl = `/uploads/${uniqueName}`
          thumbnailUrl = `/uploads/${uniqueName}`
          publicId = `local_uploads/${uniqueName}`
        }
        uploadSuccess = true
      } catch (localErr) {
        console.error('[Media Upload] Local storage fallback failed:', localErr)
        return errorResponse('Storage configuration missing', 500)
      }
    }

    if (!uploadSuccess) {
      console.log('[Media Upload] Upload Failure: Unknown error')
      return errorResponse('Upload Failed', 500)
    }

    // Save to Database
    await connectDB()
    const asset = await MediaAsset.create({
      name: filename,
      type: mediaType,
      url: originalUrl,
      publicId: publicId,
      size: size,
      mimeType: mimeType,
      dimensions: width && height ? { width, height } : undefined,
      duration: duration,
      thumbnailUrl,
      mediumUrl,
      originalUrl,
    })

    console.log(`[Media Upload] Upload Success.
  Filename: ${filename}
  Storage Provider Used: ${storageProviderUsed}
  Generated URL (Original): ${originalUrl}
  Generated URL (Medium): ${mediumUrl}
  Generated URL (Thumbnail): ${thumbnailUrl}
  Database Update Result: Success. Asset ID: ${asset._id}`)

    return successResponse(asset, 'Media uploaded successfully', 201)
  } catch (error: any) {
    console.error('[Media Upload] Global error uploading media:', error)
    
    const errMsg = error.message || ''
    if (errMsg.includes('ENOTFOUND') || errMsg.includes('ETIMEDOUT') || errMsg.includes('timeout') || errMsg.includes('fetch failed')) {
      return errorResponse('Network error', 503)
    }
    
    return errorResponse('Failed to upload media', 500)
  }
}
