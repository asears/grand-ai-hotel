# Vercel Deployment Patterns: Production Strategies

**Master Git Integration, Preview Deployments, Environment Management, and Edge Architecture**

*Production-ready deployment workflows for modern web applications*

---

## Table of Contents

1. [Introduction](#introduction)
2. [Git Integration](#git-integration)
3. [Preview Deployments](#preview-deployments)
4. [Production Deployments](#production-deployments)
5. [Environment-Based Secrets](#environment-based-secrets)
6. [Monorepo Deployment](#monorepo-deployment)
7. [Edge Functions vs Serverless](#edge-functions-vs-serverless)
8. [Global CDN and Caching](#global-cdn-and-caching)
9. [A/B Testing and Feature Flags](#ab-testing-and-feature-flags)
10. [Advanced Patterns](#advanced-patterns)

---

## Introduction

### Deployment Philosophy

Vercel's deployment model centers on three principles:

1. **Git as Source of Truth**: Every commit creates a deployment
2. **Immutable Deployments**: Each deployment is frozen in time
3. **Preview Everything**: See changes before merging

### Key Concepts

**Deployment Types**:
- **Production**: Main branch deployments served to users
- **Preview**: Branch/PR deployments for testing
- **Development**: Local development with `vercel dev`

**Deployment Flow**:
```
Git Push → Build → Deploy → Preview URL
     ↓
   Merge → Production Deploy → Custom Domain
```

---

## Git Integration

### Connecting Git Provider

#### GitHub Integration

**Automatic Setup**:

1. **Sign in with GitHub** at vercel.com
2. **Import Project**: Dashboard → "Add New..." → "Project"
3. **Select Repository**: Browse or search for repo
4. **Configure**: Set build settings (usually auto-detected)
5. **Deploy**: Click "Deploy"

**Manual Setup**:

```bash
# In your Git repository
vercel --confirm

# Link to Git
vercel git connect
```

**Result**: 
- Automatic deployments on every push
- Preview URLs for pull requests
- Production deployment on main branch

#### GitLab Integration

1. **Add Integration**: Project Settings → Git
2. **Authenticate**: OAuth with GitLab
3. **Select Repository**: Choose GitLab repo
4. **Configure Branch**: Set production branch

#### Bitbucket Integration

Similar flow to GitHub/GitLab:
- OAuth authentication
- Repository selection
- Automatic webhook setup

### Repository Configuration

**Branch Settings**:

```json
// vercel.json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "develop": true,
      "*": false
    }
  }
}
```

**This configuration**:
- Deploys `main` branch to production
- Deploys `develop` branch to preview
- Ignores all other branches

### Webhook Configuration

Vercel automatically creates webhooks for:
- Push events
- Pull request events
- Tag/release events

**Manual Webhook** (advanced):

```bash
# GitHub
POST https://api.vercel.com/v1/integrations/deploy/{project-id}/{hook-id}
```

### Ignored Build Step

Skip deployments based on conditions:

```bash
# vercel.json
{
  "github": {
    "autoJobCancelation": false
  }
}
```

**Custom ignore command**:

```bash
# .vercel/ignore-build.sh
#!/bin/bash

# Only deploy if frontend files changed
git diff HEAD^ HEAD --quiet ./frontend/

# Exit 0 to proceed, exit 1 to cancel
```

**Configure in project settings**:
```
Ignored Build Step: bash .vercel/ignore-build.sh
```

### Multi-Environment Strategy

**Branch-Based Environments**:

```
main        → Production (example.com)
staging     → Staging (staging.example.com)
develop     → Development (dev.example.com)
feature/*   → Preview (feature-xyz-project.vercel.app)
```

**Configuration**:

1. **Create Projects**: Separate Vercel project per environment
2. **Link Branches**: Each project linked to specific branch
3. **Different Configs**: Unique environment variables per project

**Example**:
- **production-app**: Linked to `main`, uses production database
- **staging-app**: Linked to `staging`, uses staging database
- **development-app**: Linked to `develop`, uses test database

---

## Preview Deployments

### Automatic Preview URLs

**Every PR/branch gets**:
- Unique URL: `project-git-branch-user.vercel.app`
- Automatic SSL certificate
- Full production environment
- Independent from other deployments

### Preview Deployment Workflow

```
1. Create Feature Branch
   git checkout -b feature/new-chat

2. Make Changes
   // Edit code

3. Commit and Push
   git add .
   git commit -m "Add new chat feature"
   git push origin feature/new-chat

4. Create Pull Request
   // GitHub/GitLab/Bitbucket

5. Automatic Preview
   // Vercel builds and deploys
   // Comment on PR with preview URL

6. Test on Preview
   // Share URL with team
   // QA testing
   // Stakeholder review

7. Merge to Main
   // Triggers production deployment
```

### Preview Comments

Vercel bot automatically comments on PRs:

```
✅ Deployment ready!

🔍 Preview: https://project-git-feature-chat-user.vercel.app
📊 Logs: https://vercel.com/user/project/deployments/abc123

Build time: 45s
```

### Password Protection

**Protect preview deployments**:

1. **Navigate**: Project Settings → Deployment Protection
2. **Enable**: "Password Protection for Preview Deployments"
3. **Set Password**: Choose strong password
4. **Save**: All preview deployments now require password

**Access**:
- Visitors enter password
- Cookie saved for 30 days
- Ideal for client demos

**Pro Feature**: Password protection available on Pro plan and above.

### Preview Environment Variables

**Use different values for previews**:

```bash
# Production
DATABASE_URL=postgres://prod.db

# Preview
DATABASE_URL=postgres://staging.db
```

**Configuration**:
1. Dashboard → Environment Variables
2. Add variable
3. Select **Preview** scope
4. Save

**Result**: Preview deployments use staging database, production uses prod database.

### Instant Rollback

**Preview deployments are immutable**:

```bash
# Each deployment has unique URL
https://project-abc123.vercel.app
https://project-def456.vercel.app
https://project-ghi789.vercel.app
```

**Rollback flow**:
1. Navigate: Deployments tab
2. Find: Previous working deployment
3. Click: "Promote to Production"
4. Confirm: Instantly live

**Zero downtime**: Previous deployment becomes production immediately.

### Preview Deployment Best Practices

**✅ DO**:
- Test on preview before merging
- Share preview URLs with stakeholders
- Use preview environment variables for staging resources
- Enable password protection for sensitive projects
- Delete branches after merging (cleans up preview deployments)

**❌ DON'T**:
- Test directly on production
- Use production API keys in preview
- Share preview URLs publicly (for internal projects)
- Rely on preview for load testing (use staging project)

---

## Production Deployments

### Production Branch

**Default**: `main` branch deploys to production

**Custom Production Branch**:

1. **Navigate**: Project Settings → Git
2. **Production Branch**: Select branch (e.g., `production`)
3. **Save**: Deployments from this branch go to production

### Deployment Triggers

**Automatic**:
- Push to production branch
- Merge pull request to main
- Tag/release creation (configurable)

**Manual**:
```bash
# Deploy current directory to production
vercel --prod

# Deploy specific directory
vercel ./dist --prod

# Deploy with environment variables
vercel --prod --env CUSTOM_VAR=value
```

### Deploy Hooks

**Trigger deployments via HTTP**:

1. **Create Hook**: Project Settings → Git → Deploy Hooks
2. **Name**: e.g., "Rebuild from CMS"
3. **Branch**: Select branch to deploy
4. **Copy URL**: Webhook URL

**Trigger deployment**:

```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_xxx/deploy-hook-xxx
```

**Use cases**:
- CMS content updates (Contentful, Sanity)
- Scheduled rebuilds (cron jobs)
- External CI/CD pipelines
- Manual rebuild buttons

### Zero-Downtime Deployments

**How it works**:

1. **New deployment builds** in background
2. **Health checks** pass
3. **Traffic switches** atomically
4. **Old deployment** remains accessible for rollback

**Atomic deployments**: No in-between state, instant cutover.

### Skew Protection

**Problem**: User loads old HTML, then new JavaScript (version mismatch)

**Vercel's solution**:
- Immutable deployment URLs
- Old deployments always accessible
- Assets versioned and cached

**Example**:
```javascript
// Old HTML loads old JavaScript
<script src="/_next/static/abc123/main.js"></script>

// New HTML loads new JavaScript  
<script src="/_next/static/def456/main.js"></script>
```

### Production Checklist

**Before going live**:

- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Environment variables set (production scope)
- [ ] Analytics enabled
- [ ] Error tracking configured (Sentry)
- [ ] Rate limiting implemented
- [ ] Database connection pooling
- [ ] Cache headers optimized
- [ ] Image optimization enabled
- [ ] Security headers configured
- [ ] CORS configured (if needed)
- [ ] Logs monitoring setup
- [ ] Backup strategy defined
- [ ] Team access configured
- [ ] Budget alerts set

---

## Environment-Based Secrets

### Environment Scopes

**Three scopes**:
1. **Production**: Used in production deployments
2. **Preview**: Used in preview deployments
3. **Development**: Used with `vercel dev` locally

### Managing Secrets

#### Via Dashboard

**Add secret**:
1. Project Settings → Environment Variables
2. Click "Add"
3. **Key**: `DATABASE_URL`
4. **Value**: `postgres://...`
5. **Environments**: Select Production, Preview, and/or Development
6. **Save**

**Different values per environment**:

```
Production:
  DATABASE_URL = postgres://prod-db.server/mydb
  API_KEY = live_key_abc123

Preview:
  DATABASE_URL = postgres://staging-db.server/mydb
  API_KEY = test_key_def456

Development:
  DATABASE_URL = postgres://localhost:5432/mydb
  API_KEY = dev_key_ghi789
```

#### Via CLI

**Add to all environments**:
```bash
vercel env add SECRET_KEY
? Enter value: my_secret_value
? Select environments: Production, Preview, Development
```

**Add to specific environment**:
```bash
vercel env add DATABASE_URL production
? Enter value: postgres://prod...

vercel env add DATABASE_URL preview
? Enter value: postgres://staging...

vercel env add DATABASE_URL development
? Enter value: postgres://localhost...
```

**List all variables**:
```bash
vercel env ls
```

**Remove variable**:
```bash
vercel env rm DATABASE_URL production
```

#### Pull for Local Development

```bash
# Download development environment variables
vercel env pull .env.local
```

**Creates `.env.local`**:
```env
DATABASE_URL="postgres://localhost:5432/mydb"
API_KEY="dev_key_ghi789"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Sensitive Data Best Practices

**✅ DO**:
- Use different credentials for each environment
- Rotate secrets regularly
- Use Vercel CLI or dashboard (never commit to Git)
- Add `.env*.local` to `.gitignore`
- Document required variables in README
- Use descriptive variable names
- Prefix client-side variables with `NEXT_PUBLIC_`

**❌ DON'T**:
- Commit secrets to Git
- Share production keys in preview/development
- Use production database in preview
- Hard-code API keys in source code
- Share secrets via Slack/email
- Use same password across environments

### Secret Rotation

**Process**:

1. **Create new secret** (e.g., new API key)
2. **Add to Vercel** with different name temporarily
3. **Update code** to use new variable
4. **Deploy** and verify
5. **Remove old secret** from Vercel
6. **Revoke old credentials** at provider

**Example**:

```bash
# Add new key
vercel env add STRIPE_SECRET_KEY_V2 production
? Enter value: sk_live_new_key_xyz

# Update code
- const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
+ const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_V2);

# Deploy
vercel --prod

# Verify working
# Remove old variable
vercel env rm STRIPE_SECRET_KEY production

# Rename new variable
vercel env add STRIPE_SECRET_KEY production
? Enter value: sk_live_new_key_xyz

vercel env rm STRIPE_SECRET_KEY_V2 production
```

### Environment Variables in Code

**Server-Side** (Next.js):

```typescript
// app/api/data/route.ts
export async function GET() {
  // Available on server only
  const apiKey = process.env.API_KEY;
  const dbUrl = process.env.DATABASE_URL;
  
  // Fetch data using secrets
  const data = await fetch('https://api.example.com/data', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  
  return Response.json(data);
}
```

**Client-Side** (Next.js):

```typescript
// components/map.tsx
'use client';

export function Map() {
  // Must be prefixed with NEXT_PUBLIC_
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
  
  return <MapComponent apiKey={apiKey} />;
}
```

**⚠️ Warning**: `NEXT_PUBLIC_` variables are embedded in client bundle. Never use for secrets!

### Encrypted Environment Variables

**Vercel automatically encrypts**:
- All environment variables at rest
- Transmission over HTTPS
- Variables in build logs are redacted

**Audit logs** (Enterprise):
- Track who added/modified variables
- When changes were made
- Previous values (hashed)

---

## Monorepo Deployment

### Monorepo Structure

```
monorepo/
├── apps/
│   ├── web/              # Next.js app
│   │   ├── app/
│   │   ├── package.json
│   │   └── next.config.js
│   ├── admin/            # Admin dashboard
│   │   ├── src/
│   │   └── package.json
│   └── api/              # API server
│       ├── src/
│       └── package.json
├── packages/
│   ├── ui/               # Shared UI components
│   ├── utils/            # Shared utilities
│   └── types/            # Shared TypeScript types
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

### Deploying Monorepo Apps

**Import each app separately**:

1. **Import Project**: Select repository
2. **Root Directory**: Set to app directory (e.g., `apps/web`)
3. **Build Settings**: Vercel detects framework
4. **Deploy**

**Result**: Each app is a separate Vercel project.

### Turborepo Integration

**Install Turborepo**:

```bash
npm install turbo --save-dev
```

**turbo.json**:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false
    },
    "lint": {
      "outputs": []
    }
  }
}
```

**package.json**:

```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint"
  }
}
```

**Vercel automatically detects Turborepo** and uses it for builds.

### Shared Dependencies

**Internal packages** (packages/ui, packages/utils):

```json
// apps/web/package.json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/utils": "workspace:*"
  }
}
```

**Vercel builds dependencies automatically** when using workspaces.

### Monorepo Build Configuration

**vercel.json** (in app directory):

```json
{
  "buildCommand": "cd ../.. && turbo run build --filter=web",
  "outputDirectory": ".next",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

**Explanation**:
- `buildCommand`: Run Turborepo from root with filter
- `outputDirectory`: Where Next.js outputs build
- `installCommand`: Install all workspace dependencies

### Deployment Isolation

**Ignored Build Step** (deploy only when app changes):

```bash
#!/bin/bash
# apps/web/.vercel/ignore-build.sh

# Get files changed in this commit
CHANGED_FILES=$(git diff --name-only HEAD^ HEAD)

# Check if any files in apps/web or packages/ui changed
echo "$CHANGED_FILES" | grep -qE "^(apps/web|packages/ui|packages/utils)"

# Exit 1 to skip build, exit 0 to build
if [ $? -eq 0 ]; then
  echo "✅ Changes detected, proceeding with build"
  exit 0
else
  echo "🚫 No relevant changes, skipping build"
  exit 1
fi
```

### Nx Integration

**Nx monorepo**:

```json
// nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "@nrwl/nx-cloud",
      "options": {
        "cacheableOperations": ["build", "lint", "test"]
      }
    }
  }
}
```

**Vercel detects Nx** and uses it for builds automatically.

---

## Edge Functions vs Serverless

### Edge Functions

**Characteristics**:
- **Runtime**: Edge Runtime (V8 isolates)
- **Deployment**: 100+ global regions
- **Cold Start**: 0-50ms
- **Execution Time**: 30 seconds max
- **Memory**: 128 MB default
- **Region**: All edge locations
- **APIs**: Web APIs only (no Node.js)

**When to use**:
- Personalization
- A/B testing
- Geolocation-based responses
- Authentication/authorization
- Header manipulation
- Redirects/rewrites
- Simple API proxies

**Example**:

```typescript
// app/api/personalize/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  // Get user location from Vercel headers
  const country = request.headers.get('x-vercel-ip-country') || 'US';
  
  // Personalize response
  const greeting = country === 'FR' ? 'Bonjour' : 'Hello';
  
  return Response.json({ 
    greeting,
    country,
    message: 'Served from edge' 
  });
}
```

**Edge Middleware**:

```typescript
// middleware.ts
export const config = {
  matcher: '/dashboard/:path*',
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
```

### Serverless Functions

**Characteristics**:
- **Runtime**: Node.js (full APIs)
- **Deployment**: Regional (us-east-1 default)
- **Cold Start**: 100-500ms
- **Execution Time**: 10s (Hobby), 60s (Pro), 300s (Enterprise)
- **Memory**: 1024 MB default, up to 3008 MB
- **Region**: Single region per deployment
- **APIs**: Full Node.js (fs, crypto, child_process)

**When to use**:
- Database connections
- File operations
- Complex computations
- Image/PDF generation
- Third-party Node.js libraries
- Long-running operations

**Example**:

```typescript
// app/api/generate-pdf/route.ts
export const runtime = 'nodejs';
export const maxDuration = 60; // Pro plan feature

import { generatePDF } from '@/lib/pdf';
import { writeFile } from 'fs/promises';

export async function POST(request: Request) {
  const { data } = await request.json();
  
  // Generate PDF (CPU-intensive)
  const pdf = await generatePDF(data);
  
  // Save to filesystem (Node.js only)
  await writeFile(`/tmp/report-${Date.now()}.pdf`, pdf);
  
  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="report.pdf"',
    },
  });
}
```

### Comparison Table

| Feature | Edge Functions | Serverless Functions |
|---------|---------------|---------------------|
| **Cold Start** | 0-50ms | 100-500ms |
| **Global Distribution** | Yes (100+ regions) | No (single region) |
| **Node.js APIs** | No | Yes |
| **Max Duration** | 30s | 10s / 60s / 300s |
| **Max Memory** | 128 MB | Up to 3008 MB |
| **File System** | No | Yes |
| **Database Drivers** | Limited (edge-compatible) | All |
| **Cost** | Lower (faster execution) | Higher |
| **Use Case** | Low-latency dynamic content | Complex backend logic |

### Hybrid Pattern

**Use both for optimal performance**:

```typescript
// Edge function for auth
// middleware.ts
export const runtime = 'edge';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Add user context to headers
  const response = NextResponse.next();
  response.headers.set('x-user-id', getUserIdFromToken(token));
  
  return response;
}

// Serverless function for complex logic
// app/api/process/route.ts
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const userId = request.headers.get('x-user-id');
  
  // Complex database operations
  const result = await complexDatabaseQuery(userId);
  
  return Response.json(result);
}
```

### Regional Configuration

**Set serverless function region**:

```json
// vercel.json
{
  "functions": {
    "app/api/**": {
      "memory": 3008,
      "maxDuration": 60
    }
  },
  "regions": ["iad1"]  // us-east-1 (default)
}
```

**Available regions**:
- `iad1`: Washington, D.C., USA (us-east-1)
- `sfo1`: San Francisco, USA
- `pdx1`: Portland, USA
- `fra1`: Frankfurt, Germany
- `gru1`: São Paulo, Brazil
- `hnd1`: Tokyo, Japan
- `lhr1`: London, United Kingdom
- `sin1`: Singapore

**Multi-region** (Enterprise):
```json
{
  "regions": ["iad1", "fra1", "hnd1"]
}
```

---

## Global CDN and Caching

### Vercel CDN Architecture

**Edge Network**: 100+ global edge locations cache and serve content.

**How it works**:
1. User requests `https://example.com/page`
2. Request routed to nearest edge location
3. Edge checks cache
4. If cached: Serve immediately
5. If not cached: Fetch from origin, cache, then serve

### Cache-Control Headers

**Immutable static assets**:

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

**Dynamic content with revalidation**:

```typescript
// app/api/data/route.ts
export async function GET() {
  const data = await fetchData();
  
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  });
}
```

**Explanation**:
- `s-maxage=60`: Cache for 60 seconds on CDN
- `stale-while-revalidate=30`: Serve stale content while revalidating in background

**No caching**:

```typescript
return Response.json(data, {
  headers: {
    'Cache-Control': 'no-store, must-revalidate',
  },
});
```

### Incremental Static Regeneration (ISR)

**Static pages that update periodically**:

```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}
```

**How ISR works**:
1. First request: Generate page, cache
2. Subsequent requests: Serve cached version
3. After 60 seconds: Serve stale version, regenerate in background
4. Next request: Serve fresh version

### On-Demand Revalidation

**Revalidate specific paths programmatically**:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { path, secret } = await request.json();
  
  // Verify secret (prevent abuse)
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  // Revalidate path
  revalidatePath(path);
  
  return Response.json({ revalidated: true, path });
}
```

**Trigger from CMS**:

```javascript
// Webhook from Contentful/Sanity
fetch('https://example.com/api/revalidate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    path: '/blog/my-post',
    secret: process.env.REVALIDATE_SECRET,
  }),
});
```

### Cache Purging

**Automatic**: New deployments automatically invalidate cache

**Manual**:
1. Dashboard → Deployments
2. Select deployment
3. "Invalidate Cache"

**Via API**:

```bash
curl -X POST "https://api.vercel.com/v1/deployments/DEPLOYMENT_ID/invalidate" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### CDN Best Practices

**✅ DO**:
- Set long cache times for static assets (1 year)
- Use `stale-while-revalidate` for dynamic content
- Implement on-demand revalidation for CMS content
- Version URLs (Next.js does this automatically)
- Use ISR for semi-static pages

**❌ DON'T**:
- Disable caching for static assets
- Use `no-cache` for everything
- Forget to revalidate after content updates
- Cache personalized content on CDN

---

## A/B Testing and Feature Flags

### Edge Middleware A/B Testing

**Simple A/B test**:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check existing variant cookie
  let variant = request.cookies.get('ab-test-home')?.value;
  
  // Assign variant if not set (50/50 split)
  if (!variant) {
    variant = Math.random() < 0.5 ? 'control' : 'variant';
  }
  
  const response = variant === 'variant'
    ? NextResponse.rewrite(new URL('/home-variant', request.url))
    : NextResponse.next();
  
  // Set cookie for consistent experience
  response.cookies.set('ab-test-home', variant, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  
  // Add header for analytics
  response.headers.set('x-ab-test-variant', variant);
  
  return response;
}

export const config = {
  matcher: '/',
};
```

**Result**: 
- 50% users see `/` (control)
- 50% users see `/home-variant` (variant B)
- Variant persists for 30 days

### Multi-Variant Testing

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  let variant = request.cookies.get('ab-test')?.value;
  
  if (!variant) {
    const rand = Math.random();
    if (rand < 0.33) variant = 'A';
    else if (rand < 0.66) variant = 'B';
    else variant = 'C';
  }
  
  const urlMap = {
    A: '/pricing',
    B: '/pricing-variant-b',
    C: '/pricing-variant-c',
  };
  
  const response = NextResponse.rewrite(new URL(urlMap[variant], request.url));
  response.cookies.set('ab-test', variant, { maxAge: 60 * 60 * 24 * 30 });
  
  return response;
}
```

### Edge Config for Feature Flags

**Setup**:

1. **Create Edge Config**: Dashboard → Storage → Edge Config
2. **Add Items**:
   ```json
   {
     "feature-new-chat": true,
     "feature-dark-mode": false,
     "rollout-percentage": 50
   }
   ```
3. **Copy Connection String**: `edge-config://...`

**Install SDK**:

```bash
npm install @vercel/edge-config
```

**Environment Variable**:

```env
EDGE_CONFIG=edge-config://xxxxxxxxxxxxx
```

**Usage**:

```typescript
// middleware.ts
import { get } from '@vercel/edge-config';

export async function middleware(request: NextRequest) {
  // Check feature flag
  const newChatEnabled = await get('feature-new-chat');
  
  if (newChatEnabled) {
    return NextResponse.rewrite(new URL('/chat-v2', request.url));
  }
  
  return NextResponse.next();
}
```

**Instant updates**: No redeployment needed, changes apply in <5 seconds globally.

### Gradual Rollout

```typescript
// middleware.ts
import { get } from '@vercel/edge-config';

export async function middleware(request: NextRequest) {
  // Get rollout percentage from Edge Config
  const rolloutPercentage = await get<number>('rollout-percentage') || 0;
  
  // Check cookie or assign
  let enrolled = request.cookies.get('new-feature-enrolled')?.value;
  
  if (!enrolled) {
    enrolled = Math.random() * 100 < rolloutPercentage ? 'true' : 'false';
  }
  
  const response = enrolled === 'true'
    ? NextResponse.rewrite(new URL('/new-feature', request.url))
    : NextResponse.next();
  
  response.cookies.set('new-feature-enrolled', enrolled, { 
    maxAge: 60 * 60 * 24 * 30 
  });
  
  return response;
}
```

**Rollout strategy**:
1. Start: 5% rollout
2. Monitor errors/metrics
3. Increase: 25% rollout
4. Monitor
5. Increase: 50% rollout
6. Monitor
7. Full rollout: 100%

### Analytics Integration

**Track variant in analytics**:

```typescript
// components/analytics.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Analytics() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Get variant from cookie
    const variant = document.cookie
      .split('; ')
      .find(row => row.startsWith('ab-test='))
      ?.split('=')[1];
    
    // Track page view with variant
    if (variant && typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        ab_test_variant: variant,
      });
    }
  }, [pathname]);
  
  return null;
}
```

### Feature Flag Best Practices

**✅ DO**:
- Use Edge Config for real-time updates
- Implement gradual rollouts (5% → 25% → 50% → 100%)
- Track variants in analytics
- Set cookie expiry (30 days typical)
- Clean up old flags after full rollout
- Document active experiments

**❌ DON'T**:
- Test too many variants simultaneously
- Change variants mid-experiment
- Forget to remove old experiment code
- Skip analytics tracking
- Rollout to 100% without testing

---

## Advanced Patterns

### Canary Deployments

**Deploy to subset of traffic first**:

1. **Deploy new version**
2. **Split traffic**: 95% old, 5% new
3. **Monitor metrics**: Error rates, performance
4. **Increase**: 90% old, 10% new
5. **Full rollout**: 100% new

**Implementation** (Enterprise feature):

```json
// vercel.json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/",
      "weight": 95
    },
    {
      "src": "/(.*)",
      "dest": "https://canary-deployment-url.vercel.app/$1",
      "weight": 5
    }
  ]
}
```

### Blue-Green Deployments

**Maintain two identical environments**:

- **Blue**: Current production
- **Green**: New version

**Process**:
1. Deploy to Green environment
2. Test Green thoroughly
3. Switch DNS/routing to Green
4. Keep Blue as instant rollback

**Vercel approach**: Instant rollback via "Promote to Production" on previous deployment.

### Header-Based Routing

**Route based on headers**:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Internal traffic to beta version
  const isInternal = request.headers.get('x-internal-access') === 'true';
  
  if (isInternal) {
    return NextResponse.rewrite(new URL('/beta', request.url));
  }
  
  return NextResponse.next();
}
```

### Geographic Routing

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'US';
  
  // Route EU users to GDPR-compliant version
  if (['DE', 'FR', 'IT', 'ES', 'GB'].includes(country)) {
    return NextResponse.rewrite(new URL('/eu', request.url));
  }
  
  return NextResponse.next();
}
```

### Scheduled Functions (Cron)

**vercel.json**:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-report",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**API route**:

```typescript
// app/api/cron/daily-report/route.ts
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Run daily report
  await generateDailyReport();
  
  return Response.json({ success: true });
}
```

**Cron expressions**:
- `0 0 * * *`: Daily at midnight
- `0 */6 * * *`: Every 6 hours
- `0 9 * * 1`: Every Monday at 9 AM
- `*/15 * * * *`: Every 15 minutes

### Webhooks for CI/CD

**Trigger deployments from external CI**:

```bash
# GitHub Actions workflow
name: Deploy to Vercel
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Vercel CLI
        run: npm install --global vercel
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### DDoS Protection

**Built-in Vercel protection**:
- Automatic DDoS mitigation
- Rate limiting at edge
- Attack detection and blocking

**Custom rate limiting**:

```typescript
// middleware.ts with Upstash
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
  
  return NextResponse.next();
}
```

---

## Conclusion

You've learned advanced Vercel deployment patterns:

- **Git Integration**: Automatic deployments from GitHub/GitLab/Bitbucket
- **Preview Deployments**: Test every change before production
- **Production Strategies**: Zero-downtime deployments, instant rollbacks
- **Secret Management**: Environment-based configuration
- **Monorepo**: Deploy multiple apps from single repository
- **Edge vs Serverless**: Choose optimal runtime for your use case
- **CDN Caching**: Global content delivery and optimization
- **A/B Testing**: Data-driven feature rollouts
- **Advanced Patterns**: Canary deployments, cron jobs, DDoS protection

### Next Steps

1. **Implement CI/CD**: Automate testing before deployment
2. **Set up monitoring**: Track errors and performance
3. **Configure alerts**: Get notified of deployment failures
4. **Optimize caching**: Reduce bandwidth and improve speed
5. **Test A/B experiments**: Data-driven product decisions

### Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Edge Config**: [vercel.com/docs/storage/edge-config](https://vercel.com/docs/storage/edge-config)
- **Deployment API**: [vercel.com/docs/rest-api](https://vercel.com/docs/rest-api)
- **Examples**: [github.com/vercel/vercel/tree/main/examples](https://github.com/vercel/vercel/tree/main/examples)

---

**Deploy with Confidence! 🚀**

*Created for The Grand Budapest Terminal Project*
