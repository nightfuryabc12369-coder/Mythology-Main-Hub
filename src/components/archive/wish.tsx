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
  isUltra,
  rarityOf,
  rarityRates,
  rollCard,
  type WishKind,
} from "@/data/cards";
import type { God } from "@/data/types";
import { playSeal, playTone } from "@/lib/audio";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Card art. Drop /public/cards/<god-id>.webp in later and it replaces the placeholder on its own. */
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
        <img src={`/cards/${god.id}.webp`} alt={god.name} className="h-full w-full object-cover" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

export function Stars({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span className={cn("inline-flex gap-0.5 text-[#f2c94c] drop-shadow", className)} role="img" aria-label={`${count} golden ${count === 1 ? "star" : "stars"}`}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i}>★</span>
      ))}
    </span>
  );
}

export function CardTile({
  god,
  level,
  onOpen,
  children,
  copies = 1,
  stars = 0,
}: {
  god: God;
  level: number;
  onOpen?: () => void;
  children?: ReactNode;
  copies?: number;
  stars?: number;
}) {
  const rarity = rarityOf(god.id);
  const color = RARITY_COLOR[rarity];
  const face = (
    <>
      <div className="relative">
        <CardArt god={god} className="aspect-[3/4] w-full" />
        {stars > 0 ? (
          <div className="absolute top-2 left-2 rounded-full bg-bg-deep/75 px-2 py-0.5 text-sm">
            <Stars count={stars} />
          </div>
        ) : null}
        {copies > 1 ? (
          <span className="absolute top-2 right-2 rounded-full bg-bg-deep/80 px-2 py-0.5 text-xs text-fg">x{copies}</span>
        ) : null}
      </div>
      <div className={cn("space-y-1 px-3 pt-3", children ? "pb-0" : "pb-3")}>
        <p className="text-[10px] tracking-kicker uppercase" style={{ color }}>
          {isUltra(god.id) ? "Ultra · Legendary" : RARITY_LABEL[rarity]}
        </p>
        <h3 className="font-display text-xl leading-none text-fg">{god.name}</h3>
        <p className="text-xs text-muted">
          Level {level}/{MAX_LEVEL} · Power {cardPower(god, level, stars)}
        </p>
      </div>
    </>
  );
  return (
    <div className="overflow-hidden rounded-md bg-surface" style={{ boxShadow: `0 0 0 1px ${color}66` }}>
      {onOpen ? (
        <button type="button" onClick={onOpen} aria-label={`Open ${god.name}`} className="pressable block w-full text-left">
          {face}
        </button>
      ) : (
        face
      )}
      {children ? <div className="px-3 pb-3">{children}</div> : null}
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

type AnyKind = WishKind | "change-god" | "change-creature";

const isChange = (kind: AnyKind): kind is "change-god" | "change-creature" => kind === "change-god" || kind === "change-creature";

const WISHES: Array<{ kind: AnyKind; title: string; blurb: string }> = [
  { kind: "warrior", title: "Grant me a champion", blurb: "A random figure joins My Cards at Level 1, with 40% of their power. Strong figures are rare." },
  { kind: "power", title: "Grant me favor", blurb: `${PILLS_PER_WISH} drops of ambrosia for your inventory. Each drop raises one card by a level.` },
  { kind: "legend", title: "Grant me a legend", blurb: "One of the great legendary powers joins My Cards. Only the legendary can answer this wish. The ultra cards are sold only in the shop." },
  { kind: "change-god", title: "Change who I am", blurb: "One chance to retake Find who you are and replace your god. This wish can be granted only once." },
  { kind: "change-creature", title: "Change my creature", blurb: "One chance to retake Find your Creature and replace your creature. This wish can be granted only once." },
];

type Result = { kind: "card"; god: God } | { kind: "pills" } | { kind: "none" } | { kind: "change"; which: "god" | "creature" };

/** Banner and lineup art. Drop /public/wish/banner.jpg and /public/wish/pantheon.jpg in later and they replace the placeholders. */
function PlaceholderImage({ src, className, children, position }: { src: string; className?: string; children: ReactNode; position?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn("relative overflow-hidden bg-bg-deep", className)}>
      {!failed ? <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" style={position ? { objectPosition: position } : undefined} onError={() => setFailed(true)} /> : null}
      {failed ? (
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 20%, color-mix(in oklab, var(--color-primary) 28%, #1c1712), #0b0907 78%)" }}
        />
      ) : null}
      {children}
    </div>
  );
}

/** Renders on document.body so the windows are centred on the screen, not inside the page section. */
function Portal({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => setTarget(document.body), []);
  return target ? createPortal(children, target) : null;
}

export function WishSystem() {
  const hydrated = useArchiveStore((state) => state.hydrated);
  const storedCards = useArchiveStore((state) => state.cards);
  const nextWishAt = useArchiveStore((state) => state.nextWishAt);
  const sound = useArchiveStore((state) => state.sound);
  const grantCard = useArchiveStore((state) => state.grantCard);
  const addPills = useArchiveStore((state) => state.addPills);
  const startRest = useArchiveStore((state) => state.startRest);
  const identity = useArchiveStore((state) => state.identity);
  const creatureResult = useArchiveStore((state) => state.creature);
  const changes = useArchiveStore((state) => state.changes);
  const grantChange = useArchiveStore((state) => state.grantChange);

  const cards = hydrated ? storedCards : {};
  const owned = useMemo(() => Object.keys(cards), [cards]);

  const [hall, setHall] = useState(false);
  const [detail, setDetail] = useState<AnyKind | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(id);
  }, []);

  // While a window is open, the page behind it must not scroll.
  const locked = hall || detail !== null;
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const body = document.body;
    const gap = window.innerWidth - html.clientWidth;
    const prev = { html: html.style.overflow, body: body.style.overflow, pad: body.style.paddingRight };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      html.style.overflow = prev.html;
      body.style.overflow = prev.body;
      body.style.paddingRight = prev.pad;
    };
  }, [locked]);

  useEffect(() => {
    if (!hall) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (detail) {
        setDetail(null);
        setResult(null);
      } else {
        setHall(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hall, detail]);

  const restMs = hydrated && nextWishAt > now ? nextWishAt - now : 0;
  const resting = restMs > 0;

  function changeState(kind: "change-god" | "change-creature") {
    const state = kind === "change-god" ? changes.identity : changes.creature;
    const has = kind === "change-god" ? Boolean(identity) : Boolean(creatureResult);
    return { state: hydrated ? state : 0, has: hydrated && has };
  }

  function rowsFor(kind: AnyKind) {
    return kind === "warrior" ? pullTable(owned, "any") : kind === "legend" ? pullTable(owned, "legendary") : [];
  }

  function lockReason(kind: AnyKind) {
    if (isChange(kind)) {
      const { state, has } = changeState(kind);
      if (state === 2) return "Already used. This wish can only be granted once";
      if (state === 1) return null;
      if (!has) return kind === "change-god" ? "Locked: take Find who you are first" : "Locked: take Find your Creature first";
      return null;
    }
    if (kind === "legend" && owned.length < LEGENDARY_UNLOCK_CARDS) return `Locked: own ${LEGENDARY_UNLOCK_CARDS} cards (${owned.length}/${LEGENDARY_UNLOCK_CARDS})`;
    if (kind !== "power" && rowsFor(kind).length === 0) return kind === "legend" ? "You already own every legend" : "You already own every card";
    return null;
  }

  function grant(kind: AnyKind) {
    if (isChange(kind)) {
      if (lockReason(kind) || changeState(kind).state !== 0) return;
      grantChange(kind === "change-god" ? "identity" : "creature");
      setConfirming(false);
      setResult({ kind: "change", which: kind === "change-god" ? "god" : "creature" });
      if (sound) playSeal();
      return;
    }
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

  useEffect(() => setConfirming(false), [detail]);

  const open = detail ? WISHES.find((wish) => wish.kind === detail) : null;
  const rows = detail && !isChange(detail) ? rowsFor(detail) : [];
  const rates = rarityRates(rows);
  const lock = detail ? lockReason(detail) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setHall(true);
          if (sound) playTone(392, 0.2, 0.04);
        }}
        className="pressable group block w-full overflow-hidden rounded-md text-left shadow-border"
        aria-label="Ask a wish from the Pantheon"
      >
        <PlaceholderImage src="/wish/pantheon.jpg" position="center 35%" className="h-60 w-full sm:h-80">
          <div className="absolute inset-0 bg-bg-deep/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <p className="text-xs tracking-kicker text-gold uppercase">The Pantheon listens</p>
            <h3 className="mt-3 font-display text-4xl text-fg uppercase transition-transform duration-300 group-hover:scale-105 sm:text-6xl">
              Ask a wish from the Pantheon
            </h3>
            <p className="mt-4 text-xs tracking-kicker text-primary uppercase">Open the hall →</p>
          </div>
        </PlaceholderImage>
      </button>

      <Portal>
      {hall ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overscroll-contain bg-bg-deep/85 p-3 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="The Pantheon"
          onClick={() => setHall(false)}
        >
          <div className="panel-in max-h-[94svh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-md border border-border bg-surface" onClick={(event) => event.stopPropagation()}>
            <PlaceholderImage src="/wish/pantheon.jpg" position="center 30%" className="h-64 w-full sm:h-[28rem]">
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-bg/30" />
              <button
                type="button"
                aria-label="Close"
                onClick={() => setHall(false)}
                className="pressable absolute top-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-full border border-border bg-bg/70 text-lg text-fg"
              >
                ×
              </button>
            </PlaceholderImage>
            <div className="px-5 pt-4 pb-6 sm:px-8 sm:pb-8">
              <p className="text-xs tracking-kicker text-gold uppercase">The Pantheon stands ready</p>
              <h3 className="mt-2 font-display text-3xl text-fg sm:text-5xl">Speak your wish</h3>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                One wish at a time. After any wish the Pantheon rests for {REST_HOURS} hours. This is a game: the odds in the details are the real odds. Creatures can never be won by wishing: find yours with the quiz.
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
                {resting ? `The Pantheon is resting. Your next wish is in ${formatRest(restMs)}.` : "The Pantheon is ready."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to="/profile" className="pressable inline-flex min-h-11 items-center rounded-sm bg-primary px-4 text-xs tracking-kicker text-primary-fg uppercase">
                  My cards
                </Link>
                <button type="button" onClick={() => setHall(false)} className="pressable inline-flex min-h-11 items-center rounded-sm border border-border px-4 text-xs tracking-kicker text-muted uppercase">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center overscroll-contain bg-bg-deep/80 p-3 backdrop-blur-sm sm:items-center"
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
                ) : result.kind === "change" ? (
                  <>
                    <h4 className="mt-2 font-display text-3xl text-fg">{result.which === "god" ? "You may change who you are" : "You may change your creature"}</h4>
                    <p className="mt-3 text-sm text-muted">
                      You have exactly one retake. Whatever the quiz says this time is final, and this wish can never be granted again.
                    </p>
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
                  {result.kind === "change" ? (
                    <Link
                      to="/identity"
                      search={result.which === "creature" ? { mode: "creature" } : {}}
                      onClick={() => {
                        setDetail(null);
                        setResult(null);
                        setHall(false);
                      }}
                      className="pressable inline-flex min-h-11 items-center rounded-sm bg-primary px-5 text-xs tracking-kicker text-primary-fg uppercase"
                    >
                      {result.which === "god" ? "Retake Find who you are" : "Retake Find your Creature"}
                    </Link>
                  ) : (
                    <Link to="/profile" className="pressable inline-flex min-h-11 items-center rounded-sm bg-primary px-5 text-xs tracking-kicker text-primary-fg uppercase">
                      Open my cards
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setDetail(null);
                      setResult(null);
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
                {isChange(open.kind) ? (
                  <div className="mt-5 rounded-md border border-gold/60 bg-gold/10 p-4">
                    <p className="text-xs tracking-kicker text-gold uppercase">Warning</p>
                    <p className="mt-2 text-sm text-fg">
                      Once this is done it can&apos;t be changed. You get one retake only. Your new result replaces the old one for good, and you can never ask this wish again, even if you
                      like the new result less.
                    </p>
                    {changeState(open.kind).state === 1 ? (
                      <p className="mt-3 text-sm text-primary">Already granted. Your retake is waiting for you in the quiz.</p>
                    ) : null}
                  </div>
                ) : open.kind === "power" ? (
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
                <p className="mt-4 text-xs text-muted">
                  {isChange(open.kind) ? "This wish does not use the Pantheon's rest." : `After any wish the Pantheon rests for ${REST_HOURS} hours.`}
                </p>
                {!isChange(open.kind) && resting ? (
                  <p className="mt-2 text-xs tracking-kicker text-gold uppercase">The Pantheon is resting. Next wish in {formatRest(restMs)}.</p>
                ) : lock ? (
                  <p className="mt-2 text-xs tracking-kicker text-gold uppercase">{lock}</p>
                ) : null}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setDetail(null)} className="pressable min-h-12 rounded-sm border border-border text-xs tracking-kicker text-fg uppercase">
                    See other wishes
                  </button>
                  {isChange(open.kind) ? (
                    changeState(open.kind).state === 1 ? (
                      <Link
                        to="/identity"
                        search={open.kind === "change-creature" ? { mode: "creature" } : {}}
                        onClick={() => setHall(false)}
                        className="pressable inline-flex min-h-12 items-center justify-center rounded-sm bg-primary text-xs tracking-kicker text-primary-fg uppercase"
                      >
                        Go to the quiz
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={Boolean(lock)}
                        onClick={() => (confirming ? grant(open.kind) : setConfirming(true))}
                        className="pressable min-h-12 rounded-sm bg-primary text-xs tracking-kicker text-primary-fg uppercase disabled:opacity-40"
                      >
                        {confirming ? "Yes, grant it. It can't be undone" : "Grant"}
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      disabled={resting || Boolean(lock)}
                      onClick={() => grant(open.kind)}
                      className="pressable min-h-12 rounded-sm bg-primary text-xs tracking-kicker text-primary-fg uppercase disabled:opacity-40"
                    >
                      Grant
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
      </Portal>
    </>
  );
}
