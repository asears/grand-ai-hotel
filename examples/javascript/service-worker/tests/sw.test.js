/**
 * Service Worker Tests
 * 
 * Comprehensive test suite for Service Worker functionality.
 * Uses service-worker-mock for testing SW environment.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import makeServiceWorkerEnv from 'service-worker-mock';
import { NetworkFirstStrategy } from '../strategies/network-first.js';
import { CacheFirstStrategy } from '../strategies/cache-first.js';
import { StaleWhileRevalidateStrategy } from '../strategies/stale-while-revalidate.js';

describe('Service Worker Strategies', () => {
    beforeEach(() => {
        Object.assign(global, makeServiceWorkerEnv());
        vi.clearAllMocks();
    });

    describe('NetworkFirstStrategy', () => {
        let strategy;

        beforeEach(() => {
            strategy = new NetworkFirstStrategy({
                cacheName: 'test-network-first',
                networkTimeout: 1000,
                maxAge: 60
            });
        });

        it('should fetch from network when available', async () => {
            const mockResponse = new Response('network data', {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
            });

            global.fetch = vi.fn().mockResolvedValue(mockResponse);

            const request = new Request('https://example.com/api/data');
            const response = await strategy.handle(request);

            expect(global.fetch).toHaveBeenCalledWith(
                request,
                expect.objectContaining({ signal: expect.any(AbortSignal) })
            );
            expect(response.status).toBe(200);
        });

        it('should fallback to cache when network fails', async () => {
            // Setup cache
            const cache = await caches.open('test-network-first');
            const cachedResponse = new Response('cached data', {
                headers: {
                    'sw-cache-timestamp': Date.now().toString()
                }
            });
            const request = new Request('https://example.com/api/data');
            await cache.put(request, cachedResponse);

            // Mock network failure
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            const response = await strategy.handle(request);
            const text = await response.text();

            expect(text).toBe('cached data');
        });

        it('should throw error when network fails and no cache', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            const request = new Request('https://example.com/api/uncached');

            await expect(strategy.handle(request)).rejects.toThrow();
        });

        it('should update cache after successful network fetch', async () => {
            const mockResponse = new Response('fresh data');
            global.fetch = vi.fn().mockResolvedValue(mockResponse);

            const request = new Request('https://example.com/api/data');
            await strategy.handle(request);

            const cache = await caches.open('test-network-first');
            const cached = await cache.match(request);

            expect(cached).toBeDefined();
        });

        it('should respect cache age validation', async () => {
            const cache = await caches.open('test-network-first');
            const oldTimestamp = Date.now() - 120000; // 2 minutes ago
            
            const expiredResponse = new Response('old data', {
                headers: {
                    'sw-cache-timestamp': oldTimestamp.toString()
                }
            });

            const request = new Request('https://example.com/api/data');
            await cache.put(request, expiredResponse);

            // Mock network failure
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            // Should throw because cache is expired (maxAge is 60 seconds)
            await expect(strategy.handle(request)).rejects.toThrow();
        });
    });

    describe('CacheFirstStrategy', () => {
        let strategy;

        beforeEach(() => {
            strategy = new CacheFirstStrategy({
                cacheName: 'test-cache-first',
                maxAge: 3600,
                maxEntries: 10
            });
        });

        it('should serve from cache when available', async () => {
            const cache = await caches.open('test-cache-first');
            const cachedResponse = new Response('cached image', {
                headers: {
                    'Content-Type': 'image/png',
                    'sw-cache-timestamp': Date.now().toString()
                }
            });

            const request = new Request('https://example.com/image.png');
            await cache.put(request, cachedResponse);

            const response = await strategy.handle(request);
            const text = await response.text();

            expect(text).toBe('cached image');
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should fetch from network when not cached', async () => {
            const mockResponse = new Response('fresh image', {
                status: 200,
                headers: { 'Content-Type': 'image/png' }
            });

            global.fetch = vi.fn().mockResolvedValue(mockResponse);

            const request = new Request('https://example.com/new-image.png');
            const response = await strategy.handle(request);

            expect(global.fetch).toHaveBeenCalledWith(request);
            expect(response.status).toBe(200);
        });

        it('should cache successful responses', async () => {
            const mockResponse = new Response('image data', {
                status: 200,
                headers: { 'Content-Type': 'image/png' }
            });

            global.fetch = vi.fn().mockResolvedValue(mockResponse);

            const request = new Request('https://example.com/image.png');
            await strategy.handle(request);

            const cache = await caches.open('test-cache-first');
            const cached = await cache.match(request);

            expect(cached).toBeDefined();
        });

        it('should not cache error responses', async () => {
            const mockResponse = new Response('Not Found', {
                status: 404
            });

            global.fetch = vi.fn().mockResolvedValue(mockResponse);

            const request = new Request('https://example.com/missing.png');
            await strategy.handle(request);

            const cache = await caches.open('test-cache-first');
            const cached = await cache.match(request);

            expect(cached).toBeUndefined();
        });

        it('should return expired cache when network fails', async () => {
            const cache = await caches.open('test-cache-first');
            const oldTimestamp = Date.now() - 7200000; // 2 hours ago
            
            const expiredResponse = new Response('old image', {
                headers: {
                    'Content-Type': 'image/png',
                    'sw-cache-timestamp': oldTimestamp.toString()
                }
            });

            const request = new Request('https://example.com/image.png');
            await cache.put(request, expiredResponse);

            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            const response = await strategy.handle(request);
            const text = await response.text();

            // Should still return expired cache when network fails
            expect(text).toBe('old image');
        });

        it('should prefetch URLs', async () => {
            const urls = [
                'https://example.com/image1.png',
                'https://example.com/image2.png',
                'https://example.com/image3.png'
            ];

            global.fetch = vi.fn().mockImplementation((url) => {
                return Promise.resolve(new Response('image data', {
                    status: 200,
                    headers: { 'Content-Type': 'image/png' }
                }));
            });

            await strategy.prefetch(urls);

            expect(global.fetch).toHaveBeenCalledTimes(3);

            const cache = await caches.open('test-cache-first');
            for (const url of urls) {
                const cached = await cache.match(url);
                expect(cached).toBeDefined();
            }
        });
    });

    describe('StaleWhileRevalidateStrategy', () => {
        let strategy;

        beforeEach(() => {
            strategy = new StaleWhileRevalidateStrategy({
                cacheName: 'test-swr',
                maxAge: 60
            });
        });

        it('should return cached response immediately', async () => {
            const cache = await caches.open('test-swr');
            const cachedResponse = new Response('stale data', {
                headers: {
                    'sw-cache-timestamp': Date.now().toString()
                }
            });

            const request = new Request('https://example.com/api/data');
            await cache.put(request, cachedResponse);

            // Mock slow network
            global.fetch = vi.fn().mockImplementation(() => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(new Response('fresh data'));
                    }, 1000);
                });
            });

            const response = await strategy.handle(request);
            const text = await response.text();

            // Should return cached data immediately
            expect(text).toBe('stale data');

            // Network fetch should still be called for revalidation
            expect(global.fetch).toHaveBeenCalled();
        });

        it('should wait for network when no cache available', async () => {
            const mockResponse = new Response('fresh data');
            global.fetch = vi.fn().mockResolvedValue(mockResponse);

            const request = new Request('https://example.com/api/uncached');
            const response = await strategy.handle(request);
            const text = await response.text();

            expect(text).toBe('fresh data');
            expect(global.fetch).toHaveBeenCalled();
        });

        it('should update cache in background', async () => {
            const cache = await caches.open('test-swr');
            const oldResponse = new Response('old data', {
                headers: {
                    'sw-cache-timestamp': (Date.now() - 1000).toString()
                }
            });

            const request = new Request('https://example.com/api/data');
            await cache.put(request, oldResponse);

            const freshResponse = new Response('new data', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            global.fetch = vi.fn().mockResolvedValue(freshResponse);

            await strategy.handle(request);

            // Wait for background update
            await new Promise(resolve => setTimeout(resolve, 100));

            const updated = await cache.match(request);
            expect(updated).toBeDefined();
        });

        it('should warm cache with URLs', async () => {
            const urls = [
                'https://example.com/api/data1',
                'https://example.com/api/data2'
            ];

            global.fetch = vi.fn().mockImplementation(() => {
                return Promise.resolve(new Response('data'));
            });

            const results = await strategy.warmCache(urls);

            expect(results).toHaveLength(2);
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        it('should force revalidate specific URLs', async () => {
            const cache = await caches.open('test-swr');
            const request = new Request('https://example.com/api/data');
            
            await cache.put(request, new Response('old data', {
                headers: {
                    'sw-cache-timestamp': Date.now().toString()
                }
            }));

            global.fetch = vi.fn().mockResolvedValue(
                new Response('fresh data')
            );

            await strategy.revalidate(['https://example.com/api/data']);

            expect(global.fetch).toHaveBeenCalled();
        });

        it('should get cache statistics', async () => {
            const cache = await caches.open('test-swr');
            
            const urls = [
                'https://example.com/fresh',
                'https://example.com/stale'
            ];

            const freshTimestamp = Date.now();
            const staleTimestamp = Date.now() - 120000; // 2 minutes ago

            await cache.put(
                new Request(urls[0]),
                new Response('fresh', {
                    headers: { 'sw-cache-timestamp': freshTimestamp.toString() }
                })
            );

            await cache.put(
                new Request(urls[1]),
                new Response('stale', {
                    headers: { 'sw-cache-timestamp': staleTimestamp.toString() }
                })
            );

            const stats = await strategy.getCacheStats();

            expect(stats.totalEntries).toBe(2);
            expect(stats.fresh).toBe(1);
            expect(stats.stale).toBe(1);
        });
    });

    describe('Cache Management', () => {
        it('should cleanup old entries when max entries exceeded', async () => {
            const strategy = new CacheFirstStrategy({
                cacheName: 'test-cleanup',
                maxEntries: 3
            });

            const cache = await caches.open('test-cleanup');

            // Add 5 entries
            for (let i = 0; i < 5; i++) {
                const timestamp = Date.now() - (i * 1000);
                await cache.put(
                    new Request(`https://example.com/item${i}`),
                    new Response(`data${i}`, {
                        headers: {
                            'sw-cache-timestamp': timestamp.toString()
                        }
                    })
                );
            }

            // Trigger cleanup
            await strategy.cleanupCache(cache);

            const keys = await cache.keys();
            expect(keys.length).toBeLessThanOrEqual(3);
        });
    });
});
