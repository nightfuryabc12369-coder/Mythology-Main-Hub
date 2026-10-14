import { gods } from "@/data/gods";
import type { God } from "@/data/types";
import { useArchiveStore } from "@/lib/archive-store";
import { playSeal, playTone } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

export function Worldle() {
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

export function Scramble() {
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
