import { CompareLab } from "@/components/archive/home-interactive";
import { PageHero } from "@/components/archive/widgets";
import { createFileRoute } from "@tanstack/react-router";
import { Swords } from "lucide-react";

export const Route = createFileRoute("/hall")({
  head: () => ({ meta: [{ title: "Battle Arena · Aether Codex" }] }),
  component: ArenaPage,
});

function ArenaPage() {
  return (
    <main>
      <PageHero
        kicker="The arena"
        title="Battle Arena"
        subtitle="Set two gods on one bar. Unofficial temple measures, and choosing the same name swaps them."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6">
        <CompareLab />
        <PvpBanner />
      </section>
    </main>
  );
}

/** Teaser under the battle panel: player versus player is on its way. */
function PvpBanner() {
  return (
    <div
      role="note"
      aria-label="Player versus player is coming soon"
      className="relative mt-10 overflow-hidden rounded-md border border-gold/40 bg-gradient-to-br from-surface via-bg to-surface px-6 py-10 text-center shadow-border sm:px-10 sm:py-14"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(228,201,138,0.12),transparent_65%)]" />
      <div className="relative flex flex-col items-center gap-4">
        <span className="grid size-14 place-items-center rounded-full border border-gold/60 bg-gold/10 text-gold">
          <Swords className="size-7" aria-hidden />
        </span>
        <p className="rounded-full border border-gold/60 bg-gold/10 px-3 py-1 text-[10px] tracking-kicker text-gold uppercase">Coming soon</p>
        <h2 className="font-display text-4xl text-fg sm:text-5xl">Player VS Player</h2>
        <p className="max-w-xl text-sm text-muted sm:text-base">
          Soon you will bring your own cards into the arena and face another traveler. Keep collecting and raising your cards.
        </p>
      </div>
    </div>
  );
}
