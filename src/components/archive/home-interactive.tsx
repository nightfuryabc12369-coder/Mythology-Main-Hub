import { GodPhoto, NameChips } from "@/components/archive/cards";
import { EmblemMark } from "@/components/archive/emblem";
import { StatRow } from "@/components/archive/widgets";
import { gods, getGod } from "@/data/gods";
import type { God } from "@/data/types";
import { STAT_KEYS, THRONES, type StatKey, type TimelineEvent } from "@/data/types";
import { constellations, epithetLines, epithets, myths, oracles, realms, timeline } from "@/data/world";
import { playSeal, playSummon, playTone } from "@/lib/audio";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

export function MoteField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 18 }, (_, index) => (
        <span key={index} className="mote" style={{ ["--i" as string]: String(index), left: `${(index * 53) % 100}%` }} />
      ))}
    </div>
  );
}

export function RealmDial() {
  const [active, setActive] = useState(realms[0]?.id ?? "olympus");
  const realm = realms.find((item) => item.id === active) ?? realms[0];
  if (!realm) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {realms.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === active}
            onClick={() => setActive(item.id)}
            className={cn(
              "pressable min-h-11 rounded-sm border px-3 py-3 text-left transition-colors duration-200",
              item.id === active ? "border-primary bg-elevated text-fg" : "border-border bg-surface text-muted",
            )}
          >
            <span className="block text-xs tracking-kicker uppercase">{item.epithet}</span>
            <span className="font-display text-xl text-fg">{item.name}</span>
          </button>
        ))}
      </div>
      <div key={realm.id} className="panel-in relative min-h-80 overflow-hidden rounded-md">
        <img src={realm.image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: realm.focus }} />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-transparent" />
        <div className="relative flex min-h-80 max-w-lg flex-col justify-end p-6 sm:p-8">
          <p className="text-xs tracking-kicker text-gold uppercase">{realm.keeper}</p>
          <h3 className="mt-2 font-display text-4xl text-fg">{realm.name}</h3>
          <p className="mt-3 text-sm text-fg/90">{realm.blurb}</p>
          <div className="mt-5">
            <NameChips ids={realm.gods} />
          </div>
        </div>
      </div>
    </div>
  );
}

const THRONE_SPOTS = [
  ["50%", "8%"],
  ["71%", "13.63%"],
  ["86.37%", "29%"],
  ["92%", "50%"],
  ["86.37%", "71%"],
  ["71%", "86.37%"],
  ["50%", "92%"],
  ["29%", "86.37%"],
  ["13.63%", "71%"],
  ["8%", "50%"],
  ["13.63%", "29%"],
  ["29%", "13.63%"],
] as const;

export function ThroneRing() {
  const seated = useArchiveStore((state) => state.seated);
  const toggleSeat = useArchiveStore((state) => state.toggleSeat);
  const resetSeats = useArchiveStore((state) => state.resetSeats);
  const sound = useArchiveStore((state) => state.sound);
  const [focus, setFocus] = useState<string>(THRONES[0]);
  const god = getGod(focus);

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,440px)_1fr]">
      <div className="relative mx-auto aspect-square w-full max-w-[440px]">
        <div className="absolute inset-[18%] grid place-items-center rounded-full border border-border bg-bg-deep text-center">
          <p className="font-display text-5xl text-gold">{seated.length}</p>
          <p className="text-xs tracking-kicker text-muted uppercase">of 12 seated</p>
        </div>
        {THRONES.map((id, index) => {
          const figure = getGod(id);
          const spot = THRONE_SPOTS[index];
          if (!figure || !spot) return null;
          const on = seated.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              aria-label={`${on ? "Unseat" : "Seat"} ${figure.name}`}
              onClick={() => {
                setFocus(id);
                if (sound) playTone(280 + index * 24, 0.1, 0.035);
                toggleSeat(id);
              }}
              style={{ left: spot[0], top: spot[1] }}
              className={cn(
                "pressable absolute grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border sm:size-14",
                on ? "border-primary bg-primary text-primary-fg shadow-glow" : "border-border bg-surface text-gold",
              )}
            >
              <EmblemMark name={figure.emblem} className="size-5" />
            </button>
          );
        })}
      </div>
      {god ? (
        <div key={god.id} className="panel-in">
          <p className="text-xs tracking-kicker text-gold uppercase">{god.epithet}</p>
          <h3 className="mt-2 font-display text-4xl text-fg">{god.name}</h3>
          <p className="mt-2 text-sm text-muted">{god.office}</p>
          <p className="mt-4 max-w-xl text-base text-fg/90">{god.line}</p>
          <p className="mt-6 text-sm text-subtle">Seat all twelve and the council convenes. Tap a sign to give or take a throne.</p>
          <button type="button" onClick={resetSeats} className="pressable mt-4 inline-flex min-h-11 items-center text-xs tracking-kicker text-muted uppercase">
            Clear the hall
          </button>
        </div>
      ) : null}
    </div>
  );
}

const SEALS = [
  { id: "bolt", label: "Bolt" },
  { id: "tide", label: "Tide" },
  { id: "owl", label: "Owl" },
  { id: "lyre", label: "Lyre" },
  { id: "spear", label: "Spear" },
  { id: "rose", label: "Rose" },
] as const;

export function OracleDrill() {
  const sound = useArchiveStore((state) => state.sound);
  const best = useArchiveStore((state) => state.oracleBest);
  const setBest = useArchiveStore((state) => state.setOracleBest);
  const [sequence, setSequence] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"idle" | "show" | "input" | "win" | "fail">("idle");
  const [flash, setFlash] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const start = (length = 3) => {
    const next = Array.from({ length }, () => SEALS[Math.floor(Math.random() * SEALS.length)]!.id);
    setSequence(next);
    setStep(0);
    setPhase("show");
  };

  useEffect(() => {
    if (phase !== "show") return;
    let index = 0;
    const timer = window.setInterval(() => {
      const id = sequence[index];
      setFlash(id ?? null);
      if (sound && id) playTone(340 + index * 36, 0.08, 0.03);
      window.setTimeout(() => setFlash(null), 280);
      index += 1;
      if (index > sequence.length) {
        window.clearInterval(timer);
        setPhase("input");
        setStep(0);
      }
    }, 520);
    return () => window.clearInterval(timer);
  }, [phase, sequence, sound]);

  const press = (id: string) => {
    if (phase !== "input") return;
    if (sound) playSeal();
    if (sequence[step] !== id) {
      setPhase("fail");
      setShake(true);
      window.setTimeout(() => setShake(false), 420);
      return;
    }
    const nextStep = step + 1;
    if (nextStep >= sequence.length) {
      const score = sequence.length;
      setBest(score);
      if (sound) playSummon();
      if (score >= 6) {
        setPhase("win");
        return;
      }
      window.setTimeout(() => start(score + 1), 480);
      setPhase("idle");
      return;
    }
    setStep(nextStep);
  };

  const status =
    phase === "idle"
      ? "Watch the signs, then repeat them."
      : phase === "show"
        ? "The oracle is speaking. Do not answer yet."
        : phase === "input"
          ? `Your turn · ${step} / ${sequence.length}`
          : phase === "win"
            ? "Six signs. Delphi goes quiet, which is a kind of praise."
            : "The sequence broke. Reset and listen again.";

  return (
    <div className={cn("rounded-md bg-surface p-5 shadow-border sm:p-6", shake && "shake")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-kicker text-gold uppercase">Oracle drill</p>
          <h3 className="mt-1 font-display text-3xl">Repeat the signs</h3>
        </div>
        <p className="text-right text-xs tracking-kicker text-muted uppercase">Best {best}</p>
      </div>
      <p className="mt-3 min-h-6 text-sm text-muted">{status}</p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {SEALS.map((seal) => (
          <button
            key={seal.id}
            type="button"
            onClick={() => press(seal.id)}
            className={cn(
              "pressable min-h-14 rounded-sm border text-sm tracking-kicker uppercase transition-colors duration-150",
              flash === seal.id ? "border-primary bg-primary text-primary-fg" : "border-border bg-bg text-fg",
            )}
          >
            {seal.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => start(3)}
        className="pressable mt-4 inline-flex min-h-11 items-center rounded-sm bg-primary px-4 text-sm text-primary-fg"
      >
        {phase === "idle" ? "Begin the oracle" : "Reset the oracle"}
      </button>
    </div>
  );
}

export function Libation() {
  const sound = useArchiveStore((state) => state.sound);
  const [level, setLevel] = useState(0);
  const [line, setLine] = useState<string | null>(null);
  const holding = useRef(false);
  const levelRef = useRef(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!holding.current) return;
      levelRef.current = Math.min(100, levelRef.current + 2.4);
      setLevel(levelRef.current);
      if (levelRef.current >= 100) {
        holding.current = false;
        const next = oracles[Math.floor(Math.random() * oracles.length)] ?? oracles[0];
        setLine(next ?? null);
        if (sound) playSummon();
        window.setTimeout(() => {
          levelRef.current = 0;
          setLevel(0);
        }, 700);
      }
    }, 40);
    return () => window.clearInterval(timer);
  }, [sound]);

  const pour = (on: boolean) => {
    holding.current = on;
    if (on) setLine(null);
  };

  return (
    <div className="rounded-md bg-surface p-5 shadow-border sm:p-6">
      <p className="text-xs tracking-kicker text-gold uppercase">Libation</p>
      <h3 className="mt-1 font-display text-3xl">Hold to pour</h3>
      <p className="mt-3 text-sm text-muted">Fill the krater and the codex answers with a line. Release early and nothing is promised.</p>
      <div className="mt-6 flex items-end gap-6">
        <div className="relative h-48 w-24 overflow-hidden rounded-b-full border border-border bg-bg-deep">
          <div className="absolute inset-x-0 bottom-0 bg-wine transition-[height] duration-75" style={{ height: `${level}%` }} />
        </div>
        <div className="min-h-24 flex-1">
          <p className="text-xs tracking-kicker text-muted uppercase">{Math.round(level)} / 100</p>
          {line ? <p key={line} className="panel-in mt-3 font-display text-2xl text-fg">{line}</p> : <p className="mt-3 text-sm text-subtle">The cup is waiting.</p>}
        </div>
      </div>
      <button
        type="button"
        onPointerDown={() => pour(true)}
        onPointerUp={() => pour(false)}
        onPointerLeave={() => pour(false)}
        onPointerCancel={() => pour(false)}
        className="pressable mt-6 inline-flex min-h-12 items-center rounded-sm border border-primary px-5 text-sm text-gold"
      >
        Pour
      </button>
    </div>
  );
}

export function EpithetLadder() {
  const [line, setLine] = useState(epithetLines[0] ?? "Sky father");
  const rungs = epithets.filter((epithet) => epithet.line === line).sort((a, b) => a.stage - b.stage);
  const [stage, setStage] = useState(rungs[0]?.id ?? "");
  const current = rungs.find((epithet) => epithet.id === stage) ?? rungs[0];
  const god = current ? getGod(current.god) : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="flex gap-2 overflow-x-auto lg:flex-col">
        {epithetLines.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={item === line}
            onClick={() => {
              setLine(item);
              const first = epithets.find((epithet) => epithet.line === item);
              setStage(first?.id ?? "");
            }}
            className={cn(
              "pressable min-h-11 shrink-0 rounded-sm border px-3 text-left text-sm",
              item === line ? "border-primary bg-elevated text-fg" : "border-border bg-surface text-muted",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          {rungs.map((rung) => (
            <button
              key={rung.id}
              type="button"
              aria-pressed={rung.id === current?.id}
              onClick={() => setStage(rung.id)}
              className={cn(
                "pressable min-h-11 rounded-full px-4 text-sm",
                rung.id === current?.id ? "bg-primary text-primary-fg" : "bg-surface text-muted",
              )}
            >
              {rung.stage}. {rung.name}
            </button>
          ))}
        </div>
        {current ? (
          <div key={current.id} className="panel-in mt-5 rounded-md bg-surface p-5 shadow-border sm:p-6">
            <p className="text-xs tracking-kicker text-gold uppercase">
              {god?.name} · {current.meaning}
            </p>
            <h3 className="mt-2 font-display text-4xl text-fg">{current.name}</h3>
            <p className="mt-4 max-w-2xl text-base text-fg/90">{current.description}</p>
            <p className="mt-4 text-sm text-muted">{current.note}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {current.signs.map((sign) => (
                <span key={sign} className="rounded-full border border-border px-3 py-2 text-xs tracking-kicker text-muted uppercase">
                  {sign}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ConstellationMap() {
  const [active, setActive] = useState(constellations[0]?.id ?? "lyra");
  const sky = constellations.find((item) => item.id === active) ?? constellations[0];
  const patron = sky ? getGod(sky.patron) : undefined;
  if (!sky) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="relative min-h-80 overflow-hidden rounded-md border border-border bg-bg-deep">
        <img src="/scenes/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
          {sky.stars.slice(1).map((star, index) => {
            const prev = sky.stars[index];
            if (!prev) return null;
            return (
              <line
                key={`${sky.id}-${index}`}
                x1={prev[0]}
                y1={prev[1]}
                x2={star[0]}
                y2={star[1]}
                className="constellation-line"
                stroke="var(--color-gold)"
                strokeWidth="0.6"
              />
            );
          })}
        </svg>
        {sky.stars.map((star, index) => (
          <span
            key={`${sky.id}-star-${index}`}
            className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-glow"
            style={{ left: `${star[0]}%`, top: `${star[1]}%` }}
          />
        ))}
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2">
          {constellations.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === sky.id}
              onClick={() => setActive(item.id)}
              className={cn(
                "pressable min-h-11 rounded-full px-3 text-xs tracking-kicker uppercase",
                item.id === sky.id ? "bg-primary text-primary-fg" : "bg-bg/70 text-fg",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      <div key={sky.id} className="panel-in flex flex-col justify-end">
        <p className="text-xs tracking-kicker text-gold uppercase">{patron ? `Claimed by ${patron.name}` : "Unclaimed"}</p>
        <h3 className="mt-2 font-display text-4xl text-fg">{sky.name}</h3>
        <p className="mt-4 text-base text-fg/90">{sky.myth}</p>
      </div>
    </div>
  );
}

export function FateLoom() {
  const [id, setId] = useState(myths[3]?.id ?? myths[0]?.id ?? "");
  const [step, setStep] = useState(0);
  const myth = myths.find((item) => item.id === id) ?? myths[0];
  if (!myth) return null;
  const beat = myth.beats[step] ?? myth.beats[0];

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {myths.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === myth.id}
            onClick={() => {
              setId(item.id);
              setStep(0);
            }}
            className={cn(
              "pressable min-h-11 shrink-0 rounded-full px-3 text-xs tracking-kicker uppercase",
              item.id === myth.id ? "bg-primary text-primary-fg" : "bg-surface text-muted",
            )}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 rounded-md bg-surface p-5 shadow-border sm:p-6 lg:grid-cols-[1fr_auto]">
        <div key={`${myth.id}-${step}`} className="panel-in">
          <p className="text-xs tracking-kicker text-gold uppercase">
            Beat {step + 1} / {myth.beats.length}
          </p>
          <p className="mt-3 font-display text-3xl text-fg">{beat}</p>
        </div>
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            className="pressable inline-flex min-h-11 items-center rounded-sm border border-border px-4 text-sm text-fg"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setStep((value) => Math.min(myth.beats.length - 1, value + 1))}
            className="pressable inline-flex min-h-11 items-center rounded-sm bg-primary px-4 text-sm text-primary-fg"
          >
            Next beat
          </button>
        </div>
      </div>
      <div className="mt-3 flex gap-1">
        {myth.beats.map((item, index) => (
          <button
            key={item}
            type="button"
            aria-label={`Beat ${index + 1}`}
            onClick={() => setStep(index)}
            className={cn("h-2 flex-1 rounded-full", index <= step ? "bg-primary" : "bg-elevated")}
          />
        ))}
      </div>
    </div>
  );
}

const LOTS = [
  {
    prompt: "Where do you stand when the weather turns?",
    options: [
      { label: "On the high ridge", weights: { zeus: 2, apollo: 1 } },
      { label: "In the surf", weights: { poseidon: 2, aphrodite: 1 } },
      { label: "At a threshold", weights: { hecate: 2, hermes: 1 } },
      { label: "By the fire", weights: { hestia: 2, hephaestus: 1 } },
    ],
  },
  {
    prompt: "What do you refuse to surrender?",
    options: [
      { label: "A guest", weights: { zeus: 2, hera: 1 } },
      { label: "A secret", weights: { hades: 2, persephone: 1 } },
      { label: "The hunt", weights: { artemis: 2, apollo: 1 } },
      { label: "A making", weights: { hephaestus: 2, athena: 2 } },
    ],
  },
  {
    prompt: "What do you trust when the room goes quiet?",
    options: [
      { label: "An oath", weights: { hera: 2, zeus: 1 } },
      { label: "A song", weights: { apollo: 2, dionysus: 1 } },
      { label: "A thread", weights: { athena: 2, hermes: 1 } },
      { label: "The dark", weights: { hades: 1, persephone: 2 } },
    ],
  },
] as const;

export function DrawLot() {
  const openOverlay = useArchiveStore((state) => state.openOverlay);
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step >= LOTS.length;

  const winner = useMemo(() => {
    if (!done) return undefined;
    const scores: Record<string, number> = {};
    answers.forEach((choice, index) => {
      const option = LOTS[index]?.options[choice];
      if (!option) return;
      Object.entries(option.weights).forEach(([id, weight]) => {
        scores[id] = (scores[id] ?? 0) + weight;
      });
    });
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return best ? getGod(best[0]) : undefined;
  }, [answers, done]);

  return (
    <div className="rounded-md bg-surface p-5 shadow-border sm:p-6">
      <p className="text-xs tracking-kicker text-gold uppercase">The lot</p>
      <h3 className="mt-1 font-display text-3xl">{done ? "The lot falls" : `Question ${step + 1}`}</h3>
      {!done ? (
        <div className="panel-in mt-4" key={step}>
          <p className="text-base text-fg">{LOTS[step]?.prompt}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {LOTS[step]?.options.map((option, index) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setAnswers((current) => [...current, index])}
                className="pressable min-h-12 rounded-sm border border-border bg-bg px-3 text-left text-sm text-fg"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : winner ? (
        <div className="panel-in mt-4">
          <p className="text-xs tracking-kicker text-gold uppercase">{winner.epithet}</p>
          <p className="mt-2 font-display text-4xl text-fg">{winner.name}</p>
          <p className="mt-3 max-w-xl text-sm text-muted">{winner.line}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openOverlay({ type: "god", id: winner.id })}
              className="pressable inline-flex min-h-11 items-center rounded-sm bg-primary px-4 text-sm text-primary-fg"
            >
              Open the dossier
            </button>
            <button type="button" onClick={() => setAnswers([])} className="pressable inline-flex min-h-11 items-center px-3 text-sm text-muted">
              Draw again
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}


const BATTLE_WEIGHTS: Record<StatKey, number> = {
  might: 0.3,
  wrath: 0.15,
  cunning: 0.15,
  endurance: 0.2,
  dominion: 0.1,
  craft: 0.05,
  favor: 0.05,
};

function battlePower(god: God) {
  return STAT_KEYS.reduce((sum, [key]) => sum + god.stats[key as StatKey] * BATTLE_WEIGHTS[key as StatKey], 0);
}

/** Chance that `a` beats `b`. A steep exponent makes bigger gaps count, but upsets stay possible. */
function winChance(a: God, b: God) {
  const pa = battlePower(a) ** 6;
  const pb = battlePower(b) ** 6;
  return pa / (pa + pb);
}

const POPS = ["POW!", "BAM!", "WHAM!", "CRASH!", "SMASH!", "THOOM!"];

type BattlePhase = "idle" | "fighting" | "done";

function BattleCard({ god, side, lunging, hurt, ko, won }: { god: God; side: "L" | "R"; lunging: boolean; hurt: boolean; ko: boolean; won: boolean }) {
  const dir = side === "L" ? 1 : -1;
  let transform = "none";
  if (ko) transform = `translateX(${dir * -24}px) translateY(14px) rotate(${dir * -9}deg) scale(0.94)`;
  else if (lunging) transform = `translateX(${dir * 70}px) rotate(${dir * 4}deg) scale(1.05)`;
  else if (hurt) transform = `translateX(${dir * -14}px) rotate(${dir * -3}deg)`;
  return (
    <div
      className="relative w-36 overflow-hidden rounded-md border border-border bg-bg-deep sm:w-48"
      style={{
        aspectRatio: "3 / 4",
        transform,
        transition: "transform 160ms ease-out, filter 300ms, opacity 300ms, box-shadow 300ms",
        filter: ko ? "grayscale(1) brightness(0.6)" : hurt ? "brightness(1.5) saturate(1.3)" : "none",
        opacity: ko ? 0.75 : 1,
        boxShadow: won ? "0 0 0 2px var(--color-gold), 0 0 36px color-mix(in oklab, var(--color-gold) 55%, transparent)" : "none",
        zIndex: lunging ? 2 : 1,
      }}
    >
      <GodPhoto god={god} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-transparent" />
      <EmblemMark name={god.emblem} className="absolute top-2 left-2 size-6 text-gold" />
      <p className="absolute right-2 bottom-2 left-2 font-display text-xl text-fg sm:text-2xl">{god.name}</p>
    </div>
  );
}

function HealthBar({ name, hp, side, tone }: { name: string; hp: number; side: "L" | "R"; tone: string }) {
  return (
    <div className={cn("min-w-0 flex-1", side === "R" && "text-right")}>
      <p className="mb-1 truncate text-xs tracking-kicker text-fg uppercase">{name}</p>
      <div className="h-3 overflow-hidden rounded-full bg-bg-deep">
        <div
          className={cn("h-full rounded-full", side === "R" && "ml-auto")}
          style={{ width: `${Math.max(0, hp)}%`, background: tone, transition: "width 380ms ease-out" }}
        />
      </div>
    </div>
  );
}

function BattleArena({ left, right }: { left: God; right: God }) {
  const [phase, setPhase] = useState<BattlePhase>("idle");
  const [hp, setHp] = useState<[number, number]>([100, 100]);
  const [lunging, setLunging] = useState<"L" | "R" | null>(null);
  const [hurt, setHurt] = useState<"L" | "R" | null>(null);
  const [pop, setPop] = useState<{ text: string; n: number } | null>(null);
  const [winnerSide, setWinnerSide] = useState<"L" | "R" | null>(null);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => clear, []);
  // A new pairing wipes the arena.
  useEffect(() => {
    clear();
    setPhase("idle");
    setHp([100, 100]);
    setLunging(null);
    setHurt(null);
    setPop(null);
    setWinnerSide(null);
  }, [left.id, right.id]);

  const pLeft = winChance(left, right);
  const leftPct = Math.round(pLeft * 100);
  const rightPct = 100 - leftPct;
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function fight() {
    clear();
    const leftWins = Math.random() < pLeft;
    const win: "L" | "R" = leftWins ? "L" : "R";
    const lose: "L" | "R" = leftWins ? "R" : "L";
    const pWin = leftWins ? pLeft : 1 - pLeft;
    const winnerEnd = Math.round(Math.min(78, Math.max(14, 20 + 60 * (pWin - 0.5) * 2 + (Math.random() * 12 - 6))));
    setWinnerSide(null);
    setHp([100, 100]);
    setPhase("fighting");

    // Seven exchanges: the winner lands four, the loser three.
    const order: Array<"W" | "L"> = ["W", "L", "W", "L", "W", "L", "W"];
    const step = reduced ? 120 : 700;
    let hpW = 100;
    let hpL = 100;
    order.forEach((who, i) => {
      const at = 500 + i * step;
      const attacker = who === "W" ? win : lose;
      const defender = who === "W" ? lose : win;
      timers.current.push(
        window.setTimeout(() => {
          if (who === "W") hpL = i === order.length - 1 ? 0 : Math.max(8, hpL - (100 / 4) * (0.8 + Math.random() * 0.4));
          else hpW = Math.max(winnerEnd, hpW - ((100 - winnerEnd) / 3) * (0.8 + Math.random() * 0.4));
          const next: [number, number] = [0, 0];
          next[win === "L" ? 0 : 1] = Math.round(hpW);
          next[lose === "L" ? 0 : 1] = Math.round(hpL);
          setLunging(attacker);
          setHurt(defender);
          setPop({ text: POPS[Math.floor(Math.random() * POPS.length)], n: i });
          setHp(next);
          playTone(150 + Math.random() * 90, 0.09, 0.05);
          timers.current.push(window.setTimeout(() => setLunging(null), reduced ? 60 : 200));
          timers.current.push(window.setTimeout(() => setHurt(null), reduced ? 100 : 320));
        }, at),
      );
    });
    timers.current.push(
      window.setTimeout(() => {
        setPop(null);
        setWinnerSide(win);
        setPhase("done");
        playSeal();
      }, 500 + order.length * step + (reduced ? 100 : 500)),
    );
  }

  const winner = winnerSide === "L" ? left : winnerSide === "R" ? right : null;
  const loser = winnerSide === "L" ? right : winnerSide === "R" ? left : null;
  let reason = "";
  let upset = false;
  if (winner && loser) {
    let best: { label: string; a: number; b: number; gap: number } | null = null;
    for (const [key, label] of STAT_KEYS) {
      const a = winner.stats[key as StatKey];
      const b = loser.stats[key as StatKey];
      if (a - b > (best?.gap ?? 0)) best = { label, a, b, gap: a - b };
    }
    reason = best ? `Won on ${best.label.toLowerCase()} (${best.a} vs ${best.b}).` : "Won on fortune alone.";
    upset = (winnerSide === "L" ? pLeft : 1 - pLeft) < 0.5;
  }

  return (
    <div className="mt-8 border-t border-border pt-8">
      <div className="flex justify-center">
        <button
          type="button"
          disabled={phase === "fighting"}
          onClick={fight}
          className="pressable inline-flex min-h-12 items-center rounded-sm bg-primary px-8 text-sm tracking-kicker text-primary-fg uppercase disabled:opacity-60"
        >
          {phase === "idle" ? "Battle" : phase === "fighting" ? "Fighting…" : "Battle again"}
        </button>
      </div>

      {phase !== "idle" ? (
        <div className="panel-in mt-6 overflow-hidden rounded-md border border-border bg-bg-deep p-4 sm:p-6">
          <div className="flex items-start gap-4 sm:gap-8">
            <HealthBar name={left.name} hp={hp[0]} side="L" tone="var(--color-primary)" />
            <HealthBar name={right.name} hp={hp[1]} side="R" tone="var(--color-wine)" />
          </div>
          <div className="relative mt-5 flex min-h-64 items-center justify-between gap-2 sm:min-h-80 sm:px-10">
            <BattleCard god={left} side="L" lunging={lunging === "L"} hurt={hurt === "L"} ko={winnerSide === "R"} won={winnerSide === "L"} />
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              {pop ? (
                <span key={pop.n} className="battle-pop font-display text-4xl text-gold sm:text-6xl">
                  {pop.text}
                </span>
              ) : null}
              {winnerSide ? <span className="battle-pop font-display text-5xl text-wine sm:text-7xl">K.O.!</span> : null}
            </div>
            <BattleCard god={right} side="R" lunging={lunging === "R"} hurt={hurt === "R"} ko={winnerSide === "L"} won={winnerSide === "R"} />
          </div>
        </div>
      ) : null}

      {winner ? (
        <div className="panel-in mt-6 text-center">
          <p className="text-xs tracking-kicker text-muted uppercase">{upset ? "Winner · an upset" : "Winner"}</p>
          <p className="mt-1 font-display text-5xl text-gold">{winner.name}</p>
          <p className="mt-2 text-sm text-fg">{reason}</p>
          <p className="mt-1 text-xs text-muted">
            Odds: {left.name} {leftPct}% · {right.name} {rightPct}%. A temple game, not a canon.
          </p>
        </div>
      ) : phase === "idle" ? (
        <p className="mt-4 text-center text-xs text-muted">
          Odds before the fight: {left.name} {leftPct}% · {right.name} {rightPct}%.
        </p>
      ) : null}
    </div>
  );
}

export function CompareLab() {
  const leftId = useArchiveStore((state) => state.compareLeft);
  const rightId = useArchiveStore((state) => state.compareRight);
  const setCompare = useArchiveStore((state) => state.setCompare);
  const left = getGod(leftId) ?? gods[0];
  const right = getGod(rightId) ?? gods[1];
  if (!left || !right) return null;

  const leads = STAT_KEYS.reduce(
    (count, [key]) => count + (left.stats[key as StatKey] === right.stats[key as StatKey] ? 0 : left.stats[key as StatKey] > right.stats[key as StatKey] ? 1 : 0),
    0,
  );

  return (
    <div className="rounded-md bg-surface p-4 shadow-border sm:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <GodSelect label="Left" value={left.id} onChange={(id) => setCompare("left", id)} />
        <GodSelect label="Right" value={right.id} onChange={(id) => setCompare("right", id)} />
      </div>
      <p className="mt-4 text-sm text-muted">
        {left.name} leads in {leads} of {STAT_KEYS.length}. These bars are temple measures for play, not a canon.
      </p>
      <div key={`${left.id}-${right.id}`} className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-4 font-display text-2xl">{left.name}</h3>
          <div className="space-y-3">
            {STAT_KEYS.map(([key, label], index) => (
              <StatRow key={key} label={label} value={left.stats[key]} delay={index * 40} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-display text-2xl">{right.name}</h3>
          <div className="space-y-3">
            {STAT_KEYS.map(([key, label], index) => (
              <StatRow key={key} label={label} value={right.stats[key]} delay={index * 40} bar="var(--color-wine)" />
            ))}
          </div>
        </div>
      </div>
      <BattleArena left={left} right={right} />
    </div>
  );
}

function GodSelect({ label, value, onChange }: { label: string; value: string; onChange: (id: string) => void }) {
  return (
    <label className="block text-xs tracking-kicker text-muted uppercase">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-sm border border-border bg-bg px-3 text-base text-fg normal-case"
      >
        {gods.map((god) => (
          <option key={god.id} value={god.id}>
            {god.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TimelineList({ items }: { items: TimelineEvent[] }) {
  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute top-1.5 -left-[1.7rem] size-2.5 rounded-full bg-primary" />
          <p className="text-xs tracking-kicker text-gold uppercase">
            {item.age} · {item.when}
          </p>
          <h3 className="mt-1 font-display text-2xl text-fg">{item.title}</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}

export { timeline };
