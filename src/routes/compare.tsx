import { CompareLab } from "@/components/archive/home-interactive";
import { PageHero } from "@/components/archive/widgets";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/compare")({ component: ComparePage });

function ComparePage() {
  return (
    <main>
      <PageHero kicker="Measure" title="Measure" subtitle="Set any two dossiers on the same seven bars. The numbers are for play." />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <CompareLab />
      </div>
    </main>
  );
}
