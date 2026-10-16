import { EmblemMark } from "@/components/archive/emblem";
import { getGod } from "@/data/gods";
import { LEVELS, archetypeTitle, fullTitle, getArchetype, getLevel } from "@/data/identity";
import type { Emblem } from "@/data/types";
import { playSeal, playTone } from "@/lib/audio";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Image slot. Drop a picture at /public/identity/<god id>.jpg (for example zeus.jpg) and it replaces the
 * placeholder. /public/identity/choose.jpg is used before a god has been chosen.
 */
export function IdentityImage({
  src,
  emblem,
  className,
  children,
  focus,
  fallbackSrc,
  fallbackFocus,
}: {
  focus?: string;
  /** Tried when `src` fails to load, before the emblem placeholder is shown. */
  fallbackSrc?: string;
  /** Object position used only while the fallback image is showing. */
  fallbackFocus?: string;
  src: string;
  emblem: Emblem;
  className?: string;
  children?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  useEffect(() => {
    setFailed(false);
    setUseFallback(false);
  }, [src, fallbackSrc]);
  const shown = useFallback && fallbackSrc ? fallbackSrc : src;
  return (
    <div className={cn("relative overflow-hidden bg-bg-deep", className)}>
      {!failed ? <img
          src={shown}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={(shown === src ? focus : fallbackFocus) ? { objectPosition: shown === src ? focus : fallbackFocus } : undefined}
          onError={() => (!useFallback && fallbackSrc ? setUseFallback(true) : setFailed(true))}
        /> : null}
      {failed ? (
        <>
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 25%, color-mix(in oklab, var(--color-primary) 30%, #1c1712), #0b0907 78%)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <EmblemMark name={emblem} className="size-16 text-gold/35 sm:size-20" />
          </div>
        </>
      ) : null}
      {children}
    </div>
  );
}

export function Portal({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => setTarget(document.body), []);
  return target ? createPortal(children, target) : null;
}

function LevelMeter({ level }: { level: string | null }) {
  const index = LEVELS.findIndex((entry) => entry.id === level);
  return (
    <div className="flex gap-1.5" role="img" aria-label={index >= 0 ? `Level: ${LEVELS[index].label}` : "Level not chosen yet"}>
      {LEVELS.map((entry, i) => (
        <div key={entry.id} className="flex-1">
          <div className={cn("h-1.5 rounded-full", i <= index ? "bg-primary" : "bg-bg-deep")} />
          <p className={cn("mt-1.5 text-[10px] tracking-kicker uppercase", i === index ? "text-gold" : "text-subtle")}>{entry.label}</p>
        </div>
      ))}
    </div>
  );
}

export function IdentityWindow() {
  const hydrated = useArchiveStore((state) => state.hydrated);
  const identity = useArchiveStore((state) => state.identity);
  const gender = useArchiveStore((state) => state.gender);
  const sound = useArchiveStore((state) => state.sound);
  const [open, setOpen] = useState(false);

  const archetype = hydrated ? getArchetype(identity?.godId) : null;
  const god = archetype ? getGod(archetype.godId) : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Nothing chosen yet: one invitation, one click into the quiz page.
  if (!archetype || !god || !identity) {
    return (
      <Link
        to="/identity"
        onClick={() => {
          if (sound) playTone(392, 0.2, 0.04);
        }}
        className="pressable group block w-full overflow-hidden rounded-md text-left shadow-border"
        aria-label="Find who you are: start the quiz"
      >
        <IdentityImage src="/identity/choose.jpg" emblem="crown" className="h-52 w-full sm:h-64">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h3 className="font-display text-3xl text-fg uppercase transition-transform duration-300 group-hover:scale-105 sm:text-4xl">
              Find who you are
            </h3>
            <p className="mt-3 max-w-xs text-sm text-fg/85">Ten questions. Different every time. The answers decide which god you would be.</p>
            <p className="mt-4 text-xs tracking-kicker text-primary uppercase">Start the quiz</p>
          </div>
          <span className="absolute top-3 left-3 rounded-full border border-border bg-bg/70 px-3 py-1 text-[10px] tracking-kicker text-muted uppercase">
            Placeholder image
          </span>
        </IdentityImage>
      </Link>
    );
  }

  const level = getLevel(identity.level);
  const title = fullTitle(archetype, identity.level, gender);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          if (sound) playSeal();
        }}
        className="pressable group block w-full overflow-hidden rounded-md text-left shadow-border"
        aria-label={`Open your history: ${title}`}
      >
        <IdentityImage src={`/identity/${god.id}.jpg`} emblem={god.emblem} className="h-52 w-full sm:h-64">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-8 text-center">
            <p className="text-xs tracking-kicker text-gold uppercase">You are</p>
            <h3 className="mt-2 font-display text-3xl text-fg uppercase transition-transform duration-300 group-hover:scale-105 sm:text-4xl">{archetypeTitle(archetype, gender)}</h3>
            <p className="mt-2 font-display text-lg text-fg/90 sm:text-2xl">{level ? `${level.label} level` : "Level not chosen yet"}</p>
            <p className="mt-4 text-xs tracking-kicker text-primary uppercase">Open your history</p>
          </div>
          <span className="absolute top-3 left-3 rounded-full border border-border bg-bg/70 px-3 py-1 text-[10px] tracking-kicker text-muted uppercase">
            Placeholder image
          </span>
        </IdentityImage>
      </button>

      <Portal>
        {open ? (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center overscroll-contain bg-bg-deep/85 p-3 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={() => setOpen(false)}
          >
            <div
              className="panel-in max-h-[94svh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-md border border-border bg-surface"
              onClick={(event) => event.stopPropagation()}
            >
              <IdentityImage src={`/identity/${god.id}.jpg`} emblem={god.emblem} className="h-72 w-full sm:h-[26rem]">
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-bg/30" />
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="pressable absolute top-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-full border border-border bg-bg/70 text-lg text-fg"
                >
                  ×
                </button>
                <div className="absolute inset-x-0 bottom-0 px-5 pb-4 sm:px-8">
                  <p className="text-xs tracking-kicker text-gold uppercase">You are</p>
                  <h3 className="mt-1 font-display text-4xl text-fg sm:text-6xl">{archetypeTitle(archetype, gender)}</h3>
                  {level ? <p className="mt-1 font-display text-lg text-fg/90 sm:text-2xl">{level.label} level</p> : null}
                </div>
              </IdentityImage>

              <div className="grid gap-8 px-5 pt-4 pb-6 sm:px-8 sm:pb-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="font-display text-xl text-gold sm:text-2xl">{archetype.tagline}</p>
                  <p className="mt-3 max-w-2xl text-sm text-fg/90">{archetype.reading}</p>

                  <h4 className="mt-8 font-display text-xl text-fg">The history of this title</h4>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{god.story}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{god.nature}</p>

                  {god.deeds.length > 0 ? (
                    <>
                      <h4 className="mt-8 font-display text-xl text-fg">Known for</h4>
                      <ul className="mt-2 grid gap-1.5 text-sm text-muted">
                        {god.deeds.map((deed) => (
                          <li key={deed} className="border-l border-primary/60 pl-3">
                            {deed}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>

                <aside className="grid content-start gap-6">
                  <div className="rounded-md border border-border bg-bg/70 p-4">
                    <p className="text-xs tracking-kicker text-gold uppercase">Your level</p>
                    <div className="mt-3">
                      <LevelMeter level={identity.level} />
                    </div>
                    {level ? (
                      <>
                        <p className="mt-4 font-display text-lg text-fg">{level.label}</p>
                        <p className="mt-1 text-sm text-muted">{level.blurb}</p>
                      </>
                    ) : (
                      <p className="mt-4 text-sm text-muted">
                        Your level is not set. Answer a second short quiz to find out whether you are a lesser, mid, high or legendary {archetypeTitle(archetype, gender)}.
                      </p>
                    )}
                    <Link
                      to="/identity"
                      search={{ mode: "level" }}
                      onClick={() => setOpen(false)}
                      className="pressable mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-primary px-4 text-xs tracking-kicker text-primary-fg uppercase"
                    >
                      {level ? "Retake the level quiz" : "Choose your level"}
                    </Link>
                  </div>

                  <dl className="grid gap-3 text-sm">
                    <div>
                      <dt className="text-xs tracking-kicker text-subtle uppercase">Domain</dt>
                      <dd className="mt-0.5 text-fg">{archetype.domain}</dd>
                    </div>
                    <div>
                      <dt className="text-xs tracking-kicker text-subtle uppercase">Symbols</dt>
                      <dd className="mt-0.5 text-fg">{god.symbols.join(", ")}</dd>
                    </div>
                  </dl>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="pressable inline-flex min-h-11 items-center rounded-sm border border-border px-4 text-xs tracking-kicker text-muted uppercase"
                    >
                      Close
                    </button>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        ) : null}
      </Portal>
    </>
  );
}
