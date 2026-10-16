import { useAccountStore, usePlayer } from "@/lib/account";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export type Gender = "male" | "female";

const OPTIONS: Array<{ id: Gender; label: string; title: string }> = [
  { id: "male", label: "Male", title: "God of …" },
  { id: "female", label: "Female", title: "Goddess of …" },
];

/** Two choices and a red warning. Used on the sign-up form and on the profile page. */
export function GenderChoice({ value, onChange }: { value: Gender | null; onChange: (value: Gender) => void }) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-xs tracking-kicker text-muted uppercase">Male or female</legend>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={value === option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "pressable min-h-14 rounded-sm border px-3 py-2 text-left transition-colors",
              value === option.id ? "border-primary bg-elevated text-fg" : "border-border bg-bg text-muted hover:text-fg",
            )}
          >
            <span className="block text-sm text-fg">{option.label}</span>
            <span className="block text-xs text-subtle">Your title: {option.title}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 rounded-sm border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
        Warning: this choice cannot be changed later. Choose carefully.
      </p>
    </fieldset>
  );
}

/** Shown on the profile page of a signed-in account that has not chosen yet (for example, a Google or X sign-up). */
export function GenderGate() {
  const hydrated = useArchiveStore((state) => state.hydrated);
  const gender = useArchiveStore((state) => state.gender);
  const setGender = useArchiveStore((state) => state.setGender);
  const loaded = useAccountStore((state) => state.loaded);
  const dbReady = useAccountStore((state) => state.dbReady);
  const [pick, setPick] = useState<Gender | null>(null);

  // Wait until the account has loaded, so someone who already chose on another device is never asked again.
  if (!hydrated || !loaded || dbReady === false || gender) return null;
  return (
    <section className="mx-auto mt-6 max-w-3xl rounded-md bg-surface p-6 shadow-border">
      <h2 className="font-display text-xl text-fg">Choose your title</h2>
      <p className="mt-2 text-sm text-muted">Your result from the quizzes reads &ldquo;God of&hellip;&rdquo; for men and &ldquo;Goddess of&hellip;&rdquo; for women. Pick yours once.</p>
      <div className="mt-4">
        <GenderChoice value={pick} onChange={setPick} />
      </div>
      <button
        type="button"
        disabled={!pick}
        onClick={() => {
          if (pick && window.confirm(`Lock in "${pick}"? You will not be able to change it later.`)) setGender(pick);
        }}
        className="pressable mt-4 min-h-11 rounded-sm bg-primary px-5 text-xs tracking-kicker text-primary-fg uppercase disabled:opacity-40"
      >
        Lock in my choice
      </button>
    </section>
  );
}

const LATER_KEY = "aether-gender-later";

/**
 * A one-time question for accounts that signed up before the choice existed (and for Google or X sign-ups).
 * It appears on any page once the account has loaded. "Later" hides it for this visit only.
 */
export function GenderPrompt() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { player } = usePlayer();
  const hydrated = useArchiveStore((state) => state.hydrated);
  const gender = useArchiveStore((state) => state.gender);
  const setGender = useArchiveStore((state) => state.setGender);
  const loaded = useAccountStore((state) => state.loaded);
  const dbReady = useAccountStore((state) => state.dbReady);
  const [pick, setPick] = useState<Gender | null>(null);
  const [later, setLater] = useState(true);

  useEffect(() => {
    try {
      setLater(window.sessionStorage.getItem(LATER_KEY) === "1");
    } catch {
      setLater(false);
    }
  }, []);

  const hide = () => {
    try {
      window.sessionStorage.setItem(LATER_KEY, "1");
    } catch {
      /* hiding for this visit only is a convenience */
    }
    setLater(true);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!player || !hydrated || !loaded || dbReady === false || gender || later) return null;
  if (pathname === "/profile" || pathname === "/login") return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="gender-prompt-title">
      <div className="w-full max-w-md rounded-md bg-surface p-6 shadow-border">
        <h2 id="gender-prompt-title" className="font-display text-xl text-fg">
          Choose your title
        </h2>
        <p className="mt-2 text-sm text-muted">
          Accounts now have a title: &ldquo;God of&hellip;&rdquo; for men and &ldquo;Goddess of&hellip;&rdquo; for women. Please pick yours once.
        </p>
        <div className="mt-4">
          <GenderChoice value={pick} onChange={setPick} />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!pick}
            onClick={() => {
              if (pick && window.confirm(`Lock in "${pick}"? You will not be able to change it later.`)) setGender(pick);
            }}
            className="pressable min-h-11 rounded-sm bg-primary px-5 text-xs tracking-kicker text-primary-fg uppercase disabled:opacity-40"
          >
            Lock in my choice
          </button>
          <button type="button" onClick={hide} className="min-h-11 px-3 text-xs tracking-kicker text-muted uppercase hover:text-fg">
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
