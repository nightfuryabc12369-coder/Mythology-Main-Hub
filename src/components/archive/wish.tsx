import { EmblemMark } from "@/components/archive/emblem";
import {
  LEGENDARY_UNLOCK_CARDS,
  MAX_LEVEL,
  PILLS_PER_WISH,
  RARITY_COLOR,
  RARITY_LABEL,
  REST_HOURS,
  cardPower,
  pullTable,
  rarityOf,
  rarityRates,
  rollCard,
  type WishKind,
} from "@/data/cards";
import type { God } from "@/data/types";
import { playSeal, playSummon, playTone } from "@/lib/audio";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

const SEVEN = [1, 2, 3, 4, 5, 6, 7];

/** Card art. Drop /public/cards/<god-id>.jpg in later and it replaces the placeholder on its own. */
export function CardArt({ god, className }: { god: God; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn("relative overflow-hidden bg-bg-deep", className)}>
      {failed ? (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2"
          style={{ background: "radial-gradient(circle at 50% 35%, color-mix(in oklab, var(--color-primary) 30%, #1c1712), #0c0a08 75%)" }}
        >
          <EmblemMark name={god.emblem} className="size-10 text-gold/70" />
          <span className="font-display text-5xl text-fg/40">{god.name.replace(/^The /, "").charAt(0)}</span>
          <span className="text-[10px] tracking-kicker text-muted uppercase">Placeholder</span>
        </div>
      ) : (
        <img src={`/cards/${god.id}.jpg`} alt={god.name} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

export function CardTile({ god, level, children }: { god: God; level: number; children?: React.ReactNode }) {
  const rarity = rarityOf(god.id);
  const color = RARITY_COLOR[rarity];
  return (
    <div className="overflow-hidden rounded-md bg-surface" style={{ boxShadow: `0 0 0 1px ${color}66` }}>
      <CardArt god={god} className="aspect-[3/4] w-full" />
      <div className="space-y-1 px-3 py-3">
        <p className="text-[10px] tracking-kicker uppercase" style={{ color }}>
          {RARITY_LABEL[rarity]}
        </p>
        <h3 className="font-display text-xl leading-none text-fg">{god.name}</h3>
        <p className="text-xs text-muted">
          Level {level}/{MAX_LEVEL} · Power {cardPower(god, level)}
        </p>
        {children}
      </div>
    </div>
  );
}

function formatRest(ms: number) {
  const minutes = Math.ceil(ms / 60000);
  if (minutes < 1) return "less than a minute";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const WISHES: Array<{ kind: WishKind; title: string; blurb: string }> = [
  { kind: "warrior", title: "Grant me a champion", blurb: "A random figure joins My Cards at Level 1, with 40% of their power. Strong figures are rare." },
  { kind: "power", title: "Grant me favor", blurb: `${PILLS_PER_WISH} drops of ambrosia for your inventory. Each drop raises one card by a level.` },
  { kind: "legend", title: "Grant me a legend", blurb: "One of the seven great powers joins My Cards. Only the legendary can answer this wish." },
];

type Result = { kind: "card"; god: God } | { kind: "pills" } | { kind: "none" };

export function WishSystem() {
  const hydrated = useArchiveStore((state) => state.hydrated);
  const storedCards = useArchiveStore((state) => state.cards);
  const nextWishAt = useArchiveStore((state) => state.nextWishAt);
  const sound = useArchiveStore((state) => state.sound);
  const grantCard = useArchiveStore((state) => state.grantCard);
  const addPills = useArchiveStore((state) => state.addPills);
  const startRest = useArchiveStore((state) => state.startRest);

  const cards = hydrated ? storedCards : {};
  const owned = useMemo(() => Object.keys(cards), [cards]);

  const [gathered, setGathered] = useState<number[]>([]);
  const [phase, setPhase] = useState<"gather" | "summoning" | "wish">("gather");
  const [detail, setDetail] = useState<WishKind | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!detail) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDetail(null);
        setResult(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail]);

  const restMs = hydrated && nextWishAt > now ? nextWishAt - now : 0;
  const resting = restMs > 0;

  function toggleStar(n: number) {
    if (phase !== "gather") return;
    const has = gathered.includes(n);
    const next = has ? gathered.filter((x) => x !== n) : [...gathered, n];
    setGathered(next);
    if (sound) playTone(262 + n * 44, 0.14, 0.04);
    if (next.length === 7) {
      setPhase("summoning");
      if (sound) playSummon();
      window.setTimeout(() => setPhase("wish"), 2000);
    }
  }

  function scatter() {
    setGathered([]);
    setPhase("gather");
    setDetail(null);
    setResult(null);
  }

  function rowsFor(kind: WishKind) {
    return kind === "warrior" ? pullTable(owned, "any") : kind === "legend" ? pullTable(owned, "legendary") : [];
  }

  function lockReason(kind: WishKind) {
    if (kind === "legend" && owned.length < LEGENDARY_UNLOCK_CARDS) return `Locked: own ${LEGENDARY_UNLOCK_CARDS} cards (${owned.length}/${LEGENDARY_UNLOCK_CARDS})`;
    if (kind !== "power" && rowsFor(kind).length === 0) return kind === "legend" ? "You already own every legend" : "You already own every card";
    return null;
  }

  function grant(kind: WishKind) {
    if (resting || lockReason(kind)) return;
    if (kind === "power") {
      addPills(PILLS_PER_WISH);
      setResult({ kind: "pills" });
    } else {
      const god = rollCard(rowsFor(kind));
      if (!god) {
        setResult({ kind: "none" });
        return;
      }
      grantCard(god.id);
      setResult({ kind: "card", god });
    }
    startRest(REST_HOURS * 3600 * 1000);
    setNow(Date.now());
    if (sound) playSeal();
  }

  const open = detail ? WISHES.find((wish) => wish.kind === detail) : null;
  const rows = detail ? rowsFor(detail) : [];
  const rates = rarityRates(rows);
  const lock = detail ? lockReason(detail) : null;

  return (
    <div className="relative overflow-hidden rounded-md bg-surface shadow-border">
      <img src="/scenes/oracle.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/80 to-bg" />
      <div className="relative px-4 py-8 sm:px-8 sm:py-10">
        {phase === "gather" ? (
          <>
            <p className="text-xs tracking-kicker text-gold uppercase">Collect the seven</p>
            <h3 className="mt-2 font-display text-3xl text-fg sm:text-4xl">The Pleiades</h3>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Select every star. When the seven are gathered, the Fates weave one wish for you. Cards you win live on your profile.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
              {SEVEN.map((n) => {
                const on = gathered.includes(n);
                return (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={on}
                    aria-label={`Star ${n}`}
                    onClick={() => toggleStar(n)}
                    className="wish-star pressable"
                    data-on={on}
                  >
                    <span className="flex max-w-[3.2rem] flex-wrap items-center justify-center gap-0.5 text-[9px] leading-none text-bg-deep">
                      {Array.from({ length: n }, (_, i) => (
                        <span key={i}>◆</span>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-6 text-center text-xs tracking-kicker text-muted uppercase">{gathered.length} / 7 gathered</p>
          </>
        ) : null}

        {phase === "summoning" ? (
          <div className="panel-in flex min-h-64 flex-col items-center justify-center text-center">
            <div className="wish-pulse size-24 rounded-full" />
            <p className="mt-6 text-xs tracking-kicker text-gold uppercase">The seven align</p>
            <p className="mt-2 font-display text-3xl text-fg">The Fates are listening…</p>
          </div>
        ) : null}

        {phase === "wish" ? (
          <div className="panel-in">
            <p className="text-xs tracking-kicker text-gold uppercase">Summon complete</p>
            <h3 className="mt-2 font-display text-3xl text-fg sm:text-4xl">Speak your wish</h3>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              One wish at a time. After any wish the Fates rest for {REST_HOURS} hours. This is a game: the odds below are the real odds.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {WISHES.map((wish) => {
                const locked = lockReason(wish.kind);
                return (
                  <button
                    key={wish.kind}
                    type="button"
                    onClick={() => {
                      setResult(null);
                      setDetail(wish.kind);
                    }}
                    className="pressable rounded-md border border-border bg-bg/70 p-5 text-left"
                  >
                    <h4 className="font-display text-xl text-fg">{wish.title}</h4>
                    <p className="mt-2 text-sm text-muted">{wish.blurb}</p>
                    <p className="mt-4 text-xs tracking-kicker text-primary uppercase">See details →</p>
                    {locked ? <p className="mt-2 text-xs tracking-kicker text-gold uppercase">{locked}</p> : null}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-muted">
              {resting ? `The Fates are resting. Your next wish is in ${formatRest(restMs)}.` : "The Fates are ready."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={scatter} className="pressable inline-flex min-h-11 items-center rounded-sm border border-border px-4 text-xs tracking-kicker text-muted uppercase">
                Scatter the stars
              </button>
              <Link to="/profile" className="pressable inline-flex min-h-11 items-center rounded-sm bg-primary px-4 text-xs tracking-kicker text-primary-fg uppercase">
                My cards
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-bg-deep/80 p-3 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          onClick={() => {
            setDetail(null);
            setResult(null);
          }}
        >
          <div className="max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-md border border-border bg-surface p-5 sm:p-7" onClick={(event) => event.stopPropagation()}>
            {result ? (
              <div className="panel-in text-center">
                <p className="text-xs tracking-kicker text-gold uppercase">Wish granted</p>
                {result.kind === "card" ? (
                  <>
                    <h4 className="mt-2 font-display text-3xl text-fg">{result.god.name}</h4>
                    <div className="mx-auto mt-4 w-48">
                      <CardTile god={result.god} level={1} />
                    </div>
                    <p className="mt-4 text-sm text-muted">Added to My Cards at Level 1.</p>
                  </>
                ) : result.kind === "pills" ? (
                  <>
                    <h4 className="mt-2 font-display text-3xl text-fg">+{PILLS_PER_WISH} ambrosia</h4>
                    <p className="mt-3 text-sm text-muted">Added to My Inventory. Spend them on your profile to raise a card a level.</p>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-muted">There was nothing left to give.</p>
                )}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link to="/profile" className="pressable inline-flex min-h-11 items-center rounded-sm bg-primary px-5 text-xs tracking-kicker text-primary-fg uppercase">
                    Open my cards
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setDetail(null);
                      setResult(null);
                      scatter();
                    }}
                    className="pressable inline-flex min-h-11 items-center rounded-sm border border-border px-5 text-xs tracking-kicker text-muted uppercase"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs tracking-kicker text-gold uppercase">Wish details</p>
                <h4 className="mt-2 font-display text-3xl text-fg">{open.title}</h4>
                <p className="mt-2 text-sm text-muted">{open.blurb}</p>
                {open.kind === "power" ? (
                  <p className="mt-5 text-sm text-fg">You always get {PILLS_PER_WISH} drops of ambrosia. No luck involved.</p>
                ) : (
                  <>
                    <p className="mt-5 text-sm text-muted">
                      <span className="font-display text-3xl text-primary">{rows.length}</span> {open.kind === "legend" ? "legends" : "figures"} you can still get.
                    </p>
                    <p className="mt-4 text-xs tracking-kicker text-muted uppercase">Pull rates by rarity</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {rates.map((rate) => (
                        <li key={rate.tier} className="flex justify-between gap-3">
                          <span style={{ color: RARITY_COLOR[rate.tier] }}>{RARITY_LABEL[rate.tier]}</span>
                          <span className="text-muted">{rate.count} figures</span>
                          <span className="w-14 text-right text-fg">{rate.pct.toFixed(rate.pct < 10 ? 1 : 0)}%</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs tracking-kicker text-muted uppercase">Every figure</p>
                    <ul className="mt-2 max-h-48 divide-y divide-border overflow-y-auto rounded-sm bg-bg/60 text-sm">
                      {rows.map((row) => (
                        <li key={row.god.id} className="flex items-center justify-between gap-3 px-3 py-2">
                          <span className="text-fg">{row.god.name}</span>
                          <span className="text-[10px] tracking-kicker uppercase" style={{ color: RARITY_COLOR[row.rarity] }}>
                            {RARITY_LABEL[row.rarity]}
                          </span>
                          <span className="w-12 text-right text-muted">{row.pct.toFixed(1)}%</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="mt-4 text-xs text-muted">After any wish the Fates rest for {REST_HOURS} hours.</p>
                {resting ? (
                  <p className="mt-2 text-xs tracking-kicker text-gold uppercase">The Fates are resting. Next wish in {formatRest(restMs)}.</p>
                ) : lock ? (
                  <p className="mt-2 text-xs tracking-kicker text-gold uppercase">{lock}</p>
                ) : null}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setDetail(null)} className="pressable min-h-12 rounded-sm border border-border text-xs tracking-kicker text-fg uppercase">
                    See other wishes
                  </button>
                  <button
                    type="button"
                    disabled={resting || Boolean(lock)}
                    onClick={() => grant(open.kind)}
                    className="pressable min-h-12 rounded-sm bg-primary text-xs tracking-kicker text-primary-fg uppercase disabled:opacity-40"
                  >
                    Grant
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
