import type { Message } from "ai";
import { streamText, createDataStreamResponse } from "ai";
import { z } from "zod";
import { auth } from "../../../server/auth";
import { model } from "../../../model";
import { searchSerper } from "../../../serper";

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
        system: `You are a helpful AI assistant that can search the web for current information. 

When users ask questions that might benefit from current information, you should use the searchWeb tool to find relevant and up-to-date information.

IMPORTANT: Always format ALL links as Markdown links using the [text](url) format. This includes:
- Links from web search results
- Any URLs you reference in your responses
- Links to sources, articles, or websites

Never use plain URLs or HTML links. Always use the Markdown format: [descriptive text](url)

If a user asks about current events, recent developments, or anything that might have changed recently, use the search tool to get the latest information.

Be conversational and helpful, but always back up your claims with sources when using web search results.`,
        tools: {
          searchWeb: {
            parameters: z.object({
              query: z.string().describe("The query to search the web for"),
            }),
            execute: async ({ query }, { abortSignal }) => {
              const results = await searchSerper(
                { q: query, num: 10 },
                abortSignal,
              );

              return results.organic.map((result) => ({
                title: result.title,
                link: result.link,
                snippet: result.snippet,
              }));
            },
          },
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: (e) => {
      console.error(e);
      return "Oops, an error occured!";
    },
  });
}
