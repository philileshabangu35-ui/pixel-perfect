import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { clearHistory, getHistory, onHistoryChange, removeHistory, timeAgo, TOOL_LABEL, TOOL_PATH, type HistoryItem, type ToolId } from "@/lib/history";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — SHARON AI" },
      { name: "description", content: "Browse and reopen your previous SHARON AI requests." },
      { property: "og:title", content: "History — SHARON AI" },
      { property: "og:description", content: "Browse and reopen your previous SHARON AI requests." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<ToolId | "all">("all");
  useEffect(() => {
    const load = () => setItems(getHistory());
    load();
    return onHistoryChange(load);
  }, []);
  const shown = filter === "all" ? items : items.filter((i) => i.tool === filter);

  return (
    <>
      <PageHeader title="History" />
      <div className="p-4 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {(["all", "research", "summarize", "insights", "email"] as const).map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`skew-1 rounded-sm px-3 py-1.5 text-xs font-semibold ${filter === f ? "bg-ink text-volt" : "border border-ink"}`}
            >
              <span className="skew-2 inline-block">{f === "all" ? "All" : TOOL_LABEL[f]}</span>
            </button>
          ))}
          {items.length > 0 && (
            <button
              onClick={() => confirm("Clear all history?") && clearHistory()}
              className="ml-auto text-xs text-destructive underline"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="rounded-sm border-2 border-ink">
          {shown.length === 0 ? (
            <p className="p-8 text-sm text-stone">No requests yet.</p>
          ) : (
            <ul>
              {shown.map((h) => (
                <li key={h.id} className="flex items-center gap-4 border-b border-ink/10 p-4 last:border-0">
                  <span className="skew-1 w-24 shrink-0 rounded-sm bg-ink px-2 py-1 text-center text-[10px] uppercase tracking-wider text-volt">
                    <span className="skew-2 inline-block">{TOOL_LABEL[h.tool]}</span>
                  </span>
                  <Link to={TOOL_PATH[h.tool]} search={{ id: h.id } as never} className="min-w-0 flex-1 hover:underline">
                    <p className="truncate text-sm font-medium">{h.input}</p>
                    <p className="truncate text-xs text-stone">{h.tone ? `${h.tone} · ` : ""}{h.output.slice(0, 120)}</p>
                  </Link>
                  <span className="text-xs text-stone">{timeAgo(h.createdAt)}</span>
                  <button onClick={() => removeHistory(h.id)} aria-label="Delete" className="text-xs text-stone hover:text-destructive">✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-4 text-xs text-stone">History is stored only in this browser.</p>
      </div>
    </>
  );
}
