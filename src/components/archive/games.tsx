import { Portal } from "@/components/archive/identity";
import { gods } from "@/data/gods";
import type { God } from "@/data/types";
import { useArchiveStore } from "@/lib/archive-store";
import { playSeal, playTone } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Tab = "quizzes" | "worldle" | "scramble";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "quizzes", label: "Quizzes" },
  { id: "worldle", label: "Worldle" },
  { id: "scramble", label: "Word scramble" },
];

function shuffled<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** "The Minotaur" -> "MINOTAUR", "Dionysus" -> "DIONYSUS". Letters only. */
function wordOf(god: God): string {
  const first = god.name.replace(/^The\s+/i, "").split(/\s+/)[0] ?? "";
  return first
    .normalize("NFD")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();
}

type Entry = { word: string; god: God };

function entriesBetween(min: number, max: number): Entry[] {
  const seen = new Set<string>();
  const out: Entry[] = [];
  for (const god of gods) {
    const word = wordOf(god);
    if (word.length < min || word.length > max || seen.has(word)) continue;
    seen.add(word);
    out.push({ word, god });
  }
  return out;
}

export function GamesWindow({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("quizzes");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  return (
    <Portal>
      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overscroll-contain bg-bg-deep/85 p-3 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Quizzes and games"
          onClick={onClose}
        >
          <div
            className="panel-in flex max-h-[94svh] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-border bg-surface"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 pt-5 pb-4 sm:px-8">
              <div>
                <p className="text-xs tracking-kicker text-gold uppercase">The play hall</p>
                <h2 className="mt-1 font-display text-3xl text-fg sm:text-4xl">Quizzes &amp; games</h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="pressable inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-bg/70 text-lg text-fg"
              >
                ×
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto border-b border-border px-5 py-3 sm:px-8" role="tablist">
              {TABS.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === entry.id}
                  onClick={() => setTab(entry.id)}
                  className={cn(
                    "pressable min-h-10 shrink-0 rounded-full px-4 text-xs tracking-kicker uppercase",
                    tab === entry.id ? "bg-primary text-primary-fg" : "border border-border text-muted",
                  )}
                >
                  {entry.label}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto overscroll-contain px-5 py-6 sm:px-8">
              {tab === "quizzes" ? <Quizzes onNavigate={onClose} /> : null}
              {tab === "worldle" ? <Worldle /> : null}
              {tab === "scramble" ? <Scramble /> : null}
            </div>
          </div>
        </div>
      ) : null}
    </Portal>
  );
}

// ── Quizzes ──────────────────────────────────────────────────────────────────────

function Quizzes({ onNavigate }: { onNavigate: () => void }) {
  const creature = useArchiveStore((state) => state.creature);
  const identity = useArchiveStore((state) => state.identity);
  const [trivia, setTrivia] = useState(false);

  if (trivia) return <Trivia onBack={() => setTrivia(false)} />;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        to="/identity"
        onClick={onNavigate}
        className="pressable block rounded-md border border-border bg-bg/60 p-5"
      >
        <p className="text-xs tracking-kicker text-gold uppercase">Quiz</p>
        <h3 className="mt-2 font-display text-2xl text-fg">Find who you are</h3>
        <p className="mt-2 text-sm text-muted">Ten questions. The answers decide which god you would be.{identity ? " You already have a result." : ""}</p>
      </Link>

      <Link
        to="/identity"
        search={{ mode: "creature" }}
        onClick={onNavigate}
        className="pressable block rounded-md border border-border bg-bg/60 p-5"
      >
        <p className="text-xs tracking-kicker text-gold uppercase">Quiz</p>
        <h3 className="mt-2 font-display text-2xl text-fg">Find your Creature</h3>
        <p className="mt-2 text-sm text-muted">
          Longer the rarer you get. One try only.{creature ? " Your creature is already found." : ""}
        </p>
      </Link>

      <button
        type="button"
        onClick={() => setTrivia(true)}
        className="pressable block rounded-md border border-border bg-bg/60 p-5 text-left sm:col-span-2"
      >
        <p className="text-xs tracking-kicker text-gold uppercase">Quick quiz</p>
        <h3 className="mt-2 font-display text-2xl text-fg">Myth trivia</h3>
        <p className="mt-2 text-sm text-muted">Eight questions about the gods and creatures in this archive. Play it as many times as you like.</p>
      </button>
    </div>
  );
}

type TriviaQuestion = { prompt: string; options: string[]; answer: string };

function buildTrivia(): TriviaQuestion[] {
  const count = (pick: (god: God) => string) => {
    const map = new Map<string, number>();
    for (const god of gods) map.set(pick(god), (map.get(pick(god)) ?? 0) + 1);
    return map;
  };
  const offices = count((god) => god.office);
  const domains = count((god) => god.domain);
  const lines = count((god) => god.line);

  const makers: Array<(god: God) => string | null> = [
    (god) => (god.office && offices.get(god.office) === 1 ? `Who is known as "${god.office}"?` : null),
    (god) => (god.domain && domains.get(god.domain) === 1 ? `Whose domain is: ${god.domain}?` : null),
    (god) => (god.line && lines.get(god.line) === 1 ? `Whose line is this? "${god.line}"` : null),
  ];

  const out: TriviaQuestion[] = [];
  for (const god of shuffled(gods)) {
    if (out.length >= 8) break;
    const prompts = makers.map((make) => make(god)).filter((value): value is string => Boolean(value));
    if (!prompts.length) continue;
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    const others = shuffled(gods.filter((other) => other.id !== god.id))
      .slice(0, 3)
      .map((other) => other.name);
    out.push({ prompt, answer: god.name, options: shuffled([god.name, ...others]) });
  }
  return out;
}

function Trivia({ onBack }: { onBack: () => void }) {
  const sound = useArchiveStore((state) => state.sound);
  const [questions, setQuestions] = useState<TriviaQuestion[]>(() => buildTrivia());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const done = index >= questions.length;

  function restart() {
    setQuestions(buildTrivia());
    setIndex(0);
    setScore(0);
    setPicked(null);
  }

  if (done) {
    return (
      <div className="text-center">
        <p className="text-xs tracking-kicker text-gold uppercase">Finished</p>
        <h3 className="mt-3 font-display text-5xl text-fg">
          {score} / {questions.length}
        </h3>
        <p className="mt-3 text-sm text-muted">
          {score >= questions.length - 1 ? "The Muses would hire you." : score >= questions.length / 2 ? "Not bad. The fates are watching." : "Back to the archive with you."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={restart} className="pressable min-h-11 rounded-sm bg-primary px-5 text-sm text-primary-fg">
            Play again
          </button>
          <button type="button" onClick={onBack} className="pressable min-h-11 rounded-sm border border-border px-5 text-sm text-fg">
            Back to quizzes
          </button>
        </div>
      </div>
    );
  }

  const question = questions[index];

  function choose(option: string) {
    if (picked !== null) return;
    setPicked(option);
    const correct = option === question.answer;
    if (correct) setScore((value) => value + 1);
    if (sound) playTone(correct ? 520 : 180, 0.14, 0.04);
    timer.current = window.setTimeout(() => {
      setPicked(null);
      setIndex((value) => value + 1);
    }, 900);
  }

  return (
    <div>
      <div className="flex items-center justify-between text-xs tracking-kicker text-muted uppercase">
        <button type="button" onClick={onBack} className="pressable min-h-9 text-muted">
          ← Quizzes
        </button>
        <span>
          Question {index + 1} of {questions.length} · {score} right
        </span>
      </div>
      <h3 className="mt-5 font-display text-2xl text-fg sm:text-3xl">{question.prompt}</h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
                "pressable min-h-12 rounded-sm border px-4 text-left text-sm",
                state === "right" ? "border-gold bg-gold/20 text-fg" : state === "wrong" ? "border-red-400/70 bg-red-400/10 text-fg" : "border-border bg-bg/60 text-fg",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Worldle ──────────────────────────────────────────────────────────────────────

type Mark = "hit" | "near" | "miss";
const MAX_TRIES = 6;

function markGuess(guess: string, word: string): Mark[] {
  const result: Mark[] = Array(word.length).fill("miss");
  const left: Record<string, number> = {};
  for (let i = 0; i < word.length; i += 1) {
    if (guess[i] === word[i]) result[i] = "hit";
    else left[word[i]] = (left[word[i]] ?? 0) + 1;
  }
  for (let i = 0; i < word.length; i += 1) {
    if (result[i] === "hit") continue;
    if ((left[guess[i]] ?? 0) > 0) {
      result[i] = "near";
      left[guess[i]] -= 1;
    }
  }
  return result;
}

const MARK_STYLE: Record<Mark | "empty", string> = {
  hit: "border-gold bg-gold text-primary-fg",
  near: "border-primary/70 bg-primary/30 text-fg",
  miss: "border-border bg-bg-deep text-muted",
  empty: "border-border bg-bg/60 text-fg",
};

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function Worldle() {
  const sound = useArchiveStore((state) => state.sound);
  const pool = useMemo(() => entriesBetween(4, 8), []);
  const [target, setTarget] = useState<Entry>(() => pool[Math.floor(Math.random() * pool.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [note, setNote] = useState("");

  const length = target.word.length;
  const won = guesses[guesses.length - 1] === target.word;
  const lost = !won && guesses.length >= MAX_TRIES;
  const over = won || lost;

  const letterState = useMemo(() => {
    const rank: Record<Mark, number> = { miss: 0, near: 1, hit: 2 };
    const states: Record<string, Mark> = {};
    for (const guess of guesses) {
      markGuess(guess, target.word).forEach((mark, i) => {
        const letter = guess[i];
        if (!states[letter] || rank[mark] > rank[states[letter]]) states[letter] = mark;
      });
    }
    return states;
  }, [guesses, target.word]);

  const press = useCallback(
    (key: string) => {
      if (over) return;
      if (key === "ENTER") {
        if (current.length !== length) {
          setNote(`Needs ${length} letters.`);
          return;
        }
        setNote("");
        setGuesses((list) => [...list, current]);
        setCurrent("");
        if (sound) playTone(current === target.word ? 660 : 300, 0.12, 0.035);
        if (current === target.word && sound) playSeal();
      } else if (key === "BACK") {
        setCurrent((value) => value.slice(0, -1));
      } else if (/^[A-Z]$/.test(key)) {
        setCurrent((value) => (value.length < length ? value + key : value));
      }
    },
    [current, length, over, sound, target.word],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const el = event.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Enter") press("ENTER");
      else if (event.key === "Backspace") press("BACK");
      else if (/^[a-zA-Z]$/.test(event.key)) press(event.key.toUpperCase());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  function next() {
    const choices = pool.filter((entry) => entry.word !== target.word);
    setTarget(choices[Math.floor(Math.random() * choices.length)] ?? target);
    setGuesses([]);
    setCurrent("");
    setNote("");
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="text-center text-sm text-muted">
        Guess the {length}-letter name from the archive in {MAX_TRIES} tries. Clue: <span className="text-fg">{target.god.office}</span>
      </p>

      <div className="mt-5 grid gap-1.5" aria-label="Guess board">
        {Array.from({ length: MAX_TRIES }, (_, row) => {
          const guess = guesses[row];
          const typing = row === guesses.length && !over;
          const marks = guess ? markGuess(guess, target.word) : null;
          return (
            <div key={row} className="flex justify-center gap-1.5">
              {Array.from({ length }, (_, col) => {
                const letter = guess ? guess[col] : typing ? current[col] : "";
                const style = marks ? MARK_STYLE[marks[col]] : MARK_STYLE.empty;
                return (
                  <div
                    key={col}
                    className={cn("flex size-11 items-center justify-center rounded-sm border font-display text-xl sm:size-12 sm:text-2xl", style)}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <p className="mt-3 min-h-5 text-center text-sm text-gold" role="status">
        {won ? `Yes. It was ${target.god.name}.` : lost ? `Out of tries. It was ${target.god.name}.` : note}
      </p>

      <div className="mt-3 grid gap-1.5">
        {ROWS.map((row, rowIndex) => (
          <div key={row} className="flex justify-center gap-1">
            {rowIndex === 2 ? (
              <button type="button" onClick={() => press("ENTER")} className="pressable h-11 rounded-sm border border-border bg-bg/60 px-2 text-[10px] tracking-kicker text-fg uppercase">
                Enter
              </button>
            ) : null}
            {row.split("").map((letter) => {
              const state = letterState[letter];
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => press(letter)}
                  className={cn(
                    "pressable h-11 w-7 rounded-sm border text-sm sm:w-8",
                    state ? MARK_STYLE[state] : "border-border bg-bg/60 text-fg",
                  )}
                >
                  {letter}
                </button>
              );
            })}
            {rowIndex === 2 ? (
              <button type="button" onClick={() => press("BACK")} aria-label="Delete" className="pressable h-11 rounded-sm border border-border bg-bg/60 px-3 text-sm text-fg">
                ⌫
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {over ? (
        <div className="mt-5 text-center">
          <button type="button" onClick={next} className="pressable min-h-11 rounded-sm bg-primary px-5 text-sm text-primary-fg">
            New word
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ── Word scramble ────────────────────────────────────────────────────────────────

function scrambleOf(word: string): string {
  if (new Set(word).size < 2) return word;
  let out = word;
  for (let tries = 0; tries < 20 && out === word; tries += 1) out = shuffled(word.split("")).join("");
  return out;
}

function Scramble() {
  const sound = useArchiveStore((state) => state.sound);
  const pool = useMemo(() => entriesBetween(4, 10), []);
  const queue = useRef<Entry[]>([]);

  const draw = useCallback((): Entry => {
    if (queue.current.length === 0) queue.current = shuffled(pool);
    return queue.current.pop() as Entry;
  }, [pool]);

  const [entry, setEntry] = useState<Entry>(() => pool[Math.floor(Math.random() * pool.length)]);
  const [letters, setLetters] = useState(() => scrambleOf(entry.word));
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"playing" | "right" | "revealed">("playing");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wrong, setWrong] = useState(false);

  function nextWord() {
    const next = draw();
    setEntry(next);
    setLetters(scrambleOf(next.word));
    setValue("");
    setStatus("playing");
    setWrong(false);
  }

  function submit() {
    if (status !== "playing") return;
    if (value.trim().toUpperCase() === entry.word) {
      setStatus("right");
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      if (sound) playSeal();
    } else {
      setWrong(true);
      setStreak(0);
      if (sound) playTone(180, 0.12, 0.04);
    }
  }

  return (
    <div className="mx-auto max-w-md text-center">
      <div className="flex justify-between text-xs tracking-kicker text-muted uppercase">
        <span>Solved {score}</span>
        <span>Streak {streak}</span>
      </div>

      <p className="mt-6 text-sm text-muted">
        Unscramble the name. Clue: <span className="text-fg">{entry.god.office}</span>
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5" aria-label={`Scrambled letters: ${letters.split("").join(" ")}`}>
        {(status === "playing" ? letters : entry.word).split("").map((letter, i) => (
          <div
            key={`${letter}-${i}`}
            className={cn(
              "flex size-11 items-center justify-center rounded-sm border font-display text-xl sm:size-12 sm:text-2xl",
              status === "right" ? MARK_STYLE.hit : status === "revealed" ? MARK_STYLE.near : "border-border bg-bg/60 text-fg",
            )}
          >
            {letter}
          </div>
        ))}
      </div>

      {status === "playing" ? (
        <>
          <input
            value={value}
            onChange={(event) => {
              setValue(event.target.value.replace(/[^A-Za-z]/g, "").slice(0, entry.word.length));
              setWrong(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
            }}
            maxLength={entry.word.length}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder={`${entry.word.length} letters`}
            aria-label="Your answer"
            className="mt-6 min-h-12 w-full rounded-sm border border-border bg-bg/60 px-4 text-center font-display text-xl tracking-widest text-fg uppercase outline-none focus:border-gold"
          />
          <p className="mt-2 min-h-5 text-sm text-red-300" role="status">
            {wrong ? "Not that one. Try again." : ""}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={submit} className="pressable min-h-11 rounded-sm bg-primary px-5 text-sm text-primary-fg">
              Check
            </button>
            <button type="button" onClick={() => setLetters(scrambleOf(entry.word))} className="pressable min-h-11 rounded-sm border border-border px-5 text-sm text-fg">
              Reshuffle
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus("revealed");
                setStreak(0);
              }}
              className="pressable min-h-11 rounded-sm border border-border px-5 text-sm text-muted"
            >
              Reveal
            </button>
          </div>
        </>
      ) : (
        <div className="mt-6">
          <p className="text-sm text-gold" role="status">
            {status === "right" ? `Correct. ${entry.god.name}.` : `It was ${entry.god.name}.`}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{entry.god.line}</p>
          <button type="button" onClick={nextWord} className="pressable mt-5 min-h-11 rounded-sm bg-primary px-5 text-sm text-primary-fg">
            Next word
          </button>
        </div>
      )}
    </div>
  );
}
