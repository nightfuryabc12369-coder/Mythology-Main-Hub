import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  const [pick, setPick] = useState<Gender | null>(null);

  if (!hydrated || gender) return null;
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
