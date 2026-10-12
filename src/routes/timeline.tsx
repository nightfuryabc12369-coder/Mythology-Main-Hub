import { TimelineList } from "@/components/archive/home-interactive";
import { PageHero } from "@/components/archive/widgets";
import { timeline } from "@/data/world";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/timeline")({ component: TimelinePage });

function TimelinePage() {
  return (
    <main>
      <PageHero kicker="Order" title="Time" subtitle="Not a history with dates. A mythic sequence, from the gap to the backward glance." />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <TimelineList items={timeline} />
      </div>
    </main>
  );
}
