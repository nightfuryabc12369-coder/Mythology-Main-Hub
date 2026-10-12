import { CardTile } from "@/components/archive/wish";
import { PageHero } from "@/components/archive/widgets";
import { MAX_LEVEL } from "@/data/cards";
import { gods } from "@/data/gods";
import { useArchiveStore } from "@/lib/archive-store";
import { Link, createFileRoute } from "@tanstack/react-router";
import { rarityOf, godPower } from "@/data/cards";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

const rarityRank = { legendary: 0, epic: 1, rare: 2, common: 3 } as const;

function ProfilePage() {
  const hydrated = useArchiveStore((state) => state.hydrated);
  const cards = useArchiveStore((state) => state.cards);
  const pills = useArchiveStore((state) => state.pills);
  const upgradeCard = useArchiveStore((state) => state.upgradeCard);

  const owned = hydrated
    ? gods
        .filter((god) => cards[god.id])
        .sort((a, b) => rarityRank[rarityOf(a.id)] - rarityRank[rarityOf(b.id)] || godPower(b) - godPower(a))
    : [];

  return (
    <main>
      <PageHero kicker="Profile" title="My cards" subtitle="Every figure the Fates have given you, and the ambrosia to raise them." />
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6">
        <section>
          <h2 className="font-display text-3xl text-fg">My cards</h2>
          <p className="mt-1 text-sm text-muted">
            {owned.length} of {gods.length} owned
          </p>
          {!hydrated ? <p className="mt-6 text-sm text-muted">Opening your hand…</p> : null}
          {hydrated && owned.length === 0 ? (
            <p className="mt-6 text-sm text-muted">
              No cards yet. Gather all seven stars on the{" "}
              <Link to="/" hash="wish" className="text-primary underline">
                home page
              </Link>{" "}
              and make a wish.
            </p>
          ) : null}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {owned.map((god) => {
              const level = cards[god.id];
              return (
                <CardTile key={god.id} god={god} level={level}>
                  <button
                    type="button"
                    disabled={pills < 1 || level >= MAX_LEVEL}
                    onClick={() => upgradeCard(god.id)}
                    className="pressable mt-2 min-h-10 w-full rounded-sm border border-border text-[11px] tracking-kicker text-primary uppercase disabled:opacity-40"
                  >
                    {level >= MAX_LEVEL ? "Max level" : "Use ambrosia"}
                  </button>
                </CardTile>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl text-fg">My inventory</h2>
          <div className="mt-6 max-w-xs rounded-md bg-surface p-5 shadow-border">
            <h3 className="font-display text-xl text-fg">Ambrosia</h3>
            <p className="mt-2 font-display text-5xl text-primary">x{hydrated ? pills : 0}</p>
            <p className="mt-3 text-sm text-muted">Raises one card by a level (up to Level {MAX_LEVEL}).</p>
          </div>
          <p className="mt-6 text-xs text-muted">
            Card art is a placeholder for now. Add an image named after each figure, like <code>public/cards/zeus.jpg</code>, and it appears here.
          </p>
        </section>
      </div>
    </main>
  );
}
