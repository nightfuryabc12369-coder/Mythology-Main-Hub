import { AgeCard, EpicCard, GodCard, MythCard } from "@/components/archive/cards";
import {
  CompareLab,
  ConstellationMap,
  DrawLot,
  EpithetLadder,
  FateLoom,
  Libation,
  MoteField,
  OracleDrill,
  RealmDial,
  ThroneRing,
  TimelineList,
} from "@/components/archive/home-interactive";
import { FindWindows } from "@/components/archive/find-windows";
import { SectionHeader, TextLink } from "@/components/archive/widgets";
import { WishSystem } from "@/components/archive/wish";
import { featuredGods } from "@/data/gods";
import { ages, epics, myths, timeline } from "@/data/world";
import { playTone } from "@/lib/audio";
import { useArchiveStore } from "@/lib/archive-store";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const sound = useArchiveStore((state) => state.sound);
  const [shift, setShift] = useState({ x: 0, y: 0 });
  const [flash, setFlash] = useState(0);

  return (
    <main>
      <section
        className="relative min-h-[calc(100svh-4rem)] overflow-hidden"
        onPointerMove={(event) => {
          if (event.pointerType !== "mouse") return;
          const rect = event.currentTarget.getBoundingClientRect();
          const dx = (event.clientX - rect.left) / rect.width - 0.5;
          const dy = (event.clientY - rect.top) / rect.height - 0.5;
          setShift({ x: dx * -16, y: dy * -12 });
        }}
      >
        <div
          className="absolute inset-[-4%]"
          style={{ transform: `translate3d(${shift.x}px, ${shift.y}px, 0)` }}
        >
          <img
            src="/scenes/hero.jpg"
            alt="Marble colonnade of Olympus above a storm-lit sea"
            className="kenburns h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/20" />
        {flash > 0 ? <div key={flash} className="storm-flash pointer-events-none absolute inset-0 bg-fg" /> : null}
        <MoteField />
        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-end px-4 pt-16 pb-16 sm:px-6">
          <p className="stagger-in text-xs tracking-kicker text-gold uppercase">Myth archive · The bright court</p>
          <h1 className="stagger-in mt-3 max-w-4xl font-display text-display text-fg uppercase" style={{ ["--d" as string]: "90ms" }}>
            Aether Codex
          </h1>
          <p className="stagger-in mt-4 max-w-xl text-base text-fg/85 sm:text-lg" style={{ ["--d" as string]: "170ms" }}>
            Gods, wars, and the stories that still move — told as a hall you can walk. Seat the twelve, pour a libation, and put two powers on the same measure.
          </p>
          <div className="stagger-in mt-8 flex flex-wrap gap-3" style={{ ["--d" as string]: "250ms" }}>
            <a href="#thrones" className="pressable inline-flex min-h-12 items-center rounded-sm bg-primary px-5 text-sm text-primary-fg">
              Seat the twelve
            </a>
            <Link
              to="/play"
              onClick={() => {
                if (sound) playTone(330, 0.12, 0.04);
              }}
              className="pressable inline-flex min-h-12 items-center rounded-sm border border-gold/60 bg-bg/40 px-5 text-sm text-gold backdrop-blur-sm"
            >
              Quizzes &amp; games
            </Link>
            <Link
              to="/shop"
              onClick={() => {
                if (sound) playTone(392, 0.12, 0.04);
              }}
              className="pressable inline-flex min-h-12 items-center rounded-sm border border-gold/60 bg-bg/40 px-5 text-sm text-gold backdrop-blur-sm"
            >
              Shop
            </Link>
            <button
              type="button"
              onClick={() => {
                setFlash((value) => value + 1);
                if (sound) playTone(196, 0.18, 0.04);
              }}
              className="pressable inline-flex min-h-12 items-center rounded-sm border border-fg/30 bg-bg/40 px-5 text-sm text-fg backdrop-blur-sm"
            >
              Stir the storm
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-20 sm:px-6" id="identity">
        <FindWindows />
      </section>

      <section className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6" id="ages">
        <SectionHeader
          kicker="001 / Ages"
          title="Four weathers of the same sky"
          subtitle="From a gap with no name to the last generation that dined with gods."
          action={<TextLink to="/ages">All ages</TextLink>}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {ages.map((age) => (
            <AgeCard key={age.id} age={age} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6" id="wish">
        <SectionHeader
          kicker="Wish / The Pantheon"
          title="Ask the Pantheon for a wish"
          subtitle="Open the hall, speak a wish, and keep the figures you win on your profile."
          action={<TextLink to="/profile">My cards</TextLink>}
        />
        <WishSystem />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <SectionHeader kicker="002 / Realms" title="Pick a country of the gods" subtitle="The dial changes the room without leaving the page." />
        <RealmDial />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" id="gods">
        <SectionHeader
          kicker="003 / Dossiers"
          title="Figures of the court"
          subtitle="Open a file for the story, the kin, and the temple measures."
          action={<TextLink to="/gods">Full pantheon</TextLink>}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredGods.map((god, index) => (
            <GodCard key={god.id} god={god} index={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6" id="thrones">
        <SectionHeader
          kicker="004 / Council"
          title="Seat the twelve"
          subtitle="Hestia keeps the hearth. Dionysus takes the public chair. Fill the ring."
        />
        <ThroneRing />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionHeader kicker="005 / Fate" title="Walk a myth one beat at a time" action={<TextLink to="/myths">All myths</TextLink>} />
        <FateLoom />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeader kicker="006 / Myths" title="Stories worth naming" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {myths.slice(0, 6).map((myth) => (
            <MythCard key={myth.id} myth={myth} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6" id="epithets">
        <SectionHeader
          kicker="007 / Epithets"
          title="Climb a name"
          subtitle="The same god, addressed differently, is a different power."
          action={<TextLink to="/epithets">Every epithet</TextLink>}
        />
        <EpithetLadder />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeader kicker="008 / Sky" title="Name a constellation" subtitle="Tap a figure. The lines draw themselves." />
        <ConstellationMap />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid items-start gap-6 xl:grid-cols-2">
          <OracleDrill />
          <div className="grid gap-6">
            <Libation />
            <DrawLot />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeader kicker="009 / Epics" title="The poems that kept them" action={<TextLink to="/epics">Epic shelf</TextLink>} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {epics.slice(0, 4).map((epic) => (
            <EpicCard key={epic.id} epic={epic} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionHeader kicker="010 / Time" title="The long order" action={<TextLink to="/timeline">Full timeline</TextLink>} />
        <TimelineList items={timeline.slice(0, 6)} />
      </section>

      <section className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 pb-24 sm:px-6" id="measure">
        <SectionHeader
          kicker="011 / Measure"
          title="Set two gods on one bar"
          subtitle="Unofficial temple measures. Choosing the same name swaps them."
          action={<TextLink to="/compare">Full measure</TextLink>}
        />
        <CompareLab />
      </section>
    </main>
  );
}
