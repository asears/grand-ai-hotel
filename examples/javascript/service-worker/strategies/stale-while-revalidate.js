/**
 * Stale-While-Revalidate Strategy
 * 
 * Returns cached response immediately while fetching fresh data in background.
 * Best for: Frequently updated content where stale data is acceptable temporarily.
 * 
 * Flow:
 * 1. Return cached response immediately (if available)
 * 2. Fetch from network in background
 * 3. Update cache with fresh response
 * 4. Next request gets the updated version
 * 
 * Benefits:
 * - Instant response time (from cache)
 * - Always updating to latest version
 * - Works offline (serves stale data)
 * 
 * @see https://developer.chrome.com/docs/workbox/modules/workbox-strategies/
 */

export class StaleWhileRevalidateStrategy {
    constructor(options = {}) {
        this.cacheName = options.cacheName || 'swr-cache';
        this.maxAge = options.maxAge || 86400; // 24 hours
        this.maxEntries = options.maxEntries || 60;
        this.plugins = options.plugins || [];
    }

    /**
     * Handle fetch request with stale-while-revalidate strategy
     * @param {Request} request - Fetch request
     * @returns {Promise<Response>} Response
     */
    async handle(request) {
        const cache = await caches.open(this.cacheName);

        // Try to get from cache first
        const cachedResponse = await cache.match(request);

        // Start network fetch (don't await - happens in background)
        const fetchPromise = this.fetchAndCache(cache, request);

        // If we have cache, return it immediately
        if (cachedResponse) {
            console.log('Serving from cache (revalidating):', request.url);
            
            // Wait for background fetch to complete (don't block response)
            fetchPromise.catch(error => {
                console.error('Background revalidation failed:', error);
            });

            return cachedResponse;
        }

        // No cache available, wait for network
        console.log('No cache, waiting for network:', request.url);
        try {
            return await fetchPromise;
        } catch (error) {
            console.error('Network request failed:', error);
            throw error;
        }
    }

    /**
     * Fetch from network and update cache
     * @private
     */
    async fetchAndCache(cache, request) {
        try {
            const networkResponse = await fetch(request);

            // Clone before caching (response can only be read once)
            const responseToCache = networkResponse.clone();

            // Update cache in background
            this.updateCache(cache, request, responseToCache).catch(error => {
                console.error('Failed to update cache:', error);
            });

            return networkResponse;

        } catch (error) {
            // Network fetch failed
            console.error('Network fetch failed:', request.url, error);
            throw error;
        }
    }

    /**
     * Update cache with response and metadata
     * @private
     */
    async updateCache(cache, request, response) {
        // Don't cache error responses
        if (!response.ok && response.status !== 0) {
            console.log('Not caching error response:', response.status);
            return;
        }

        try {
            // Add metadata headers
            const headers = new Headers(response.headers);
            headers.set('sw-cache-timestamp', Date.now().toString());
            headers.set('sw-cache-strategy', 'stale-while-revalidate');
            headers.set('sw-cache-version', '1');

            const modifiedResponse = new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers
            });

            await cache.put(request, modifiedResponse);

            // Run plugins (e.g., expiration)
            await this.runPlugins('cachedResponseWillBeUsed', { request, response });

            // Cleanup old entries
            await this.cleanupCache(cache);

        } catch (error) {
            console.error('Failed to update cache:', error);
        }
    }

    /**
     * Run plugins for lifecycle hooks
     * @private
     */
    async runPlugins(hookName, context) {
        for (const plugin of this.plugins) {
            if (typeof plugin[hookName] === 'function') {
                try {
                    await plugin[hookName](context);
                } catch (error) {
                    console.error(`Plugin ${hookName} failed:`, error);
                }
            }
        }
    }

    /**
     * Check if cached response is still fresh enough
     * @private
     */
    isCacheFresh(response) {
        const timestamp = response.headers.get('sw-cache-timestamp');
        if (!timestamp) return false;

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

        // Get entries with metadata
        const entries = await Promise.all(
            keys.map(async (key) => {
                const response = await cache.match(key);
                const timestamp = response.headers.get('sw-cache-timestamp') || '0';
                const size = response.headers.get('content-length') || '0';
                
                return {
                    key,
                    timestamp: parseInt(timestamp, 10),
                    size: parseInt(size, 10)
                };
            })
        );

        // Sort by timestamp (oldest first)
        entries.sort((a, b) => a.timestamp - b.timestamp);

        // Delete oldest entries beyond max
        const deleteCount = entries.length - this.maxEntries;
        const toDelete = entries.slice(0, deleteCount);

        await Promise.all(
            toDelete.map(({ key }) => {
                console.log('Deleting old cache entry:', key.url);
                return cache.delete(key);
            })
        );
    }

    /**
     * Get cache freshness statistics
     */
    async getCacheStats() {
        const cache = await caches.open(this.cacheName);
        const keys = await cache.keys();

        const entries = await Promise.all(
            keys.map(async (key) => {
                const response = await cache.match(key);
                const timestamp = response.headers.get('sw-cache-timestamp');
                const age = timestamp ? (Date.now() - parseInt(timestamp, 10)) / 1000 : 0;

                return {
                    url: key.url,
                    age,
                    fresh: this.isCacheFresh(response),
                    timestamp: timestamp ? new Date(parseInt(timestamp, 10)) : null
                };
            })
        );

        const freshCount = entries.filter(e => e.fresh).length;
        const staleCount = entries.length - freshCount;

        return {
            cacheName: this.cacheName,
            totalEntries: entries.length,
            fresh: freshCount,
            stale: staleCount,
            entries
        };
    }

    /**
     * Force revalidation of specific URLs
     * @param {Array<string>} urls - URLs to revalidate
     */
    async revalidate(urls) {
        const cache = await caches.open(this.cacheName);

        const results = await Promise.allSettled(
            urls.map(async (url) => {
                try {
                    const request = new Request(url);
                    await cache.delete(request);
                    await this.fetchAndCache(cache, request);
                    return { url, success: true };
                } catch (error) {
                    return { url, success: false, error: error.message };
                }
            })
        );

        return results.map(r => r.value);
    }

    /**
     * Warm cache with URLs
     * @param {Array<string>} urls - URLs to warm cache with
     */
    async warmCache(urls) {
        const cache = await caches.open(this.cacheName);

        console.log(`Warming cache with ${urls.length} URLs...`);

        const results = await Promise.allSettled(
            urls.map(async (url) => {
                const request = new Request(url);
                const cached = await cache.match(request);

                if (!cached) {
                    await this.fetchAndCache(cache, request);
                    return { url, cached: false };
                }

                return { url, cached: true };
            })
        );

        const newlyCached = results.filter(
            r => r.status === 'fulfilled' && !r.value.cached
        ).length;

        console.log(`Cache warmed: ${newlyCached} new entries`);

        return results.map(r => r.value);
    }
}

/**
 * Convenience factory function
 */
export function staleWhileRevalidate(options) {
    return new StaleWhileRevalidateStrategy(options);
}

/**
 * Example expiration plugin
 */
export class ExpirationPlugin {
    constructor(options = {}) {
        this.maxEntries = options.maxEntries || 60;
        this.maxAgeSeconds = options.maxAgeSeconds || 86400;
    }

    async cachedResponseWillBeUsed({ request, cachedResponse }) {
        if (!cachedResponse) return null;

        const timestamp = cachedResponse.headers.get('sw-cache-timestamp');
        if (!timestamp) return cachedResponse;

        const age = (Date.now() - parseInt(timestamp, 10)) / 1000;

        if (age > this.maxAgeSeconds) {
            console.log('Cache entry expired:', request.url);
            return null;
        }

        return cachedResponse;
    }
}
