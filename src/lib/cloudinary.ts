import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export type UploadOptions = {
  folder?: string
  resourceType?: 'image' | 'video' | 'raw' | 'auto'
  allowedFormats?: string[]
  maxFileSize?: number
}

export async function uploadToCloudinary(
  fileData: string | Buffer,
  options: UploadOptions = {}
): Promise<{
  url: string
  publicId: string
  width?: number
  height?: number
  duration?: number
  size: number
  format: string
}> {
  const uploadOptions = {
    folder: options.folder ?? 'portfolio',
    resource_type: (options.resourceType ?? 'auto') as 'image' | 'video' | 'raw' | 'auto',
    allowed_formats: options.allowedFormats,
    quality: 'auto',
    fetch_format: 'auto',
  }

  const result = await cloudinary.uploader.upload(
    typeof fileData === 'string' ? fileData : `data:application/octet-stream;base64,${fileData.toString('base64')}`,
    uploadOptions
  )

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    duration: result.duration,
    size: result.bytes,
    format: result.format,
  }
}

export async function deleteFromCloudinary(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}

export function getOptimizedImageUrl(
  publicId: string,
  options: { width?: number; height?: number; quality?: number } = {}
): string {
  return cloudinary.url(publicId, {
    ...options,
    fetch_format: 'auto',
    quality: options.quality ?? 'auto',
  })
}

export default cloudinary