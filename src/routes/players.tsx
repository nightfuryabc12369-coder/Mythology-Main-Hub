import { Avatar } from "@/components/archive/avatar";
import { RoleBadge, type BadgeRole } from "@/components/archive/role-badge";
import { PageHero } from "@/components/archive/widgets";
import { CardTile } from "@/components/archive/wish";
import { godPower, rarityOf } from "@/data/cards";
import { gods } from "@/data/gods";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

export const Route = createFileRoute("/players")({
  validateSearch: (search: Record<string, unknown>): { id?: string } => ({
    id: typeof search.id === "string" && search.id ? search.id : undefined,
  }),
  component: PlayersPage,
});

type Viewer = { id: string | null; role: BadgeRole };
type Summary = { id: string; name: string; joinedAt: string; role: BadgeRole; hasAvatar: boolean; cardCount: number; banned: boolean };
type Detail = {
  id: string;
  name: string;
  joinedAt?: string;
  role?: BadgeRole;
  hasAvatar?: boolean;
  cards?: Record<string, number>;
  banned?: boolean;
  email?: string;
  pills?: number;
  nextWishAt?: number;
  banReason?: string | null;
};
type LogEntry = { id: number; actorName: string; actorRole: string; targetId: string | null; targetName: string | null; action: string; detail: string; at: number };

const rarityRank = { legendary: 0, epic: 1, rare: 2, common: 3 } as const;
const avatarUrl = (id: string) => `/api/avatar?id=${encodeURIComponent(id)}`;
const dateLabel = (iso?: string) => (iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "");

function PlayersPage() {
  const { id } = Route.useSearch();
  return id ? <PlayerView id={id} /> : <Directory />;
}

function PlayerAvatar({ id, name, has, className }: { id: string; name: string; has: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  return <Avatar name={name} src={has && !failed ? avatarUrl(id) : null} className={className} />;
}

function Directory() {
  const [q, setQ] = useState("");
  const [players, setPlayers] = useState<Summary[] | null>(null);
  const [viewer, setViewer] = useState<Viewer>({ id: null, role: null });
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      fetch(`/api/players${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`, { credentials: "same-origin" })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error("offline"))))
        .then((data: { players: Summary[]; viewer: Viewer }) => {
          if (cancelled) return;
          setPlayers(data.players);
          setViewer(data.viewer);
          setError(false);
        })
        .catch(() => !cancelled && setError(true));
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [q]);

  return (
    <main>
      <PageHero kicker="Players" title="Travelers" subtitle="Everyone who joined Aether Codex. Open a profile to see their cards." />
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search by name"
          aria-label="Search players by name"
          className="h-12 w-full max-w-md rounded-sm border border-border bg-bg px-4 text-base text-fg placeholder:text-subtle focus:border-gold focus:outline-none"
        />
        {error ? <p className="text-sm text-wine">Could not load the players. Try again in a moment.</p> : null}
        {!players && !error ? <p className="text-sm text-muted">Gathering the travelers…</p> : null}
        {players && players.length === 0 ? <p className="text-sm text-muted">No travelers found.</p> : null}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {players?.map((player) => (
            <Link
              key={player.id}
              to="/players"
              search={{ id: player.id }}
              className="pressable flex items-center gap-4 rounded-md bg-surface p-4 shadow-border"
            >
              <PlayerAvatar id={player.id} name={player.name} has={player.hasAvatar} className="size-14 text-xl" />
              <div className="min-w-0">
                <p className="truncate font-display text-xl text-fg">{player.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <RoleBadge role={player.role} />
                  {player.banned ? <span className="rounded-full border border-wine/60 px-2 py-0.5 text-[10px] tracking-kicker text-wine uppercase">Banned</span> : null}
                </div>
                <p className="mt-1 text-xs text-muted">
                  {player.cardCount} {player.cardCount === 1 ? "card" : "cards"} · joined {dateLabel(player.joinedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {viewer.role ? <StaffLog /> : null}
      </div>
    </main>
  );
}

const ACTION_TEXT: Record<string, string> = {
  "remove-card": "removed a card from",
  "give-card": "gave a card to",
  "give-pills": "gave ambrosia to",
  "reset-wish": "reset the wish timer of",
  ban: "banned",
  unban: "unbanned",
  "make-moderator": "made a moderator:",
  "remove-moderator": "removed the moderator role from",
};

function StaffLog() {
  const [log, setLog] = useState<LogEntry[] | null>(null);
  useEffect(() => {
    fetch("/api/staff", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { log: LogEntry[] } | null) => setLog(data?.log ?? []))
      .catch(() => setLog([]));
  }, []);
  return (
    <section>
      <h2 className="font-display text-3xl text-fg">Moderation log</h2>
      <p className="mt-1 text-sm text-muted">Every staff action, newest first. Only staff can see this.</p>
      <ul className="mt-4 divide-y divide-border rounded-md bg-surface shadow-border">
        {log === null ? <li className="p-4 text-sm text-muted">Loading…</li> : null}
        {log?.length === 0 ? <li className="p-4 text-sm text-muted">Nothing yet.</li> : null}
        {log?.map((entry) => (
          <li key={entry.id} className="p-4 text-sm">
            <span className="text-fg">{entry.actorName}</span> <RoleBadge role={entry.actorRole as BadgeRole} className="align-middle" />{" "}
            <span className="text-muted">{ACTION_TEXT[entry.action] ?? entry.action}</span> <span className="text-fg">{entry.targetName ?? ""}</span>
            {entry.detail ? <span className="text-muted"> · {entry.detail}</span> : null}
            <span className="block text-xs text-subtle">{new Date(entry.at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const ERROR_TEXT: Record<string, string> = {
  forbidden: "You are not allowed to do that.",
  "admins-only": "Only admins can do that.",
  "cannot-target-admin": "Nobody can act on an admin.",
  "cannot-target-staff": "Moderators cannot act on other staff.",
  "not-yourself": "You cannot do that to yourself.",
  "not-owned": "They no longer own that card.",
  "already-owned": "They already own that card.",
  "bad-amount": "Pick an amount from 1 to 50.",
  banned: "Unban them first.",
};

function PlayerView({ id }: { id: string }) {
  const [data, setData] = useState<{ viewer: Viewer; player: Detail } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [giveCard, setGiveCard] = useState("");
  const [amount, setAmount] = useState("5");
  const [reason, setReason] = useState("");

  const load = useCallback(() => {
    return fetch(`/api/players?id=${encodeURIComponent(id)}`, { credentials: "same-origin" })
      .then(async (res) => {
        if (res.status === 404) return setStatus("missing");
        if (!res.ok) return setStatus("error");
        setData((await res.json()) as { viewer: Viewer; player: Detail });
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  useEffect(() => {
    setStatus("loading");
    setNotice("");
    void load();
  }, [load]);

  async function act(body: Record<string, unknown>, okText: string) {
    setBusy(true);
    setNotice("");
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: id, ...body }),
      });
      if (res.ok) {
        setNotice(okText);
        await load();
      } else {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        setNotice(ERROR_TEXT[err.error ?? ""] ?? "That did not work.");
      }
    } catch {
      setNotice("That did not work. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  const back = (
    <Link to="/players" search={{}} className="text-xs tracking-kicker text-primary uppercase">
      ← All travelers
    </Link>
  );

  if (status === "loading") return <main className="px-4 py-32 text-center text-sm text-muted">Opening the profile…</main>;
  if (status !== "ready" || !data)
    return (
      <main className="mx-auto max-w-3xl px-4 py-32 text-center">
        <p className="text-sm text-muted">{status === "missing" ? "That traveler could not be found." : "Could not load this profile. Try again in a moment."}</p>
        <div className="mt-6">{back}</div>
      </main>
    );

  const { viewer, player } = data;
  if (player.banned && !viewer.role)
    return (
      <main className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="font-display text-4xl text-fg">{player.name}</h1>
        <p className="mt-3 text-sm text-muted">This traveler has been banned.</p>
        <div className="mt-6">{back}</div>
      </main>
    );

  const cards = player.cards ?? {};
  const owned = gods
    .filter((god) => cards[god.id])
    .sort((a, b) => rarityRank[rarityOf(a.id)] - rarityRank[rarityOf(b.id)] || godPower(b) - godPower(a));
  const isSelf = viewer.id === player.id;
  const targetRole = player.role ?? null;
  const canAct = !isSelf && (viewer.role === "admin" ? targetRole !== "admin" : viewer.role === "moderator" ? targetRole === null : false);
  const isAdmin = viewer.role === "admin";
  const unowned = gods.filter((god) => !cards[god.id]);
  const wishWait = player.nextWishAt && player.nextWishAt > Date.now() ? Math.ceil((player.nextWishAt - Date.now()) / 3_600_000) : 0;

  return (
    <main>
      <PageHero kicker="Traveler" title={player.name} subtitle="A look at their cards. Only they, and the staff, can change anything here.">
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <RoleBadge role={targetRole} />
          {player.banned ? <span className="rounded-full border border-wine/60 px-2.5 py-0.5 text-[10px] tracking-kicker text-wine uppercase">Banned</span> : null}
          <span className="text-xs text-muted">Joined {dateLabel(player.joinedAt)}</span>
        </div>
      </PageHero>
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6">
        <section className="flex flex-wrap items-center gap-5">
          <PlayerAvatar id={player.id} name={player.name} has={Boolean(player.hasAvatar)} className="size-24 text-3xl" />
          <div className="min-w-0">
            <p className="font-display text-3xl text-fg">{player.name}</p>
            <p className="text-sm text-muted">
              {owned.length} of {gods.length} cards
            </p>
            {viewer.role && player.email ? (
              <p className="mt-1 text-xs text-subtle">
                Staff view · {player.email} · {player.pills ?? 0} ambrosia{wishWait ? ` · wish ready in about ${wishWait}h` : " · wish ready"}
              </p>
            ) : null}
            {player.banned && player.banReason !== undefined ? <p className="mt-1 text-xs text-wine">Ban reason: {player.banReason || "none given"}</p> : null}
            <div className="mt-3">{back}</div>
          </div>
        </section>

        {notice ? (
          <p role="status" className="rounded-sm border border-border bg-surface px-4 py-3 text-sm text-fg">
            {notice}
          </p>
        ) : null}

        <section>
          <h2 className="font-display text-3xl text-fg">Cards</h2>
          {owned.length === 0 ? <p className="mt-4 text-sm text-muted">No cards yet.</p> : null}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {owned.map((god) => (
              <CardTile key={god.id} god={god} level={cards[god.id]}>
                {canAct ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm(`Remove ${god.name} from ${player.name}?`)) void act({ action: "remove-card", godId: god.id }, `${god.name} was removed.`);
                    }}
                    className="pressable mt-2 min-h-10 w-full rounded-sm border border-wine/60 text-[11px] tracking-kicker text-wine uppercase disabled:opacity-40"
                  >
                    Remove card
                  </button>
                ) : null}
              </CardTile>
            ))}
          </div>
        </section>

        {canAct && isAdmin ? (
          <section className="rounded-md bg-surface p-5 shadow-border sm:p-6">
            <h2 className="font-display text-3xl text-fg">Admin powers</h2>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs tracking-kicker text-muted uppercase">Give a card</p>
                <div className="mt-2 flex gap-2">
                  <select
                    value={giveCard}
                    onChange={(event) => setGiveCard(event.target.value)}
                    className="h-11 min-w-0 flex-1 rounded-sm border border-border bg-bg px-2 text-sm text-fg"
                  >
                    <option value="">Pick a card…</option>
                    {unowned.map((god) => (
                      <option key={god.id} value={god.id}>
                        {god.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={busy || !giveCard}
                    onClick={() => void act({ action: "give-card", godId: giveCard }, "Card given.").then(() => setGiveCard(""))}
                    className="pressable min-h-11 rounded-sm bg-primary px-4 text-xs tracking-kicker text-primary-fg uppercase disabled:opacity-40"
                  >
                    Give
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs tracking-kicker text-muted uppercase">Give ambrosia (1 to 50)</p>
                <div className="mt-2 flex gap-2">
                  <input
                    value={amount}
                    onChange={(event) => setAmount(event.target.value.replace(/\D/g, "").slice(0, 2))}
                    inputMode="numeric"
                    className="h-11 w-24 rounded-sm border border-border bg-bg px-3 text-sm text-fg"
                    aria-label="Ambrosia amount"
                  />
                  <button
                    type="button"
                    disabled={busy || !amount}
                    onClick={() => void act({ action: "give-pills", amount: Number(amount) }, `${amount} ambrosia given.`)}
                    className="pressable min-h-11 rounded-sm bg-primary px-4 text-xs tracking-kicker text-primary-fg uppercase disabled:opacity-40"
                  >
                    Give
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void act({ action: "reset-wish" }, "Wish timer reset.")}
                  className="pressable min-h-11 rounded-sm border border-border px-4 text-xs tracking-kicker text-fg uppercase disabled:opacity-40"
                >
                  Reset wish timer
                </button>
                <button
                  type="button"
                  disabled={busy || player.banned}
                  onClick={() =>
                    void act({ action: "set-role", role: targetRole === "moderator" ? null : "moderator" }, targetRole === "moderator" ? "Moderator removed." : "Now a moderator.")
                  }
                  className="pressable min-h-11 rounded-sm border border-border px-4 text-xs tracking-kicker text-fg uppercase disabled:opacity-40"
                >
                  {targetRole === "moderator" ? "Remove moderator" : "Make moderator"}
                </button>
              </div>
              <div>
                <p className="text-xs tracking-kicker text-muted uppercase">{player.banned ? "This account is banned" : "Ban this account"}</p>
                {player.banned ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void act({ action: "unban" }, "Unbanned.")}
                    className="pressable mt-2 min-h-11 rounded-sm border border-border px-4 text-xs tracking-kicker text-fg uppercase disabled:opacity-40"
                  >
                    Unban
                  </button>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <input
                      value={reason}
                      onChange={(event) => setReason(event.target.value.slice(0, 200))}
                      placeholder="Reason (they will see it)"
                      className="h-11 min-w-0 flex-1 rounded-sm border border-border bg-bg px-3 text-sm text-fg placeholder:text-subtle"
                    />
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        if (window.confirm(`Ban ${player.name}? They are signed out right away.`)) void act({ action: "ban", reason }, "Banned.").then(() => setReason(""));
                      }}
                      className="pressable min-h-11 rounded-sm border border-wine/60 px-4 text-xs tracking-kicker text-wine uppercase disabled:opacity-40"
                    >
                      Ban
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}
        {canAct && !isAdmin ? <p className="text-xs text-muted">Moderator powers: you can remove cards from players who break the rules.</p> : null}
      </div>
    </main>
  );
}
