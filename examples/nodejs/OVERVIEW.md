# Modern Node.js ESM Examples

This directory contains **production-ready Node.js examples** demonstrating modern patterns, best practices, and real-world use cases. All examples use **pure ESM (ES Modules)** with modern async/await patterns.

## 🎯 What's Inside

Three complete, working examples with full test coverage:

### 1. **Express Copilot API** (`express-copilot/`)
Modern Express.js REST API with GitHub Copilot SDK integration.

**Highlights:**
- ✅ Express.js server with middleware patterns
- 🔒 Helmet.js security headers
- 📝 Winston structured logging
- ✔️ Zod schema validation
- 🧪 Vitest + Supertest integration tests
- 🎯 Mock Copilot client implementation

**Files:** 11 files, ~2,500 LOC

### 2. **GitHub Integration** (`github-integration/`)
GitHub API integration with Octokit SDK, webhooks, and authentication.

**Highlights:**
- 🔌 Octokit REST API client wrapper
- 🔐 GitHub App authentication (JWT + installation tokens)
- 🔑 OAuth authentication flow
- 🎣 Webhook handling with HMAC signature verification
- 🧪 HTTP mocking with Nock
- 📡 Event-driven architecture

**Files:** 6 files, ~3,500 LOC

### 3. **Stream Processing** (`stream-processing/`)
Node.js Streams API with transforms, backpressure handling, and pipeline composition.

**Highlights:**
- 🔄 Custom Transform streams (text, objects)
- ⚡ Backpressure handling with concurrency control
- 📊 CSV processing with csv-parse/stringify
- 📄 JSONL (JSON Lines) processing
- 🔗 Pipeline composition with fluent API
- 🎯 Rate limiting and batching

**Files:** 9 files, ~4,000 LOC

## 🚀 Quick Start

Each example is **self-contained** with its own dependencies:

```bash
# Choose an example
cd express-copilot
# or
cd github-integration
# or
cd stream-processing

# Install dependencies
npm install

# Run the example
npm start

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## ✨ Modern Features

All examples demonstrate:

- ✅ **Pure ESM** - `"type": "module"` in package.json
- ✅ **Modern async/await** - No callbacks
- ✅ **Top-level await** - Clean async initialization
- ✅ **JSDoc comments** - Full API documentation
- ✅ **Vitest testing** - Modern test framework
- ✅ **Error handling** - Centralized error management
- ✅ **Input validation** - Zod schemas where applicable
- ✅ **Production-ready** - Security, logging, monitoring

## 📋 Requirements

- **Node.js** >= 18.0.0
- **npm**, **pnpm**, or **yarn**

## 📚 What You'll Learn

### Express Copilot API
- Setting up Express.js with ESM
- Middleware patterns (logging, validation, error handling)
- Request/response validation with Zod
- Structured logging with Winston
- Security best practices with Helmet
- Integration testing with Supertest

### GitHub Integration
- Octokit SDK usage patterns
- GitHub App authentication flows
- OAuth implementation
- Webhook signature verification
- HTTP request mocking
- Async API client patterns

### Stream Processing
- Transform stream implementation
- Backpressure handling
- Async generators and iterators
- CSV/JSON streaming
- Pipeline composition
- Memory-efficient data processing

## 🎓 Learning Path

**Beginner** → Start with **Express Copilot API**
- Learn REST API patterns
- Understand middleware
- Practice testing

**Intermediate** → Move to **GitHub Integration**
- API client patterns
- Authentication flows
- Webhook handling

**Advanced** → Explore **Stream Processing**
- Advanced async patterns
- Memory management
- Pipeline composition

## 📖 Code Quality

All examples include:

- ✅ **JSDoc comments** - Every function documented
- ✅ **Error handling** - Try/catch, error middleware
- ✅ **Input validation** - Zod schemas
- ✅ **Tests** - 60+ test cases total
- ✅ **README files** - Detailed documentation
- ✅ **Type safety** - JSDoc type annotations

## 🧪 Testing

Total test coverage across all examples:

- **Express Copilot**: 25+ tests (health, API, validation, errors)
- **GitHub Integration**: 20+ tests (API client, mocking)
- **Stream Processing**: 15+ tests (transforms, pipelines, backpressure)

Run all tests:

```bash
# In each example directory
npm test              # Run tests
npm run test:coverage # Run with coverage report
```

## 🔒 Security

Examples demonstrate security best practices:

- ✅ Helmet.js security headers
- ✅ Input validation (Zod)
- ✅ HMAC signature verification
- ✅ Error message sanitization
- ✅ No secrets in code
- ✅ Environment variable usage

## 📦 Dependencies

### Core Dependencies
- **express** - Web framework
- **@octokit/rest** - GitHub API client
- **helmet** - Security headers
- **winston** - Logging
- **zod** - Validation
- **csv-parse/csv-stringify** - CSV processing

### Dev Dependencies
- **vitest** - Testing framework
- **supertest** - HTTP testing
- **nock** - HTTP mocking

## 🔧 Development

### Recommended Tools
- **VSCode** with ESLint, Prettier extensions
- **Node.js** 18+ with native test runner
- **Git** for version control

### Project Structure
```
examples/nodejs/
├── README.md                    # This file
├── express-copilot/             # Express API example
│   ├── server.js
│   ├── middleware/
│   ├── routes/
│   └── tests/
├── github-integration/          # GitHub API example
│   ├── github-client.js
│   ├── auth.js
│   ├── webhooks.js
│   └── tests/
└── stream-processing/           # Streams example
    ├── transforms/
    ├── processors/
    └── tests/
```

## 🌟 Highlights

### Clean Code
```javascript
// ✅ Modern ESM imports
import express from 'express';
import { createServer } from 'http';

// ✅ Top-level await
const config = await loadConfig();

// ✅ Async/await (no callbacks)
const data = await fetchData();
```

### Type Safety (JSDoc)
```javascript
/**
 * Process user data
 * @param {object} user - User object
 * @param {string} user.name - User name
 * @param {number} user.age - User age
 * @returns {Promise<object>} Processed user
 */
async function processUser(user) {
  // ...
}
```

### Error Handling
```javascript
// ✅ Centralized error handling
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.statusCode || 500).json({
    error: err.message
  });
});
```

## 📚 Additional Resources

- [Node.js Streams Guide](https://nodejs.org/api/stream.html)
- [Express.js Documentation](https://expressjs.com/)
- [Octokit REST API](https://octokit.github.io/rest.js/)
- [Vitest Documentation](https://vitest.dev/)
- [Zod Documentation](https://zod.dev/)

## 🤝 Contributing

To add new examples:

1. Create new directory under `examples/nodejs/`
2. Use `"type": "module"` in package.json
3. Include tests with Vitest
4. Add JSDoc comments
5. Create detailed README.md
6. Follow existing patterns

## 📄 License

MIT

---

**Built with modern Node.js best practices** | **Pure ESM** | **Production-Ready** | **Fully Tested** 🚀
