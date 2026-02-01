import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';
export const maxDuration = 30;

const models = {
  'claude-sonnet': anthropic('claude-sonnet-4.5'),
  'claude-haiku': anthropic('claude-haiku-4'),
  'gpt-4': openai('gpt-4-turbo'),
  'gpt-3.5': openai('gpt-3.5-turbo'),
} as const;

export async function POST(req: Request) {
  try {
    const { messages, model = 'claude-sonnet' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    const selectedModel = models[model as keyof typeof models] || models['claude-sonnet'];

    const result = streamText({
      model: selectedModel,
      messages,
      temperature: 0.7,
      maxTokens: 2000,
      system: 'You are a helpful AI assistant. Provide concise, accurate, and friendly responses.',
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response('Internal server error', { status: 500 });
  }
}
