import { createFileRoute } from "@tanstack/react-router";
import { CONTACT, PageHeader } from "@/components/AppShell";
import { clearHistory } from "@/lib/history";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SHARON AI" },
      { name: "description", content: "Manage your SHARON AI data and read the Responsible AI policy." },
      { property: "og:title", content: "Settings — SHARON AI" },
      { property: "og:description", content: "Manage your SHARON AI data and read the Responsible AI policy." },
    ],
  }),
  component: Settings,
});

function Settings() {
  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid gap-6 p-4 sm:p-8 lg:grid-cols-2">
        <section className="rounded-sm border-2 border-ink">
          <h2 className="bg-ink px-5 py-3 font-display text-[11px] uppercase tracking-[0.2em] text-paper">Your data</h2>
          <div className="space-y-4 p-5 text-sm">
            <p>Your request history is saved only in this browser. Nothing is shared between devices.</p>
            <button
              onClick={() => confirm("Delete all saved history?") && clearHistory()}
              className="skew-1 rounded-sm bg-ink px-4 py-2 text-xs font-semibold text-volt"
            >
              <span className="skew-2 inline-block">Clear history</span>
            </button>
          </div>
        </section>
        <section className="rounded-sm border-2 border-ink">
          <h2 className="bg-volt px-5 py-3 font-display text-[11px] uppercase tracking-[0.2em] text-ink">Responsible AI</h2>
          <div className="space-y-3 p-5 text-sm leading-relaxed">
            <p>SHARON AI generates content with artificial intelligence. Responses can contain errors, outdated facts or bias.</p>
            <ul className="list-square ml-5 list-disc space-y-1">
              <li>Always verify facts and figures against primary sources.</li>
              <li>Review every email before sending — nothing is sent automatically.</li>
              <li>Don't enter passwords, ID numbers or sensitive personal data.</li>
              <li>You remain responsible for decisions made using SHARON's output.</li>
            </ul>
            <p>Questions or feedback: <a className="font-semibold underline" href={`mailto:${CONTACT}`}>{CONTACT}</a></p>
          </div>
        </section>
      </div>
    </>
  );
}
