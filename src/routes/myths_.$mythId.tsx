import { MYTH_ARTICLES } from "@/data/myth-articles";
import { readingMinutesFor } from "@/data/articles/age-helpers";
import { resolveRef, type ResolvedRef } from "@/data/articles/relations";
import { ages, myths } from "@/data/world";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/myths_/$mythId")({
  head: ({ params }) => {
    const article = MYTH_ARTICLES[params.mythId];
    const myth = myths.find((m) => m.id === params.mythId);
    return {
      meta: [
        { title: myth ? `${myth.name} · Myths · Aether Codex` : "Myth · Aether Codex" },
        ...(article ? [{ name: "description", content: article.excerpt }] : []),
      ],
    };
  },
  component: MythPage,
});

const GLOW = { textShadow: "0 0 10px rgba(228, 201, 138, 0.65), 0 0 22px rgba(228, 201, 138, 0.3)" };

function RefLink({ item }: { item: ResolvedRef }) {
  return (
    <Link
      to="/library/$slug"
      params={{ slug: item.slug }}
      style={GLOW}
      className={`inline-flex min-h-8 items-center gap-1 text-sm transition-colors hover:text-fg ${item.written ? "text-gold" : "text-gold/70"}`}
    >
      {item.name}
      {item.written ? null : <span className="text-[9px] tracking-kicker text-muted uppercase">soon</span>}
    </Link>
  );
}

function MythPage() {
  const { mythId } = Route.useParams();
  const myth = myths.find((m) => m.id === mythId);
  const article = MYTH_ARTICLES[mythId];

  if (!myth || !article) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-xs tracking-kicker text-gold uppercase">Not found</p>
        <h1 className="mt-3 font-display text-title text-fg uppercase">That myth is not in the loom</h1>
        <Link to="/myths" className="mt-8 inline-flex min-h-11 items-center text-xs tracking-kicker text-primary uppercase">
          ← Back to the myths
        </Link>
      </main>
    );
  }

  const ordered = [...myths].sort((a, b) => a.order - b.order);
  const index = ordered.findIndex((m) => m.id === myth.id);
  const next = ordered[(index + 1) % ordered.length];
  const age = ages.find((a) => a.name.toLowerCase() === myth.age.toLowerCase());

  const godRefs = myth.gods.map((id) => resolveRef(id)).filter((ref): ref is ResolvedRef => ref !== null);
  // Mortals are stored as display names. Link the ones we know, leave the rest as plain text.
  const mortals = myth.mortals.map((name) => ({ name, ref: resolveRef(name.toLowerCase()) }));

  return (
    <main>
      <header className="relative overflow-hidden border-b border-border">
        <img src={myth.image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: myth.focus }} />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/40" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <Link to="/myths" className="inline-flex min-h-11 items-center text-xs tracking-kicker text-primary uppercase">
            ← Myths
          </Link>
          <p className="mt-4 text-xs tracking-kicker text-gold uppercase">
            {myth.age} · {myth.span} · {readingMinutesFor(article.body)} min read
          </p>
          <h1 className="mt-3 font-display text-title text-fg uppercase">{myth.name}</h1>
          <p className="mt-2 max-w-4xl font-display text-xl text-fg/90">{article.title}</p>
          <p className="mt-4 max-w-2xl text-base text-fg/80">{article.excerpt}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
          {godRefs.length > 0 ? (
            <section className="rounded-sm border border-border bg-surface/60 p-4">
              <p className="text-[10px] tracking-kicker text-gold uppercase">Gods in this story</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-0.5">
                {godRefs.map((item) => (
                  <RefLink key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          {mortals.length > 0 ? (
            <section className="rounded-sm border border-border bg-surface/60 p-4">
              <p className="text-[10px] tracking-kicker text-gold uppercase">Mortals</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-0.5">
                {mortals.map(({ name, ref }) =>
                  ref ? (
                    <RefLink key={name} item={ref} />
                  ) : (
                    <span key={name} className="inline-flex min-h-8 items-center text-sm text-fg/80">
                      {name}
                    </span>
                  ),
                )}
              </div>
            </section>
          ) : null}

          {age ? (
            <section className="rounded-sm border border-border bg-surface/60 p-4">
              <p className="text-[10px] tracking-kicker text-gold uppercase">From the age</p>
              <Link
                to="/ages/$ageId"
                params={{ ageId: age.id }}
                style={GLOW}
                className="mt-3 inline-flex min-h-8 items-center text-sm text-gold transition-colors hover:text-fg"
              >
                {age.name}
              </Link>
            </section>
          ) : null}
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
            <Link to="/myths" className="inline-flex min-h-11 items-center text-xs tracking-kicker text-primary uppercase">
              ← All myths
            </Link>
            <Link
              to="/myths/$mythId"
              params={{ mythId: next.id }}
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
