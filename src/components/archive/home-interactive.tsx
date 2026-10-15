import { GodPhoto } from "@/components/archive/cards";
import { EmblemMark } from "@/components/archive/emblem";
import { StatRow } from "@/components/archive/widgets";
import { gods, getGod } from "@/data/gods";
import type { God } from "@/data/types";
import { STAT_KEYS, type StatKey, type TimelineEvent } from "@/data/types";
import { epithetLines, epithets, myths, timeline } from "@/data/world";
import { playSeal, playTone } from "@/lib/audio";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function MoteField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 18 }, (_, index) => (
        <span key={index} className="mote" style={{ ["--i" as string]: String(index), left: `${(index * 53) % 100}%` }} />
      ))}
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
