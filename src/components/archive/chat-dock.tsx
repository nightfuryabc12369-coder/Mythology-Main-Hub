import { usePresence } from "@/components/archive/widgets";
import { cn } from "@/lib/utils";
import { Ban, Crown, MessageCircle, Send, ShieldCheck, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Msg = { id: number; name: string; body: string; verified: boolean; admin: boolean; role?: "admin" | "moderator" | null; at: number };

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
  muted: "You are muted for a while.",
};

export function ChatDock() {
  const [open, setOpen] = useState(false);
  const { render, shown } = usePresence(open, 260);

  const [ready, setReady] = useState<"loading" | "ok" | "offline">("loading");
  const [account, setAccount] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [unread, setUnread] = useState(0);
  const [nick, setNick] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const cursor = useRef(0);
  const base = useRef(0);
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
      .then((data: { latest: number; user: { name: string } | null; admin?: boolean; role?: string | null }) => {
        if (cancelled) return;
        cursor.current = data.latest;
        base.current = data.latest;
        setAccount(data.user?.name ?? null);
        setIsAdmin(Boolean(data.admin));
        setIsStaff(Boolean(data.admin || data.role));
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
      const res = await fetch(`/api/chat?after=${cursor.current}&base=${base.current}`);
      if (!res.ok) return;
      const data = (await res.json()) as { latest: number; messages: Msg[]; removed?: number[] };
      cursor.current = Math.max(cursor.current, data.latest);
      const removed = new Set(data.removed ?? []);
      setMessages((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        const fresh = (data.messages ?? []).filter((m) => !seen.has(m.id));
        const kept = removed.size ? prev.filter((m) => !removed.has(m.id)) : prev;
        if (!fresh.length && kept.length === prev.length) return prev;
        if (fresh.length && !openRef.current) setUnread((n) => n + fresh.length);
        return [...kept, ...fresh].slice(-MAX_ON_SCREEN);
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

  // Signing in or out in another tab (or after this page loaded) should still be picked up.
  useEffect(() => {
    if (!open || ready !== "ok") return;
    fetch("/api/chat")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { user: { name: string } | null; admin?: boolean; role?: string | null } | null) => {
        if (!data) return;
        setAccount(data.user?.name ?? null);
        setIsAdmin(Boolean(data.admin));
        setIsStaff(Boolean(data.admin || data.role));
      })
      .catch(() => {});
  }, [open, ready]);

  const adminAction = async (action: "delete" | "mute" | "clear", id?: number) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, id }),
      });
      if (!res.ok) {
        setError("That did not work.");
        return;
      }
      setError("");
      if (action === "clear") setMessages([]);
      else if (action === "delete") setMessages((prev) => prev.filter((m) => m.id !== id));
      else if (action === "mute") {
        const target = messages.find((m) => m.id === id);
        void pull();
        if (target) setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch {
      setError("That did not work.");
    }
  };

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
              <div className="flex items-center gap-1">
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirmClear) {
                        setConfirmClear(true);
                        window.setTimeout(() => setConfirmClear(false), 3000);
                        return;
                      }
                      setConfirmClear(false);
                      void adminAction("clear");
                    }}
                    className="pressable inline-flex h-9 items-center gap-1 rounded-sm border border-wine/60 px-2 text-[10px] tracking-kicker text-wine uppercase"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    {confirmClear ? "Sure?" : "Clear all"}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="pressable inline-flex h-11 w-11 items-center justify-center rounded-sm text-muted"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
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
                <div key={m.id} className={cn("group", m.admin && "rounded-sm border border-gold/30 bg-gold/5 p-2", m.role === "moderator" && "rounded-sm border border-[#7fb4d9]/30 bg-[#7fb4d9]/5 p-2")}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex min-w-0 items-center gap-1 text-xs text-subtle">
                      {m.admin ? <Crown className="h-3.5 w-3.5 shrink-0 text-gold" aria-label="Admin" /> : null}
                      <span className={cn("truncate font-semibold", m.role === "moderator" ? "text-[#7fb4d9]" : m.admin || m.verified ? "text-gold" : "text-fg")}>{m.name}</span>
                      {m.admin ? <span className="text-[9px] tracking-kicker text-gold uppercase">Admin</span> : null}
                      {m.role === "moderator" ? <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#7fb4d9]" aria-label="Moderator" /> : null}
                      {m.role === "moderator" ? <span className="text-[9px] tracking-kicker text-[#7fb4d9] uppercase">Mod</span> : null}
                      <span>· {timeLabel(m.at)}</span>
                    </p>
                    {isStaff ? (
                      <span className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => void adminAction("delete", m.id)}
                          aria-label="Delete message"
                          title="Delete message"
                          className="pressable inline-flex h-7 w-7 items-center justify-center rounded-sm text-subtle hover:text-wine"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </button>
                        {!m.admin && !m.role ? (
                          <button
                            type="button"
                            onClick={() => void adminAction("mute", m.id)}
                            aria-label="Mute this person for an hour and remove their messages"
                            title="Mute for 1 hour + remove their messages"
                            className="pressable inline-flex h-7 w-7 items-center justify-center rounded-sm text-subtle hover:text-wine"
                          >
                            <Ban className="h-3.5 w-3.5" aria-hidden />
                          </button>
                        ) : null}
                      </span>
                    ) : null}
                  </div>
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
                    {isAdmin ? " · admin powers on" : isStaff ? " · moderator powers on" : ""}
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
