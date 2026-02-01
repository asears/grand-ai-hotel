'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { Send, Sparkles, Loader2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

type ModelType = 'claude-sonnet' | 'claude-haiku' | 'gpt-4' | 'gpt-3.5';

export function ChatInterface() {
  const [model, setModel] = useState<ModelType>('claude-sonnet');

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: {
      model,
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmit(e);
  };

  return (
    <>
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">AI Assistant</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select value={model} onValueChange={(value) => setModel(value as ModelType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude-sonnet">Claude Sonnet 4.5</SelectItem>
                <SelectItem value="claude-haiku">Claude Haiku 4</SelectItem>
                <SelectItem value="gpt-4">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
            <Link href="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Sparkles className="mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="mb-2 text-2xl font-semibold">Start a Conversation</h2>
              <p className="text-muted-foreground">
                Ask me anything. I'm powered by state-of-the-art AI models.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg bg-muted px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-destructive">
                <p className="text-sm">
                  Error: {error.message || 'Something went wrong. Please try again.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form onSubmit={onSubmit} className="mx-auto max-w-3xl p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="min-h-[60px] flex-1 resize-none"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e as any);
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              className="h-[60px] w-[60px]"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>
    </>
  );
}
