import { GodPhoto, NameChips } from "@/components/archive/cards";
import { EmblemMark } from "@/components/archive/emblem";
import { FavoriteButton, StatRow, usePresence } from "@/components/archive/widgets";
import { MAX_LEVEL, RARITY_COLOR, RARITY_LABEL, cardPower, levelFactor, rarityOf } from "@/data/cards";
import { getGod, realmLabel } from "@/data/gods";
import { searchArchive, searchLabel } from "@/data/search";
import { STAT_KEYS, type FavoriteKind } from "@/data/types";
import { ageMap, epicMap, epithetMap, mythMap } from "@/data/world";
import { playSummon } from "@/lib/audio";
import { useArchiveStore, type Overlay } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { Maximize2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export function SearchOverlay() {
  const open = useArchiveStore((state) => state.searchOpen);
  const query = useArchiveStore((state) => state.searchQuery);
  const setQuery = useArchiveStore((state) => state.setSearchQuery);
  const setOpen = useArchiveStore((state) => state.setSearchOpen);
  const openOverlay = useArchiveStore((state) => state.openOverlay);
  const { render, shown } = usePresence(open);
  const hits = searchArchive(query);

  if (!render) return null;

  return (
    <div className={cn("fixed inset-0 z-50 bg-bg/70 backdrop-blur-sm transition-opacity duration-200", shown ? "opacity-100" : "opacity-0")}>
      <div className="mx-auto mt-[10vh] w-[min(640px,calc(100%-2rem))] rounded-md bg-surface shadow-glass">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search gods, myths, epithets, epics"
            className="h-14 w-full bg-transparent text-base text-fg outline-none placeholder:text-subtle"
          />
          <button type="button" aria-label="Close search" onClick={() => setOpen(false)} className="inline-flex size-11 items-center justify-center text-muted">
            <X className="size-5" />
          </button>
        </div>
        <ul className="max-h-[50vh] overflow-auto p-2">
          {hits.length === 0 ? <li className="px-3 py-6 text-sm text-muted">Nothing in the codex answers that.</li> : null}
          {hits.map((hit) => (
            <li key={`${hit.kind}-${hit.id}`}>
              <button
                type="button"
                onClick={() => openOverlay({ type: hit.kind, id: hit.id })}
                className="flex min-h-12 w-full items-center justify-between gap-3 rounded-sm px-3 text-left hover:bg-elevated"
              >
                <span>
                  <span className="block text-sm text-fg">{hit.title}</span>
                  <span className="text-xs text-muted">{hit.subtitle}</span>
                </span>
                <span className="text-xs tracking-kicker text-gold uppercase">{searchLabel(hit.kind)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Dossier() {
  const overlay = useArchiveStore((state) => state.overlay);
  const close = useArchiveStore((state) => state.closeOverlay);
  const open = overlay?.type === "god";
  const god = open ? getGod(overlay.id) : undefined;
  const { render, shown } = usePresence(Boolean(god));
  const [epithetId, setEpithetId] = useState<string | null>(null);
  const [tab, setTab] = useState<"file" | "kin" | "deeds">("file");
  const hydrated = useArchiveStore((state) => state.hydrated);
  const cards = useArchiveStore((state) => state.cards);
  const pills = useArchiveStore((state) => state.pills);
  const upgradeCard = useArchiveStore((state) => state.upgradeCard);

  const [fullImage, setFullImage] = useState(false);

  useEffect(() => {
    setEpithetId(null);
    setTab("file");
    setFullImage(false);
  }, [god?.id]);

  // While the big picture is open, Escape closes only the picture, not the dossier behind it.
  useEffect(() => {
    if (!fullImage) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setFullImage(false);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [fullImage]);

  if (!render || !god) return null;

  const level = hydrated ? cards[god.id] : undefined;
  const factor = level ? levelFactor(level) : 1;
  const rarity = rarityOf(god.id);
  const rarityColor = RARITY_COLOR[rarity];
  const maxed = Boolean(level) && (level ?? 0) >= MAX_LEVEL;

  return (
    <div className={cn("fixed inset-0 z-50 transition-opacity duration-200", shown ? "opacity-100" : "opacity-0")}>
      <button type="button" aria-label="Close dossier" className="absolute inset-0 bg-bg/70 backdrop-blur-sm" onClick={close} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-title"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-3xl flex-col bg-bg shadow-glass transition-transform duration-300",
          shown ? "translate-x-0" : "translate-x-8",
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <p className="text-xs tracking-kicker text-gold uppercase">Dossier</p>
          <div className="flex items-center">
            <FavoriteButton kind="god" id={god.id} label={god.name} />
            <button type="button" aria-label="Close" onClick={close} className="inline-flex size-11 items-center justify-center text-muted">
              <X className="size-5" />
            </button>
          </div>
        </div>
        <div className="grid min-h-0 flex-1 gap-0 overflow-y-auto md:grid-cols-[240px_1fr]">
          <div className="px-4 md:px-6">
            <button
              type="button"
              onClick={() => setFullImage(true)}
              aria-label={`See full image of ${god.name}`}
              className="group relative block h-72 w-full cursor-zoom-in overflow-hidden rounded-md md:h-[420px]"
            >
              <GodPhoto god={god} full className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/10" />
              <EmblemMark name={god.emblem} className="absolute bottom-4 left-4 size-8 text-gold" />
              <span className="absolute inset-0 flex items-center justify-center bg-bg/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:bg-transparent [@media(hover:none)]:opacity-100 [@media(hover:none)]:items-end [@media(hover:none)]:pb-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-bg/85 px-4 py-2 text-xs tracking-kicker text-gold uppercase shadow-glass">
                  <Maximize2 className="size-4" />
                  See full image
                </span>
              </span>
            </button>
            {god.epithetIds.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEpithetId(null)}
                  className={cn("min-h-10 rounded-full px-3 text-xs", !epithetId ? "bg-primary text-primary-fg" : "bg-surface text-muted")}
                >
                  Office
                </button>
                {god.epithetIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setEpithetId(id)}
                    className={cn("min-h-10 rounded-full px-3 text-xs", epithetId === id ? "bg-primary text-primary-fg" : "bg-surface text-muted")}
                  >
                    {epithetMap[id]?.name ?? id}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="px-4 py-4 sm:px-6">
            <p className="text-xs tracking-kicker text-muted uppercase">
              {realmLabel[god.realm]} · {god.office}
            </p>
            <h2 id="dossier-title" className="font-display text-4xl text-fg">
              {god.name}
            </h2>
            <p className="mt-2 text-sm text-gold">{epithetId ? epithetMap[epithetId]?.meaning : god.line}</p>
            {level ? (
              <div className="mt-4 rounded-md bg-surface p-4" style={{ boxShadow: `0 0 0 1px ${rarityColor}66` }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] tracking-kicker uppercase" style={{ color: rarityColor }}>
                      {RARITY_LABEL[rarity]} card · in your collection
                    </p>
                    <p className="mt-1 font-display text-2xl text-fg">
                      Level {level}/{MAX_LEVEL}
                    </p>
                    <p className="text-xs text-muted">
                      Power {cardPower(god, level)} · {Math.round(factor * 100)}% of full strength
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-3xl text-primary">x{pills}</p>
                    <p className="text-[10px] tracking-kicker text-muted uppercase">Ambrosia</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-10 gap-1" aria-hidden="true">
                  {Array.from({ length: MAX_LEVEL }, (_, index) => (
                    <span key={index} className={cn("h-1.5 rounded-full", index < level ? "bg-primary" : "bg-bg-deep")} />
                  ))}
                </div>
                <button
                  type="button"
                  disabled={pills < 1 || maxed}
                  onClick={() => upgradeCard(god.id)}
                  className="pressable mt-3 min-h-11 w-full rounded-sm bg-primary text-xs tracking-kicker text-primary-fg uppercase disabled:opacity-40"
                >
                  {maxed ? "Max level" : pills < 1 ? "No ambrosia left" : "Use ambrosia to level up"}
                </button>
              </div>
            ) : null}
            <div className="mt-4 flex gap-2">
              {(["file", "kin", "deeds"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={cn("min-h-11 rounded-sm px-3 text-xs tracking-kicker uppercase", tab === item ? "bg-elevated text-fg" : "text-muted")}
                >
                  {item}
                </button>
              ))}
            </div>
            <div key={`${tab}-${epithetId ?? "base"}`} className="panel-in mt-4 space-y-4">
              {tab === "file" ? (
                <>
                  <p className="text-sm text-fg/90">{epithetId ? epithetMap[epithetId]?.description : god.story}</p>
                  <p className="text-sm text-muted">{epithetId ? epithetMap[epithetId]?.note : god.nature}</p>
                  <div className="space-y-3">
                    {STAT_KEYS.map(([key, label], index) => (
                      <StatRow key={`${key}-${level ?? 0}`} label={label} value={Math.round(god.stats[key] * factor)} delay={index * 40} />
                    ))}
                  </div>
                  <p className="text-xs text-subtle">
                    {level
                      ? `Traits shown at Level ${level} of ${MAX_LEVEL}. Each level unlocks more of this figure's full strength.`
                      : "Temple measures for the compare table. Not a ranking from any ancient text."}
                  </p>
                </>
              ) : null}
              {tab === "kin" ? (
                <>
                  <div>
                    <p className="mb-2 text-xs tracking-kicker text-gold uppercase">Allies</p>
                    <NameChips ids={god.allies} />
                  </div>
                  <div>
                    <p className="mb-2 text-xs tracking-kicker text-gold uppercase">Rivals</p>
                    <NameChips ids={god.rivals} />
                  </div>
                  <ul className="space-y-1 text-sm text-muted">
                    {god.kin.map((person) => (
                      <li key={person}>{person}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {tab === "deeds" ? (
                <>
                  <p className="text-sm text-fg/90">{god.summary}</p>
                  <ul className="space-y-2 text-sm text-fg">
                    {god.deeds.map((deed) => (
                      <li key={deed}>{deed}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-subtle">
                    {god.parentage} · {god.status} · {god.age}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {god.symbols.map((symbol) => (
                      <span key={symbol} className="rounded-full border border-border px-3 py-2 text-xs tracking-kicker text-muted uppercase">
                        {symbol}
                      </span>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </aside>
      {fullImage ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={`${god.name}, full image`}>
          <button type="button" aria-label="Close full image" className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setFullImage(false)} />
          <button
            type="button"
            aria-label="Close full image"
            onClick={() => setFullImage(false)}
            className="absolute top-4 right-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-bg/80 text-fg shadow-glass"
          >
            <X className="size-5" />
          </button>
          <GodPhoto
            god={god}
            full
            className="relative h-auto max-h-[88vh] w-auto max-w-[94vw] rounded-md object-contain shadow-glass"
            style={{ objectPosition: "center" }}
          />
        </div>
      ) : null}
    </div>
  );
}

function sheetOf(overlay: Overlay): { kind: FavoriteKind | null; title: string; kicker: string; image: string; focus: string; body: string; extra: string; chips: string[] } | null {
  if (!overlay || overlay.type === "god") return null;
  if (overlay.type === "myth") {
    const myth = mythMap[overlay.id];
    if (!myth) return null;
    return {
      kind: "myth",
      title: myth.name,
      kicker: `${myth.age} · ${myth.span}`,
      image: myth.image,
      focus: myth.focus,
      body: myth.story,
      extra: myth.beats.join(" "),
      chips: myth.gods,
    };
  }
  if (overlay.type === "epic") {
    const epic = epicMap[overlay.id];
    if (!epic) return null;
    return {
      kind: "epic",
      title: epic.title,
      kicker: `${epic.voice} · ${epic.year}`,
      image: epic.image,
      focus: epic.focus,
      body: epic.synopsis,
      extra: "A telling, not the only telling.",
      chips: epic.gods,
    };
  }
  if (overlay.type === "epithet") {
    const epithet = epithetMap[overlay.id];
    if (!epithet) return null;
    const god = getGod(epithet.god);
    return {
      kind: "epithet",
      title: epithet.name,
      kicker: `${god?.name ?? epithet.god} · ${epithet.meaning}`,
      image: god?.image ?? "/scenes/oracle.jpg",
      focus: god?.focus ?? "center",
      body: epithet.description,
      extra: epithet.note,
      chips: [epithet.god],
    };
  }
  const age = ageMap[overlay.id];
  if (!age) return null;
  return {
    kind: null,
    title: age.name,
    kicker: `${age.tag} · ${age.years}`,
    image: age.image,
    focus: age.focus,
    body: age.story,
    extra: age.summary,
    chips: age.gods,
  };
}

export function DetailSheet() {
  const overlay = useArchiveStore((state) => state.overlay);
  const close = useArchiveStore((state) => state.closeOverlay);
  const sheet = sheetOf(overlay);
  const { render, shown } = usePresence(Boolean(sheet));
  if (!render || !sheet || !overlay || overlay.type === "god") return null;

  return (
    <div className={cn("fixed inset-0 z-50 transition-opacity duration-200", shown ? "opacity-100" : "opacity-0")}>
      <button type="button" aria-label="Close" className="absolute inset-0 bg-bg/70 backdrop-blur-sm" onClick={close} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className={cn(
          "absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-lg bg-bg shadow-glass transition-transform duration-300 sm:inset-y-0 sm:left-auto sm:w-full sm:max-w-xl sm:rounded-none",
          shown ? "translate-y-0 sm:translate-x-0" : "translate-y-6 sm:translate-x-8",
        )}
      >
        <div className="relative h-48 overflow-hidden">
          <img src={sheet.image} alt="" className="h-full w-full object-cover" style={{ objectPosition: sheet.focus }} />
          <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
        </div>
        <div className="flex items-start justify-between gap-3 px-5 pt-2">
          <div>
            <p className="text-xs tracking-kicker text-gold uppercase">{sheet.kicker}</p>
            <h2 id="sheet-title" className="mt-1 font-display text-4xl text-fg">
              {sheet.title}
            </h2>
          </div>
          <div className="flex items-center">
            {sheet.kind ? <FavoriteButton kind={sheet.kind} id={overlay.id} label={sheet.title} /> : null}
            <button type="button" aria-label="Close" onClick={close} className="inline-flex size-11 items-center justify-center text-muted">
              <X className="size-5" />
            </button>
          </div>
        </div>
        <div className="space-y-4 px-5 py-5">
          <p className="text-sm text-fg/90">{sheet.body}</p>
          <p className="text-sm text-muted">{sheet.extra}</p>
          <NameChips ids={sheet.chips} />
        </div>
      </aside>
    </div>
  );
}

export function CouncilModal() {
  const open = useArchiveStore((state) => state.councilOpen);
  const setOpen = useArchiveStore((state) => state.setCouncilOpen);
  const sound = useArchiveStore((state) => state.sound);
  const { render, shown } = usePresence(open);

  useEffect(() => {
    if (open && sound) playSummon();
  }, [open, sound]);

  if (!render) return null;

  return (
    <div className={cn("fixed inset-0 z-50 grid place-items-center bg-bg/75 px-4 backdrop-blur-sm transition-opacity duration-200", shown ? "opacity-100" : "opacity-0")}>
      <div role="dialog" aria-modal="true" aria-labelledby="council-title" className="panel-in w-full max-w-lg rounded-md bg-surface p-6 shadow-glass">
        <p className="text-xs tracking-kicker text-gold uppercase">The twelve</p>
        <h2 id="council-title" className="mt-2 font-display text-4xl text-fg">
          The council sits
        </h2>
        <p className="mt-4 text-sm text-fg/90">
          Sky, sea, grain, craft, war, desire, the road, the vine, and the mind in armor. Hestia keeps the hearth off to the side, which is how a house survives a meeting like this. Nothing is settled. Everything is in the room.
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="pressable mt-6 inline-flex min-h-11 items-center rounded-sm bg-primary px-4 text-sm text-primary-fg"
        >
          Let them argue
        </button>
      </div>
    </div>
  );
}
