import { AgeCard } from "@/components/archive/cards";
import { PageHero } from "@/components/archive/widgets";
import { ages } from "@/data/world";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ages")({ component: AgesPage });

function AgesPage() {
  return (
    <main>
      <PageHero kicker="Ages" title="Ages" subtitle="The same cosmos, told as four weathers. Open any of them." />
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2">
        {ages.map((age) => (
          <AgeCard key={age.id} age={age} />
        ))}
      </div>
    </main>
  );
}
