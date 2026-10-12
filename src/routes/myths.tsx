import { MythCard } from "@/components/archive/cards";
import { FateLoom } from "@/components/archive/home-interactive";
import { PageHero, SectionHeader } from "@/components/archive/widgets";
import { myths } from "@/data/world";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/myths")({ component: MythsPage });

function MythsPage() {
  return (
    <main>
      <PageHero kicker="Myths" title="Myths" subtitle="Nine stories you can open, or walk one beat at a time." />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <SectionHeader kicker="Thread" title="The fate loom" subtitle="Pick a myth. Advance the beat. The room changes with the line." />
        <FateLoom />
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {myths.map((myth) => (
            <MythCard key={myth.id} myth={myth} />
          ))}
        </div>
      </div>
    </main>
  );
}
