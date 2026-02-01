# Next.js 15 AI Chat Application

Production-ready AI chat application built with Next.js 15 App Router, Vercel AI SDK, and TypeScript. Features streaming responses, multiple AI models, and Edge Runtime optimization.

## ✨ Features

- **🚀 Next.js 15 App Router** - Modern React architecture with Server Components
- **💬 Streaming AI Chat** - Real-time token-by-token responses
- **🤖 Multiple AI Models** - Claude Sonnet, Claude Haiku, GPT-4, GPT-3.5
- **⚡ Edge Runtime** - Ultra-low latency with global deployment
- **🎨 Beautiful UI** - Tailwind CSS + shadcn/ui components
- **📱 Responsive Design** - Mobile-first, works on all devices
- **🔒 Type-Safe** - TypeScript strict mode throughout
- **🛡️ Security Headers** - Built-in security best practices
- **📊 Production Ready** - Optimized build, caching, error handling

## 🏗️ Architecture

```
nextjs-ai/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── chat/
│   │   ├── layout.tsx          # Chat layout
│   │   └── page.tsx            # Chat page
│   └── api/
│       ├── chat/
│       │   └── route.ts        # Streaming chat endpoint (Edge)
│       └── health/
│           └── route.ts        # Health check endpoint
├── components/
│   ├── chat-interface.tsx      # Main chat component
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── textarea.tsx
│       └── select.tsx
├── lib/
│   ├── utils.ts                # Utility functions
│   └── ai.ts                   # AI SDK exports
├── middleware.ts               # Edge middleware
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or higher
- npm, yarn, or pnpm
- Anthropic API key (for Claude models)
- OpenAI API key (for GPT models)

### Installation

1. **Clone or download this example**

```bash
cd labs/vercel/examples/nextjs-ai
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

**Getting API Keys:**

- **Anthropic (Claude)**: [console.anthropic.com](https://console.anthropic.com/)
- **OpenAI (GPT)**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

4. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy with Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

- Import your repository
- Add environment variables:
  - `ANTHROPIC_API_KEY`
  - `OPENAI_API_KEY`
- Deploy!

3. **Automatic deployments**

Every push to `main` triggers a production deployment. Pull requests get preview deployments.

### Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables on Vercel

```bash
# Add production secrets
vercel env add ANTHROPIC_API_KEY production
vercel env add OPENAI_API_KEY production

# Add preview secrets (optional)
vercel env add ANTHROPIC_API_KEY preview
vercel env add OPENAI_API_KEY preview

# Pull for local development
vercel env pull .env.local
```

## 🛠️ Configuration

### AI Models

Edit `app/api/chat/route.ts` to configure available models:

```typescript
const models = {
  'claude-sonnet': anthropic('claude-sonnet-4.5'),
  'claude-haiku': anthropic('claude-haiku-4'),
  'gpt-4': openai('gpt-4-turbo'),
  'gpt-3.5': openai('gpt-3.5-turbo'),
};
```

### System Prompt

Customize the AI's behavior in `app/api/chat/route.ts`:

```typescript
const result = streamText({
  model: selectedModel,
  messages,
  system: 'You are a helpful AI assistant. Provide concise, accurate responses.',
  temperature: 0.7,
  maxTokens: 2000,
});
```

### Styling

- **Colors**: Edit `app/globals.css` CSS variables
- **Components**: Customize `components/ui/*.tsx`
- **Tailwind**: Modify `tailwind.config.ts`

## 🎯 Usage

### Basic Chat

1. Navigate to `/chat`
2. Select an AI model from the dropdown
3. Type your message
4. Press Enter to send (Shift+Enter for new line)

### Available Models

- **Claude Sonnet 4.5**: Most capable Claude model, best for complex tasks
- **Claude Haiku 4**: Fast and cost-effective Claude model
- **GPT-4 Turbo**: OpenAI's most capable model
- **GPT-3.5 Turbo**: Fast and economical OpenAI model

### Keyboard Shortcuts

- `Enter`: Send message
- `Shift + Enter`: New line

## 🧪 Development

### Project Structure

**Server Components** (default):
- `app/layout.tsx` - Root layout
- `app/page.tsx` - Landing page
- `app/chat/page.tsx` - Chat page container

**Client Components** (`'use client'`):
- `components/chat-interface.tsx` - Interactive chat UI

**API Routes** (Edge Runtime):
- `app/api/chat/route.ts` - Streaming chat endpoint
- `app/api/health/route.ts` - Health check

**Middleware**:
- `middleware.ts` - Security headers, could add rate limiting

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Build

```bash
npm run build
npm run start
```

## 🔐 Security

### Environment Variables

- **Never commit** `.env.local` or `.env`
- **Use Vercel dashboard** or CLI to add production secrets
- **Prefix client-side variables** with `NEXT_PUBLIC_` (if needed)

### Security Headers

Automatically configured in `middleware.ts`:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

### Rate Limiting

For production, implement rate limiting:

```bash
npm install @upstash/ratelimit @upstash/redis
```

See `vercel-deployment-patterns.md` for implementation details.

## 📊 Performance

### Edge Runtime

API routes use Edge Runtime for:
- **0-50ms cold starts** vs 100-500ms Node.js
- **Global deployment** - 100+ edge locations
- **Lower costs** - Faster execution

### Caching

Static assets automatically cached with optimal headers.

### Optimization Tips

1. **Image Optimization**: Use Next.js `<Image>` component
2. **Code Splitting**: Automatic with Next.js
3. **Bundle Analysis**: `ANALYZE=true npm run build`
4. **Lighthouse Audits**: Built into Vercel deployments

## 🐛 Troubleshooting

### API Key Errors

```
Error: Missing API key
```

**Solution**: 
1. Verify `.env.local` has API keys
2. Restart development server
3. For Vercel, add keys in dashboard

### Build Failures

```
Error: Module not found
```

**Solution**:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Type Errors

```
Type 'X' is not assignable to type 'Y'
```

**Solution**:
```bash
npm run type-check
# Fix reported errors
```

### Deployment Errors

Check Vercel deployment logs:
1. Dashboard → Deployments
2. Click failed deployment
3. View "Build Logs" and "Function Logs"

## 📚 Learn More

### Documentation

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai)
- [Anthropic API](https://docs.anthropic.com)
- [OpenAI API](https://platform.openai.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

### Guides

- `../vercel-getting-started.md` - Vercel platform guide
- `../vercel-nextjs-agents.md` - Advanced Next.js + AI patterns
- `../vercel-deployment-patterns.md` - Production deployment strategies

### Examples

- [Vercel AI Examples](https://github.com/vercel/ai/tree/main/examples)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

## 🤝 Contributing

Contributions welcome! This is an example/template project.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this in your projects!

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org) by Vercel
- AI powered by [Anthropic](https://anthropic.com) and [OpenAI](https://openai.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Styling with [Tailwind CSS](https://tailwindcss.com)

## 💡 Tips

### Cost Optimization

1. **Use cheaper models** for simple queries (Haiku, GPT-3.5)
2. **Implement rate limiting** to prevent abuse
3. **Set max tokens** to control response length
4. **Cache responses** for common queries
5. **Monitor usage** in provider dashboards

### Scaling

1. **Implement authentication** (NextAuth.js, Clerk)
2. **Add database** for chat history (Vercel Postgres, Supabase)
3. **Use vector search** for RAG (Pinecone, Upstash Vector)
4. **Add analytics** (Vercel Analytics, Mixpanel)
5. **Set up monitoring** (Sentry, Datadog)

### Advanced Features

- **Function calling** - Let AI use tools
- **Streaming with tools** - Real-time tool execution
- **Multi-modal** - Support images with GPT-4 Vision
- **Chat history** - Persist conversations in database
- **User authentication** - Protect chat interface
- **Rate limiting** - Prevent abuse
- **A/B testing** - Test different prompts/models

See `vercel-nextjs-agents.md` for implementation examples.

---

**Happy Building! 🚀**

*Part of The Grand Budapest Terminal Project*
