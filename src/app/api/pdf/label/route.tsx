import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { CoreReturnLabel } from '../../../../components/pdf/CoreReturnLabel';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');
    const serviceType = searchParams.get('serviceType') || 'Ground';
    const weight = searchParams.get('weight') || '1 lb';
    const shipDate = searchParams.get('shipDate') || new Date().toLocaleDateString();
    const reference = searchParams.get('reference');

    // Parse address parameters
    const fromName = searchParams.get('fromName');
    const fromCompany = searchParams.get('fromCompany');
    const fromAddress = searchParams.get('fromAddress');
    const fromCity = searchParams.get('fromCity');
    const fromState = searchParams.get('fromState');
    const fromZip = searchParams.get('fromZip');

    const toName = searchParams.get('toName');
    const toCompany = searchParams.get('toCompany');
    const toAddress = searchParams.get('toAddress');
    const toCity = searchParams.get('toCity');
    const toState = searchParams.get('toState');
    const toZip = searchParams.get('toZip');

    // Validate required parameters
    if (!trackingNumber || !fromName || !fromAddress || !fromCity || !fromState || !fromZip ||
        !toName || !toAddress || !toCity || !toState || !toZip) {
      return NextResponse.json(
        { error: 'Missing required address or tracking parameters' },
        { status: 400 }
      );
    }

    const fromAddressObj = {
      name: fromName,
      company: fromCompany || '',
      address: fromAddress,
      city: fromCity,
      state: fromState,
      zip: fromZip,
    };

    const toAddressObj = {
      name: toName,
      company: toCompany || '',
      address: toAddress,
      city: toCity,
      state: toState,
      zip: toZip,
    };

    // Generate PDF stream
    const pdfStream = await renderToStream(
      <CoreReturnLabel
        trackingNumber={trackingNumber}
        fromAddress={fromAddressObj}
        toAddress={toAddressObj}
        serviceType={serviceType}
        weight={weight}
        shipDate={shipDate}
        reference={reference || undefined}
      />
    );

    // Return PDF as response
    const response = new NextResponse(pdfStream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Core_Return_Label_${trackingNumber}.pdf"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error generating label PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate label PDF' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      trackingNumber,
      fromAddress,
      toAddress,
      serviceType = 'Ground',
      weight = '1 lb',
      shipDate = new Date().toLocaleDateString(),
      reference,
    } = body;

    // Validate required parameters
    if (!trackingNumber || !fromAddress || !toAddress) {
      return NextResponse.json(
        { error: 'Missing required parameters: trackingNumber, fromAddress, toAddress' },
        { status: 400 }
      );
    }

    // Generate PDF stream
    const pdfStream = await renderToStream(
      <CoreReturnLabel
        trackingNumber={trackingNumber}
        fromAddress={fromAddress}
        toAddress={toAddress}
        serviceType={serviceType}
        weight={weight}
        shipDate={shipDate}
        reference={reference}
      />
    );

    // Return PDF as response
    const response = new NextResponse(pdfStream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Core_Return_Label_${trackingNumber}.pdf"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error generating label PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate label PDF' },
      { status: 500 }
    );
  }
}
