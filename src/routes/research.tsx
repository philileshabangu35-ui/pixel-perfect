import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/ToolPage";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — SHARON AI" },
      { name: "description", content: "Research any topic with structured findings, perspectives and next steps." },
      { property: "og:title", content: "Research Assistant — SHARON AI" },
      { property: "og:description", content: "Research any topic with structured findings, perspectives and next steps." },
    ],
  }),
  component: () => (
    <ToolPage
      tool="research"
      title="Research Assistant"
      inputLabel="Topic"
      outputLabel="Research brief"
      actionLabel="Research"
      placeholder="e.g. The impact of microplastics on coastal fisheries in Southern Africa"
    />
  ),
});
