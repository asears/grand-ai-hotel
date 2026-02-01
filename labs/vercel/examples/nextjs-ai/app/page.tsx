import Link from 'next/link';
import { MessageSquare, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <span className="text-xl font-bold">AI Chat</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/chat">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              AI-Powered Chat
              <br />
              <span className="text-primary">Built for Production</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Experience streaming AI responses with Next.js 15 App Router,
              React Server Components, and the Vercel AI SDK.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/chat">
                <Button size="lg">
                  Start Chatting
                  <MessageSquare className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a
                href="https://github.com/yourusername/nextjs-ai-chat"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline">
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Production-Ready Features
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<Zap className="h-8 w-8" />}
                title="Edge Runtime"
                description="Ultra-low latency with Edge Functions deployed globally"
              />
              <FeatureCard
                icon={<MessageSquare className="h-8 w-8" />}
                title="Streaming Responses"
                description="Real-time AI responses with token-by-token streaming"
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8" />}
                title="Rate Limiting"
                description="Built-in protection against abuse and cost overruns"
              />
              <FeatureCard
                icon={<Globe className="h-8 w-8" />}
                title="Multiple Models"
                description="Support for Claude, GPT-4, and other leading AI models"
              />
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold">
              Technology Stack
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <TechCard
                name="Next.js 15"
                description="App Router with React Server Components"
              />
              <TechCard
                name="Vercel AI SDK"
                description="Streaming AI responses and tool calling"
              />
              <TechCard
                name="TypeScript"
                description="Type-safe development with strict mode"
              />
              <TechCard
                name="Tailwind CSS"
                description="Beautiful UI with shadcn/ui components"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js 15 and Vercel AI SDK •{' '}
            <a
              href="https://github.com/yourusername/nextjs-ai-chat"
              className="underline underline-offset-4 hover:text-foreground"
            >
              View Source
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function TechCard({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-1 font-semibold">{name}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
