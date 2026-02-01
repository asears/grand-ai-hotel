# Modern Node.js ESM Examples

Production-ready Node.js examples demonstrating modern patterns, best practices, and real-world use cases. All examples use pure ESM (ES Modules) with modern async/await patterns.

## 📚 Examples

### 1. [Express Copilot API](./express-copilot/)
Modern Express.js REST API with GitHub Copilot SDK integration.

**Features:**
- Pure ESM modules
- Helmet security headers
- Winston structured logging
- Zod request validation
- Vitest + Supertest testing
- Middleware patterns
- Error handling

**Tech Stack:** Express, Helmet, Winston, Zod, Vitest, Supertest

### 2. [GitHub Integration](./github-integration/)
GitHub API integration with Octokit SDK, webhooks, and authentication.

**Features:**
- Octokit REST API client
- GitHub App authentication (JWT + installation tokens)
- OAuth authentication
- Webhook handling with crypto verification
- Nock for HTTP mocking
- Event-driven architecture

**Tech Stack:** Octokit, @octokit/webhooks, @octokit/auth-app, Nock, Vitest

### 3. [Stream Processing](./stream-processing/)
Node.js Streams API with transforms, backpressure, and pipeline composition.

**Features:**
- Transform streams (text, objects)
- Backpressure handling
- CSV/JSON processing
- Pipeline composition with fluent API
- Async generators
- Rate limiting
- Batch processing

**Tech Stack:** Node.js Streams, csv-parse, csv-stringify, Vitest

## 🚀 Quick Start

Each example is self-contained with its own `package.json` and `README.md`.

```bash
# Navigate to an example
cd express-copilot

# Install dependencies
npm install

# Run the example
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📋 Requirements

- **Node.js**: >= 18.0.0
- **Package Manager**: npm, pnpm, or yarn

All examples use:
- ✅ **Pure ESM** - `"type": "module"` in package.json
- ✅ **Modern async/await** - No callbacks
- ✅ **Top-level await** - Where appropriate
- ✅ **JSDoc comments** - Full documentation
- ✅ **Vitest** - Modern testing framework
- ✅ **Production-ready** - Error handling, validation, logging

## 🎯 Common Patterns

### 1. ESM Import/Export

```javascript
// Import
import express from 'express';
import { Router } from 'express';

// Named exports
export function handler() { }
export class MyClass { }

// Default export
export default app;
```

### 2. Async/Await

```javascript
// Async function
async function fetchData() {
  const response = await fetch(url);
  return await response.json();
}

// Top-level await (ESM only)
const data = await fetchData();

// Error handling
try {
  const result = await riskyOperation();
} catch (error) {
  console.error('Failed:', error);
}
```

### 3. Modern Error Handling

```javascript
// Custom error classes
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Centralized error handler (Express)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message,
    timestamp: new Date().toISOString()
  });
});
```

### 4. Request Validation (Zod)

```javascript
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(120)
});

// Validate
const user = await userSchema.parseAsync(data);
```

### 5. Structured Logging (Winston)

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

logger.info('Server started', { port: 3000 });
logger.error('Database error', { error: err.message });
```

### 6. Testing (Vitest)

```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('MyComponent', () => {
  beforeEach(() => {
    // Setup
  });

  it('should work correctly', () => {
    expect(result).toBe(expected);
  });

  it('should handle async operations', async () => {
    const data = await fetchData();
    expect(data).toHaveProperty('id');
  });
});
```

## 🔧 Development Tools

### Recommended VSCode Extensions

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Test runner integration
- **REST Client** - API testing
- **Error Lens** - Inline error messages

### Package Scripts

Common scripts across all examples:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

## 📖 Learning Path

**Beginner:**
1. Start with [Express Copilot](./express-copilot/) - Learn REST API patterns
2. Study middleware, validation, and error handling
3. Run tests to understand testing patterns

**Intermediate:**
4. Explore [GitHub Integration](./github-integration/) - API client patterns
5. Learn authentication (OAuth, GitHub App)
6. Understand webhook handling

**Advanced:**
7. Dive into [Stream Processing](./stream-processing/) - Async patterns
8. Master backpressure and pipeline composition
9. Build custom transforms

## 🎓 Key Concepts

### ESM vs CommonJS

```javascript
// ❌ CommonJS (old)
const express = require('express');
module.exports = app;

// ✅ ESM (modern)
import express from 'express';
export default app;
```

### Async/Await vs Callbacks

```javascript
// ❌ Callbacks (old)
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// ✅ Async/await (modern)
const data = await fs.promises.readFile('file.txt');
console.log(data);
```

### Top-level Await

```javascript
// ✅ ESM only feature
const config = await loadConfig();
const db = await connectDatabase();

// Start server with loaded config
const server = createServer(config);
```

## 🔒 Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Validate all input** - Use Zod or similar
3. **Use Helmet.js** - Security headers
4. **Verify webhooks** - HMAC signature verification
5. **Rate limiting** - Prevent abuse
6. **HTTPS only** - No plaintext communication
7. **Update dependencies** - Regular security updates

## 📚 Additional Resources

### Node.js Documentation
- [Node.js Streams Guide](https://nodejs.org/api/stream.html)
- [ESM in Node.js](https://nodejs.org/api/esm.html)
- [Async Patterns](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)

### Libraries
- [Express.js](https://expressjs.com/)
- [Octokit](https://octokit.github.io/rest.js/)
- [Zod](https://zod.dev/)
- [Winston](https://github.com/winstonjs/winston)
- [Vitest](https://vitest.dev/)

### Best Practices
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [Twelve-Factor App](https://12factor.net/)

## 🤝 Contributing

When adding new examples:

1. ✅ Use pure ESM (`"type": "module"`)
2. ✅ Include working `package.json`
3. ✅ Write tests with Vitest
4. ✅ Add JSDoc comments
5. ✅ Create detailed README.md
6. ✅ Follow existing patterns
7. ✅ Include error handling
8. ✅ Add validation where needed

## 📄 License

MIT

---

**Built with modern Node.js best practices** 🚀
