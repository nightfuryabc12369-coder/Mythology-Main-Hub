import { EmblemMark } from "@/components/archive/emblem";
import { getGod } from "@/data/gods";
import {
  IDENTITY_COUNT,
  LEVELS,
  LEVEL_COUNT,
  archetypeTitle,
  drawIdentityQuiz,
  drawLevelQuiz,
  fullTitle,
  getArchetype,
  scoreIdentity,
  scoreLevel,
  type IdentityQuestion,
  type LevelId,
  type LevelQuestion,
  type Weights,
} from "@/data/identity";
import { playSeal, playTone } from "@/lib/audio";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/identity")({
  validateSearch: (search: Record<string, unknown>): { mode?: "level" } => (search.mode === "level" ? { mode: "level" } : {}),
  head: () => ({ meta: [{ title: "Choose who you are · Aether Codex" }] }),
  component: IdentityPage,
});

type Question = { id: string; prompt: string; options: Array<{ text: string }> };

function IdentityPage() {
  const { mode } = Route.useSearch();
  const hydrated = useArchiveStore((state) => state.hydrated);
  const identity = useArchiveStore((state) => state.identity);

  if (!hydrated) return <Shell>{null}</Shell>;
  // The level quiz needs a god first.
  if (mode === "level" && identity) return <LevelQuiz key={`level-${identity.at}`} godId={identity.godId} />;
  return <GodQuiz key="god" />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto min-h-[100svh] max-w-3xl px-4 pt-28 pb-24 sm:px-6">{children}</main>;
}

function Progress({ index, total }: { index: number; total: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs tracking-kicker text-muted uppercase">
        <span>
          Question {Math.min(index + 1, total)} of {total}
        </span>
      </div>
      <div className="mt-2 flex gap-1" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", i < index ? "bg-primary" : i === index ? "bg-gold/70" : "bg-surface")} />
        ))}
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  total,
  chosen,
  onPick,
  onBack,
}: {
  question: Question;
  index: number;
  total: number;
  chosen: number | null;
  onPick: (optionIndex: number) => void;
  onBack: () => void;
}) {
  return (
    <div>
      <Progress index={index} total={total} />
      <div key={question.id} className="panel-in mt-8">
        <h1 className="font-display text-2xl text-fg sm:text-4xl">{question.prompt}</h1>
        <div className="mt-8 grid gap-3" role="group" aria-label="Answers">
          {question.options.map((option, i) => (
            <button
              key={option.text}
              type="button"
              disabled={chosen !== null}
              aria-pressed={chosen === i}
              onClick={() => onPick(i)}
              className={cn(
                "pressable min-h-14 rounded-md border px-4 py-3 text-left text-base transition-colors duration-150",
                chosen === i ? "border-primary bg-primary/15 text-fg" : "border-border bg-surface text-fg/90 hover:border-primary/60",
              )}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={index === 0 || chosen !== null}
          className="pressable inline-flex min-h-11 items-center rounded-sm border border-border px-4 text-xs tracking-kicker text-muted uppercase disabled:opacity-40"
        >
          Back
        </button>
        <Link to="/" className="inline-flex min-h-11 items-center text-xs tracking-kicker text-subtle uppercase">
          Leave the quiz
        </Link>
      </div>
    </div>
  );
}

/** Quiz 1: ten random questions, then the god. */
function GodQuiz() {
  const sound = useArchiveStore((state) => state.sound);
  const setIdentity = useArchiveStore((state) => state.setIdentity);
  const [questions, setQuestions] = useState<IdentityQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Weights[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const timer = useRef<number>(0);

  useEffect(() => {
    setQuestions(drawIdentityQuiz());
    return () => window.clearTimeout(timer.current);
  }, []);

  function restart() {
    setQuestions(drawIdentityQuiz());
    setAnswers([]);
    setChosen(null);
    setResultId(null);
  }

  if (resultId) {
    const archetype = getArchetype(resultId);
    const god = getGod(resultId);
    if (archetype && god) {
      return (
        <Shell>
          <div className="panel-in text-center">
            <p className="text-xs tracking-kicker text-gold uppercase">Your answers say you are the</p>
            <div className="mx-auto mt-6 flex size-28 items-center justify-center rounded-full border border-primary/60 bg-surface shadow-glow">
              <EmblemMark name={god.emblem} className="size-12 text-gold" />
            </div>
            <h1 className="mt-6 font-display text-5xl text-fg uppercase sm:text-7xl">{archetypeTitle(archetype)}</h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-fg">{archetype.tagline}</p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted">{archetype.reading}</p>
            <p className="mx-auto mt-6 max-w-xl text-sm text-muted">Saved. It now shows on the home page, and you can open it for the full history.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/identity"
                search={{ mode: "level" }}
                className="pressable inline-flex min-h-12 items-center rounded-sm bg-primary px-5 text-sm text-primary-fg"
              >
                Choose your level
              </Link>
              <Link to="/" className="pressable inline-flex min-h-12 items-center rounded-sm border border-border px-5 text-sm text-fg">
                Back to the home page
              </Link>
              <button type="button" onClick={restart} className="pressable inline-flex min-h-12 items-center rounded-sm border border-border px-5 text-sm text-muted">
                Take it again
              </button>
            </div>
          </div>
        </Shell>
      );
    }
  }

  if (!questions) return <Shell>{null}</Shell>;
  const index = answers.length;
  const question = questions[index];

  function pick(optionIndex: number) {
    if (chosen !== null || !questions) return;
    if (sound) playTone(330 + index * 24, 0.12, 0.03);
    setChosen(optionIndex);
    const weights = questions[index].options[optionIndex].w;
    timer.current = window.setTimeout(() => {
      const next = [...answers, weights];
      setChosen(null);
      if (next.length >= IDENTITY_COUNT) {
        const result = scoreIdentity(next);
        setIdentity(result.godId);
        if (sound) playSeal();
        setAnswers(next);
        setResultId(result.godId);
      } else {
        setAnswers(next);
      }
    }, 260);
  }

  return (
    <Shell>
      <QuestionCard
        question={question}
        index={index}
        total={IDENTITY_COUNT}
        chosen={chosen}
        onPick={pick}
        onBack={() => setAnswers((current) => current.slice(0, -1))}
      />
    </Shell>
  );
}

/** Quiz 2: eight random questions, then the level of your god. */
function LevelQuiz({ godId }: { godId: string }) {
  const sound = useArchiveStore((state) => state.sound);
  const setIdentityLevel = useArchiveStore((state) => state.setIdentityLevel);
  const [questions, setQuestions] = useState<LevelQuestion[] | null>(null);
  const [points, setPoints] = useState<number[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [result, setResult] = useState<{ level: LevelId; percent: number } | null>(null);
  const timer = useRef<number>(0);
  const archetype = getArchetype(godId);
  const god = getGod(godId);

  useEffect(() => {
    setQuestions(drawLevelQuiz());
    return () => window.clearTimeout(timer.current);
  }, []);

  function restart() {
    setQuestions(drawLevelQuiz());
    setPoints([]);
    setChosen(null);
    setResult(null);
  }

  if (!archetype || !god) return <GodQuiz />;

  if (result) {
    const info = LEVELS.find((entry) => entry.id === result.level) ?? LEVELS[0];
    return (
      <Shell>
        <div className="panel-in text-center">
          <p className="text-xs tracking-kicker text-gold uppercase">Your level</p>
          <h1 className="mt-4 font-display text-5xl text-fg uppercase sm:text-7xl">{info.label}</h1>
          <p className="mt-3 font-display text-xl text-gold sm:text-2xl">{fullTitle(archetype, result.level)}</p>
          <div className="mx-auto mt-8 flex max-w-md gap-1.5" role="img" aria-label={`${info.label} of four levels`}>
            {LEVELS.map((entry, i) => (
              <div key={entry.id} className="flex-1">
                <div className={cn("h-1.5 rounded-full", i <= LEVELS.indexOf(info) ? "bg-primary" : "bg-surface")} />
                <p className={cn("mt-1.5 text-[10px] tracking-kicker uppercase", entry.id === info.id ? "text-gold" : "text-subtle")}>{entry.label}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-sm text-muted">{info.blurb}</p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted">
            This level shows on the home page now. Retake the quiz and your answers may place you somewhere else.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="pressable inline-flex min-h-12 items-center rounded-sm bg-primary px-5 text-sm text-primary-fg">
              Back to the home page
            </Link>
            <button type="button" onClick={restart} className="pressable inline-flex min-h-12 items-center rounded-sm border border-border px-5 text-sm text-muted">
              Take it again
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  if (!questions) return <Shell>{null}</Shell>;
  const index = points.length;
  const question = questions[index];

  function pick(optionIndex: number) {
    if (chosen !== null || !questions) return;
    if (sound) playTone(300 + index * 28, 0.12, 0.03);
    setChosen(optionIndex);
    const value = questions[index].options[optionIndex].points;
    timer.current = window.setTimeout(() => {
      const next = [...points, value];
      setChosen(null);
      if (next.length >= LEVEL_COUNT) {
        const scored = scoreLevel(next);
        setIdentityLevel(scored.level.id);
        if (sound) playSeal();
        setPoints(next);
        setResult({ level: scored.level.id, percent: scored.percent });
      } else {
        setPoints(next);
      }
    }, 260);
  }

  return (
    <Shell>
      <p className="mb-6 text-sm text-muted">
        Level quiz for the <span className="text-gold">{archetypeTitle(archetype)}</span>
      </p>
      <QuestionCard
        question={question}
        index={index}
        total={LEVEL_COUNT}
        chosen={chosen}
        onPick={pick}
        onBack={() => setPoints((current) => current.slice(0, -1))}
      />
    </Shell>
  );
}
