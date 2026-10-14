import { getArticle, readingMinutes } from "@/data/articles";
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

function ArticlePage() {
  const { slug } = Route.useParams();
  const article = getArticle(slug);

  if (!article) {
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
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mx-auto w-48 overflow-hidden rounded-sm border border-border lg:w-full">
            <img src={`/cards/${article.godId}.webp`} alt={article.godName} className="aspect-[5/6] w-full object-cover" />
          </div>
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
