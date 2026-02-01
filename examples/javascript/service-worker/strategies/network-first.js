/**
 * Network-First Cache Strategy
 * 
 * Attempts to fetch from network first, falls back to cache if network fails.
 * Best for: API responses, dynamic content, data that should be fresh.
 * 
 * Flow:
 * 1. Try network request
 * 2. If successful, update cache and return response
 * 3. If fails, return cached version
 * 4. If no cache, return error
 * 
 * @see https://developer.chrome.com/docs/workbox/modules/workbox-strategies/
 */

export class NetworkFirstStrategy {
    constructor(options = {}) {
        this.cacheName = options.cacheName || 'network-first-cache';
        this.networkTimeout = options.networkTimeout || 3000; // 3 seconds
        this.maxAge = options.maxAge || 86400; // 24 hours in seconds
        this.maxEntries = options.maxEntries || 50;
    }

    /**
     * Handle fetch request with network-first strategy
     * @param {Request} request - Fetch request
     * @returns {Promise<Response>} Response
     */
    async handle(request) {
        const cache = await caches.open(this.cacheName);

        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.networkTimeout);

            // Try network first
            const networkResponse = await fetch(request, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Clone response before caching (response body can only be read once)
            const responseToCache = networkResponse.clone();

            // Update cache in background
            this.updateCache(cache, request, responseToCache);

            return networkResponse;

        } catch (networkError) {
            console.log('Network request failed, trying cache:', request.url);

            // Try to get from cache
            const cachedResponse = await cache.match(request);

            if (cachedResponse) {
                // Check if cached response is still valid
                if (this.isCacheValid(cachedResponse)) {
                    return cachedResponse;
                } else {
                    console.log('Cached response expired:', request.url);
                }
            }

            // No valid cache, throw error
            throw new Error(`Network request failed and no valid cache available: ${request.url}`);
        }
    }

    /**
     * Update cache with new response
     * @private
     */
    async updateCache(cache, request, response) {
        try {
            // Add timestamp header for expiration tracking
            const headers = new Headers(response.headers);
            headers.set('sw-cache-timestamp', Date.now().toString());

            const modifiedResponse = new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers
            });

            await cache.put(request, modifiedResponse);
            await this.cleanupCache(cache);
        } catch (error) {
            console.error('Failed to update cache:', error);
        }
    }

    /**
     * Check if cached response is still valid
     * @private
     */
    isCacheValid(response) {
        const timestamp = response.headers.get('sw-cache-timestamp');
        if (!timestamp) return true; // No timestamp, consider valid

        const age = (Date.now() - parseInt(timestamp, 10)) / 1000;
        return age < this.maxAge;
    }

    /**
     * Cleanup old cache entries
     * @private
     */
    async cleanupCache(cache) {
        const keys = await cache.keys();

        if (keys.length <= this.maxEntries) return;

        // Sort by timestamp (oldest first)
        const entries = await Promise.all(
            keys.map(async (key) => {
                const response = await cache.match(key);
                const timestamp = response.headers.get('sw-cache-timestamp') || '0';
                return { key, timestamp: parseInt(timestamp, 10) };
            })
        );

        entries.sort((a, b) => a.timestamp - b.timestamp);

        // Delete oldest entries
        const entriesToDelete = entries.slice(0, keys.length - this.maxEntries);
        await Promise.all(
            entriesToDelete.map(({ key }) => cache.delete(key))
        );
    }

    /**
     * Create response with offline fallback
     * @param {Request} request - Original request
     * @returns {Response} Fallback response
     */
    createOfflineResponse(request) {
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'Network unavailable and no cached data',
                url: request.url,
                timestamp: new Date().toISOString()
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store'
                }
            }
        );
    }
}

/**
 * Convenience factory function
 */
export function networkFirst(options) {
    return new NetworkFirstStrategy(options);
}
