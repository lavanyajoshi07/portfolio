import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { MediaAsset } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'
import { deleteFromCloudinary } from '@/lib/cloudinary'
import { Types } from 'mongoose'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid media asset ID', 400)
    }

    await connectDB()
    const asset = await MediaAsset.findById(id)

    if (!asset) {
      return errorResponse('Media asset not found', 404)
    }

    // Determine resource type for Cloudinary deletion
    let resourceType: 'image' | 'video' | 'raw' = 'raw'
    if (asset.type === 'image') {
      resourceType = 'image'
    } else if (asset.type === 'video' || asset.type === 'audio') {
      resourceType = 'video'
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(asset.publicId, resourceType)
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError)
      // We will still proceed to delete from database even if Cloudinary file is already gone
    }

    await MediaAsset.findByIdAndDelete(id)

    return successResponse({ id }, 'Media asset deleted successfully')
  } catch (error) {
    console.error('Error deleting media asset:', error)
    return errorResponse('Failed to delete media asset', 500)
  }
}
