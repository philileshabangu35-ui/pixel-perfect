import { createFileRoute } from "@tanstack/react-router";
import { ToolPage } from "@/components/ToolPage";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator — SHARON AI" },
      { name: "description", content: "Write ready-to-send emails in Formal, Friendly, Persuasive or Professional tone." },
      { property: "og:title", content: "Email Generator — SHARON AI" },
      { property: "og:description", content: "Write ready-to-send emails in Formal, Friendly, Persuasive or Professional tone." },
    ],
  }),
  component: () => (
    <ToolPage
      tool="email"
      title="Email Generator"
      inputLabel="Brief"
      outputLabel="Email"
      placeholder="e.g. Follow up with the field team about the water-quality dataset. Confirm Thursday's handover and request the missing sensor logs."
    />
  ),
});
