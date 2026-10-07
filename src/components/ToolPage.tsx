import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { PageHeader } from "./AppShell";
import { addHistory, getHistory, onHistoryChange, timeAgo, type HistoryItem, type ToolId } from "@/lib/history";

const TONES = ["Formal", "Friendly", "Persuasive", "Professional"];
const ERR = "[[SHARON_ERROR]]";

type Props = {
  tool: ToolId;
  title: string;
  inputLabel: string;
  placeholder: string;
  outputLabel: string;
  actionLabel?: string;
};

export function ToolPage({ tool, title, inputLabel, placeholder, outputLabel, actionLabel = "Generate" }: Props) {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("Professional");
  const [recipient, setRecipient] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [recent, setRecent] = useState<HistoryItem[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const load = () => setRecent(getHistory().filter((h) => h.tool === tool).slice(0, 3));
    load();
    // restore from history link (?id=)
    const id = new URLSearchParams(window.location.search).get("id");
    const item = id ? getHistory().find((h) => h.id === id) : undefined;
    if (item) {
      setInput(item.input);
      setOutput(item.output);
      if (item.tone) setTone(item.tone);
      if (item.recipient) setRecipient(item.recipient);
    }
    return onHistoryChange(load);
  }, [tool]);

  async function generate() {
    if (!input.trim() || loading) return;
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    setError(null);
    setOutput("");
    let text = "";
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, input, tone, recipient }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong. Please try again.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        setOutput(text.split(ERR)[0]);
      }
      if (text.includes(ERR)) {
        const [ok, msg] = text.split(ERR);
        setOutput(ok.trim());
        throw new Error(msg);
      }
      if (!text.trim()) throw new Error("No response was returned. Please try again.");
      addHistory({ tool, input, output: text.trim(), ...(tool === "email" ? { tone, recipient } : {}) });
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <PageHeader title={title} />
      <div className="grid flex-1 grid-cols-1 gap-6 p-4 sm:p-8 xl:grid-cols-5">
        <div className="flex flex-col gap-4 xl:col-span-2">
          {tool === "email" && (
            <fieldset className="skew-1 rounded-sm bg-ink p-6 text-paper">
              <legend className="sr-only">Tone</legend>
              <p className="skew-2 mb-3 text-[10px] uppercase tracking-[0.25em] text-volt">Tone Selector</p>
              <div className="skew-2 flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={tone === t}
                    onClick={() => setTone(t)}
                    className={`rounded-sm px-3 py-1.5 text-xs transition-colors ${
                      tone === t ? "bg-volt font-semibold text-ink" : "bg-paper/10 text-paper hover:bg-paper/20"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              generate();
            }}
            className="flex flex-1 flex-col overflow-hidden rounded-sm border-2 border-ink bg-paper"
          >
            <label htmlFor="sharon-input" className="bg-ink px-5 py-3 font-display text-[11px] uppercase tracking-[0.2em] text-paper">
              Input · {inputLabel}
            </label>
            {tool === "email" && (
              <div className="border-b border-ink/10 px-5 py-3">
                <label htmlFor="sharon-recipient" className="text-[10px] uppercase tracking-[0.2em] text-stone">Recipient</label>
                <input
                  id="sharon-recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Dr. Nkosi, Research Lead"
                  className="mt-1 w-full bg-transparent text-sm outline-none placeholder:text-stone"
                />
              </div>
            )}
            <textarea
              id="sharon-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate();
              }}
              placeholder={placeholder}
              rows={9}
              className="min-h-48 flex-1 resize-none bg-transparent p-5 text-sm leading-relaxed outline-none placeholder:text-stone"
            />
            <div className="flex items-center justify-between border-t border-ink/10 px-5 py-4">
              <span className="text-xs text-stone">{input.length} characters</span>
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="skew-1 bg-ink px-5 py-2 text-xs font-semibold uppercase tracking-wider text-volt transition-colors hover:bg-volt hover:text-ink disabled:opacity-40 disabled:hover:bg-ink disabled:hover:text-volt"
              >
                <span className="skew-2 inline-block">{loading ? "Working…" : actionLabel}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-4 xl:col-span-3">
          <section aria-live="polite" className="relative flex min-h-80 flex-1 flex-col overflow-hidden rounded-sm border-2 border-ink bg-paper">
            <div className="flex items-center justify-between bg-volt px-5 py-3 font-display text-[11px] uppercase tracking-[0.2em] text-ink">
              <span>Output · {outputLabel}</span>
              {tool === "email" && <span className="text-[10px] font-semibold">Tone: {tone}</span>}
            </div>
            <div className="flex-1 p-6">
              {error && (
                <div role="alert" className="mb-4 rounded-sm border-2 border-destructive p-4 text-sm text-destructive">
                  <p className="font-semibold">Couldn't generate</p>
                  <p className="mt-1">{error}</p>
                </div>
              )}
              {loading && !output && (
                <div className="space-y-3" aria-label="Generating">
                  {[100, 92, 75, 85, 60].map((w, i) => (
                    <div key={i} className="h-3 animate-pulse rounded-sm bg-ink/10" style={{ width: `${w}%` }} />
                  ))}
                </div>
              )}
              {output ? (
                <div className="prose-sharon">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              ) : (
                !loading && !error && (
                  <p className="text-sm text-stone">Your result will appear here. Tip: press Ctrl/⌘ + Enter to generate.</p>
                )
              )}
            </div>
            <div className="flex items-center gap-3 border-t border-ink/10 bg-ink/[0.03] px-5 py-3">
              <button
                onClick={copy}
                disabled={!output || loading}
                className="skew-1 rounded-sm bg-ink px-3 py-1.5 text-xs font-semibold text-volt disabled:opacity-40"
              >
                <span className="skew-2 inline-block">{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={generate}
                disabled={!input.trim() || loading}
                className="skew-1 rounded-sm border border-ink px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-ink hover:text-volt disabled:opacity-40"
              >
                <span className="skew-2 inline-block">Regenerate</span>
              </button>
              {loading && (
                <button onClick={() => abortRef.current?.abort()} className="text-xs underline">Stop</button>
              )}
              <span className="ml-auto hidden text-[10px] uppercase tracking-widest text-stone sm:inline">AI-generated · verify</span>
            </div>
          </section>

          <section className="rounded-sm border-2 border-ink bg-paper p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-[11px] uppercase tracking-[0.2em] text-stone">Recent history</h2>
              <Link to="/history" className="text-xs underline">View all</Link>
            </div>
            {recent.length === 0 ? (
              <p className="text-sm text-stone">Nothing yet — your requests will be saved here.</p>
            ) : (
              <ul className="space-y-3">
                {recent.map((h, i) => (
                  <li key={h.id} className={`flex items-center gap-4 ${i < recent.length - 1 ? "border-b border-ink/10 pb-3" : ""}`}>
                    <span className="skew-1 w-24 shrink-0 rounded-sm bg-ink px-2 py-1 text-center text-[10px] uppercase tracking-wider text-volt">
                      <span className="skew-2 inline-block">{h.tone ?? title.split(" ")[0]}</span>
                    </span>
                    <button
                      className="flex-1 truncate text-left text-sm hover:underline"
                      onClick={() => {
                        setInput(h.input);
                        setOutput(h.output);
                        setError(null);
                        if (h.tone) setTone(h.tone);
                        if (h.recipient) setRecipient(h.recipient);
                      }}
                    >
                      {h.input}
                    </button>
                    <span className="text-xs text-stone">{timeAgo(h.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
