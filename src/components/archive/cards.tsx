import { EmblemMark } from "@/components/archive/emblem";
import { FavoriteButton } from "@/components/archive/widgets";
import { getGod, realmLabel } from "@/data/gods";
import type { Age, Epic, God, Myth } from "@/data/types";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * A god's picture. Uses the card art at /cards/<id>.webp when it exists,
 * and falls back to the older scene picture for figures without card art yet.
 */
export function GodPhoto({ god, className, style }: { god: God; className?: string; style?: React.CSSProperties }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [god.id]);
  return failed ? (
    <img src={god.image} alt="" className={className} style={{ objectPosition: god.focus, ...style }} />
  ) : (
    <img
      src={`/cards/${god.id}.webp`}
      alt={god.name}
      className={className}
      style={{ objectPosition: "center 22%", ...style }}
      onError={() => setFailed(true)}
    />
  );
}

export function GodCard({ god, index = 0 }: { god: God; index?: number }) {
  const openOverlay = useArchiveStore((state) => state.openOverlay);
  const [tilt, setTilt] = useState({ x: "0deg", y: "0deg" });

  return (
    <article
      className="tilt-card stagger-in"
      style={{ ["--rx" as string]: tilt.x, ["--ry" as string]: tilt.y, ["--d" as string]: `${Math.min(index, 8) * 50}ms` }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        const dx = (event.clientX - rect.left) / rect.width - 0.5;
        const dy = (event.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: `${(-dy * 7).toFixed(2)}deg`, y: `${(dx * 8).toFixed(2)}deg` });
      }}
      onPointerLeave={() => setTilt({ x: "0deg", y: "0deg" })}
    >
      <div className="relative overflow-hidden rounded-md bg-surface shadow-border transition-shadow duration-200 hover:shadow-glow">
        <button type="button" onClick={() => openOverlay({ type: "god", id: god.id })} className="pressable group w-full text-left">
          <div className="relative h-52 overflow-hidden">
            <GodPhoto god={god} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-bg/10" />
            <EmblemMark name={god.emblem} className="absolute bottom-3 left-4 size-7 text-gold" />
          </div>
          <div className="space-y-1 px-4 py-4">
            <p className="text-xs tracking-kicker text-gold uppercase">
              {realmLabel[god.realm]} · {god.office}
            </p>
            <h3 className="font-display text-2xl leading-none text-fg">{god.name}</h3>
            <p className="line-clamp-2 text-sm text-muted">{god.line}</p>
          </div>
        </button>
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton kind="god" id={god.id} label={god.name} />
        </div>
      </div>
    </article>
  );
}

export function AgeCard({ age }: { age: Age }) {
  const openOverlay = useArchiveStore((state) => state.openOverlay);
  return (
    <button
      type="button"
      onClick={() => openOverlay({ type: "age", id: age.id })}
      className="pressable group relative min-h-64 overflow-hidden rounded-md text-left shadow-border"
    >
      <img
        src={age.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ objectPosition: age.focus }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/10" />
      <div className="relative flex h-full min-h-64 flex-col justify-end p-5">
        <p className="text-xs tracking-kicker text-gold uppercase">
          {age.tag} · {age.years}
        </p>
        <h3 className="mt-1 font-display text-3xl text-fg">{age.name}</h3>
        <p className="mt-2 max-w-sm text-sm text-fg/85">{age.summary}</p>
      </div>
    </button>
  );
}

export function MythCard({ myth }: { myth: Myth }) {
  const openOverlay = useArchiveStore((state) => state.openOverlay);
  return (
    <div className="group relative overflow-hidden rounded-md bg-surface text-left shadow-border">
      <button type="button" onClick={() => openOverlay({ type: "myth", id: myth.id })} className="pressable w-full text-left">
        <div className="relative h-36 overflow-hidden">
          <img
            src={myth.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: myth.focus }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
        </div>
        <div className="px-4 py-4">
          <p className="text-xs tracking-kicker text-gold uppercase">
            {myth.age} · {myth.span}
          </p>
          <h3 className="mt-1 font-display text-2xl text-fg">{myth.name}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-muted">{myth.logline}</p>
        </div>
      </button>
      <div className="absolute top-3 right-3 z-10">
        <FavoriteButton kind="myth" id={myth.id} label={myth.name} />
      </div>
    </div>
  );
}

export function EpicCard({ epic }: { epic: Epic }) {
  const openOverlay = useArchiveStore((state) => state.openOverlay);
  return (
    <button
      type="button"
      onClick={() => openOverlay({ type: "epic", id: epic.id })}
      className="pressable group relative min-h-56 overflow-hidden rounded-md text-left shadow-border"
    >
      <img
        src={epic.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ objectPosition: epic.focus }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-bg/15" />
      <div className="relative flex min-h-56 flex-col justify-end p-4">
        <p className="text-xs tracking-kicker text-gold uppercase">{epic.voice}</p>
        <h3 className="font-display text-xl text-fg">{epic.title}</h3>
        <p className="mt-1 text-xs text-fg/75">{epic.year}</p>
      </div>
    </button>
  );
}

export function NameChips({ ids }: { ids: string[] }) {
  const openOverlay = useArchiveStore((state) => state.openOverlay);
  const known = ids.filter((id) => getGod(id));
  const rest = ids.filter((id) => !getGod(id));
  return (
    <div className="flex flex-wrap gap-2">
      {known.map((id) => {
        const god = getGod(id);
        if (!god) return null;
        return (
          <button
            key={id}
            type="button"
            onClick={() => openOverlay({ type: "god", id })}
            className="pressable min-h-11 rounded-full border border-border bg-elevated px-3 text-sm text-fg"
          >
            {god.name}
          </button>
        );
      })}
      {rest.map((name) => (
        <span key={name} className="inline-flex min-h-11 items-center rounded-full border border-border px-3 text-sm text-muted">
          {name}
        </span>
      ))}
    </div>
  );
}
