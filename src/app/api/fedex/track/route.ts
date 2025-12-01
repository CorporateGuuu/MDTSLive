import { NextRequest, NextResponse } from 'next/server';
import { getTrackingInfo, getMultipleTrackingInfo } from 'utils/fedex';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackingNumbers } = body;

    if (!trackingNumbers) {
      return NextResponse.json(
        { error: 'Tracking numbers are required' },
        { status: 400 }
      );
    }

    let trackingData;

    if (Array.isArray(trackingNumbers)) {
      // Multiple tracking numbers
      if (trackingNumbers.length === 0) {
        return NextResponse.json(
          { error: 'At least one tracking number is required' },
          { status: 400 }
        );
      }
      trackingData = await getMultipleTrackingInfo(trackingNumbers);
    } else {
      // Single tracking number
      trackingData = await getTrackingInfo(trackingNumbers);
    }

    return NextResponse.json({
      success: true,
      data: trackingData
    });

  } catch (error) {
    console.error('FedEx API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve tracking information',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET method for single tracking number via query parameter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const trackingData = await getTrackingInfo(trackingNumber);

    return NextResponse.json({
      success: true,
      data: trackingData
    });

  } catch (error) {
    console.error('FedEx API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve tracking information',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
