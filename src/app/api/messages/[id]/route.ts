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
    if (read === undefined) {
      return errorResponse('Read status is required', 400)
    }

    await connectDB()
    const updatedMessage = await ContactMessage.findByIdAndUpdate(
      id,
      { read },
      { new: true }
    )

    if (!updatedMessage) {
      return errorResponse('Message not found', 404)
    }

    return successResponse(updatedMessage, 'Message updated successfully')
  } catch (error) {
    console.error('Error updating message:', error)
    return errorResponse('Failed to update message', 500)
  }
}

export async function DELETE(
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

    await connectDB()
    const deletedMessage = await ContactMessage.findByIdAndDelete(id)

    if (!deletedMessage) {
      return errorResponse('Message not found', 404)
    }

    return successResponse({ id }, 'Message deleted successfully')
  } catch (error) {
    console.error('Error deleting message:', error)
    return errorResponse('Failed to delete message', 500)
  }
}
