import { usePresence } from "@/components/archive/widgets";
import { cn } from "@/lib/utils";
import { MessageCircle, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Msg = { id: number; name: string; body: string; verified: boolean; at: number };

const OPEN_POLL_MS = 3000;
const CLOSED_POLL_MS = 20000;
const MAX_ON_SCREEN = 150;
const NAME_KEY = "aether-chat-name";

function timeLabel(at: number) {
  return new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

const ERRORS: Record<string, string> = {
  "slow-down": "Slow down a little.",
  "no-links": "Links are not allowed in chat.",
  "name-needed": "Pick a nickname first.",
  empty: "Write something first.",
};

export function ChatDock() {
  const [open, setOpen] = useState(false);
  const { render, shown } = usePresence(open, 260);

  const [ready, setReady] = useState<"loading" | "ok" | "offline">("loading");
  const [account, setAccount] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [unread, setUnread] = useState(0);
  const [nick, setNick] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const cursor = useRef(0);
  const openRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  openRef.current = open;

  // A fresh chat every visit: remember only where the room was when this page loaded.
  useEffect(() => {
    let cancelled = false;
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(NAME_KEY) : null;
    if (saved) setNick(saved);
    fetch("/api/chat")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("offline"))))
      .then((data: { latest: number; user: { name: string } | null }) => {
        if (cancelled) return;
        cursor.current = data.latest;
        setAccount(data.user?.name ?? null);
        setReady("ok");
      })
      .catch(() => {
        if (!cancelled) setReady("offline");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const pull = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?after=${cursor.current}`);
      if (!res.ok) return;
      const data = (await res.json()) as { latest: number; messages: Msg[] };
      if (!data.messages?.length) return;
      cursor.current = Math.max(cursor.current, data.latest);
      setMessages((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        const fresh = data.messages.filter((m) => !seen.has(m.id));
        if (!fresh.length) return prev;
        if (!openRef.current) setUnread((n) => n + fresh.length);
        return [...prev, ...fresh].slice(-MAX_ON_SCREEN);
      });
    } catch {
      /* try again on the next tick */
    }
  }, []);

  // Poll while the tab is visible: quickly when the panel is open, slowly (for the badge) when closed.
  useEffect(() => {
    if (ready !== "ok") return;
    let timer: number | undefined;
    const tick = () => {
      if (document.visibilityState === "visible") void pull();
      timer = window.setTimeout(tick, openRef.current ? OPEN_POLL_MS : CLOSED_POLL_MS);
    };
    if (open) void pull();
    timer = window.setTimeout(tick, open ? OPEN_POLL_MS : CLOSED_POLL_MS);
    return () => window.clearTimeout(timer);
  }, [ready, open, pull]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open, messages.length]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openRef.current) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages, shown]);

  const send = async () => {
    const body = text.trim();
    if (!body || sending) return;
    const name = account ?? nick.trim();
    if (!name) {
      setError(ERRORS["name-needed"]);
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, body }),
      });
      const data = (await res.json()) as { message?: Msg; error?: string };
      if (!res.ok || !data.message) {
        setError(ERRORS[data.error ?? ""] ?? "Could not send. Try again.");
        return;
      }
      if (!account) window.localStorage.setItem(NAME_KEY, name);
      const sent = data.message;
      stickToBottom.current = true;
      setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent].slice(-MAX_ON_SCREEN)));
      setText("");
    } catch {
      setError("Could not send. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        className="pressable fixed top-20 left-3 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 bg-bg/70 text-gold shadow-lg backdrop-blur-md sm:top-24 sm:left-5"
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
        {unread > 0 && !open ? (
          <span className="absolute -top-1 -right-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-wine px-1 text-[10px] font-semibold text-fg">
            {unread > 99 ? "99+" : unread}
          </span>
        ) : null}
      </button>

      {render ? (
        <>
          <div
            className={cn("fixed inset-0 z-40 bg-bg-deep/50 transition-opacity duration-200 sm:hidden", shown ? "opacity-100" : "opacity-0")}
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside
            role="dialog"
            aria-label="Chat"
            className={cn(
              "fixed top-0 bottom-0 left-0 z-50 flex w-[min(380px,100vw)] flex-col border-r border-border bg-surface shadow-2xl transition-transform duration-[260ms] ease-out",
              shown ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <p className="text-[10px] tracking-kicker text-gold uppercase">Open hall</p>
                <h2 className="font-display text-lg text-fg uppercase">Chat</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="pressable inline-flex h-11 w-11 items-center justify-center rounded-sm text-muted"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div
              ref={listRef}
              onScroll={(event) => {
                const el = event.currentTarget;
                stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
              }}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {ready === "loading" ? <p className="text-sm text-muted">Opening the hall…</p> : null}
              {ready === "offline" ? (
                <p className="text-sm text-muted">Chat is resting right now. Please try again a little later.</p>
              ) : null}
              {ready === "ok" && messages.length === 0 ? (
                <p className="text-sm text-muted">
                  This chat starts fresh each time you visit. You will see messages sent from now on. Say hello.
                </p>
              ) : null}
              {messages.map((m) => (
                <div key={m.id}>
                  <p className="text-xs text-subtle">
                    <span className={cn("font-semibold", m.verified ? "text-gold" : "text-fg")}>{m.name}</span> · {timeLabel(m.at)}
                  </p>
                  <p className="mt-0.5 text-sm break-words text-fg/90">{m.body}</p>
                </div>
              ))}
            </div>

            {ready === "ok" ? (
              <div className="border-t border-border p-3">
                {!account ? (
                  <input
                    value={nick}
                    onChange={(event) => setNick(event.target.value.slice(0, 20))}
                    placeholder="Your nickname"
                    aria-label="Your nickname"
                    className="mb-2 h-10 w-full rounded-sm border border-border bg-bg px-3 text-sm text-fg placeholder:text-subtle focus:border-gold focus:outline-none"
                  />
                ) : (
                  <p className="mb-2 text-xs text-subtle">
                    Chatting as <span className="text-gold">{account}</span>
                  </p>
                )}
                <div className="flex gap-2">
                  <input
                    value={text}
                    onChange={(event) => setText(event.target.value.slice(0, 300))}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void send();
                      }
                    }}
                    placeholder="Write a message"
                    aria-label="Message"
                    className="h-11 min-w-0 flex-1 rounded-sm border border-border bg-bg px-3 text-sm text-fg placeholder:text-subtle focus:border-gold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => void send()}
                    disabled={sending || !text.trim()}
                    aria-label="Send"
                    className="pressable inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-fg disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                {error ? <p className="mt-2 text-xs text-wine">{error}</p> : null}
              </div>
            ) : null}
          </aside>
        </>
      ) : null}
    </>
  );
}
