import type { FavoriteKind } from "@/data/types";
import { playSeal } from "@/lib/audio";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export type AppTo =
  | "/"
  | "/gods"
  | "/ages"
  | "/myths"
  | "/epithets"
  | "/epics"
  | "/timeline"
  | "/compare"
  | "/votive"
  | "/about";

export function SectionHeader({
  kicker,
  title,
  subtitle,
  action,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="text-xs tracking-kicker text-gold uppercase">{kicker}</p>
        <h2 className="mt-2 font-display text-title text-fg">{title}</h2>
        {subtitle ? <p className="mt-3 max-w-xl text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function TextLink({ to, children }: { to: AppTo; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex min-h-11 items-center text-xs tracking-kicker text-primary uppercase">
      {children}
    </Link>
  );
}

export function FavoriteButton({ kind, id, label }: { kind: FavoriteKind; id: string; label: string }) {
  const hydrated = useArchiveStore((state) => state.hydrated);
  const active = useArchiveStore((state) => state.isFavorite(kind, id));
  const toggle = useArchiveStore((state) => state.toggleFavorite);
  const sound = useArchiveStore((state) => state.sound);
  const on = hydrated && active;

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Remove ${label} from the votive shelf` : `Set ${label} on the votive shelf`}
      onClick={(event) => {
        event.stopPropagation();
        if (sound) playSeal();
        toggle(kind, id);
      }}
      className={cn(
        "pressable inline-flex size-11 items-center justify-center rounded-full border border-border bg-bg/55 text-muted",
        on && "border-primary text-primary",
      )}
    >
      <Bookmark className={cn("size-4 transition-transform duration-200", on && "scale-110 fill-current")} />
    </button>
  );
}

export function usePresence(open: boolean, ms = 240) {
  const [render, setRender] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setRender(true);
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }
    setShown(false);
    const timer = window.setTimeout(() => setRender(false), ms);
    return () => window.clearTimeout(timer);
  }, [open, ms]);

  return { render, shown };
}

export function StatRow({
  label,
  value,
  delay = 0,
  bar = "var(--color-primary)",
}: {
  label: string;
  value: number;
  delay?: number;
  bar?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs tracking-kicker text-muted uppercase">
        <span>{label}</span>
        <span className="text-fg">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-bg-deep">
        <div
          className="stat-fill h-full rounded-full"
          style={{ ["--w" as string]: `${value}%`, ["--d" as string]: `${delay}ms`, ["--bar" as string]: bar }}
        />
      </div>
    </div>
  );
}

export function PageHero({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return (
    <header className="relative overflow-hidden border-b border-border">
      <img src="/scenes/oracle.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/35" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="stagger-in text-xs tracking-kicker text-gold uppercase">{kicker}</p>
        <h1 className="stagger-in mt-3 font-display text-display text-fg uppercase" style={{ ["--d" as string]: "80ms" }}>
          {title}
        </h1>
        <p className="stagger-in mt-4 max-w-xl text-base text-muted" style={{ ["--d" as string]: "160ms" }}>
          {subtitle}
        </p>
      </div>
    </header>
  );
}

export function FilterChip({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "pressable min-h-11 shrink-0 rounded-full px-3 text-xs tracking-kicker uppercase",
        on ? "bg-primary text-primary-fg" : "bg-surface text-muted",
      )}
    >
      {children}
    </button>
  );
}
