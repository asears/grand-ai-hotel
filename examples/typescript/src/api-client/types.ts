/**
 * Type definitions for API client
 * Demonstrates Result types, branded types, and advanced type patterns
 */

/**
 * Result type for handling success/error cases without exceptions
 * @template T - Success value type
 * @template E - Error type (defaults to Error)
 */
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API error types for detailed error handling
 */
export type ApiErrorType =
  | 'network'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'not_found'
  | 'server'
  | 'rate_limit'
  | 'timeout'
  | 'unknown';

/**
 * Structured API error
 */
export interface ApiError {
  type: ApiErrorType;
  message: string;
  status?: number;
  details?: unknown;
  retryAfter?: number;
}

/**
 * Request configuration options
 */
export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
}

/**
 * Rate limiter configuration
 */
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableStatuses: number[];
}

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  rateLimit?: RateLimitConfig;
  retry?: RetryConfig;
}

/**
 * Helper to create successful Result
 */
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

/**
 * Helper to create error Result
 */
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

/**
 * Type guard for successful Result
 */
export const isOk = <T, E>(result: Result<T, E>): result is { ok: true; value: T } =>
  result.ok === true;

/**
 * Type guard for error Result
 */
export const isErr = <T, E>(result: Result<T, E>): result is { ok: false; error: E } =>
  result.ok === false;

/**
 * Map Result value through a function
 */
export const map = <T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> => {
  return result.ok ? ok(fn(result.value)) : result;
};

/**
 * Flat map Result through a function that returns Result
 */
export const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> => {
  return result.ok ? fn(result.value) : result;
};

/**
 * Map error through a function
 */
export const mapErr = <T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> => {
  return result.ok ? result : err(fn(result.error));
};
