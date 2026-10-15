import { AGE_ARTICLES } from "@/data/age-articles";
import { getFamilyLink, readingMinutesFor } from "@/data/articles/age-helpers";
import type { ResolvedRef } from "@/data/articles/relations";
import { ages } from "@/data/world";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ages_/$ageId")({
  head: ({ params }) => {
    const article = AGE_ARTICLES[params.ageId];
    const age = ages.find((a) => a.id === params.ageId);
    return {
      meta: [
        { title: age ? `${age.name} · Ages · Aether Codex` : "Age · Aether Codex" },
        ...(article ? [{ name: "description", content: article.excerpt }] : []),
      ],
    };
  },
  component: AgePage,
});

const GLOW = { textShadow: "0 0 10px rgba(228, 201, 138, 0.65), 0 0 22px rgba(228, 201, 138, 0.3)" };

function AgePage() {
  const { ageId } = Route.useParams();
  const age = ages.find((a) => a.id === ageId);
  const article = AGE_ARTICLES[ageId];

  if (!age || !article) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-xs tracking-kicker text-gold uppercase">Not found</p>
        <h1 className="mt-3 font-display text-title text-fg uppercase">That age is not on the map</h1>
        <Link to="/ages" className="mt-8 inline-flex min-h-11 items-center text-xs tracking-kicker text-primary uppercase">
          ← Back to the ages
        </Link>
      </main>
    );
  }

  const index = ages.findIndex((a) => a.id === age.id);
  const next = ages[(index + 1) % ages.length];
  const figures = age.gods.map(getFamilyLink).filter((item): item is ResolvedRef => item !== null);

  return (
    <main>
      <header className="relative overflow-hidden border-b border-border">
        <img src={age.image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: age.focus }} />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <Link to="/ages" className="inline-flex min-h-11 items-center text-xs tracking-kicker text-primary uppercase">
            ← Ages
          </Link>
          <p className="mt-4 text-xs tracking-kicker text-gold uppercase">
            {age.tag} · {age.years} · {readingMinutesFor(article.body)} min read
          </p>
          <h1 className="mt-3 font-display text-title text-fg uppercase">{age.name}</h1>
          <p className="mt-2 max-w-4xl font-display text-xl text-fg/90">{article.title}</p>
          <p className="mt-4 max-w-2xl text-base text-fg/80">{article.excerpt}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
          <section className="rounded-sm border border-border bg-surface/60 p-4">
            <p className="text-[10px] tracking-kicker text-gold uppercase">Figures of this age</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-0.5">
              {figures.map((item) => (
                <Link
                  key={item.id}
                  to="/library/$slug"
                  params={{ slug: item.slug }}
                  style={GLOW}
                  className={`inline-flex min-h-8 items-center gap-1 text-sm transition-colors hover:text-fg ${item.written ? "text-gold" : "text-gold/70"}`}
                >
                  {item.name}
                  {item.written ? null : <span className="text-[9px] tracking-kicker text-muted uppercase">soon</span>}
                </Link>
              ))}
            </div>
          </section>
        </aside>

        <article className="max-w-3xl">
          {article.body.map((block, i) =>
            block.startsWith("## ") ? (
              <h2 key={i} className="mt-12 mb-4 font-display text-2xl text-fg uppercase">
                {block.slice(3)}
              </h2>
            ) : (
              <p key={i} className="mb-5 text-base leading-8 text-fg/90">
                {block}
              </p>
            ),
          )}

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <Link to="/ages" className="inline-flex min-h-11 items-center text-xs tracking-kicker text-primary uppercase">
              ← All ages
            </Link>
            <Link
              to="/ages/$ageId"
              params={{ ageId: next.id }}
              className="inline-flex min-h-11 items-center text-xs tracking-kicker text-primary uppercase"
            >
              Next: {next.name} →
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
