/**
 * Cache-First Strategy
 * 
 * Serves from cache first, only fetches from network if not cached.
 * Best for: Static assets, images, fonts, CSS, JavaScript.
 * 
 * Flow:
 * 1. Check cache for matching request
 * 2. If found, return cached response
 * 3. If not found, fetch from network
 * 4. Cache the network response for future use
 * 5. Return network response
 * 
 * @see https://developer.chrome.com/docs/workbox/modules/workbox-strategies/
 */

export class CacheFirstStrategy {
    constructor(options = {}) {
        this.cacheName = options.cacheName || 'cache-first-cache';
        this.maxAge = options.maxAge || 2592000; // 30 days in seconds
        this.maxEntries = options.maxEntries || 100;
        this.cacheableResponse = options.cacheableResponse || {
            statuses: [0, 200]
        };
    }

    /**
     * Handle fetch request with cache-first strategy
     * @param {Request} request - Fetch request
     * @returns {Promise<Response>} Response
     */
    async handle(request) {
        const cache = await caches.open(this.cacheName);

        // Try cache first
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            console.log('Serving from cache:', request.url);

            // Check if cache is still valid
            if (this.isCacheValid(cachedResponse)) {
                return cachedResponse;
            } else {
                console.log('Cache expired, fetching fresh:', request.url);
                await cache.delete(request);
            }
        }

        // Not in cache or expired, fetch from network
        try {
            const networkResponse = await fetch(request);

            // Only cache successful responses
            if (this.shouldCache(networkResponse)) {
                await this.cacheResponse(cache, request, networkResponse.clone());
            }

            return networkResponse;

        } catch (error) {
            console.error('Network fetch failed:', error);

            // If we have a cached response (even if expired), use it
            if (cachedResponse) {
                console.log('Network failed, using expired cache:', request.url);
                return cachedResponse;
            }

            throw error;
        }
    }

    /**
     * Determine if response should be cached
     * @private
     */
    shouldCache(response) {
        // Check status code
        if (!this.cacheableResponse.statuses.includes(response.status)) {
            return false;
        }

        // Don't cache if response is too large (>5MB)
        const contentLength = response.headers.get('content-length');
        if (contentLength && parseInt(contentLength, 10) > 5 * 1024 * 1024) {
            console.log('Response too large to cache:', contentLength);
            return false;
        }

        return true;
    }

    /**
     * Cache response with metadata
     * @private
     */
    async cacheResponse(cache, request, response) {
        try {
            // Add metadata headers
            const headers = new Headers(response.headers);
            headers.set('sw-cache-timestamp', Date.now().toString());
            headers.set('sw-cache-strategy', 'cache-first');

            const modifiedResponse = new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers
            });

            await cache.put(request, modifiedResponse);
            await this.cleanupCache(cache);
        } catch (error) {
            console.error('Failed to cache response:', error);
        }
    }

    /**
     * Check if cached response is still valid
     * @private
     */
    isCacheValid(response) {
        const timestamp = response.headers.get('sw-cache-timestamp');
        if (!timestamp) return true;

        const age = (Date.now() - parseInt(timestamp, 10)) / 1000;
        return age < this.maxAge;
    }

    /**
     * Cleanup old cache entries based on max entries limit
     * @private
     */
    async cleanupCache(cache) {
        const keys = await cache.keys();

        if (keys.length <= this.maxEntries) return;

        // Get all entries with timestamps
        const entries = await Promise.all(
            keys.map(async (key) => {
                const response = await cache.match(key);
                const timestamp = response.headers.get('sw-cache-timestamp') || '0';
                return { key, timestamp: parseInt(timestamp, 10) };
            })
        );

        // Sort by timestamp (oldest first)
        entries.sort((a, b) => a.timestamp - b.timestamp);

        // Calculate how many to delete
        const deleteCount = keys.length - this.maxEntries;
        const entriesToDelete = entries.slice(0, deleteCount);

        // Delete oldest entries
        await Promise.all(
            entriesToDelete.map(({ key }) => {
                console.log('Deleting old cache entry:', key.url);
                return cache.delete(key);
            })
        );
    }

    /**
     * Prefetch and cache URLs
     * @param {Array<string>} urls - URLs to prefetch
     */
    async prefetch(urls) {
        const cache = await caches.open(this.cacheName);

        const results = await Promise.allSettled(
            urls.map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (this.shouldCache(response)) {
                        await this.cacheResponse(cache, new Request(url), response);
                        return { url, success: true };
                    }
                } catch (error) {
                    return { url, success: false, error };
                }
            })
        );

        const successful = results.filter(r => r.status === 'fulfilled' && r.value?.success);
        console.log(`Prefetched ${successful.length}/${urls.length} URLs`);

        return results;
    }

    /**
     * Get cache statistics
     */
    async getStats() {
        const cache = await caches.open(this.cacheName);
        const keys = await cache.keys();

        let totalSize = 0;
        const entries = await Promise.all(
            keys.map(async (key) => {
                const response = await cache.match(key);
                const blob = await response.blob();
                totalSize += blob.size;

                const timestamp = response.headers.get('sw-cache-timestamp');
                const age = timestamp ? (Date.now() - parseInt(timestamp, 10)) / 1000 : 0;

                return {
                    url: key.url,
                    size: blob.size,
                    age,
                    valid: this.isCacheValid(response)
                };
            })
        );

        return {
            name: this.cacheName,
            entries: keys.length,
            totalSize,
            items: entries
        };
    }
}

/**
 * Convenience factory function
 */
export function cacheFirst(options) {
    return new CacheFirstStrategy(options);
}
