/**
 * Type-safe API client with Result types, rate limiting, and retry logic
 * Demonstrates advanced TypeScript patterns and functional programming
 */

import type { z } from 'zod';
import type {
  ApiClientConfig,
  ApiError,
  HttpMethod,
  RateLimitConfig,
  RequestConfig,
  Result,
  RetryConfig,
} from './types.ts';
import { err, ok } from './types.ts';

/**
 * Sleep utility for delays
 */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Rate limiter using sliding window algorithm
 */
class RateLimiter {
  private requests: number[] = [];

  constructor(private config: RateLimitConfig) {}

  /**
   * Check if request is allowed and wait if necessary
   */
  async acquire(): Promise<void> {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    this.requests = this.requests.filter((timestamp) => timestamp > windowStart);

    if (this.requests.length >= this.config.maxRequests) {
      const oldestRequest = this.requests[0];
      if (!oldestRequest) {
        return;
      }

      const waitTime = oldestRequest + this.config.windowMs - now;
      if (waitTime > 0) {
        await sleep(waitTime);
        return this.acquire();
      }
    }

    this.requests.push(now);
  }
}

/**
 * Type-safe API client with error handling
 */
export class ApiClient {
  private rateLimiter?: RateLimiter;
  private defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
  };

  constructor(private config: ApiClientConfig) {
    if (config.rateLimit) {
      this.rateLimiter = new RateLimiter(config.rateLimit);
    }
  }

  /**
   * Make a type-safe request with Zod validation
   * @template T - Expected response type (inferred from schema)
   * @param path - API endpoint path
   * @param schema - Zod schema for response validation
   * @param options - Request configuration
   * @returns Result with validated data or error
   */
  async request<T extends z.ZodTypeAny>(
    path: string,
    schema: T,
    options: RequestConfig = {},
  ): Promise<Result<z.infer<T>, ApiError>> {
    const url = `${this.config.baseUrl}${path}`;
    const method = options.method ?? 'GET';
    const retryConfig = { ...this.defaultRetryConfig, ...this.config.retry };
    const maxRetries = options.retries ?? retryConfig.maxRetries;

    let lastError: ApiError | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = this.calculateBackoff(attempt, retryConfig);
        await sleep(delay);
      }

      const result = await this.executeRequest(url, method, schema, options);

      if (result.ok) {
        return result;
      }

      lastError = result.error;

      if (!this.isRetryable(result.error, retryConfig)) {
        return result;
      }

      if (result.error.type === 'rate_limit' && result.error.retryAfter) {
        await sleep(result.error.retryAfter * 1000);
      }
    }

    return err(
      lastError ?? {
        type: 'unknown',
        message: 'Request failed with unknown error',
      },
    );
  }

  /**
   * Execute a single request attempt
   */
  private async executeRequest<T extends z.ZodTypeAny>(
    url: string,
    method: HttpMethod,
    schema: T,
    options: RequestConfig,
  ): Promise<Result<z.infer<T>, ApiError>> {
    try {
      if (this.rateLimiter) {
        await this.rateLimiter.acquire();
      }

      const timeout = options.timeout ?? this.config.timeout ?? 30000;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...options.headers,
      };

      const response = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: options.signal ?? controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return this.handleErrorResponse(response);
      }

      const data: unknown = await response.json();
      const parsed = schema.safeParse(data);

      if (!parsed.success) {
        return err({
          type: 'validation',
          message: 'Response validation failed',
          details: parsed.error.errors,
        });
      }

      return ok(parsed.data);
    } catch (error) {
      return this.handleException(error);
    }
  }

  /**
   * Handle HTTP error responses
   */
  private async handleErrorResponse(response: Response): Promise<Result<never, ApiError>> {
    const { status } = response;

    let type: ApiError['type'] = 'unknown';
    if (status === 401) {
      type = 'authentication';
    } else if (status === 403) {
      type = 'authorization';
    } else if (status === 404) {
      type = 'not_found';
    } else if (status === 429) {
      type = 'rate_limit';
    } else if (status >= 500) {
      type = 'server';
    }

    let message = `HTTP ${status}: ${response.statusText}`;
    let retryAfter: number | undefined;

    try {
      const data: unknown = await response.json();
      if (data && typeof data === 'object' && 'error' in data) {
        const errorData = data.error;
        if (errorData && typeof errorData === 'object' && 'message' in errorData) {
          message = typeof errorData.message === 'string' ? errorData.message : message;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }

    if (type === 'rate_limit') {
      const retryAfterHeader = response.headers.get('Retry-After');
      if (retryAfterHeader) {
        retryAfter = Number.parseInt(retryAfterHeader, 10);
      }
    }

    return err({
      type,
      message,
      status,
      retryAfter,
    });
  }

  /**
   * Handle exceptions during request
   */
  private handleException(error: unknown): Result<never, ApiError> {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return err({
          type: 'timeout',
          message: 'Request timeout',
        });
      }

      return err({
        type: 'network',
        message: error.message,
      });
    }

    return err({
      type: 'unknown',
      message: 'Unknown error occurred',
      details: error,
    });
  }

  /**
   * Check if error is retryable
   */
  private isRetryable(error: ApiError, config: RetryConfig): boolean {
    if (error.type === 'rate_limit') {
      return true;
    }
    if (error.type === 'network') {
      return true;
    }
    if (error.type === 'timeout') {
      return true;
    }
    if (error.status && config.retryableStatuses.includes(error.status)) {
      return true;
    }
    return false;
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoff(attempt: number, config: RetryConfig): number {
    const delay = config.initialDelayMs * config.backoffMultiplier ** (attempt - 1);
    return Math.min(delay, config.maxDelayMs);
  }

  /**
   * Convenience methods for common HTTP methods
   */

  async get<T extends z.ZodTypeAny>(
    path: string,
    schema: T,
    options?: Omit<RequestConfig, 'method' | 'body'>,
  ): Promise<Result<z.infer<T>, ApiError>> {
    return this.request(path, schema, { ...options, method: 'GET' });
  }

  async post<T extends z.ZodTypeAny>(
    path: string,
    schema: T,
    body: unknown,
    options?: Omit<RequestConfig, 'method' | 'body'>,
  ): Promise<Result<z.infer<T>, ApiError>> {
    return this.request(path, schema, { ...options, method: 'POST', body });
  }

  async put<T extends z.ZodTypeAny>(
    path: string,
    schema: T,
    body: unknown,
    options?: Omit<RequestConfig, 'method' | 'body'>,
  ): Promise<Result<z.infer<T>, ApiError>> {
    return this.request(path, schema, { ...options, method: 'PUT', body });
  }

  async patch<T extends z.ZodTypeAny>(
    path: string,
    schema: T,
    body: unknown,
    options?: Omit<RequestConfig, 'method' | 'body'>,
  ): Promise<Result<z.infer<T>, ApiError>> {
    return this.request(path, schema, { ...options, method: 'PATCH', body });
  }

  async delete<T extends z.ZodTypeAny>(
    path: string,
    schema: T,
    options?: Omit<RequestConfig, 'method' | 'body'>,
  ): Promise<Result<z.infer<T>, ApiError>> {
    return this.request(path, schema, { ...options, method: 'DELETE' });
  }
}
