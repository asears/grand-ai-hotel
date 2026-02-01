/**
 * Service Worker - Main Entry Point
 * 
 * Modern Service Worker implementation for Progressive Web App.
 * Implements multiple caching strategies, background sync, and push notifications.
 * Uses Workbox for robust caching and routing.
 * 
 * Features:
 * - Precaching of static assets
 * - Runtime caching with multiple strategies
 * - Offline fallback pages
 * - Background sync for failed requests
 * - Push notification handling
 * - Cache versioning and cleanup
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
 */

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// Service Worker version for debugging
const SW_VERSION = '1.0.0';
const CACHE_PREFIX = 'pwa-cache';

console.log(`Service Worker ${SW_VERSION} loading...`);

/**
 * Precache static assets
 * This will be replaced by Workbox during build with actual file list
 */
precacheAndRoute(self.__WB_MANIFEST || []);

/**
 * Clean up old caches
 */
cleanupOutdatedCaches();

/**
 * Network-First Strategy for API requests
 * Try network first, fallback to cache if offline
 */
registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new NetworkFirst({
        cacheName: `${CACHE_PREFIX}-api`,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
            }),
            new BackgroundSyncPlugin('api-queue', {
                maxRetentionTime: 24 * 60 // Retry for up to 24 hours
            })
        ]
    })
);

/**
 * Cache-First Strategy for images
 * Serve from cache, update in background
 */
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: `${CACHE_PREFIX}-images`,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            })
        ]
    })
);

/**
 * Stale-While-Revalidate for CSS and JavaScript
 * Return cached version immediately, update in background
 */
registerRoute(
    ({ request }) => 
        request.destination === 'style' || 
        request.destination === 'script',
    new StaleWhileRevalidate({
        cacheName: `${CACHE_PREFIX}-assets`,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
            })
        ]
    })
);

/**
 * Network-First for HTML pages
 * Always try to get fresh content, fallback to cache
 */
registerRoute(
    ({ request }) => request.destination === 'document',
    new NetworkFirst({
        cacheName: `${CACHE_PREFIX}-pages`,
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 1 day
            })
        ]
    })
);

/**
 * Offline fallback page
 */
const OFFLINE_URL = '/offline.html';

// Cache offline page during install
self.addEventListener('install', (event) => {
    console.log(`Service Worker ${SW_VERSION} installing...`);
    
    event.waitUntil(
        caches.open(`${CACHE_PREFIX}-offline`)
            .then((cache) => cache.add(OFFLINE_URL))
            .then(() => self.skipWaiting())
    );
});

/**
 * Activate event - cleanup old caches
 */
self.addEventListener('activate', (event) => {
    console.log(`Service Worker ${SW_VERSION} activating...`);
    
    event.waitUntil(
        Promise.all([
            // Clean up old cache versions
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => 
                            cacheName.startsWith(CACHE_PREFIX) &&
                            !cacheName.includes(SW_VERSION)
                        )
                        .map((cacheName) => {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            }),
            // Take control of all clients immediately
            self.clients.claim()
        ])
    );
});

/**
 * Fetch event handler with offline support
 */
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // For navigation requests, return offline page if network fails
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match(OFFLINE_URL);
                })
        );
    }
});

/**
 * Background Sync event
 * Retry failed API requests when connection is restored
 */
self.addEventListener('sync', (event) => {
    console.log('Background sync:', event.tag);
    
    if (event.tag === 'sync-messages') {
        event.waitUntil(syncMessages());
    }
});

/**
 * Sync pending messages
 */
async function syncMessages() {
    try {
        // Get pending messages from IndexedDB or cache
        const cache = await caches.open(`${CACHE_PREFIX}-pending`);
        const requests = await cache.keys();
        
        for (const request of requests) {
            try {
                await fetch(request.clone());
                await cache.delete(request);
                console.log('Synced request:', request.url);
            } catch (error) {
                console.error('Failed to sync request:', error);
            }
        }
    } catch (error) {
        console.error('Sync failed:', error);
        throw error;
    }
}

/**
 * Push notification event
 */
self.addEventListener('push', (event) => {
    console.log('Push notification received');
    
    const options = {
        body: event.data?.text() || 'New notification',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [200, 100, 200],
        tag: 'notification',
        requireInteraction: false,
        actions: [
            {
                action: 'open',
                title: 'Open App'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: crypto.randomUUID()
        }
    };

    event.waitUntil(
        self.registration.showNotification('PWA Notification', options)
    );
});

/**
 * Notification click event
 */
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.action);
    
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

/**
 * Message event - communication with main thread
 */
self.addEventListener('message', (event) => {
    console.log('Message received from client:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: SW_VERSION });
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys()
                .then((cacheNames) => {
                    return Promise.all(
                        cacheNames.map((cacheName) => caches.delete(cacheName))
                    );
                })
                .then(() => {
                    event.ports[0].postMessage({ success: true });
                })
        );
    }
});

/**
 * Periodic Background Sync (Experimental)
 */
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-content') {
        event.waitUntil(updateContent());
    }
});

/**
 * Update content in background
 */
async function updateContent() {
    try {
        const response = await fetch('/api/updates');
        const data = await response.json();
        
        // Store in cache for offline access
        const cache = await caches.open(`${CACHE_PREFIX}-data`);
        await cache.put('/api/updates', new Response(JSON.stringify(data)));
        
        console.log('Content updated');
    } catch (error) {
        console.error('Failed to update content:', error);
    }
}

/**
 * Handle unhandled promise rejections
 */
self.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection in SW:', event.reason);
});

/**
 * Log successful installation
 */
console.log(`Service Worker ${SW_VERSION} loaded successfully`);
