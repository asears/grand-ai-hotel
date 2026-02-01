# TypeScript Examples

Modern TypeScript examples demonstrating best practices, type safety, and advanced patterns using Bun, Vite, Vitest, and Biome.

## 📁 Examples

### 1. API Client (`api-client/`)

Type-safe HTTP client with comprehensive error handling and retry logic.

**Features:**
- ✅ Generic fetch wrapper with Zod validation
- ✅ Type inference from schemas
- ✅ Result types for error handling
- ✅ Rate limiting with sliding window
- ✅ Retry logic with exponential backoff
- ✅ MSW (Mock Service Worker) for testing

**Files:**
- `api-client.ts` - Main API client implementation
- `schemas.ts` - Zod schemas for API responses
- `types.ts` - Type definitions and Result type utilities
- `tests/api-client.test.ts` - Tests with MSW mocks

**Example Usage:**
```typescript
import { ApiClient } from "./api-client/api-client.ts";
import { UserSchema } from "./api-client/schemas.ts";

const client = new ApiClient({
  baseUrl: "https://api.example.com",
  rateLimit: { maxRequests: 100, windowMs: 60000 },
  retry: { maxRetries: 3, initialDelayMs: 1000 }
});

const result = await client.get("/users/1", UserSchema);

if (result.ok) {
  console.log(result.value); // Typed as User
} else {
  console.error(result.error); // Structured ApiError
}
```

---

### 2. CLI Tool (`cli-tool/`)

Modern CLI application using Bun with beautiful output and robust validation.

**Features:**
- ✅ Bun-native with shebang support
- ✅ Commander.js for argument parsing
- ✅ Chalk for colored output
- ✅ Ora for loading spinners
- ✅ Zod for config validation
- ✅ Subcommands pattern

**Commands:**
- `greet` - Greet a user with options
- `config` - Manage configuration (show, set, reset)
- `process` - Process tasks with worker pool

**Example Usage:**
```bash
# Make executable
chmod +x src/cli-tool/cli.ts

# Run commands
bun src/cli-tool/cli.ts greet --name "John" --emoji
bun src/cli-tool/cli.ts config set username john_doe
bun src/cli-tool/cli.ts process --file data.json --workers 8
```

---

### 3. Validation (`validation/`)

Advanced Zod validation patterns with branded types and custom validators.

**Features:**
- ✅ Complex nested schemas
- ✅ Branded types for type safety
- ✅ Transform and refine patterns
- ✅ Custom validators (credit card, IBAN, IP addresses)
- ✅ Error formatting utilities
- ✅ Recursive and discriminated union schemas

**Files:**
- `schemas.ts` - Complex Zod schemas
- `branded-types.ts` - Type-safe branded types
- `validators.ts` - Custom validation functions
- `tests/validation.test.ts` - Edge case tests

**Example Usage:**
```typescript
import { createUserId, createEmail } from "./validation/branded-types.ts";
import { PasswordSchema } from "./validation/schemas.ts";
import { validateCreditCard } from "./validation/validators.ts";

// Branded types prevent mixing different ID types
const userId = createUserId(123); // UserId type
const email = createEmail("test@example.com"); // Email type

// Complex validation
const result = PasswordSchema.safeParse("MyP@ssw0rd");

// Custom validators
const isValid = validateCreditCard("4532015112830366");
```

---

## 🚀 Getting Started

### Installation

```bash
cd C:\projects\ai\copilot\examples\typescript
bun install
```

### Run Tests

```bash
# Run all tests
bun test

# Run with coverage
bun test:coverage

# Run in UI mode
bun test:ui

# Run specific test file
bun test src/api-client/tests/api-client.test.ts
```

### Linting & Formatting

```bash
# Check code
bun lint

# Auto-fix issues
bun lint:fix

# Format code
bun format
```

### Type Checking

```bash
bun type-check
```

---

## 📚 Key Patterns

### Result Type Pattern

Instead of throwing exceptions, use Result types for explicit error handling:

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Usage
const result = await fetchData();
if (result.ok) {
  // TypeScript knows result.value exists
} else {
  // TypeScript knows result.error exists
}
```

### Branded Types

Prevent mixing different types with the same underlying type:

```typescript
type UserId = Branded<number, "UserId">;
type PostId = Branded<number, "PostId">;

function getUser(id: UserId) { ... }
const userId: UserId = createUserId(1);
const postId: PostId = createPostId(1);

getUser(userId);  // ✅ OK
getUser(postId);  // ❌ Type error!
```

### Discriminated Unions

Type-safe unions with discriminator field:

```typescript
type Event =
  | { type: "click"; x: number; y: number }
  | { type: "key"; key: string }
  | { type: "scroll"; deltaY: number };

function handleEvent(event: Event) {
  switch (event.type) {
    case "click":
      // TypeScript knows event.x and event.y exist
      break;
  }
}
```

---

## 🛠 Technology Stack

- **Runtime:** Bun 1.0+
- **Language:** TypeScript 5.7+
- **Validation:** Zod 3.22+
- **Testing:** Vitest 2.1+
- **Mocking:** MSW 2.0+
- **CLI:** Commander 12.0+, Chalk 5.3+, Ora 8.0+
- **Linting:** Biome 1.9+

---

## 📖 Best Practices

### TypeScript

- ✅ Use strict mode
- ✅ Prefer `const` assertions
- ✅ Use `satisfies` operator for type checking
- ✅ Leverage type inference
- ✅ Use branded types for domain modeling

### Validation

- ✅ Validate at boundaries (API, user input)
- ✅ Use Zod for runtime validation
- ✅ Create reusable schemas
- ✅ Use transforms for data normalization

### Testing

- ✅ Write tests for edge cases
- ✅ Use MSW for API mocking
- ✅ Aim for >80% coverage
- ✅ Test error paths

### Error Handling

- ✅ Use Result types instead of exceptions
- ✅ Provide structured error types
- ✅ Include context in errors
- ✅ Make errors recoverable when possible

---

## 📝 License

MIT License - see LICENSE file for details
