import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { GAPPCertificate } from '../../../../components/pdf/GAPPCertificate';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userName = searchParams.get('userName');
    const certificateNumber = searchParams.get('certificateNumber');
    const enrollmentDate = searchParams.get('enrollmentDate');
    const expiryDate = searchParams.get('expiryDate');

    // Validate required parameters
    if (!userName || !certificateNumber || !enrollmentDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: userName, certificateNumber, enrollmentDate' },
        { status: 400 }
      );
    }

    // Generate PDF stream
    const pdfStream = await renderToStream(
      <GAPPCertificate
        userName={userName}
        certificateNumber={certificateNumber}
        enrollmentDate={enrollmentDate}
        expiryDate={expiryDate || undefined}
      />
    );

    // Return PDF as response
    const response = new NextResponse(pdfStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="GAPP_Certificate_${certificateNumber}.pdf"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error generating certificate PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate PDF' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, certificateNumber, enrollmentDate, expiryDate } = body;

    // Validate required parameters
    if (!userName || !certificateNumber || !enrollmentDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: userName, certificateNumber, enrollmentDate' },
        { status: 400 }
      );
    }

    // Generate PDF stream
    const pdfStream = await renderToStream(
      <GAPPCertificate
        userName={userName}
        certificateNumber={certificateNumber}
        enrollmentDate={enrollmentDate}
        expiryDate={expiryDate}
      />
    );

    // Return PDF as response
    const response = new NextResponse(pdfStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="GAPP_Certificate_${certificateNumber}.pdf"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error generating certificate PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate PDF' },
      { status: 500 }
    );
  }
}
