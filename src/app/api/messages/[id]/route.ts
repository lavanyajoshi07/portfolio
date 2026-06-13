import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { ContactMessage } from '@/models'
import { successResponse, errorResponse, requireAdmin } from '@/lib/api'
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
      return errorResponse('Invalid message ID', 400)
    }

    const { read } = await req.json()
    await connectDB()

    const message = await ContactMessage.findByIdAndUpdate(id, { read }, { new: true })

    if (!message) {
      return errorResponse('Message not found', 404)
    }

    return successResponse(message, 'Message status updated successfully')
  } catch (error) {
    console.error('Error updating message:', error)
    return errorResponse('Failed to update message', 500)
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await requireAdmin()
    if (authResult.error) return authResult.error

    if (!Types.ObjectId.isValid(id)) {
      return errorResponse('Invalid message ID', 400)
    }

    await connectDB()
    const message = await ContactMessage.findByIdAndDelete(id)

    if (!message) {
      return errorResponse('Message not found', 404)
    }

    return successResponse({ id }, 'Message deleted successfully')
  } catch (error) {
    console.error('Error deleting message:', error)
    return errorResponse('Failed to delete message', 500)
  }
}
