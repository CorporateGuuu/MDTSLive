import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import JSZip from 'jszip';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// POST /api/marketing-materials/download-zip - Generate and download ZIP of all materials
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = cookies();
    const token = cookieStore.get('sb-access-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's IP address for tracking
    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    // Fetch all marketing materials
    const { data: materials, error: fetchError } = await supabase
      .from('gapp_marketing_materials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching marketing materials:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch marketing materials' },
        { status: 500 }
      );
    }

    if (!materials || materials.length === 0) {
      return NextResponse.json(
        { error: 'No marketing materials available' },
        { status: 404 }
      );
    }

    // Create ZIP file
    const zip = new JSZip();

    // Track download for each material
    const downloadPromises = materials.map(async (material) => {
      try {
        // Track the download
        await supabase
          .from('marketing_material_downloads')
          .insert({
            user_id: user.id,
            material_id: material.id,
            downloaded_at: new Date().toISOString(),
            ip_address: ipAddress,
            user_agent: request.headers.get('user-agent') || 'unknown',
          });

        // Increment download count using RPC function
        await supabase.rpc('increment_download_count', {
          material_id: material.id
        });

        // Fetch the file content (assuming file_url is accessible)
        // In a real implementation, you might need to fetch from Supabase Storage
        const response = await fetch(material.file_url);
        if (response.ok) {
          const fileContent = await response.arrayBuffer();
          const fileName = `${material.name.toLowerCase().replace(/\s+/g, '-')}.${getFileExtension(material.file_url)}`;
          zip.file(fileName, fileContent);
        } else {
          console.warn(`Failed to fetch file: ${material.file_url}`);
        }
      } catch (error) {
        console.error(`Error processing material ${material.id}:`, error);
      }
    });

    // Wait for all downloads to be tracked and files added
    await Promise.all(downloadPromises);

    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    const zipContent = new Uint8Array(zipBuffer);

    // Return ZIP file as response
    return new Response(zipContent, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="gapp-marketing-materials.zip"',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Error in POST /api/marketing-materials/download-zip:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get file extension from URL
function getFileExtension(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const extension = pathname.split('.').pop()?.toLowerCase();

    // Common file extensions for marketing materials
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'doc', 'docx', 'ppt', 'pptx'];
    return validExtensions.includes(extension || '') ? extension! : 'pdf';
  } catch {
    return 'pdf';
  }
}
