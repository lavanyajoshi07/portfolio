import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { Certification } from '@/models'; // Ensure your models export this
import { successResponse, errorResponse, requireAdmin } from '@/lib/api';

// GET: Retrieve a single certification
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const cert = await Certification.findById(params.id);
  if (!cert) return errorResponse('Certification not found', 404);
  return successResponse(cert);
}

// PUT: Update a certification
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await connectDB();
    const body = await req.json();
    const updated = await Certification.findByIdAndUpdate(params.id, body, { new: true });
    return successResponse(updated, 'Certification updated successfully');
  } catch (error) {
    return errorResponse('Failed to update certification', 500);
  }
}

// DELETE: Remove a certification
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await connectDB();
    await Certification.findByIdAndDelete(params.id);
    return successResponse(null, 'Certification deleted successfully');
  } catch (error) {
    return errorResponse('Failed to delete certification', 500);
  }
}