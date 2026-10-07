import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/ToolPage";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights & Recommendations — SHARON AI" },
      { name: "description", content: "Turn situations and data into actionable insights and recommendations." },
      { property: "og:title", content: "Insights & Recommendations — SHARON AI" },
      { property: "og:description", content: "Turn situations and data into actionable insights and recommendations." },
    ],
  }),
  component: () => (
    <ToolPage
      tool="insights"
      title="Insights & Recommendations"
      inputLabel="Situation or data"
      outputLabel="Insights"
      actionLabel="Analyse"
      placeholder="Describe your situation, goals or paste data — e.g. Our survey shows 40% of students skip lectures on Fridays…"
    />
  ),
});
