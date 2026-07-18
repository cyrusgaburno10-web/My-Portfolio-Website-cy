import { groq } from '@ai-sdk/groq';
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, stepCountIs, streamText, tool, type LanguageModel, type UIMessage } from 'ai';
import { z } from 'zod';
import { SYSTEM_PROMPT } from '@/lib/prompt';

export const runtime = 'edge';
export const maxDuration = 30;

function resolveModel(): LanguageModel | null {
  if (process.env.GROQ_API_KEY) {
    return groq(process.env.GROQ_MODEL || 'llama-3.3-70b-versatile');
  }
  if (process.env.OPENAI_API_KEY) {
    return openai(process.env.OPENAI_MODEL || 'gpt-4o-mini');
  }
  return null;
}

const tools = {
  showProjects: tool({
    description:
      "Display Cyrus's 6 project case studies as visual cards in the chat UI. Call this whenever the visitor asks to see his projects, work, portfolio, or examples of what he's built. After calling it, do not re-list the projects in plain text in the same reply — just give a brief one or two sentence intro instead, since the cards already show the details.",
    inputSchema: z.object({
      reason: z.string().describe('One short phrase for why the cards are being shown right now, e.g. "visitor asked to see projects".'),
    }),
    execute: async () => ({ shown: true }),
  }),
};

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const model = resolveModel();

  if (!model) {
    return new Response(
      'No AI provider configured. Add GROQ_API_KEY (and optionally GROQ_MODEL) or OPENAI_API_KEY (and optionally OPENAI_MODEL) to your environment and restart the server.',
      { status: 500 },
    );
  }

  const result = streamText({
    model,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
