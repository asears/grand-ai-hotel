# Service Worker PWA Example

Modern Progressive Web App implementation with Service Worker, advanced caching strategies, offline support, and background sync.

## Features

### 🔌 Offline Support
- Full offline functionality with cached resources
- Offline fallback pages
- Network detection and status indicators
- Graceful degradation

### 🚀 Caching Strategies
- **Network-First**: Fresh data priority, cache fallback
- **Cache-First**: Instant loading for static assets
- **Stale-While-Revalidate**: Instant response + background updates

### 🔄 Background Sync
- Automatic retry of failed requests
- Queue management for offline operations
- Background data synchronization
- Periodic content updates

### 🔔 Push Notifications
- Web Push API integration
- Notification actions and interactions
- Background notification handling
- User permission management

### 💾 Cache Management
- Intelligent cache versioning
- Automatic cleanup of old caches
- Size and quota management
- Cache statistics and monitoring

## Architecture

```
service-worker/
├── strategies/                    # Caching Strategies
│   ├── network-first.js          # Network-first strategy
│   ├── cache-first.js            # Cache-first strategy
│   └── stale-while-revalidate.js # SWR strategy
├── tests/                         # Test Suite
│   └── sw.test.js                # Service Worker tests
├── sw.js                          # Service Worker main
├── index.html                     # Demo application
├── manifest.json                  # PWA manifest
├── package.json
└── README.md
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

**Note**: Service Workers require HTTPS or localhost for security.

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Build

```bash
npm run build
```

Production files will be in `dist/`.

## Usage Examples

### Registering Service Worker

```javascript
if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);
}
```

### Using Caching Strategies

#### Network-First Strategy

```javascript
import { NetworkFirstStrategy } from './strategies/network-first.js';

const strategy = new NetworkFirstStrategy({
    cacheName: 'api-cache',
    networkTimeout: 3000,
    maxAge: 300,        // 5 minutes
    maxEntries: 50
});

// In Service Worker fetch event
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) {
        event.respondWith(strategy.handle(event.request));
    }
});
```

#### Cache-First Strategy

```javascript
import { CacheFirstStrategy } from './strategies/cache-first.js';

const strategy = new CacheFirstStrategy({
    cacheName: 'images-cache',
    maxAge: 2592000,    // 30 days
    maxEntries: 100
});

// Prefetch images
await strategy.prefetch([
    '/images/logo.png',
    '/images/hero.jpg',
    '/images/background.png'
]);
```

#### Stale-While-Revalidate Strategy

```javascript
import { StaleWhileRevalidateStrategy } from './strategies/stale-while-revalidate.js';

const strategy = new StaleWhileRevalidateStrategy({
    cacheName: 'dynamic-cache',
    maxAge: 86400,      // 24 hours
    maxEntries: 60
});

// Warm cache
await strategy.warmCache([
    '/api/user/profile',
    '/api/settings'
]);

// Force revalidation
await strategy.revalidate(['/api/user/profile']);
```

### Background Sync

```javascript
// In Service Worker
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-messages') {
        event.waitUntil(syncMessages());
    }
});

async function syncMessages() {
    const cache = await caches.open('pending-requests');
    const requests = await cache.keys();
    
    for (const request of requests) {
        try {
            await fetch(request);
            await cache.delete(request);
        } catch (error) {
            console.error('Sync failed:', error);
        }
    }
}

// From main application
if ('serviceWorker' in navigator && 'sync' in registration) {
    await registration.sync.register('sync-messages');
}
```

### Push Notifications

```javascript
// Request permission
const permission = await Notification.requestPermission();

if (permission === 'granted') {
    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: '<your-vapid-public-key>'
    });
    
    // Send subscription to server
    await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
    });
}

// In Service Worker
self.addEventListener('push', (event) => {
    const data = event.data.json();
    
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/icon-192.png',
            badge: '/badge-72.png',
            actions: [
                { action: 'open', title: 'Open' },
                { action: 'close', title: 'Close' }
            ]
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open') {
        clients.openWindow('/');
    }
});
```

### Cache Statistics

```javascript
import { CacheFirstStrategy } from './strategies/cache-first.js';

const strategy = new CacheFirstStrategy({
    cacheName: 'my-cache'
});

const stats = await strategy.getStats();
console.log('Cache entries:', stats.entries);
console.log('Total size:', stats.totalSize);
console.log('Items:', stats.items);
```

## Caching Strategy Comparison

| Strategy | Use Case | Network | Cache | Best For |
|----------|----------|---------|-------|----------|
| **Network-First** | API calls, dynamic content | First | Fallback | Fresh data priority |
| **Cache-First** | Images, fonts, static assets | Fallback | First | Performance priority |
| **Stale-While-Revalidate** | CSS, JS, frequent updates | Background | First | Balance speed & freshness |

## Service Worker Lifecycle

### Install Phase
```javascript
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/styles.css',
                '/script.js'
            ]);
        })
    );
});
```

### Activate Phase
```javascript
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== 'v1')
                    .map((name) => caches.delete(name))
            );
        })
    );
});
```

### Fetch Phase
```javascript
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
```

## PWA Manifest

The `manifest.json` defines app metadata:

```json
{
    "name": "My PWA",
    "short_name": "PWA",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#4f46e5",
    "icons": [
        {
            "src": "/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        }
    ]
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14.1+

### Feature Detection

```javascript
const features = {
    serviceWorker: 'serviceWorker' in navigator,
    pushManager: 'PushManager' in window,
    notifications: 'Notification' in window,
    backgroundSync: 'sync' in registration,
    periodicSync: 'periodicSync' in registration
};
```

## Performance Optimization

### 1. Precaching Critical Assets
```javascript
const CRITICAL_ASSETS = [
    '/',
    '/styles.css',
    '/app.js',
    '/logo.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('critical-v1')
            .then((cache) => cache.addAll(CRITICAL_ASSETS))
    );
});
```

### 2. Route-based Caching
```javascript
const strategies = {
    api: new NetworkFirstStrategy({ cacheName: 'api' }),
    images: new CacheFirstStrategy({ cacheName: 'images' }),
    pages: new StaleWhileRevalidateStrategy({ cacheName: 'pages' })
};

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(strategies.api.handle(event.request));
    } else if (event.request.destination === 'image') {
        event.respondWith(strategies.images.handle(event.request));
    } else {
        event.respondWith(strategies.pages.handle(event.request));
    }
});
```

### 3. Lazy Loading
```javascript
// Cache on first access
const lazyCache = new Map();

async function getCached(url) {
    if (lazyCache.has(url)) {
        return lazyCache.get(url);
    }
    
    const response = await fetch(url);
    lazyCache.set(url, response.clone());
    return response;
}
```

## Debugging

### Chrome DevTools

1. Open DevTools (F12)
2. Go to **Application** tab
3. Navigate to **Service Workers**
4. View cache storage, clear cache, unregister SW

### Logging

```javascript
// In Service Worker
console.log('SW event:', event.type);
console.log('Request:', event.request.url);

// View in DevTools Console with "Service Workers" filter
```

### Update Strategy

```javascript
// Force update on page load
navigator.serviceWorker.register('/sw.js').then(reg => {
    reg.update();
});

// Listen for updates
navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
});
```

## Security Considerations

1. **HTTPS Required**: Service Workers only work over HTTPS (except localhost)
2. **Scope Restrictions**: SW only controls pages in its scope
3. **CORS Handling**: Respect CORS policies for cross-origin requests
4. **Content Security Policy**: Configure CSP headers properly

## Troubleshooting

### Service Worker Not Updating

```javascript
// Clear and re-register
navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister());
});

// Then reload page
```

### Cache Not Working

```javascript
// Check quota
if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    console.log('Quota:', estimate.quota);
    console.log('Usage:', estimate.usage);
}
```

### Push Notifications Not Showing

```javascript
// Check permission
if (Notification.permission !== 'granted') {
    await Notification.requestPermission();
}

// Test notification
new Notification('Test', { body: 'Testing...' });
```

## Best Practices

1. ✅ Version your caches for easy cleanup
2. ✅ Set appropriate cache expiration times
3. ✅ Implement cache size limits
4. ✅ Provide offline fallback pages
5. ✅ Use appropriate strategies per resource type
6. ✅ Handle errors gracefully
7. ✅ Monitor cache performance
8. ✅ Test offline functionality thoroughly

## Resources

- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

## License

MIT
