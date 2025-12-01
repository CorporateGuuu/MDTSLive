# FedEx Integration

This document describes the FedEx API integration for real-time shipment tracking in the Midas Technical Solutions application.

## Overview

The FedEx integration allows the application to retrieve real-time tracking information for shipments, providing customers with accurate delivery status updates.

## Setup

### 1. Get FedEx API Credentials

1. Visit the [FedEx Developer Portal](https://developer.fedex.com/)
2. Create a developer account
3. Register your application
4. Get your Client ID and Client Secret

### 2. Environment Variables

Add the following to your `.env` file:

```bash
# FedEx API Configuration
FEDEX_CLIENT_ID=your-fedex-client-id-here
FEDEX_CLIENT_SECRET=your-fedex-client-secret-here
```

### 3. API Endpoints

#### Track Single Shipment (GET)
```
GET /api/fedex/track?trackingNumber=123456789012
```

#### Track Multiple Shipments (POST)
```
POST /api/fedex/track
Content-Type: application/json

{
  "trackingNumbers": ["123456789012", "987654321098"]
}
```

## Usage Examples

### JavaScript/TypeScript

```javascript
import { getTrackingInfo } from 'utils/fedex';

// Track a single shipment
const trackingData = await getTrackingInfo('123456789012');
console.log(trackingData);

// API Route usage
const response = await fetch('/api/fedex/track?trackingNumber=123456789012');
const data = await response.json();
```

### React Hook (Future Implementation)

```javascript
import { useState, useEffect } from 'react';

function useFedExTracking(trackingNumber) {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!trackingNumber) return;

    setLoading(true);
    fetch(`/api/fedex/track?trackingNumber=${trackingNumber}`)
      .then(res => res.json())
      .then(data => {
        setTrackingData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [trackingNumber]);

  return { trackingData, loading, error };
}
```

## API Response Format

The FedEx API returns detailed tracking information including:

- Current shipment status
- Estimated delivery date/time
- Detailed scan events
- Package weight and dimensions
- Delivery location information
- Exception notifications

## Error Handling

The integration includes comprehensive error handling:

- Invalid tracking numbers
- API authentication failures
- Network timeouts
- Rate limiting

## Caching

The integration implements intelligent token caching to minimize API calls and improve performance. FedEx OAuth tokens are cached for their full lifetime minus a 1-minute buffer.

## Security

- API credentials are stored securely in environment variables
- No sensitive data is logged
- HTTPS-only communication with FedEx APIs
- Input validation on all tracking requests

## Testing

For testing purposes, you can use FedEx's sample tracking numbers:

- 449044304137821 (Standard Overnight)
- 568838414941 (Express Saver)
- 403934084723025 (Ground)

## Support

For issues with the FedEx integration:

1. Check that your API credentials are valid
2. Verify environment variables are set correctly
3. Check the application logs for detailed error messages
4. Contact FedEx developer support if API issues persist

## Future Enhancements

- Real-time webhook notifications for status updates
- Shipment creation and label generation
- Rate shopping and comparison
- Address validation
- Pickup request scheduling
