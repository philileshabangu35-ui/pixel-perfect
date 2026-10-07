export type ToolId = "research" | "summarize" | "insights" | "email";
export type HistoryItem = {
  id: string;
  tool: ToolId;
  input: string;
  tone?: string;
  recipient?: string;
  output: string;
  createdAt: number;
};

const KEY = "sharon-history";
const EVT = "sharon-history-change";

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
export function addHistory(item: Omit<HistoryItem, "id" | "createdAt">) {
  const list = [{ ...item, id: crypto.randomUUID(), createdAt: Date.now() }, ...getHistory()].slice(0, 100);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVT));
}
export function removeHistory(id: string) {
  localStorage.setItem(KEY, JSON.stringify(getHistory().filter((h) => h.id !== id)));
  window.dispatchEvent(new Event(EVT));
}
export function clearHistory() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVT));
}
export function onHistoryChange(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}

export const TOOL_LABEL: Record<ToolId, string> = {
  research: "Research",
  summarize: "Summary",
  insights: "Insights",
  email: "Email",
};
export const TOOL_PATH: Record<ToolId, "/research" | "/summarizer" | "/insights" | "/email"> = {
  research: "/research",
  summarize: "/summarizer",
  insights: "/insights",
  email: "/email",
};

export function timeAgo(t: number) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
