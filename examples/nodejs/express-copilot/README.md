# Express Copilot API Example

Modern Express.js REST API with GitHub Copilot SDK integration, featuring ESM modules, structured logging, request validation, and security best practices.

## Features

- ✅ **Pure ESM** - Modern ES modules (no CommonJS)
- 🔒 **Security** - Helmet.js for security headers
- 📝 **Logging** - Winston structured logging
- ✔️ **Validation** - Zod schema validation
- 🧪 **Testing** - Vitest + Supertest
- 🚀 **Modern Patterns** - async/await, top-level await
- 📚 **Documentation** - JSDoc comments

## Project Structure

```
express-copilot/
├── server.js              # Main application entry point
├── middleware/
│   ├── logger.js          # Winston logging middleware
│   ├── error-handler.js   # Centralized error handling
│   └── validator.js       # Zod validation middleware
├── routes/
│   ├── copilot.js         # Copilot SDK integration routes
│   └── health.js          # Health check endpoints
├── tests/
│   └── api.test.js        # Integration tests
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Usage

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Run Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

## API Endpoints

### Health Checks

```bash
# Basic health check
GET /health

# Readiness check
GET /health/ready

# Liveness check
GET /health/live
```

### Copilot API

#### Generate Completion

```bash
POST /api/copilot/complete
Content-Type: application/json

{
  "prompt": "Write a hello world function in JavaScript",
  "model": "gpt-4",
  "temperature": 0.7,
  "maxTokens": 1000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "comp_1234567890",
    "model": "gpt-4",
    "completion": "function helloWorld() {\n  console.log('Hello, World!');\n}",
    "usage": {
      "promptTokens": 10,
      "completionTokens": 15,
      "totalTokens": 25
    },
    "created": "2024-01-29T10:00:00.000Z"
  },
  "timestamp": "2024-01-29T10:00:00.000Z"
}
```

#### Chat Completion

```bash
POST /api/copilot/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Explain async/await in JavaScript" }
  ],
  "stream": false
}
```

#### List Models

```bash
GET /api/copilot/models
```

## Request Validation

All POST/PUT/PATCH requests are validated using Zod schemas:

```javascript
// Completion schema
{
  prompt: string (1-10000 chars, required),
  model: enum ['gpt-4', 'gpt-3.5-turbo', 'claude-3'] (optional),
  temperature: number 0-2 (optional),
  maxTokens: number 1-4000 (optional)
}

// Chat schema
{
  messages: array of {
    role: enum ['system', 'user', 'assistant'],
    content: string (required)
  } (min 1 message),
  stream: boolean (optional)
}
```

## Error Handling

The API uses centralized error handling with consistent error responses:

```json
{
  "error": "Validation Error",
  "timestamp": "2024-01-29T10:00:00.000Z",
  "path": "/api/copilot/complete",
  "details": [
    {
      "path": "prompt",
      "message": "Required",
      "code": "invalid_type"
    }
  ]
}
```

## Logging

Winston structured logging with different log levels:

```javascript
// Request logging
logger.info('Incoming request', { method: 'POST', path: '/api/copilot/complete' });

// Error logging
logger.error('Error occurred', { message: err.message, stack: err.stack });
```

## Security Features

- **Helmet.js** - Sets security HTTP headers
- **Content-Type validation** - Enforces application/json
- **Request size limits** - Prevents DoS attacks
- **Error stack traces** - Only shown in development

## Testing

Tests use Vitest and Supertest for integration testing:

```javascript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';

describe('Copilot API', () => {
  it('should generate completion', async () => {
    const response = await request(app)
      .post('/api/copilot/complete')
      .send({ prompt: 'test' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
  });
});
```

## Environment Variables

```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # Environment mode
LOG_LEVEL=info              # Logging level (error, warn, info, debug)
```

## Modern JavaScript Features Used

- **ESM imports/exports** - `import`/`export` syntax
- **Top-level await** - Async operations at module level
- **Async/await** - Modern promise handling
- **Optional chaining** - `?.` operator
- **Nullish coalescing** - `??` operator
- **Template literals** - String interpolation
- **Destructuring** - Object/array destructuring
- **Arrow functions** - Concise function syntax

## Next Steps

1. Replace mock `CopilotClient` with actual GitHub Copilot SDK
2. Add authentication middleware (JWT, OAuth)
3. Implement rate limiting
4. Add Redis caching
5. Set up monitoring (Prometheus, Grafana)
6. Configure CI/CD pipeline
7. Add OpenAPI/Swagger documentation
8. Implement request/response compression

## License

MIT
