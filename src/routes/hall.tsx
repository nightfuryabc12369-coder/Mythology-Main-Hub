import { CompareLab } from "@/components/archive/home-interactive";
import { PageHero } from "@/components/archive/widgets";
import { createFileRoute } from "@tanstack/react-router";

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
      </section>
    </main>
  );
}
