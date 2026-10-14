import { Scramble, Worldle } from "@/components/archive/games";
import { PageHero } from "@/components/archive/widgets";
import { QUIZZES, type QuizDef, type QuizSection } from "@/data/quizzes";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

type Section = "quizzes" | "worldle" | "scramble";

const SECTIONS: Array<{ id: Section; label: string }> = [
  { id: "quizzes", label: "Quizzes" },
  { id: "worldle", label: "Worldle" },
  { id: "scramble", label: "Word scramble" },
];

export const Route = createFileRoute("/play")({
  validateSearch: (search: Record<string, unknown>): { section?: Section } =>
    search.section === "worldle" || search.section === "scramble" || search.section === "quizzes" ? { section: search.section } : {},
  head: () => ({ meta: [{ title: "Quizzes & games · Aether Codex" }] }),
  component: PlayPage,
});

const GROUPS: QuizSection[] = ["Myth & legend", "From the archive"];

function PlayPage() {
  const { section = "quizzes" } = Route.useSearch();
  const navigate = useNavigate({ from: "/play" });

  return (
    <main>
      <PageHero
        kicker="The play hall"
        title="Quizzes & games"
        subtitle="Test what you know, earn titles for your profile, and play a word game between myths."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex gap-2 overflow-x-auto" role="tablist">
          {SECTIONS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={section === entry.id}
              onClick={() => void navigate({ search: { section: entry.id }, replace: true })}
              className={cn(
                "pressable min-h-11 shrink-0 rounded-full px-5 text-xs tracking-kicker uppercase",
                section === entry.id ? "bg-primary text-primary-fg" : "border border-border text-muted",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>

        {section === "quizzes" ? <QuizList /> : null}
        {section === "worldle" ? (
          <div className="mx-auto mt-10 max-w-xl">
            <h2 className="font-display text-3xl text-fg">Worldle</h2>
            <p className="mt-1 mb-6 text-sm text-muted">Guess a name from the archive. Play as many rounds as you like.</p>
            <Worldle />
          </div>
        ) : null}
        {section === "scramble" ? (
          <div className="mx-auto mt-10 max-w-xl">
            <h2 className="font-display text-3xl text-fg">Word scramble</h2>
            <p className="mt-1 mb-6 text-sm text-muted">Put the letters of a god or creature back in order.</p>
            <Scramble />
          </div>
        ) : null}
      </div>
    </main>
  );
}

function QuizList() {
  const hydrated = useArchiveStore((state) => state.hydrated);
  const results = useArchiveStore((state) => state.quizResults);
  const earned = hydrated ? Object.keys(results).length : 0;

  return (
    <div className="mt-8 space-y-12">
      <p className="text-sm text-muted">
        {QUIZZES.length} quizzes · {earned} {earned === 1 ? "title" : "titles"} earned. Your best title for each quiz is saved to your{" "}
        <Link to="/profile" className="text-primary underline">
          profile
        </Link>
        .
      </p>
      {GROUPS.map((group) => (
        <section key={group}>
          <h2 className="font-display text-3xl text-fg">{group}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {QUIZZES.filter((quiz) => quiz.section === group).map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} label={hydrated ? results[quiz.id]?.label : undefined} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function QuizCard({ quiz, label }: { quiz: QuizDef; label?: string }) {
  return (
    <Link
      to="/quiz/$quizId"
      params={{ quizId: quiz.id }}
      className="pressable flex min-h-44 flex-col rounded-md bg-surface p-5 shadow-border"
    >
      <p className="text-xs tracking-kicker text-gold uppercase">{quiz.count} questions</p>
      <h3 className="mt-2 font-display text-2xl text-fg">{quiz.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{quiz.blurb}</p>
      <p className={cn("mt-4 text-xs tracking-kicker uppercase", label ? "text-primary" : "text-subtle")}>
        {label ? `Title: ${label}` : "Not played yet"}
      </p>
    </Link>
  );
}
