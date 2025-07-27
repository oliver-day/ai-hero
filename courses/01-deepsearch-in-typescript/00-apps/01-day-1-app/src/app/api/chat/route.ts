import type { Message } from "ai";
import { streamText, createDataStreamResponse } from "ai";
import { auth } from "../../../server/auth";
import { model } from "../../../model";

export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json()) as {
    messages: Array<Message>;
  };

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const { messages } = body;

      const result = streamText({
        model,
        messages,
        maxSteps: 10,
        system: `You are a helpful AI assistant that can search the web for current information using native search grounding.

When users ask questions that might benefit from current information, you will automatically search the web for relevant and up-to-date information.

IMPORTANT: Always format ALL links as Markdown links using the [text](url) format. This includes:
- Links from web search results
- Any URLs you reference in your responses
- Links to sources, articles, or websites

Never use plain URLs or HTML links. Always use the Markdown format: [descriptive text](url)

If a user asks about current events, recent developments, or anything that might have changed recently, you will automatically search for the latest information.

Be conversational and helpful, but always back up your claims with sources when using web search results.`,
      });

      result.mergeIntoDataStream(dataStream, {
        sendSources: true,
      });
    },
    onError: (e) => {
      console.error(e);
      return "Oops, an error occured!";
    },
  });
}
