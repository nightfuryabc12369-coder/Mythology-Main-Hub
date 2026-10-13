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
import {
  AGE_COUNTS,
  currentTarget,
  drawAgeQuiz,
  drawCreatureQuiz,
  getCreature,
  getRarity,
  needsMore,
  scoreAge,
  scoreCreature,
  type AgeQuestion,
  type CreatureAnswer,
  type CreatureQuestion,
} from "@/data/creatures";
import { playSeal, playTone } from "@/lib/audio";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/identity")({
  validateSearch: (search: Record<string, unknown>): { mode?: "level" | "creature" | "age" } =>
    search.mode === "level" || search.mode === "creature" || search.mode === "age" ? { mode: search.mode } : {},
  head: () => ({ meta: [{ title: "Find who you are · Aether Codex" }] }),
  component: IdentityPage,
});

type Question = { id: string; prompt: string; options: Array<{ text: string }> };

function IdentityPage() {
  const { mode } = Route.useSearch();
  const hydrated = useArchiveStore((state) => state.hydrated);
  const identity = useArchiveStore((state) => state.identity);
  const creature = useArchiveStore((state) => state.creature);

  if (!hydrated) return <Shell>{null}</Shell>;
  // Each one-shot quiz decides whether it is locked once, when it opens, so its own result screen stays visible.
  if (mode === "creature") return <CreatureQuiz key="creature" />;
  if (mode === "age") return creature ? <AgeQuiz key="age" /> : <CreatureQuiz key="creature" />;
  // The level quiz needs a god first.
  if (mode === "level" && identity) return <LevelQuiz key={`level-${identity.at}`} godId={identity.godId} />;
  return <GodQuiz key="god" />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto min-h-[100svh] max-w-3xl px-4 pt-28 pb-24 sm:px-6">{children}</main>;
}

function Progress({ index, total, more }: { index: number; total: number; more?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs tracking-kicker text-muted uppercase">
        <span>
          Question {Math.min(index + 1, total)}
          {more ? "" : ` of ${total}`}
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
  more,
  noBack,
}: {
  more?: boolean;
  noBack?: boolean;
  question: Question;
  index: number;
  total: number;
  chosen: number | null;
  onPick: (optionIndex: number) => void;
  onBack: () => void;
}) {
  return (
    <div>
      <Progress index={index} total={total} more={more} />
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
          disabled={noBack || index === 0 || chosen !== null}
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
  const [locked] = useState(() => {
    const state = useArchiveStore.getState();
    return Boolean(state.identity) && state.changes.identity !== 1;
  });
  const [retake] = useState(() => useArchiveStore.getState().changes.identity === 1 && Boolean(useArchiveStore.getState().identity));

  useEffect(() => {
    setQuestions(drawIdentityQuiz());
    return () => window.clearTimeout(timer.current);
  }, []);

  if (locked) return <Locked kind="god" />;

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
            <p className="mx-auto mt-6 max-w-xl text-sm text-muted">{retake ? "Your one change has been used, so this can't be changed again. " : ""}Saved. It now shows on the home page, and you can open it for the full history.</p>
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

/** Shown when someone comes back to a one-shot quiz that is already done. */
function Locked({ kind }: { kind: "god" | "creature" | "age" }) {
  const result = useArchiveStore((state) => state.creature);
  const creature = getCreature(result?.creatureId);
  const changes = useArchiveStore((state) => state.changes);
  const wished = kind === "god" ? changes.identity : changes.creature;
  return (
    <Shell>
      <div className="panel-in text-center">
        <p className="text-xs tracking-kicker text-gold uppercase">{kind === "age" ? "Already told" : "Already found"}</p>
        <h1 className="mt-4 font-display text-4xl text-fg sm:text-6xl">{kind === "age" ? "Its age is settled" : "This quiz can't be retaken"}</h1>
        <p className="mx-auto mt-6 max-w-xl text-sm text-muted">
          {kind === "creature" && creature ? `Your creature is the ${creature.name}. ` : ""}
          {kind === "age" && result?.age ? `It is ${result.age.text}. ` : ""}
          {kind === "age"
            ? "The window on the home page keeps it for you."
            : wished === 2
              ? "You already used your one change wish. This result is final."
              : "The only way to change it is the one-time change wish in the Pantheon, and it can be used once."}
        </p>
        <Link to="/" className="pressable mt-8 inline-flex min-h-12 items-center rounded-sm bg-primary px-5 text-sm text-primary-fg">
          Back to the home page
        </Link>
      </div>
    </Shell>
  );
}

/** Quiz A: adaptive length. Common answers end early on a common creature; rarer answers keep asking. */
function CreatureQuiz() {
  const sound = useArchiveStore((state) => state.sound);
  const setCreature = useArchiveStore((state) => state.setCreature);
  const [questions, setQuestions] = useState<CreatureQuestion[] | null>(null);
  const [answers, setAnswers] = useState<CreatureAnswer[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const timer = useRef<number>(0);
  const [locked] = useState(() => {
    const state = useArchiveStore.getState();
    return Boolean(state.creature) && state.changes.creature !== 1;
  });

  useEffect(() => {
    setQuestions(drawCreatureQuiz());
    return () => window.clearTimeout(timer.current);
  }, []);

  if (locked) return <Locked kind="creature" />;

  if (resultId) {
    const creature = getCreature(resultId);
    if (creature) {
      const rarity = getRarity(creature.rarity);
      return (
        <Shell>
          <div className="panel-in text-center">
            <p className="text-xs tracking-kicker text-gold uppercase">Your creature is a {rarity.label.toLowerCase()}</p>
            <div className="mx-auto mt-6 flex size-28 items-center justify-center rounded-full border border-primary/60 bg-surface shadow-glow">
              <EmblemMark name={creature.god.emblem} className="size-12 text-gold" />
            </div>
            <h1 className="mt-6 font-display text-5xl text-fg uppercase sm:text-7xl">{creature.name}</h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-fg">{creature.god.line}</p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted">{rarity.blurb}</p>
            <p className="mx-auto mt-6 max-w-xl text-sm text-muted">
              Saved for good. This quiz can't be retaken. The window on the home page is now your creature: open it for the full details.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/identity" search={{ mode: "age" }} className="pressable inline-flex min-h-12 items-center rounded-sm bg-primary px-5 text-sm text-primary-fg">
                Find out about it
              </Link>
              <Link to="/" className="pressable inline-flex min-h-12 items-center rounded-sm border border-border px-5 text-sm text-fg">
                Back to the home page
              </Link>
            </div>
          </div>
        </Shell>
      );
    }
  }

  if (!questions) return <Shell>{null}</Shell>;
  const index = answers.length;
  const question = questions[index];
  if (!question) return <Shell>{null}</Shell>;

  function pick(optionIndex: number) {
    if (chosen !== null || !questions) return;
    if (sound) playTone(350 + index * 22, 0.12, 0.03);
    setChosen(optionIndex);
    const option = questions[index].options[optionIndex];
    timer.current = window.setTimeout(() => {
      const next = [...answers, { r: option.r, w: option.w }];
      setChosen(null);
      if (!needsMore(next)) {
        const creature = scoreCreature(next);
        setCreature(creature.id, creature.rarity);
        if (sound) playSeal();
        setAnswers(next);
        setResultId(creature.id);
      } else {
        setAnswers(next);
      }
    }, 260);
  }

  const total = currentTarget(answers);
  return (
    <Shell>
      <QuestionCard
        question={question}
        index={index}
        total={total}
        more
        noBack
        chosen={chosen}
        onPick={pick}
        onBack={() => undefined}
      />
    </Shell>
  );
}

/** Quiz B: how old is the creature. Its rarity caps the answer. */
function AgeQuiz() {
  const sound = useArchiveStore((state) => state.sound);
  const result = useArchiveStore((state) => state.creature);
  const setCreatureAge = useArchiveStore((state) => state.setCreatureAge);
  const creature = getCreature(result?.creatureId);
  const [questions, setQuestions] = useState<AgeQuestion[] | null>(null);
  const [points, setPoints] = useState<number[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [done, setDone] = useState<{ label: string; age: string; blurb: string } | null>(null);
  const timer = useRef<number>(0);
  const [locked] = useState(() => Boolean(useArchiveStore.getState().creature?.age));

  useEffect(() => {
    if (result) setQuestions(drawAgeQuiz(result.rarity));
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (locked) return <Locked kind="age" />;
  if (!creature || !result) return <Shell>{null}</Shell>;

  if (done) {
    return (
      <Shell>
        <div className="panel-in text-center">
          <p className="text-xs tracking-kicker text-gold uppercase">About your {creature.name}</p>
          <h1 className="mt-4 font-display text-5xl text-fg uppercase sm:text-7xl">{done.label}</h1>
          <p className="mt-3 font-display text-xl text-gold sm:text-2xl">{done.age}</p>
          <p className="mx-auto mt-8 max-w-xl text-sm text-muted">{done.blurb}</p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted">Saved for good. This quiz can't be retaken.</p>
          <Link to="/" className="pressable mt-8 inline-flex min-h-12 items-center rounded-sm bg-primary px-5 text-sm text-primary-fg">
            Back to the home page
          </Link>
        </div>
      </Shell>
    );
  }

  if (!questions) return <Shell>{null}</Shell>;
  const total = AGE_COUNTS[result.rarity];
  const index = points.length;
  const question = questions[index];
  if (!question) return <Shell>{null}</Shell>;

  function pick(optionIndex: number) {
    if (chosen !== null || !questions || !creature) return;
    if (sound) playTone(300 + index * 26, 0.12, 0.03);
    setChosen(optionIndex);
    const value = questions[index].options[optionIndex].points;
    timer.current = window.setTimeout(() => {
      const next = [...points, value];
      setChosen(null);
      setPoints(next);
      if (next.length >= total) {
        const scored = scoreAge(creature, next);
        setCreatureAge({ stage: scored.stage, label: scored.label, text: scored.age });
        if (sound) playSeal();
        setDone({ label: scored.label, age: scored.age, blurb: scored.blurb });
      }
    }, 260);
  }

  return (
    <Shell>
      <p className="mb-6 text-sm text-muted">
        Age quiz for your <span className="text-gold">{creature.name}</span>
      </p>
      <QuestionCard question={question} index={index} total={total} noBack chosen={chosen} onPick={pick} onBack={() => undefined} />
    </Shell>
  );
}
