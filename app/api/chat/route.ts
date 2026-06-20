import { google } from "@ai-sdk/google"; // 1. Import Google provider
import { streamText, type UIMessage, convertToModelMessages } from "ai";

export const maxDuration = 30;

// 2. Define the model (e.g., gemini-2.5-flash)
const customModel = google('gemini-2.5-flash');

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const systemPrompt = `You are a proffesor in all forms of pathway education and you answer questions related to subjects related to the users pathway and you help them in achieving there dreams and you help also in other questions they need answer.`;

  const modelMessages = await convertToModelMessages(messages);

  const result = await streamText({
    model: customModel,
    messages: [
      { role: "system", content: systemPrompt },
      ...modelMessages
    ],
  });

  return result.toTextStreamResponse();
}
