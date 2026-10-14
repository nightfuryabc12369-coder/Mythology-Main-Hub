import { PageHero, SectionHeader } from "@/components/archive/widgets";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library · Aether Codex" },
      {
        name: "description",
        content: "Long-form articles on the gods, heroes and monsters of Greek and Norse mythology.",
      },
    ],
  }),
  component: LibraryPage,
});

type Article = {
  title: string;
  character: string;
  summary: string;
  tag: string; // e.g. "Greek", "Norse"
};

// ADD YOUR ARTICLES HERE.
// Copy one block, paste it inside the brackets, and edit the text.
// Example:
//   {
//     title: "Zeus: King of the Sky",
//     character: "Zeus",
//     tag: "Greek",
//     summary: "How Zeus overthrew the Titans and took the throne of Olympus.",
//   },
const ARTICLES: Article[] = [];

function LibraryPage() {
  return (
    <main>
      <PageHero
        kicker="The library"
        title="Library"
        subtitle="Long reads on the gods, heroes and monsters of the old stories. One character at a time."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionHeader
          kicker="Articles"
          title="Character articles"
          subtitle="Deep dives into the figures behind the myths."
        />

        {ARTICLES.length === 0 ? (
          <div className="rounded-sm border border-border bg-bg/40 p-8 text-center">
            <p className="text-xs tracking-kicker text-gold uppercase">Coming soon</p>
            <h3 className="mt-3 font-display text-2xl text-fg uppercase">The shelves are being filled</h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">
              The first articles on our characters are being written. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((article) => (
              <article
                key={article.title}
                className="rounded-sm border border-border bg-bg/40 p-6 transition-colors hover:border-gold/60"
              >
                <p className="text-xs tracking-kicker text-gold uppercase">
                  {article.tag} · {article.character}
                </p>
                <h3 className="mt-3 font-display text-xl text-fg uppercase">{article.title}</h3>
                <p className="mt-3 text-sm text-muted">{article.summary}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
