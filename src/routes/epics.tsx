import { EpicCard } from "@/components/archive/cards";
import { PageHero } from "@/components/archive/widgets";
import { epics } from "@/data/world";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/epics")({ component: EpicsPage });

function EpicsPage() {
  return (
    <main>
      <PageHero kicker="Poems" title="Epics" subtitle="The texts that kept the gods in circulation. Ovid is filed as a Roman lens, not a Greek rite." />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {epics.map((epic) => (
          <EpicCard key={epic.id} epic={epic} />
        ))}
      </div>
    </main>
  );
}
