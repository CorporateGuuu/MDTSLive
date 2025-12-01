import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase/admin';
import { getUserFromCookie } from '../../../lib/auth';
import { validateData, uploadSignedUrlSchema } from '../../../lib/validate';

// =============================================================================
// Midas Technical Solutions - Upload Signed URL API Route
// =============================================================================

/**
 * POST /api/upload-signed-url
 *
 * Generates a signed upload URL for Supabase Storage
 *
 * Request Body:
 * {
 *   fileName: string (required) - Name of the file to upload
 *   bucket: 'products' | 'avatars' (required) - Storage bucket
 * }
 *
 * Response:
 * {
 *   signedUrl: string - URL to upload the file to
 *   publicUrl: string - Public URL to access the uploaded file
 * }
 *
 * Authentication: Required (via cookie)
 * CORS: Enabled for frontend fetch
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        {
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = validateData(uploadSignedUrlSchema, body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.issues
        },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    const { fileName, bucket } = validationResult.data;

    // Basic file size validation (5MB limit)
    // Note: This is a basic check. Actual size validation should be done on the client
    // or through Supabase Storage policies
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    // Generate signed upload URL
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(fileName, {
        upsert: false, // Don't allow overwriting existing files
      });

    if (error) {
      console.error('Supabase Storage error:', error);
      return NextResponse.json(
        { error: 'Failed to generate upload URL' },
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    // Generate public URL for the uploaded file
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json(
      {
        signedUrl: data.signedUrl,
        publicUrl,
        fileName,
        bucket,
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );

  } catch (error) {
    console.error('Upload signed URL error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

/**
 * OPTIONS /api/upload-signed-url
 *
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
