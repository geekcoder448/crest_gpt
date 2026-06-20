import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

const customModel = google("gemini-2.5-flash");

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: customModel,
    system:
    `
      You are a professor in all forms of pathway education.
      You answer questions related to the user's pathway and help them achieve their dreams.
    `,
    messages, 
  });

  return result.toDataStreamResponse(); 
}
