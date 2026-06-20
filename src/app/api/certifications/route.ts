import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { Certification } from '@/models';
import { successResponse, errorResponse, requireAdmin, revalidatePortfolio } from '@/lib/api';
import { safeParse, certificationSchema } from '@/lib/validation';

export async function GET() {
  try {
    await connectDB();
    const certifications = await Certification.find().sort({ sortOrder: 1 }).lean();
    return successResponse(certifications);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return errorResponse('Failed to fetch certifications', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    // SECURITY: Ensure admin access
    await requireAdmin();

    const body = await req.json();
    
    // VALIDATION: Ensure the data meets your Zod schema requirements
    const validation = safeParse(certificationSchema, body);
    if (!validation.success) {
      return errorResponse(validation.error as any, 400);
    }

    await connectDB();
    const certification = await Certification.create(validation.data);
    revalidatePortfolio();

    return successResponse(certification, 'Certification created successfully', 201);
  } catch (error) {
    console.error('Error creating certification:', error);
    return errorResponse('Failed to create certification', 500);
  }
}
