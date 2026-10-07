import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const MODEL = "openai/gpt-6-astra";
const TONES = ["Formal", "Friendly", "Persuasive", "Professional"];

const BASE =
  "You are SHARON AI, a precise assistant for students, researchers, professionals and businesses. Respond in clean Markdown with clear headings and bullet points. Be accurate; flag uncertainty and never invent citations.";

const INSTRUCTIONS: Record<string, string> = {
  research:
    "Research the topic the user gives. Structure: ## Overview, ## Key Findings (bullets), ## Different Perspectives, ## Open Questions, ## Suggested Next Steps. Note that facts should be verified against primary sources.",
  summarize:
    "Summarize the article or text provided. Structure: ## TL;DR (2 sentences), ## Key Points (bullets), ## Notable Details, ## Takeaways.",
  insights:
    "Analyse the situation or data provided and produce: ## Situation Summary, ## Key Insights, ## Recommendations (numbered, actionable, with rationale), ## Risks & Considerations.",
  email:
    "Write a complete email. Start with a line 'Subject: ...', then the greeting, body and sign-off. Keep it concise and ready to send. Output only the email.",
};

export async function handleGenerate(request: Request) {
  let body: { tool?: string; input?: string; tone?: string; recipient?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const tool = body.tool ?? "";
  const input = (body.input ?? "").trim();
  if (!INSTRUCTIONS[tool]) return Response.json({ error: "Unknown tool." }, { status: 400 });
  if (!input) return Response.json({ error: "Please enter some text first." }, { status: 400 });
  if (input.length > 20000) return Response.json({ error: "Input is too long (20,000 characters max)." }, { status: 400 });

  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return Response.json({ error: "AI is not configured." }, { status: 500 });

  let prompt = input;
  if (tool === "email") {
    const tone = TONES.includes(body.tone ?? "") ? body.tone : "Professional";
    prompt = `Tone: ${tone}\nRecipient: ${body.recipient?.slice(0, 200) || "not specified"}\nBrief: ${input}`;
  }

  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });

  let upstreamError: string | null = null;
  const result = streamText({
    model: provider.responses(MODEL),
    system: `${BASE}\n\n${INSTRUCTIONS[tool]}`,
    prompt,
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
    onError: ({ error }) => {
      const status = (error as { statusCode?: number })?.statusCode;
      upstreamError =
        status === 429 ? "Too many requests — please wait a moment and try again."
        : status === 402 ? "AI credits are used up. Please add credits to continue."
        : "The AI service had a problem. Please try again.";
    },
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.textStream) controller.enqueue(encoder.encode(chunk));
      } catch {
        upstreamError ??= "The AI service had a problem. Please try again.";
      }
      if (upstreamError) controller.enqueue(encoder.encode(`\n\n[[SHARON_ERROR]]${upstreamError}`));
      controller.close();
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
