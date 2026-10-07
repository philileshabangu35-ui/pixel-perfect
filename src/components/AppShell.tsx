import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/research", label: "Research Assistant" },
  { to: "/summarizer", label: "Article Summarizer" },
  { to: "/insights", label: "Insights" },
  { to: "/email", label: "Email Generator" },
  { to: "/history", label: "History" },
  { to: "/settings", label: "Settings" },
] as const;

export const CONTACT = "philileshabangu35@gmail.com";

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col bg-ink text-paper">
      <div className="border-b border-paper/10 px-8 pb-6 pt-8">
        <Link to="/" onClick={onNavigate} className="flex items-center gap-3">
          <div className="skew-1 grid h-9 w-9 place-items-center bg-volt">
            <span className="skew-2 font-display text-lg font-bold text-ink">S</span>
          </div>
          <div>
            <p className="font-display text-lg font-bold leading-none tracking-tight">SHARON</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-volt">AI Assist</p>
          </div>
        </Link>
      </div>
      <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {NAV.map((n) => {
          const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`skew-1 flex items-center rounded-sm px-4 py-3 text-sm transition-colors ${
                active ? "bg-volt font-semibold text-ink" : "text-paper/70 hover:bg-paper/5 hover:text-paper"
              }`}
            >
              <span className="skew-2">{n.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-paper/10 px-6 py-5">
        <div className="rounded-sm bg-paper/5 p-4">
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-volt">Responsible AI</p>
          <p className="text-[11px] leading-relaxed text-paper/60">
            Outputs may be inaccurate. Verify before use. Contact{" "}
            <a href={`mailto:${CONTACT}`} className="underline hover:text-volt">{CONTACT}</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-paper text-ink lg:h-screen lg:overflow-hidden">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 lg:block">
        <Sidebar />
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button aria-label="Close menu" className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72">
            <Sidebar onNavigate={() => setOpen(false)} />
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute right-3 top-3 p-2 text-paper">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col lg:overflow-y-auto">
        <div className="flex items-center justify-between bg-ink px-4 py-3 text-paper lg:hidden">
          <span className="font-display font-bold tracking-tight">SHARON <span className="text-volt">AI</span></span>
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="p-1">
            <Menu className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow = "Workspace", title }: { eyebrow?: string; title: string }) {
  return (
    <>
      <header className="flex items-center justify-between border-b border-ink/10 px-5 py-6 sm:px-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-stone">{eyebrow}</p>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        </div>
      </header>
      <div className="overflow-hidden border-b border-ink/10 bg-ink py-2" aria-hidden="true">
        <div className="marquee flex w-max gap-12 whitespace-nowrap font-display text-xs uppercase tracking-[0.2em] text-volt">
          {Array.from({ length: 4 }).flatMap((_, i) =>
            ["Research", "Summarize", "Insights", "Formal", "Friendly", "Persuasive", "Professional"].map((w) => (
              <span key={`${i}-${w}`} className="flex gap-12">
                <span>{w}</span>
                <span className="text-paper/30">✦</span>
              </span>
            )),
          )}
        </div>
      </div>
    </>
  );
}
