# Next.js 15 + Vercel AI SDK: Building AI-Powered Applications

**Advanced Tutorial for Streaming AI Agents with Next.js 15 App Router**

*Master modern React Server Components, Server Actions, Edge Runtime, and the Vercel AI SDK*

---

## Table of Contents

1. [Introduction](#introduction)
2. [Next.js 15 App Router Architecture](#nextjs-15-app-router-architecture)
3. [Vercel AI SDK Integration](#vercel-ai-sdk-integration)
4. [Server Components vs Server Actions](#server-components-vs-server-actions)
5. [Edge Runtime vs Node.js Runtime](#edge-runtime-vs-nodejs-runtime)
6. [Route Handlers for API Endpoints](#route-handlers-for-api-endpoints)
7. [Middleware for Authentication](#middleware-for-authentication)
8. [Deployment Optimization](#deployment-optimization)
9. [Performance Monitoring](#performance-monitoring)
10. [Production Best Practices](#production-best-practices)

---

## Introduction

### What We're Building

A production-ready AI chat application with:

- **Streaming responses** from AI models
- **Server-side rendering** with React Server Components
- **Real-time updates** using Server Actions
- **Edge-optimized** API routes
- **Authentication** via middleware
- **Rate limiting** to prevent abuse
- **Type-safe** with TypeScript strict mode

### Technology Stack

**Framework**: Next.js 15 with App Router
**AI SDK**: Vercel AI SDK (ai package)
**Styling**: Tailwind CSS + shadcn/ui
**Type Safety**: TypeScript 5.3+ with strict mode
**Deployment**: Vercel Edge Network

### Prerequisites

```bash
node --version  # v18.17 or higher
npm --version   # v9.0 or higher
```

Basic knowledge of:
- React fundamentals
- TypeScript
- Async/await patterns
- REST APIs

---

## Next.js 15 App Router Architecture

### Directory Structure

```
nextjs-ai-app/
├── app/
│   ├── layout.tsx           # Root layout (Server Component)
│   ├── page.tsx             # Home page (Server Component)
│   ├── chat/
│   │   ├── page.tsx         # Chat interface
│   │   └── actions.ts       # Server Actions
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts     # Chat API endpoint
│   │   └── health/
│   │       └── route.ts     # Health check
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── chat-interface.tsx   # Client component
│   └── message-list.tsx     # Client component
├── lib/
│   ├── ai.ts                # AI SDK configuration
│   ├── utils.ts             # Utility functions
│   └── rate-limit.ts        # Rate limiting logic
├── middleware.ts            # Edge middleware
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```

### App Router Fundamentals

**Key Concepts**:

1. **File-based Routing**: Every folder in `app/` is a route segment
2. **Server Components by Default**: All components are Server Components unless marked with `'use client'`
3. **Nested Layouts**: Layouts wrap child pages and persist across navigation
4. **Loading & Error States**: `loading.tsx` and `error.tsx` for automatic UI states

### Route Segments

```
app/
├── page.tsx                    → /
├── chat/
│   └── page.tsx                → /chat
├── api/
│   └── chat/
│       └── route.ts            → /api/chat
└── [userId]/
    └── profile/
        └── page.tsx            → /[userId]/profile
```

### Layouts and Templates

**Root Layout** (Required):

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Chat Application',
  description: 'Powered by Next.js 15 and Vercel AI SDK',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
```

**Nested Layout**:

```typescript
// app/chat/layout.tsx
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">AI Assistant</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
```

### Loading States

```typescript
// app/chat/loading.tsx
export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900" />
    </div>
  );
}
```

### Error Boundaries

```typescript
// app/chat/error.tsx
'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Chat error:', error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-gray-600">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
```

### Server Components Benefits

**Advantages**:
- Zero client-side JavaScript by default
- Direct database/API access
- Automatic code splitting
- Reduced bundle size
- Better SEO

**Example**:

```typescript
// app/page.tsx (Server Component)
import { db } from '@/lib/db';

export default async function HomePage() {
  // Direct database query - runs on server
  const recentChats = await db.chat.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1>Recent Conversations</h1>
      <ul>
        {recentChats.map((chat) => (
          <li key={chat.id}>{chat.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Vercel AI SDK Integration

### Installation

```bash
npm install ai @ai-sdk/anthropic @ai-sdk/openai
npm install --save-dev @types/node
```

**Packages**:
- `ai`: Core Vercel AI SDK with streaming utilities
- `@ai-sdk/anthropic`: Anthropic Claude integration
- `@ai-sdk/openai`: OpenAI GPT integration

### AI SDK Configuration

```typescript
// lib/ai.ts
import { Anthropic } from '@ai-sdk/anthropic';
import { OpenAI } from '@ai-sdk/openai';

// Initialize providers
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model configurations
export const models = {
  claude: anthropic('claude-sonnet-4.5'),
  gpt4: openai('gpt-4-turbo'),
  gpt35: openai('gpt-3.5-turbo'),
} as const;

export type ModelName = keyof typeof models;
```

### Environment Variables

```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

**Vercel Setup**:

```bash
# Add to Vercel project
vercel env add ANTHROPIC_API_KEY production
vercel env add OPENAI_API_KEY production

# Pull for local development
vercel env pull .env.local
```

### Streaming Chat Endpoint

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { models } from '@/lib/ai';

export const runtime = 'edge'; // Use Edge Runtime for low latency

export async function POST(req: Request) {
  try {
    const { messages, model = 'claude' } = await req.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    // Stream AI response
    const result = streamText({
      model: models[model as keyof typeof models],
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
```

### Client-Side Chat Hook

```typescript
// components/chat-interface.tsx
'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

export function ChatInterface() {
  const [model, setModel] = useState<'claude' | 'gpt4'>('claude');

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      model,
    },
  });

  return (
    <div className="flex h-full flex-col">
      {/* Model selector */}
      <div className="border-b p-4">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value as 'claude' | 'gpt4')}
          className="rounded-md border p-2"
        >
          <option value="claude">Claude Sonnet 4.5</option>
          <option value="gpt4">GPT-4 Turbo</option>
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-gray-200 px-4 py-2">
              <div className="flex space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-600" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-600 delay-100" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-600 delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
```

### Streaming Text Generation

**useChat Hook Features**:

- **Automatic Streaming**: Handles Server-Sent Events (SSE)
- **Message Management**: Maintains chat history
- **Loading States**: Built-in `isLoading` flag
- **Error Handling**: Automatic retry logic
- **Optimistic Updates**: Instant UI feedback

**Custom Stream Processing**:

```typescript
import { StreamingTextResponse, LangChainStream } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const { stream, handlers } = LangChainStream();

  // Process stream with custom logic
  const model = models.claude;
  
  model
    .stream(messages)
    .then((response) => {
      response.pipeThrough(handlers);
    })
    .catch((error) => {
      console.error(error);
    });

  return new StreamingTextResponse(stream);
}
```

### Function Calling (Tool Use)

```typescript
// app/api/chat/route.ts
import { streamText, tool } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: models.claude,
    messages,
    tools: {
      getWeather: tool({
        description: 'Get the current weather for a location',
        parameters: z.object({
          location: z.string().describe('City name'),
        }),
        execute: async ({ location }) => {
          // Call weather API
          const response = await fetch(
            `https://api.weather.com/v1/current?location=${location}`
          );
          const data = await response.json();
          return { temperature: data.temp, conditions: data.conditions };
        },
      }),
      searchDatabase: tool({
        description: 'Search the knowledge database',
        parameters: z.object({
          query: z.string(),
          limit: z.number().optional().default(10),
        }),
        execute: async ({ query, limit }) => {
          // Search vector database
          const results = await vectorDb.search(query, { limit });
          return results;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
```

---

## Server Components vs Server Actions

### Server Components

**Definition**: React components that render on the server and send HTML to the client.

**Characteristics**:
- Default in Next.js 15 App Router
- Can directly access backend resources
- Don't add to client bundle
- Cannot use hooks or event handlers

**Example**:

```typescript
// app/dashboard/page.tsx (Server Component)
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  // Server-side authentication
  const user = await auth.getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  // Direct database query
  const stats = await db.analytics.findUnique({
    where: { userId: user.id },
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total messages: {stats.messageCount}</p>
      <p>Tokens used: {stats.tokenUsage}</p>
    </div>
  );
}
```

**When to Use**:
- Fetching data from databases
- Accessing environment variables
- Reading files from filesystem
- Calling backend APIs
- SEO-critical content

### Server Actions

**Definition**: Server-side functions that can be called from Client Components.

**Characteristics**:
- Marked with `'use server'` directive
- Can mutate data
- Automatically create API endpoints
- Type-safe with TypeScript
- Support progressive enhancement

**Example**:

```typescript
// app/chat/actions.ts
'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveMessage(formData: FormData) {
  const content = formData.get('content') as string;
  const userId = formData.get('userId') as string;

  // Validate input
  if (!content || content.length > 1000) {
    return { error: 'Invalid message content' };
  }

  // Save to database
  const message = await db.message.create({
    data: {
      content,
      userId,
      createdAt: new Date(),
    },
  });

  // Revalidate cache
  revalidatePath('/chat');

  return { success: true, messageId: message.id };
}

export async function deleteMessage(messageId: string) {
  await db.message.delete({
    where: { id: messageId },
  });

  revalidatePath('/chat');
}
```

**Client Usage**:

```typescript
// components/message-form.tsx
'use client';

import { saveMessage } from '@/app/chat/actions';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Sending...' : 'Send'}
    </button>
  );
}

export function MessageForm({ userId }: { userId: string }) {
  return (
    <form action={saveMessage}>
      <input type="hidden" name="userId" value={userId} />
      <textarea name="content" required />
      <SubmitButton />
    </form>
  );
}
```

**Progressive Enhancement**: Forms work without JavaScript!

**Type-Safe Actions** (with TypeScript):

```typescript
// app/chat/actions.ts
'use server';

import { z } from 'zod';

const MessageSchema = z.object({
  content: z.string().min(1).max(1000),
  userId: z.string().uuid(),
});

export async function saveMessage(data: z.infer<typeof MessageSchema>) {
  // Validate with Zod
  const validated = MessageSchema.parse(data);

  const message = await db.message.create({
    data: validated,
  });

  return message;
}
```

### Comparison Table

| Feature | Server Components | Server Actions |
|---------|------------------|----------------|
| **Purpose** | Render UI on server | Execute mutations on server |
| **Directive** | Default | `'use server'` |
| **Client Access** | No | Yes (via imports) |
| **Use Hooks** | No | No |
| **Return Value** | JSX | Serializable data |
| **Caching** | Yes (automatic) | Manual revalidation |
| **Progressive Enhancement** | N/A | Yes |

---

## Edge Runtime vs Node.js Runtime

### Edge Runtime

**What Is It?**: Lightweight JavaScript runtime that runs on Vercel's Edge Network (100+ locations worldwide).

**Characteristics**:
- **Ultra-low latency**: Executes close to users
- **Fast cold starts**: ~0-50ms
- **Limited APIs**: No Node.js APIs (fs, child_process)
- **Smaller bundle**: <1 MB after compression
- **Ideal for**: Simple API routes, middleware, dynamic pages

**Configuration**:

```typescript
// app/api/chat/route.ts
export const runtime = 'edge'; // Enable Edge Runtime

export async function GET() {
  return Response.json({ message: 'Running on the edge!' });
}
```

**Supported APIs**:
- `fetch` (native Web API)
- `Request` / `Response`
- `Headers`
- `URL` / `URLSearchParams`
- Web Crypto API
- Encoding APIs (TextEncoder, TextDecoder)
- Streaming APIs (ReadableStream, WritableStream)

**Example**:

```typescript
// app/api/geocode/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  // Fetch from external API
  const response = await fetch(
    `https://api.geocoding.com/v1/lookup?city=${city}`
  );
  const data = await response.json();

  // Return JSON response
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600',
    },
  });
}
```

### Node.js Runtime

**What Is It?**: Full Node.js environment with complete API access.

**Characteristics**:
- **Full Node.js APIs**: fs, path, crypto, child_process
- **Larger bundles**: No size limit
- **Slower cold starts**: 100-500ms
- **Regional execution**: Runs in single region (us-east-1 by default)
- **Ideal for**: Complex logic, database connections, file operations

**Configuration**:

```typescript
// app/api/export/route.ts
export const runtime = 'nodejs'; // Default (can be omitted)

import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  const { data } = await request.json();

  // Write file to filesystem (only Node.js)
  const filePath = join(process.cwd(), 'exports', `${Date.now()}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2));

  return Response.json({ success: true, filePath });
}
```

### Comparison

| Aspect | Edge Runtime | Node.js Runtime |
|--------|-------------|----------------|
| **Cold Start** | 0-50ms | 100-500ms |
| **Latency** | Ultra-low (global) | Regional |
| **APIs** | Web APIs only | Full Node.js |
| **Bundle Size** | <1 MB | Unlimited |
| **Use Case** | API routes, middleware | Complex logic, files |
| **Cost** | Lower (faster execution) | Higher |

### Choosing the Right Runtime

**Use Edge Runtime for**:
- AI streaming chat endpoints
- Authentication middleware
- Geolocation-based responses
- A/B testing
- Personalization
- Simple API proxies

**Use Node.js Runtime for**:
- Database connections (if not using edge-compatible drivers)
- File system operations
- Image processing
- PDF generation
- Complex computations
- Legacy Node.js dependencies

### Hybrid Approach

```typescript
// Edge runtime for chat streaming
// app/api/chat/route.ts
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({ model: models.claude, messages });
  return result.toDataStreamResponse();
}

// Node.js runtime for file export
// app/api/export/route.ts
export const runtime = 'nodejs';

export async function GET() {
  const data = await generateReport(); // Complex computation
  return Response.json(data);
}
```

---

## Route Handlers for API Endpoints

### Basic Route Handler

```typescript
// app/api/hello/route.ts
export async function GET(request: Request) {
  return Response.json({ message: 'Hello, World!' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ received: body });
}
```

### Dynamic Routes

```typescript
// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) {
    return new Response('User not found', { status: 404 });
  }

  return Response.json(user);
}
```

### Request Handling

**Reading Request Body**:

```typescript
export async function POST(request: Request) {
  // JSON
  const json = await request.json();

  // Form Data
  const formData = await request.formData();
  const name = formData.get('name');

  // Text
  const text = await request.text();

  return Response.json({ success: true });
}
```

**Query Parameters**:

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';

  return Response.json({ query, page });
}
```

**Headers**:

```typescript
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }

  return Response.json({ authenticated: true });
}
```

### Response Types

**JSON Response**:

```typescript
return Response.json(
  { data: 'value' },
  {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=60',
    },
  }
);
```

**Streaming Response**:

```typescript
export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(`data: ${i}\n\n`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
```

**Redirect**:

```typescript
import { redirect } from 'next/navigation';

export async function GET() {
  redirect('/new-location');
}
```

### Error Handling

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email) {
      return Response.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await processEmail(body.email);
    return Response.json(result);

  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### CORS Configuration

```typescript
export async function GET(request: Request) {
  const response = Response.json({ data: 'public' });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

---

## Middleware for Authentication

### Middleware Basics

Middleware runs before every request, perfect for authentication, redirects, and header manipulation.

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add custom header
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'my-value');
  return response;
}

// Configure which routes use middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
  ],
};
```

### Authentication Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  // Public routes - allow without auth
  if (request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Protected routes - require auth
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token
    const user = await verifyToken(token);

    // Add user to headers (accessible in route handlers)
    const response = NextResponse.next();
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-email', user.email);

    return response;
  } catch (error) {
    // Invalid token - redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/chat/:path*',
    '/api/chat/:path*',
  ],
};
```

### Rate Limiting Middleware

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

export async function middleware(request: NextRequest) {
  // Get client IP
  const ip = request.ip ?? 'anonymous';

  // Check rate limit
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse('Rate limit exceeded', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### Geolocation Middleware

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Vercel automatically provides geolocation headers
  const country = request.geo?.country || 'Unknown';
  const city = request.geo?.city || 'Unknown';

  // Redirect based on location
  if (country === 'CN' && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/cn', request.url));
  }

  // Add geo headers to response
  const response = NextResponse.next();
  response.headers.set('x-user-country', country);
  response.headers.set('x-user-city', city);

  return response;
}
```

### A/B Testing Middleware

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Check for existing variant cookie
  let variant = request.cookies.get('ab-test-variant')?.value;

  // Assign variant if not set
  if (!variant) {
    variant = Math.random() < 0.5 ? 'A' : 'B';
  }

  // Rewrite to variant-specific page
  const url = request.nextUrl.clone();
  if (variant === 'B') {
    url.pathname = `/variant-b${url.pathname}`;
  }

  const response = NextResponse.rewrite(url);
  response.cookies.set('ab-test-variant', variant, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}
```

---

## Deployment Optimization

### Build Optimization

**next.config.js**:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification (faster than Terser)
  swcMinify: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },

  // Enable experimental features
  experimental: {
    // Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Compression
  compress: true,

  // Production source maps (optional)
  productionBrowserSourceMaps: false,

  // Strict mode
  reactStrictMode: true,
};

module.exports = nextConfig;
```

### Caching Strategies

**Static Data Fetching**:

```typescript
// Cache for 1 hour
export const revalidate = 3600;

export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data}</div>;
}
```

**Dynamic Data with Revalidation**:

```typescript
// Revalidate on-demand
import { unstable_cache } from 'next/cache';

const getCachedData = unstable_cache(
  async (id: string) => {
    return await db.data.findUnique({ where: { id } });
  },
  ['data-cache'],
  { revalidate: 60 } // 60 seconds
);
```

**API Route Caching**:

```typescript
export async function GET() {
  const data = await fetchData();

  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  });
}
```

### Bundle Analysis

```bash
npm install @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

```bash
ANALYZE=true npm run build
```

### Code Splitting

**Dynamic Imports**:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/heavy-component'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Client-side only
});
```

### Edge Config

Fast, global key-value store for configuration:

```bash
npm install @vercel/edge-config
```

```typescript
// lib/edge-config.ts
import { get } from '@vercel/edge-config';

export async function getFeatureFlags() {
  const flags = await get('feature-flags');
  return flags;
}
```

```typescript
// middleware.ts
import { get } from '@vercel/edge-config';

export async function middleware(request: NextRequest) {
  const maintenanceMode = await get('maintenance-mode');

  if (maintenanceMode) {
    return new Response('Maintenance in progress', { status: 503 });
  }

  return NextResponse.next();
}
```

---

## Performance Monitoring

### Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Web Vitals Tracking

```typescript
// app/web-vitals.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics
    console.log(metric);
    
    // Example: Send to custom endpoint
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(metric),
    });
  });

  return null;
}
```

### Custom Metrics

```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const startTime = Date.now();

  const result = await streamText({ ... });

  // Log performance metric
  console.log('Chat API latency:', Date.now() - startTime, 'ms');

  return result.toDataStreamResponse();
}
```

---

## Production Best Practices

### Security

1. **Environment Variables**: Never commit secrets
2. **Content Security Policy**:
   ```typescript
   // middleware.ts
   export function middleware(request: NextRequest) {
     const response = NextResponse.next();
     response.headers.set(
       'Content-Security-Policy',
       "default-src 'self'; script-src 'self' 'unsafe-inline';"
     );
     return response;
   }
   ```

3. **Rate Limiting**: Prevent abuse
4. **Input Validation**: Use Zod for type-safe validation

### Error Handling

```typescript
// app/error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
```

### Logging

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta }));
  },
  error: (message: string, error?: Error) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
    }));
  },
};
```

### Testing

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

```typescript
// __tests__/chat.test.tsx
import { render, screen } from '@testing-library/react';
import { ChatInterface } from '@/components/chat-interface';

describe('ChatInterface', () => {
  it('renders chat input', () => {
    render(<ChatInterface />);
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
  });
});
```

---

## Conclusion

You've learned:

- **Next.js 15 App Router**: Modern React architecture
- **Vercel AI SDK**: Streaming AI responses
- **Server Components**: Zero-bundle server rendering
- **Server Actions**: Type-safe mutations
- **Edge Runtime**: Ultra-low latency
- **Middleware**: Authentication and rate limiting
- **Optimization**: Caching, code splitting, performance

### Next Steps

1. Build the example app in `examples/nextjs-ai/`
2. Deploy to Vercel
3. Add authentication (NextAuth.js)
4. Implement vector search (Pinecone/Upstash)
5. Add observability (Sentry, Datadog)

### Resources

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel AI SDK**: [sdk.vercel.ai](https://sdk.vercel.ai)
- **Examples**: [github.com/vercel/ai/tree/main/examples](https://github.com/vercel/ai/tree/main/examples)

---

**Happy Building! 🚀**

*Created for The Grand Budapest Terminal Project*
