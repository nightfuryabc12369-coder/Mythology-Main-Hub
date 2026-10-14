import {
  CompareLab,
  ConstellationMap,
  DrawLot,
  EpithetLadder,
  FateLoom,
  Libation,
  OracleDrill,
  RealmDial,
  ThroneRing,
} from "@/components/archive/home-interactive";
import { PageHero, SectionHeader, TextLink } from "@/components/archive/widgets";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hall")({
  head: () => ({ meta: [{ title: "Hall of wonders · Aether Codex" }] }),
  component: HallPage,
});

const JUMPS = [
  { id: "realms", label: "Realms" },
  { id: "thrones", label: "Council" },
  { id: "fate", label: "Fate" },
  { id: "epithets", label: "Epithets" },
  { id: "sky", label: "Sky" },
  { id: "rites", label: "Rites" },
  { id: "measure", label: "Measure" },
];

function HallPage() {
  return (
    <main>
      <PageHero
        kicker="The hall of wonders"
        title="Hall of wonders"
        subtitle="Seat the twelve, pick a realm, climb a name, pour a libation and set two gods on one bar."
      />
      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pt-8 sm:px-6" aria-label="Jump to a section">
        {JUMPS.map((jump) => (
          <a
            key={jump.id}
            href={`#${jump.id}`}
            className="pressable inline-flex min-h-11 shrink-0 items-center rounded-full border border-border px-4 text-xs tracking-kicker text-muted uppercase"
          >
            {jump.label}
          </a>
        ))}
      </nav>

      <section className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6" id="realms">
        <SectionHeader kicker="001 / Realms" title="Pick a country of the gods" subtitle="The dial changes the room without leaving the page." />
        <RealmDial />
      </section>

      <section className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6" id="thrones">
        <SectionHeader
          kicker="002 / Council"
          title="Seat the twelve"
          subtitle="Hestia keeps the hearth. Dionysus takes the public chair. Fill the ring."
        />
        <ThroneRing />
      </section>

      <section className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6" id="fate">
        <SectionHeader kicker="003 / Fate" title="Walk a myth one beat at a time" action={<TextLink to="/myths">All myths</TextLink>} />
        <FateLoom />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 scroll-mt-24" id="epithets">
        <SectionHeader
          kicker="004 / Epithets"
          title="Climb a name"
          subtitle="The same god, addressed differently, is a different power."
          action={<TextLink to="/epithets">Every epithet</TextLink>}
        />
        <EpithetLadder />
      </section>

      <section className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6" id="sky">
        <SectionHeader kicker="005 / Sky" title="Name a constellation" subtitle="Tap a figure. The lines draw themselves." />
        <ConstellationMap />
      </section>

      <section className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6" id="rites">
        <div className="grid items-start gap-6 xl:grid-cols-2">
          <OracleDrill />
          <div className="grid gap-6">
            <Libation />
            <DrawLot />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 pb-24 sm:px-6" id="measure">
        <SectionHeader
          kicker="006 / Measure"
          title="Set two gods on one bar"
          subtitle="Unofficial temple measures. Choosing the same name swaps them."
          action={<TextLink to="/compare">Full measure</TextLink>}
        />
        <CompareLab />
      </section>
    </main>
  );
}
