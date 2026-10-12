import { EpithetLadder } from "@/components/archive/home-interactive";
import { PageHero } from "@/components/archive/widgets";
import { getGod } from "@/data/gods";
import { epithets } from "@/data/world";
import { useArchiveStore } from "@/lib/archive-store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/epithets")({ component: EpithetsPage });

function EpithetsPage() {
  const openOverlay = useArchiveStore((state) => state.openOverlay);
  return (
    <main>
      <PageHero kicker="Names" title="Epithets" subtitle="A god addressed under another title is doing another job." />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <EpithetLadder />
        <ul className="mt-12 divide-y divide-border border-y border-border">
          {epithets.map((epithet) => {
            const god = getGod(epithet.god);
            return (
              <li key={epithet.id}>
                <button
                  type="button"
                  onClick={() => openOverlay({ type: "epithet", id: epithet.id })}
                  className="pressable flex min-h-16 w-full items-center justify-between gap-4 py-3 text-left"
                >
                  <span>
                    <span className="block font-display text-2xl text-fg">{epithet.name}</span>
                    <span className="text-sm text-muted">
                      {god?.name} · {epithet.meaning}
                    </span>
                  </span>
                  <span className="text-xs tracking-kicker text-gold uppercase">{epithet.line}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
