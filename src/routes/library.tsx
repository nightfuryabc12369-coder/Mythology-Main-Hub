import { PageHero, SectionHeader } from "@/components/archive/widgets";
import { ARTICLES } from "@/data/articles";
import { Link, createFileRoute } from "@tanstack/react-router";

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
          subtitle="Pick a card to read the full article."
        />

        {ARTICLES.length === 0 ? (
          <div className="rounded-sm border border-border bg-bg/40 p-8 text-center">
            <p className="text-xs tracking-kicker text-gold uppercase">Coming soon</p>
            <h3 className="mt-3 font-display text-2xl text-fg uppercase">The shelves are being filled</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {ARTICLES.map((article) => (
              <Link
                key={article.slug}
                to="/library/$slug"
                params={{ slug: article.slug }}
                className="pressable group block overflow-hidden rounded-sm border border-border bg-surface transition-colors hover:border-gold/60"
              >
                <div className="aspect-[5/6] overflow-hidden bg-bg-deep">
                  <img
                    src={`/cards/${article.godId}.webp`}
                    alt={article.godName}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-[10px] tracking-kicker text-gold uppercase">
                    {article.tag} · {article.godName}
                  </p>
                  <h3 className="mt-2 font-display text-sm leading-snug text-fg sm:text-base">{article.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
