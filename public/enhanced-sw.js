// Enhanced Service Worker for Nexus TechHub PWA - UAE Market
const CACHE_NAME = 'nexus-techhub-v3.0';
const STATIC_CACHE = 'nexus-static-v3.0';
const DYNAMIC_CACHE = 'nexus-dynamic-v3.0';
const IMAGES_CACHE = 'nexus-images-v3.0';
const API_CACHE = 'nexus-api-v3.0';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/icons/badge-72x72.svg',
  '/css/global.css',
  '/css/components.css',
  '/images/nexus-logo.svg',
  '/images/hero-repair-parts.svg',
  '/images/placeholder.svg'
];

// Routes to cache dynamically
const DYNAMIC_ROUTES = [
  '/products',
  '/categories',
  '/iphone-parts',
  '/samsung-parts',
  '/ipad-parts',
  '/repair-tools',
  '/contact',
  '/about',
  '/account'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/products',
  '/api/categories',
  '/api/search'
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGES_CACHE && 
                cacheName !== API_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - Network first with cache fallback
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    // Images - Cache first with network fallback
    event.respondWith(handleImageRequest(request));
  } else if (STATIC_ASSETS.includes(url.pathname)) {
    // Static assets - Cache first
    event.respondWith(handleStaticRequest(request));
  } else if (DYNAMIC_ROUTES.some(route => url.pathname.startsWith(route))) {
    // Dynamic routes - Stale while revalidate
    event.respondWith(handleDynamicRequest(request));
  } else {
    // Default - Network first with cache fallback
    event.respondWith(handleDefaultRequest(request));
  }
});

// Handle API requests - Network first with cache fallback
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This feature is not available offline',
      cached: false
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle image requests - Cache first with network fallback
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGES_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Image fetch failed:', error);
  }
  
  // Return placeholder image
  return caches.match('/images/placeholder.svg');
}

// Handle static requests - Cache first
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Static asset fetch failed:', error);
  }
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    return caches.match('/offline');
  }
  
  return new Response('Asset not available offline', { status: 503 });
}

// Handle dynamic requests - Stale while revalidate
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {
      // Ignore network errors for background updates
    });
    
    return cachedResponse;
  }
  
  // No cache available, try network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Dynamic request failed:', error);
  }
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    return caches.match('/offline');
  }
  
  return new Response('Page not available offline', { status: 503 });
}

// Handle default requests - Network first with cache fallback
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Default request failed:', error);
  }
  
  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    return caches.match('/offline');
  }
  
  return new Response('Content not available offline', { status: 503 });
}

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Perform background sync
async function doBackgroundSync() {
  try {
    // Sync offline actions (orders, form submissions, etc.)
    await syncOfflineActions();
    
    // Update cached content
    await updateCachedContent();
    
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Sync offline actions
async function syncOfflineActions() {
  // Get offline actions from IndexedDB
  // This would typically include:
  // - Pending orders
  // - Form submissions
  // - User preferences
  // - Analytics events
  
  console.log('Syncing offline actions...');
  // Implementation would go here
}

// Update cached content
async function updateCachedContent() {
  console.log('Updating cached content...');
  
  // Update product data
  try {
    const response = await fetch('/api/products?limit=50');
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put('/api/products', response.clone());
    }
  } catch (error) {
    console.log('Failed to update product cache:', error);
  }
}

// Periodic sync event (for browsers that support it)
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered');
  
  if (event.tag === 'daily-sync') {
    event.waitUntil(doDailySync());
  }
});

// Perform daily sync
async function doDailySync() {
  try {
    // Update all cached content
    await updateCachedContent();
    
    // Clean up old cache entries
    await cleanupOldCacheEntries();
    
    console.log('Daily sync completed');
  } catch (error) {
    console.error('Daily sync failed:', error);
  }
}

// Clean up old cache entries
async function cleanupOldCacheEntries() {
  const cacheNames = [DYNAMIC_CACHE, IMAGES_CACHE, API_CACHE];
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  const now = Date.now();
  
  for (const cacheName of cacheNames) {
    try {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        const dateHeader = response.headers.get('date');
        
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          if (now - responseDate > maxAge) {
            await cache.delete(request);
            console.log('Deleted old cache entry:', request.url);
          }
        }
      }
    } catch (error) {
      console.error('Cache cleanup failed for', cacheName, error);
    }
  }
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: 'You have a new update from Nexus TechHub',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/badge-72x72.svg',
    tag: 'nexus-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/view-icon.svg'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.svg'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.title = data.title || 'Nexus TechHub';
    options.tag = data.tag || options.tag;
  }
  
  event.waitUntil(
    self.registration.showNotification('Nexus TechHub', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
