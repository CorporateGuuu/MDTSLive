// utils/fedex.ts
const FEDEX_API = "https://apis.fedex.com";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getFedExToken(): Promise<string> {
  // Check if we have a cached token that's still valid
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  // Get new token from FedEx
  const clientId = process.env.FEDEX_CLIENT_ID;
  const clientSecret = process.env.FEDEX_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('FedEx credentials not configured');
  }

  const authResponse = await fetch(`${FEDEX_API}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!authResponse.ok) {
    throw new Error('Failed to authenticate with FedEx API');
  }

  const authData = await authResponse.json();

  // Cache the token (FedEx tokens typically expire in 1 hour)
  cachedToken = {
    token: authData.access_token,
    expiresAt: Date.now() + (3600 * 1000), // Expire 1 minute early
  };

  return cachedToken.token;
}

export async function getTrackingInfo(trackingNumber: string) {
  const token = await getFedExToken(); // cache this!
  const res = await fetch(`${FEDEX_API}/track/v1/trackingnumbers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      trackingInfo: [{ trackingNumberInfo: { trackingNumber } }],
      includeDetailedScans: true
    })
  });

  if (!res.ok) {
    throw new Error(`FedEx API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getMultipleTrackingInfo(trackingNumbers: string[]) {
  const token = await getFedExToken();

  const res = await fetch(`${FEDEX_API}/track/v1/trackingnumbers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      trackingInfo: trackingNumbers.map(trackingNumber => ({
        trackingNumberInfo: { trackingNumber }
      })),
      includeDetailedScans: true
    })
  });

  if (!res.ok) {
    throw new Error(`FedEx API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
