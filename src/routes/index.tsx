import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CONTACT, PageHeader } from "@/components/AppShell";
import { getHistory, onHistoryChange, timeAgo, TOOL_LABEL, TOOL_PATH, type HistoryItem } from "@/lib/history";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SHARON AI — Research, Insights & Email Assistant" },
      { name: "description", content: "SHARON AI helps you research, summarize articles, get recommendations and write professional emails." },
      { property: "og:title", content: "SHARON AI — Research, Insights & Email Assistant" },
      { property: "og:description", content: "Research, summarize, analyse and write — in one focused AI workspace." },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  { to: "/research", n: "01", title: "Research Assistant", desc: "Structured briefs on any topic." },
  { to: "/summarizer", n: "02", title: "Article Summarizer", desc: "TL;DR, key points and takeaways." },
  { to: "/insights", n: "03", title: "Insights", desc: "Actionable recommendations from your data." },
  { to: "/email", n: "04", title: "Email Generator", desc: "Four tones, ready to send." },
] as const;

function Dashboard() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => {
    const load = () => setItems(getHistory());
    load();
    return onHistoryChange(load);
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="space-y-6 p-4 sm:p-8">
        <section className="skew-1 rounded-sm bg-ink p-8 text-paper">
          <div className="skew-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-volt">Welcome</p>
            <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Research, analyse and write — faster.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-paper/70">
              {items.length} request{items.length === 1 ? "" : "s"} completed so far.
            </p>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TOOLS.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group rounded-sm border-2 border-ink bg-paper p-5 transition-colors hover:bg-volt"
            >
              <p className="font-display text-xs text-stone group-hover:text-ink">{t.n}</p>
              <h3 className="mt-6 font-display text-lg font-bold tracking-tight">{t.title}</h3>
              <p className="mt-1 text-sm text-ink/70">{t.desc}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider">Open →</p>
            </Link>
          ))}
        </div>

        <section className="rounded-sm border-2 border-ink bg-paper p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[11px] uppercase tracking-[0.2em] text-stone">Recent activity</h2>
            <Link to="/history" className="text-xs underline">View all</Link>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-stone">No activity yet. Pick a tool above to get started.</p>
          ) : (
            <ul className="space-y-3">
              {items.slice(0, 5).map((h) => (
                <li key={h.id} className="flex items-center gap-4 border-b border-ink/10 pb-3 last:border-0">
                  <span className="skew-1 w-24 shrink-0 rounded-sm bg-ink px-2 py-1 text-center text-[10px] uppercase tracking-wider text-volt">
                    <span className="skew-2 inline-block">{TOOL_LABEL[h.tool]}</span>
                  </span>
                  <Link to={TOOL_PATH[h.tool]} search={{ id: h.id } as never} className="flex-1 truncate text-sm hover:underline">{h.input}</Link>
                  <span className="text-xs text-stone">{timeAgo(h.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="text-xs leading-relaxed text-stone">
          <strong className="text-ink">Responsible AI:</strong> SHARON AI can make mistakes. Verify important information and review drafts before sending. Contact{" "}
          <a href={`mailto:${CONTACT}`} className="underline">{CONTACT}</a>.
        </p>
      </div>
    </>
  );
}
