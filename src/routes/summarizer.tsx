import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/ToolPage";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Article Summarizer — SHARON AI" },
      { name: "description", content: "Paste any article and get a clear TL;DR, key points and takeaways." },
      { property: "og:title", content: "Article Summarizer — SHARON AI" },
      { property: "og:description", content: "Paste any article and get a clear TL;DR, key points and takeaways." },
    ],
  }),
  component: () => (
    <ToolPage
      tool="summarize"
      title="Article Summarizer"
      inputLabel="Article text"
      outputLabel="Summary"
      actionLabel="Summarize"
      placeholder="Paste the full article or text you want summarized…"
    />
  ),
});
