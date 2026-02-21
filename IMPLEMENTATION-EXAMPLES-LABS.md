# Multi-Language Examples & Labs Implementation Plan

## Overview
Complete implementation of production-ready examples across Python, TypeScript, Node.js, and JavaScript, plus  Vercel and GCP labs infrastructure. All examples follow modern tooling standards and include agent-led tutorials.

## Modern Tooling Standards

### TypeScript/JavaScript
- **Runtime**: Bun (fast, all-in-one toolkit)
- **Build**: Vite (lightning-fast ESM bundler)
- **Testing**: Vitest (Vite-native test runner)
- **Linting/Format**: Biome (Rust-based, replaces ESLint + Prettier)
- **Type Checking**: tsc --noEmit (strict mode)
- **Validation**: Zod (TypeScript-first schema validation)
- **ORM**: Drizzle (type-safe, serverless-ready)

### Python
- **Version**: 3.12+
- **Package Manager**: uv (Rust-based, 10-100x faster)
- **Type Checker**: ty (pytyped-python, faster than mypy)
- **Linter/Format**: ruff (Rust-based, replaces black + isort + flake8)
- **Testing**: pytest with parametric patterns
- **Validation**: Pydantic v2 (Rust core)
- **API**: FastAPI (async-native, OpenAPI auto-gen)

### Go
- **Version**: 1.22+
- **Tooling**: Built-in (go fmt, go test, go vet)
- **Linting**: golangci-lint (aggregates 50+ linters)
- **Testing**: table-driven tests with testify

### .NET
- **Version**: .NET 9
- **Tooling**: Built-in (dotnet format, dotnet test)
- **Testing**: xUnit with FluentAssertions

## Implementation Phases

### Phase 1: TypeScript/JavaScript Modern Tooling Setup ✅
**Owner**: Ludwig (Type Safety Expert) + Zero (General Tasks)

**Deliverables**:
1. `examples/typescript/package.json` - Bun workspace, Vite, Vitest, Biome
2. `examples/typescript/tsconfig.json` - Strict modern TypeScript config
3. `examples/typescript/biome.json` - Comprehensive linting rules
4. `examples/typescript/vitest.config.ts` - Test configuration
5. `examples/javascript/package.json` - Shared configuration for vanilla JS

**Success Criteria**:
- `bun install` completes without errors
- `bun run type-check` passes with strict settings
- `bun run lint` enforces modern patterns
- `bun run test` executes Vitest suite

---

### Phase 2: Python Examples (Modern 3.12+)
**Owner**: Agatha (Python Quality) + M. Gustave (Architecture)

**Examples**:
1. **FastAPI + Copilot SDK** (`examples/python/fastapi-copilot/`)
   - REST API with Copilot integration
   - Modern type hints (lowercase, | unions)
   - Pydantic v2 models
   - Azure Key Vault for secrets
   - Structured logging
   - Tests with pytest fixtures

2. **Data Processing** (`examples/python/data-processing/`)
   - Polars for fast DataFrames
   - Type-safe transformations
   - Streaming large files
   - Tests with parametric patterns

3. **Azure Integration** (`examples/python/azure-integration/`)
   - DefaultAzureCredential usage
   - Key Vault secret retrieval
   - Blob Storage operations
   - Managed Identity patterns

**Tutorial**: `tutorials/python-modern-patterns.md`
- 25 scenes, screenplay format
- Agatha teaches Zero modern Python
- M. Gustave reviews architecture
- Type hints, async/await, context managers

---

### Phase 3: TypeScript Examples (Modern ESNext)
**Owner**: Ludwig (Type Safety) + Zero (General Tasks)

**Examples**:
1. **Next.js 15 + Copilot SDK** (`examples/typescript/nextjs-copilot/`)
   - App Router architecture
   - Server Components + Server Actions
   - Copilot SDK integration
   - Zod validation
   - Drizzle ORM with Turso (SQLite)
   - Tailwind CSS + shadcn/ui
   - Tests with Vitest + Playwright

2. **Type-Safe API Client** (`examples/typescript/api-client/`)
   - Fetch wrapper with Zod validation
   - Generic type inference
   - Error handling patterns
   - Rate limiting
   - Tests with mock service worker

3. **CLI Tool** (`examples/typescript/cli-tool/`)
   - Bun-native CLI (shebang support)
   - Commander.js for args
   - Chalk for colors
   - Ora for spinners
   - Tests with Vitest

**Tutorial**: `tutorials/typescript-type-mastery.md`
- 28 scenes, screenplay format
- Ludwig teaches type safety mastery
- Zero learns generic constraints
- Advanced patterns (branded types, discriminated unions)

---

### Phase 4: Node.js Examples (ESM + Modern Patterns)
**Owner**: Zero (General Tasks) + Henckels (Standards)

**Examples**:
1. **Express API + Copilot SDK** (`examples/nodejs/express-copilot/`)
   - Pure ESM (no CommonJS)
   - Modern middleware patterns
   - Copilot SDK routes
   - Helmet for security
   - Winston for logging
   - Tests with Supertest

2. **GitHub API Integration** (`examples/nodejs/github-integration/`)
   - Octokit SDK usage
   - Webhook handling
   - GitHub App authentication
   - Probot framework
   - Tests with nock

3. **Stream Processing** (`examples/nodejs/stream-processing/`)
   - Node.js Streams API
   - Transform streams
   - Backpressure handling
   - CSV/JSON processing
   - Tests with stream assertions

**Tutorial**: `tutorials/nodejs-modern-esm.md`
- 24 scenes, screenplay format
- Zero demonstrates ESM migration
- Henckels enforces standards
- Async patterns, error handling

---

### Phase 5: JavaScript Examples (Vanilla + Modern)
**Owner**: Zero (General Tasks)

**Examples**:
1. **Browser Agent Interaction** (`examples/javascript/browser-agents/`)
   - Vanilla JS (no framework)
   - Web Components with Lit
   - LocalStorage for state
   - Fetch API patterns
   - Tests with Vitest (happy-dom)

2. **Service Worker** (`examples/javascript/service-worker/`)
   - Offline-first patterns
   - Cache strategies
   - Background sync
   - Push notifications
   - Tests with service worker testing library

**Tutorial**: `tutorials/javascript-modern-vanilla.md`
- 20 scenes, screenplay format
- Zero teaches modern vanilla JS
- No framework fatigue
- Web platform APIs

---

### Phase 6: Vercel Labs Infrastructure
**Owner**: Ludwig (TypeScript) + Henckels (CI/CD)

**Guides**:
1. **`labs/vercel/vercel-getting-started.md`**
   - Account setup (personal vs team)
   - Vercel CLI installation and login
   - Project creation and linking
   - Environment variables setup
   - Deployment basics
   - Domain configuration
   - Analytics and monitoring
   - Cost management (free tier limits)

2. **`labs/vercel/vercel-nextjs-agents.md`**
   - Next.js 15 project setup
   - Vercel AI SDK integration
   - Server Actions for streaming
   - Edge Runtime vs Node.js runtime
   - Route handlers for APIs
   - Middleware for auth
   - Deployment optimization
   - Performance monitoring

3. **`labs/vercel/vercel-serverless-functions.md`**
   - Serverless Function basics
   - Edge Functions (global, fast)
   - Request/response patterns
   - Cold start optimization
   - Streaming responses
   - Environment secrets
   - Testing locally with `vercel dev`

**Examples**:
1. **Next.js + Vercel AI SDK** (`labs/vercel/examples/nextjs-ai/`)
   - Complete working application
   - Chat interface with streaming
   - Server Actions for mutations
   - Edge Runtime API routes
   - Deployment configuration
   - Automated tests

2. **Edge Functions** (`labs/vercel/examples/edge-functions/`)
   - Geolocation-based responses
   - A/B testing with edge
   - Image optimization
   - Rate limiting
   - Analytics collection

**Tutorial**: `tutorials/vercel-deployment-mastery.md`
- 30 scenes, screenplay format
- Ludwig architects the application
- Henckels sets up CI/CD
- Zero deploys incrementally
- Production best practices

---

### Phase 7: GCP Labs Infrastructure
**Owner**: Dmitri (Security) + Serge X. (Analysis)

**Guides**:
1. **`labs/gcp/gcp-getting-started.md`**
   - GCP account setup
   - gcloud CLI installation
   - Project creation and selection
   - Billing setup and budgets
   - IAM roles and service accounts
   - Basic security hardening
   - SDK installation (Python, Node.js, Go)

2. **`labs/gcp/gcp-deployments.md`**
   - Cloud Run (containerized apps)
   - Cloud Functions (Gen 2, event-driven)
   - App Engine (managed platform)
   - Artifact Registry (container images)
   - Cloud Build (CI/CD)
   - Deployment comparison matrix

3. **`labs/gcp/gcp-security-guardrails.md`**
   - VPC Service Controls
   - Secret Manager integration
   - Workload Identity (keyless auth)
   - Binary Authorization
   - Cloud Armor (WAF)
   - Security Command Center
   - Compliance frameworks

**Examples**:
1. **Cloud Run** (`labs/gcp/examples/cloud-run/`)
   - Python FastAPI application
   - Dockerfile with multi-stage build
   - cloudbuild.yaml for CI/CD
   - Terraform module for infrastructure
   - Secret Manager integration
   - Health checks and monitoring

2. **Cloud Functions** (`labs/gcp/examples/cloud-functions/`)
   - HTTP-triggered function (Node.js)
   - Pub/Sub-triggered function (Python)
   - Storage-triggered function (Go)
   - Secret Manager usage
   - Terraform deployment

3. **Terraform Modules** (`labs/gcp/examples/terraform/`)
   - Cloud Run module
   - Cloud Functions module
   - VPC and networking
   - Secret Manager
   - Monitoring and alerting

**Tutorial**: `tutorials/gcp-secure-deployments.md`
- 32 scenes, screenplay format
- Dmitri audits security configurations
- Serge X. analyzes performance metrics
- Henckels enforces infrastructure-as-code
- Production-grade patterns

---

### Phase 8: Integration & Documentation
**Owner**: M. Gustave (Documentation) + All Agents

**Tasks**:
1. Update `README.md` with:
   - Links to all new examples
   - Technology stack matrix
   - Quick start for each language
   - Tutorial directory

2. Create language-specific READMEs:
   - `examples/python/README.md`
   - `examples/typescript/README.md`
   - `examples/nodejs/README.md`
   - `examples/javascript/README.md`

3. Cross-reference tutorials:
   - Link examples from tutorials
   - Link tutorials from examples
   - Create learning paths

4. Update `plan.md`:
   - Mark completed phases
   - Document decisions made
   - Track remaining work

5. Create justfile recipes:
   - `just python-test` - Run Python tests
   - `just ts-test` - Run TypeScript tests
   - `just node-test` - Run Node.js tests
   - `just lint-all` - Lint all languages
   - `just format-all` - Format all code
   - `just deploy-vercel` - Deploy to Vercel
   - `just deploy-gcp` - Deploy to GCP

---

## Success Criteria

### Examples
- [ ] Each example has README with setup instructions
- [ ] All examples use modern tooling (Bun, ruff, Biome)
- [ ] Tests achieve >80% coverage
- [ ] Type checking passes with strict settings
- [ ] Linting passes with no errors
- [ ] Examples are self-contained and runnable

### Labs
- [ ] Step-by-step guides with screenshots/diagrams
- [ ] Working code examples that deploy successfully
- [ ] Security best practices documented
- [ ] Cost estimates and free tier guidance
- [ ] Terraform/IaC for reproducibility

### Tutorials
- [ ] 20-35 scenes in screenplay format
- [ ] Agent personalities and colors consistent
- [ ] Code examples tested and verified
- [ ] Appendices with quick reference
- [ ] Cross-linked with examples and guides

### Documentation
- [ ] README reflects all new content
- [ ] Learning paths for beginners to advanced
- [ ] Technology decisions documented
- [ ] Justfile recipes for common tasks

---

## Timeline Estimate

- **Phase 1 (TS/JS Tooling)**: 2 hours
- **Phase 2 (Python Examples)**: 6 hours
- **Phase 3 (TypeScript Examples)**: 8 hours
- **Phase 4 (Node.js Examples)**: 6 hours
- **Phase 5 (JavaScript Examples)**: 4 hours
- **Phase 6 (Vercel Labs)**: 8 hours
- **Phase 7 (GCP Labs)**: 10 hours
- **Phase 8 (Integration)**: 4 hours

**Total**: ~48 hours of focused work

---

## Agent Assignments

| Phase | Primary | Secondary | Reviewer |
|-------|---------|-----------|----------|
| 1: TS/JS Tooling | Ludwig | Zero | Henckels |
| 2: Python | Agatha | M. Gustave | Ludwig |
| 3: TypeScript | Ludwig | Zero | M. Gustave |
| 4: Node.js | Zero | Henckels | Ludwig |
| 5: JavaScript | Zero | - | Ludwig |
| 6: Vercel | Ludwig | Henckels | Dmitri |
| 7: GCP | Dmitri | Serge X. | Henckels |
| 8: Integration | M. Gustave | All | Henckels |

---

## Technology Stack Matrix

| Language | Runtime | Package Mgr | Linter | Formatter | Type Checker | Test Framework | Build Tool |
|----------|---------|-------------|--------|-----------|--------------|----------------|------------|
| Python | 3.12+ | uv | ruff | ruff | ty | pytest | - |
| TypeScript | Bun | bun | Biome | Biome | tsc | Vitest | Vite |
| Node.js | Bun/Node 22 | bun | Biome | Biome | - | Vitest | Vite |
| JavaScript | Bun | bun | Biome | Biome | - | Vitest | Vite |
| Go | 1.22+ | go | golangci-lint | gofmt | - | go test | go build |
| .NET | 9.0 | dotnet | - | dotnet format | - | xUnit | dotnet build |

---

## Modern Patterns Enforced

### Python 3.12+
```python
# ✅ Modern type hints
def process(items: list[str]) -> dict[str, int]:
    result: dict[str, int] = {}
    return result

# ✅ Union with |
def get_value() -> str | None:
    return None

# ✅ Async with type hints
async def fetch_data(url: str) -> dict[str, Any]:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

# ❌ Old style (avoid)
from typing import Dict, List, Optional, Union
def process(items: List[str]) -> Dict[str, int]:  # Don't use this
    pass
```

### TypeScript ESNext
```typescript
// ✅ Modern TypeScript
interface User {
  readonly id: string;
  name: string;
  email: string;
}

type Result<T> = { success: true; data: T } | { success: false; error: string };

async function fetchUser(id: string): Promise<Result<User>> {
  // Implementation
}

// ✅ Zod validation
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

// ✅ Type-safe environment
const env = z.object({
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(32),
}).parse(process.env);
```

### Node.js ESM
```javascript
// ✅ Pure ESM (package.json has "type": "module")
import express from 'express';
import { readFile } from 'node:fs/promises';

// ✅ Top-level await
const config = JSON.parse(await readFile('./config.json', 'utf-8'));

const app = express();
export default app;

// ❌ CommonJS (avoid in new code)
const express = require('express');  // Don't use this
module.exports = app;  // Don't use this
```

---

## Next Steps

1. **Start with Phase 1**: Modern TypeScript/JavaScript tooling setup
2. **Create foundational examples**: One per language to establish patterns
3. **Build tutorials**: Agent-led narrative for each stack
4. **Labs infrastructure**: Vercel and GCP deployment guides
5. **Integration**: Update documentation and create justfile recipes
