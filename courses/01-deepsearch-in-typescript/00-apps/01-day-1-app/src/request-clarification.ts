import { streamText } from "ai";
import type { StreamTextResult } from "ai";
import { model } from "./model";
import type { SystemContext } from "./system-context";

export const requestClarification = async (
  ctx: SystemContext,
  reason: string,
  onFinish?: Parameters<typeof streamText>[0]["onFinish"],
  langfuseTraceId?: string,
): Promise<StreamTextResult<Record<string, never>, string>> => {
  const messageHistory = ctx.getMessageHistory();

  return streamText({
    model,
    system: `You are a clarification agent for a DeepSearch system.
Your job is to ask the user for clarification on their question so that you can provide the most accurate and helpful response.

Be friendly, conversational, and helpful. Ask specific questions that will help clarify what the user is looking for.`,
    prompt: `Here is the message history:

${messageHistory}

And here is why the question needs clarification:

${reason}

Please reply to the user with a clarification request. Be specific about what information you need to provide the best possible answer.`,
    onFinish,
    experimental_telemetry: langfuseTraceId
      ? {
          isEnabled: true,
          functionId: "request-clarification",
          metadata: {
            traceId: langfuseTraceId,
          },
        }
      : undefined,
  });
};
