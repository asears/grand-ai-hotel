import { afterAll, afterEach, beforeAll } from 'vitest';

// Global test setup
beforeAll(() => {
  // Setup code before all tests
  console.log('🧪 Starting test suite...');
});

afterAll(() => {
  // Cleanup code after all tests
  console.log('✅ Test suite complete');
});

afterEach(() => {
  // Cleanup after each test
  // Reset mocks, clear timers, etc.
});

// Polyfills or global test utilities can go here
