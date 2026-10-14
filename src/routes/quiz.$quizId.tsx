import { getQuiz, tierFor, type QuizQuestion } from "@/data/quizzes";
import { DRACHMAS_PER_CORRECT, CURRENCY } from "@/data/shop";
import { useArchiveStore } from "@/lib/archive-store";
import { playSeal, playTone } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/quiz/$quizId")({
  head: () => ({ meta: [{ title: "Quiz · Aether Codex" }] }),
  component: QuizPage,
});

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto min-h-[100svh] max-w-3xl px-4 pt-28 pb-24 sm:px-6">{children}</main>;
}

function QuizPage() {
  const { quizId } = Route.useParams();
  const quiz = getQuiz(quizId);
  const sound = useArchiveStore((state) => state.sound);
  const recordQuiz = useArchiveStore((state) => state.recordQuiz);
  const earn = useArchiveStore((state) => state.earn);
  const [run, setRun] = useState(0);
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [earned, setEarned] = useState<string | null>(null);
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!quiz) {
    return (
      <Shell>
        <h1 className="font-display text-4xl text-fg">That quiz is not in the hall</h1>
        <Link to="/play" className="pressable mt-6 inline-flex min-h-12 items-center rounded-sm bg-primary px-5 text-sm text-primary-fg">
          Back to quizzes
        </Link>
      </Shell>
    );
  }

  function start() {
    if (!quiz) return;
    setQuestions(quiz.build());
    setIndex(0);
    setScore(0);
    setPicked(null);
    setEarned(null);
    setStarted(true);
    setRun((value) => value + 1);
  }

  function choose(option: string) {
    if (!quiz || picked !== null) return;
    const question = questions[index];
    const correct = option === question.answer;
    const nextScore = score + (correct ? 1 : 0);
    setPicked(option);
    if (correct) setScore(nextScore);
    if (sound) playTone(correct ? 520 : 180, 0.14, 0.04);
    timer.current = window.setTimeout(() => {
      setPicked(null);
      if (index + 1 >= questions.length) {
        const tier = tierFor(nextScore, questions.length);
        const label = quiz.titles[tier];
        recordQuiz(quiz.id, { score: nextScore, total: questions.length, tier, label, at: Date.now() });
        earn(nextScore * DRACHMAS_PER_CORRECT);
        setEarned(label);
        if (sound) playSeal();
      }
      setIndex((value) => value + 1);
    }, 900);
  }

  if (!started) {
    return (
      <Shell>
        <p className="text-xs tracking-kicker text-gold uppercase">{quiz.section}</p>
        <h1 className="mt-3 font-display text-5xl text-fg uppercase sm:text-6xl">{quiz.title}</h1>
        <p className="mt-4 max-w-xl text-muted">{quiz.blurb} Every correct answer earns {DRACHMAS_PER_CORRECT} {CURRENCY}.</p>
        <div className="mt-8 rounded-md bg-surface p-5 shadow-border">
          <p className="text-xs tracking-kicker text-subtle uppercase">Titles you can earn</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {quiz.titles.map((title, i) => (
              <li key={title} className="flex justify-between gap-4 text-fg">
                <span>{title}</span>
                <span className="text-muted">{i === 0 ? "Any score" : i === 1 ? "Half right or more" : "Four in five or more"}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={start} className="pressable min-h-12 rounded-sm bg-primary px-6 text-sm text-primary-fg">
            Start the quiz
          </button>
          <Link to="/play" className="pressable inline-flex min-h-12 items-center rounded-sm border border-border px-6 text-sm text-fg">
            Back to quizzes
          </Link>
        </div>
      </Shell>
    );
  }

  if (index >= questions.length) {
    return (
      <Shell>
        <div className="panel-in text-center">
          <p className="text-xs tracking-kicker text-gold uppercase">
            {quiz.title} · {score} of {questions.length}
          </p>
          <h1 className="mt-4 font-display text-4xl text-fg uppercase sm:text-6xl">{earned}</h1>
          <p className="mt-5 font-display text-2xl text-gold">
            +{score * DRACHMAS_PER_CORRECT} {CURRENCY}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-sm text-muted">
            This title is saved to your profile as a label. If you replay and earn a higher one, it replaces it. A lower one never does.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={start} className="pressable min-h-12 rounded-sm bg-primary px-6 text-sm text-primary-fg">
              Play again
            </button>
            <Link to="/shop" className="pressable inline-flex min-h-12 items-center rounded-sm border border-border px-6 text-sm text-fg">
              Spend in the shop
            </Link>
            <Link to="/profile" className="pressable inline-flex min-h-12 items-center rounded-sm border border-border px-6 text-sm text-fg">
              See my titles
            </Link>
            <Link to="/play" className="pressable inline-flex min-h-12 items-center rounded-sm border border-border px-6 text-sm text-fg">
              More quizzes
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  const question = questions[index];
  return (
    <Shell>
      <div key={`${run}-${index}`} className="panel-in">
        <div className="flex items-center justify-between text-xs tracking-kicker text-muted uppercase">
          <span>
            {quiz.title} · Question {index + 1} of {questions.length}
          </span>
          <span>{score} right</span>
        </div>
        <div className="mt-3 flex gap-1.5" aria-hidden>
          {questions.map((_, i) => (
            <div key={i} className={cn("h-1.5 flex-1 rounded-full", i < index ? "bg-primary" : i === index ? "bg-primary/60" : "bg-bg-deep")} />
          ))}
        </div>
        <h2 className="mt-8 font-display text-3xl text-fg sm:text-4xl">{question.prompt}</h2>
        <div className="mt-8 grid gap-3">
          {question.options.map((option) => {
            const isAnswer = option === question.answer;
            const state = picked === null ? "idle" : isAnswer ? "right" : picked === option ? "wrong" : "idle";
            return (
              <button
                key={option}
                type="button"
                disabled={picked !== null}
                onClick={() => choose(option)}
                className={cn(
                  "pressable min-h-14 rounded-md border px-5 text-left text-base",
                  state === "right" ? "border-gold bg-gold/20 text-fg" : state === "wrong" ? "border-red-400/70 bg-red-400/10 text-fg" : "border-border bg-surface text-fg",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
        <Link to="/play" className="mt-8 inline-flex min-h-11 items-center text-xs tracking-kicker text-subtle uppercase">
          Leave the quiz
        </Link>
      </div>
    </Shell>
  );
}
