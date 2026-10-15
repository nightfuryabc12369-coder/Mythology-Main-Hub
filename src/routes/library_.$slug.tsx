import { ARTICLES, getArticle, readingMinutes } from "@/data/articles";
import { getFamily, nameOf, type ResolvedRef } from "@/data/articles/relations";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/library_/$slug")({
  head: ({ params }) => {
    const article = getArticle(params.slug);
    return {
      meta: [
        { title: article ? `${article.title} · Aether Codex` : "Article · Aether Codex" },
        ...(article ? [{ name: "description", content: article.excerpt }] : []),
      ],
    };
  },
  component: ArticlePage,
});

const GLOW = { textShadow: "0 0 10px rgba(228, 201, 138, 0.65), 0 0 22px rgba(228, 201, 138, 0.3)" };

function FamilyLink({ item }: { item: ResolvedRef }) {
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

function FamilyPanel({ godId }: { godId: string }) {
  const groups = getFamily(godId);
  if (groups.length === 0) return null;
  return (
    <section className="mt-6 rounded-sm border border-border bg-surface/60 p-4">
      <p className="text-[10px] tracking-kicker text-gold uppercase">Family</p>
      <div className="mt-3 space-y-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] tracking-kicker text-muted uppercase">{group.label}</p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
              {group.items.map((item) => (
                <FamilyLink key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ComingSoon({ id, name }: { id: string; name: string }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <div className="mx-auto mb-8 h-40 w-32 overflow-hidden rounded-sm border border-border bg-bg-deep">
        <img
          src={`/cards/${id}.webp`}
          alt={name}
          className="h-full w-full object-cover opacity-80"
          onError={(event) => {
            (event.currentTarget.parentElement as HTMLElement).style.display = "none";
          }}
        />
      </div>
      <p className="text-xs tracking-kicker text-gold uppercase">Coming soon</p>
      <h1 className="mt-3 font-display text-title text-fg uppercase">{name}</h1>
      <p className="mx-auto mt-4 max-w-md text-base text-muted">
        The article on {name} has not been written yet. It is on the list, so check back soon.
      </p>
      <Link to="/library" className="mt-8 inline-flex min-h-11 items-center text-xs tracking-kicker text-primary uppercase">
        ← Back to the library
      </Link>
    </main>
  );
}

function ArticlePage() {
  const { slug } = Route.useParams();
  // A plain card id (for example "zeus") also opens that card's article when one exists.
  const article = getArticle(slug) ?? ARTICLES.find((a) => a.godId === slug);

  if (!article) {
    const knownName = nameOf(slug);
    if (knownName) return <ComingSoon id={slug} name={knownName} />;
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-xs tracking-kicker text-gold uppercase">Not found</p>
        <h1 className="mt-3 font-display text-title text-fg uppercase">That article is not on the shelf</h1>
        <Link to="/library" className="mt-8 inline-flex min-h-11 items-center text-xs tracking-kicker text-primary uppercase">
          ← Back to the library
        </Link>
      </main>
    );
  }

  return (
    <main>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <Link to="/library" className="inline-flex min-h-11 items-center text-xs tracking-kicker text-primary uppercase">
            ← Library
          </Link>
          <p className="mt-4 text-xs tracking-kicker text-gold uppercase">
            {article.tag} · {article.godName} · {readingMinutes(article)} min read
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-title text-fg uppercase">{article.title}</h1>
          <p className="mt-4 max-w-2xl text-base text-muted">{article.excerpt}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
          <div className="mx-auto w-48 overflow-hidden rounded-sm border border-border lg:w-full">
            <img src={`/cards/${article.godId}.webp`} alt={article.godName} className="aspect-[5/6] w-full object-cover" />
          </div>
          <FamilyPanel godId={article.godId} />
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

          <div className="mt-14 border-t border-border pt-6">
            <Link to="/library" className="inline-flex min-h-11 items-center text-xs tracking-kicker text-primary uppercase">
              ← More from the library
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
