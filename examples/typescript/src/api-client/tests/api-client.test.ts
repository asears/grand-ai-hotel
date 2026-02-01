/**
 * API Client tests
 * Demonstrates testing with native fetch mocking (no MSW needed)
 * @vitest-environment node
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { z } from 'zod';
import { ApiClient } from '../api-client.ts';
import { type CreateUserSchema, type User, UserSchema } from '../schemas.ts';

const BASE_URL = 'https://api.example.com';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  age: 30,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('ApiClient', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('GET requests', () => {
    it('should fetch and validate user data', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify(mockUser), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
      );

      const client = new ApiClient({ baseUrl: BASE_URL });
      const result = await client.get('/users/1', UserSchema);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(mockUser);
      }
    });

    it('should handle validation errors', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              id: 'invalid',
              email: 'not-an-email',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          ),
        ),
      );

      const client = new ApiClient({ baseUrl: BASE_URL });
      const result = await client.get('/users/1', UserSchema);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('validation');
      }
    });
  });

  describe('POST requests', () => {
    it('should create user with valid data', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              ...mockUser,
              email: 'new@example.com',
              name: 'New User',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          ),
        ),
      );

      const client = new ApiClient({ baseUrl: BASE_URL });
      const result = await client.post('/users', UserSchema, {
        email: 'new@example.com',
        name: 'New User',
        age: 25,
      } satisfies z.infer<typeof CreateUserSchema>);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.email).toBe('new@example.com');
      }
    });
  });

  describe('Error handling', () => {
    it('should handle 404 errors', async () => {
      globalThis.fetch = vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            statusText: 'Not Found',
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
      );

      const client = new ApiClient({ baseUrl: BASE_URL });
      const result = await client.get('/users/999', UserSchema);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('not_found');
        expect(result.error.status).toBe(404);
      }
    });

    it('should handle network errors', async () => {
      globalThis.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

      const client = new ApiClient({
        baseUrl: BASE_URL,
        retry: {
          maxRetries: 0,
          initialDelayMs: 0,
          maxDelayMs: 0,
          backoffMultiplier: 1,
          retryableStatuses: [],
        },
      });
      const result = await client.get('/users/1', UserSchema);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('network');
      }
    });
  });

  describe('Rate limiting', () => {
    it('should respect rate limits', async () => {
      let requestCount = 0;
      globalThis.fetch = vi.fn(() => {
        requestCount++;
        return Promise.resolve(
          new Response(JSON.stringify(mockUser), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      });

      const client = new ApiClient({
        baseUrl: BASE_URL,
        rateLimit: { maxRequests: 2, windowMs: 1000 },
      });

      const start = Date.now();

      await Promise.all([
        client.get('/users/1', UserSchema),
        client.get('/users/1', UserSchema),
        client.get('/users/1', UserSchema),
      ]);

      const elapsed = Date.now() - start;

      expect(requestCount).toBe(3);
      expect(elapsed).toBeGreaterThanOrEqual(900);
    });
  });

  describe('Retry logic', () => {
    it('should retry on 500 errors', async () => {
      let attempts = 0;
      globalThis.fetch = vi.fn(() => {
        attempts++;
        if (attempts < 3) {
          return Promise.resolve(
            new Response(JSON.stringify({ error: 'Server error' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        }
        return Promise.resolve(
          new Response(JSON.stringify(mockUser), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      });

      const client = new ApiClient({
        baseUrl: BASE_URL,
        retry: {
          maxRetries: 3,
          initialDelayMs: 100,
          maxDelayMs: 1000,
          backoffMultiplier: 2,
          retryableStatuses: [500],
        },
      });

      const result = await client.get('/users/1', UserSchema);

      expect(attempts).toBe(3);
      expect(result.ok).toBe(true);
    });

    it('should not retry on 404 errors', async () => {
      let attempts = 0;
      globalThis.fetch = vi.fn(() => {
        attempts++;
        return Promise.resolve(
          new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      });

      const client = new ApiClient({
        baseUrl: BASE_URL,
        retry: {
          maxRetries: 3,
          initialDelayMs: 100,
          maxDelayMs: 1000,
          backoffMultiplier: 2,
          retryableStatuses: [500],
        },
      });

      const result = await client.get('/users/999', UserSchema);

      expect(attempts).toBe(1);
      expect(result.ok).toBe(false);
    });
  });
});
