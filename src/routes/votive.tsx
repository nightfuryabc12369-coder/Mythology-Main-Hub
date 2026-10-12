import { PageHero } from "@/components/archive/widgets";
import { gods } from "@/data/gods";
import type { FavoriteKind } from "@/data/types";
import { epics, epithets, myths } from "@/data/world";
import { useArchiveStore } from "@/lib/archive-store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/votive")({ component: VotivePage });

const groups: Array<{ kind: FavoriteKind; label: string }> = [
  { kind: "god", label: "Gods" },
  { kind: "myth", label: "Myths" },
  { kind: "epithet", label: "Epithets" },
  { kind: "epic", label: "Epics" },
];

function titleFor(kind: FavoriteKind, id: string) {
  if (kind === "god") return gods.find((god) => god.id === id)?.name ?? id;
  if (kind === "myth") return myths.find((myth) => myth.id === id)?.name ?? id;
  if (kind === "epithet") return epithets.find((epithet) => epithet.id === id)?.name ?? id;
  return epics.find((epic) => epic.id === id)?.title ?? id;
}

function VotivePage() {
  const hydrated = useArchiveStore((state) => state.hydrated);
  const favorites = useArchiveStore((state) => state.favorites);
  const openOverlay = useArchiveStore((state) => state.openOverlay);
  const total = groups.reduce((sum, group) => sum + favorites[group.kind].length, 0);

  return (
    <main>
      <PageHero kicker="Saved" title="Votive" subtitle="Whatever you marked stays on this shelf, in this browser." />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {!hydrated ? <p className="text-sm text-muted">Opening the shelf…</p> : null}
        {hydrated && total === 0 ? (
          <p className="text-sm text-muted">Nothing set aside yet. Mark a god, a myth, an epithet, or an epic.</p>
        ) : null}
        <div className="space-y-8">
          {groups.map((group) => {
            const ids = favorites[group.kind];
            if (!hydrated || ids.length === 0) return null;
            return (
              <section key={group.kind}>
                <h2 className="text-xs tracking-kicker text-gold uppercase">{group.label}</h2>
                <ul className="mt-3 divide-y divide-border border-y border-border">
                  {ids.map((id) => (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => openOverlay({ type: group.kind, id })}
                        className="pressable flex min-h-14 w-full items-center text-left font-display text-2xl text-fg"
                      >
                        {titleFor(group.kind, id)}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
