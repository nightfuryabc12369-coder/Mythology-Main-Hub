import { IdentityImage, Portal } from "@/components/archive/identity";
import { getCreature, getRarity, type Rarity } from "@/data/creatures";
import { playSeal, playTone } from "@/lib/audio";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const RARITY_TEXT: Record<Rarity, string> = {
  common: "text-fg/80",
  rare: "text-primary",
  legendary: "text-gold",
};

const AGE_HINT: Record<Rarity, string> = {
  common: "A few questions to learn its age. A common creature is only ever a baby.",
  rare: "A few questions to learn its age. A rare creature has to be old enough to be seen.",
  legendary: "A few questions to learn its age. A legendary creature is 100 years old or more.",
};

export function CreatureWindow() {
  const hydrated = useArchiveStore((state) => state.hydrated);
  const result = useArchiveStore((state) => state.creature);
  const sound = useArchiveStore((state) => state.sound);
  const [open, setOpen] = useState(false);

  const found = hydrated && result ? getCreature(result.creatureId) : null;
  const creature = found?.god ? found : null;

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

  // No creature yet: the invitation.
  if (!creature || !result) {
    return (
      <Link
        to="/identity"
        search={{ mode: "creature" }}
        onClick={() => {
          if (sound) playTone(440, 0.2, 0.04);
        }}
        className="pressable group block w-full overflow-hidden rounded-md text-left shadow-border"
        aria-label="Find your creature: start the quiz"
      >
        <IdentityImage src="/identity/creature.jpg" emblem="feather" className="h-52 w-full sm:h-64">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h3 className="font-display text-3xl text-fg uppercase transition-transform duration-300 group-hover:scale-105 sm:text-4xl">
              Find your Creature
            </h3>
            <p className="mt-3 max-w-xs text-sm text-fg/85">Short if you stay common. Longer the rarer you get. One try only.</p>
            <p className="mt-4 text-xs tracking-kicker text-primary uppercase">Start the quiz</p>
          </div>
        </IdentityImage>
      </Link>
    );
  }

  const rarity = getRarity(result.rarity);
  const age = result.age;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          if (sound) playSeal();
        }}
        className="pressable group block w-full overflow-hidden rounded-md text-left shadow-border"
        aria-label={`Open your creature: ${creature.name}`}
      >
        <IdentityImage src={`/cards/${creature.god.id}.webp`} fallbackSrc={creature.god.image} focus={creature.god.focus} emblem={creature.god.emblem} className="h-52 w-full sm:h-64">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-6 text-center">
            <p className={cn("text-xs tracking-kicker uppercase", RARITY_TEXT[result.rarity])}>{rarity.label} creature</p>
            <h3 className="mt-2 font-display text-3xl text-fg uppercase transition-transform duration-300 group-hover:scale-105 sm:text-4xl">{creature.name}</h3>
            {age ? <p className="mt-1 font-display text-lg text-fg/90">{age.text}</p> : null}
            <p className="mt-3 text-xs tracking-kicker text-primary uppercase">Open</p>
          </div>
        </IdentityImage>
      </button>

      <Portal>
        {open ? (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center overscroll-contain bg-bg-deep/85 p-3 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={creature.name}
            onClick={() => setOpen(false)}
          >
            <div
              className="panel-in max-h-[94svh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-md border border-border bg-surface"
              onClick={(event) => event.stopPropagation()}
            >
              <IdentityImage src={`/cards/${creature.god.id}.webp`} fallbackSrc={creature.god.image} focus={creature.god.focus} emblem={creature.god.emblem} className="h-72 w-full sm:h-[24rem]">
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
                  <p className={cn("text-xs tracking-kicker uppercase", RARITY_TEXT[result.rarity])}>{rarity.label} creature</p>
                  <h3 className="mt-1 font-display text-4xl text-fg sm:text-6xl">{creature.name}</h3>
                  {age ? <p className="mt-1 font-display text-lg text-fg/90 sm:text-2xl">{age.text}</p> : null}
                </div>
              </IdentityImage>

              <div className="grid gap-8 px-5 pt-4 pb-6 sm:px-8 sm:pb-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="font-display text-xl text-gold sm:text-2xl">{creature.god.line}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg/90">{creature.god.story}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{rarity.blurb}</p>

                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{creature.god.nature}</p>

                  {creature.god.deeds.length > 0 ? (
                    <>
                      <h4 className="mt-8 font-display text-xl text-fg">Known for</h4>
                      <ul className="mt-2 grid gap-1.5 text-sm text-muted">
                        {creature.god.deeds.map((deed) => (
                          <li key={deed} className="border-l border-primary/60 pl-3">
                            {deed}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>

                <aside className="grid content-start gap-6">
                  <dl className="grid gap-3 text-sm">
                    <div>
                      <dt className="text-xs tracking-kicker text-subtle uppercase">Domain</dt>
                      <dd className="mt-0.5 text-fg">{creature.god.domain}</dd>
                    </div>
                    <div>
                      <dt className="text-xs tracking-kicker text-subtle uppercase">Born of</dt>
                      <dd className="mt-0.5 text-fg">{creature.god.parentage}</dd>
                    </div>
                    <div>
                      <dt className="text-xs tracking-kicker text-subtle uppercase">Fate</dt>
                      <dd className="mt-0.5 text-fg">{creature.god.status}</dd>
                    </div>
                    <div>
                      <dt className="text-xs tracking-kicker text-subtle uppercase">Symbols</dt>
                      <dd className="mt-0.5 text-fg">{creature.god.symbols.join(", ")}</dd>
                    </div>
                  </dl>

                  <div className="rounded-md border border-border bg-bg/70 p-4">
                    <p className="text-xs tracking-kicker text-gold uppercase">About your creature</p>
                    {age ? (
                      <>
                        <p className="mt-3 font-display text-lg text-fg">
                          {age.label} · {age.text}
                        </p>
                        <p className="mt-1 text-sm text-muted">This is final. The age quiz can only be taken once.</p>
                      </>
                    ) : (
                      <>
                        <p className="mt-3 text-sm text-muted">{AGE_HINT[result.rarity]} One try only.</p>
                        <Link
                          to="/identity"
                          search={{ mode: "age" }}
                          onClick={() => setOpen(false)}
                          className="pressable mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-primary px-4 text-xs tracking-kicker text-primary-fg uppercase"
                        >
                          Find out about it
                        </Link>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="pressable inline-flex min-h-11 items-center justify-center rounded-sm border border-border px-4 text-xs tracking-kicker text-muted uppercase"
                  >
                    Close
                  </button>
                </aside>
              </div>
            </div>
          </div>
        ) : null}
      </Portal>
    </>
  );
}
