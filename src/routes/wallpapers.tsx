import { PageHero } from "@/components/archive/widgets";
import { WALLPAPERS, type Wallpaper } from "@/data/wallpapers";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/wallpapers")({
  head: () => ({ meta: [{ title: "Wallpapers · Aether Codex" }, { name: "description", content: "Free mythology wallpapers for your desktop and phone." }] }),
  component: WallpapersPage,
});

function WallpaperCard({ item, index }: { item: Wallpaper; index: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <article className="space-y-4">
      <div className="overflow-hidden rounded-md bg-surface shadow-border">
        <div className="relative aspect-video w-full bg-bg-deep">
          {failed ? (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted">Preview unavailable right now. You can still use the download button.</div>
          ) : (
            <img
              src={item.preview}
              alt={item.title}
              width={1920}
              height={1080}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              onError={() => setFailed(true)}
              className="size-full object-cover"
            />
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-fg">{item.title}</h2>
          <p className="mt-1 text-xs tracking-kicker text-subtle uppercase">{item.size}</p>
        </div>
        <a
          href={item.page}
          target="_blank"
          rel="noopener noreferrer"
          className="pressable inline-flex min-h-12 items-center rounded-sm bg-primary px-6 text-sm tracking-kicker text-primary-fg uppercase"
        >
          Download
        </a>
      </div>
    </article>
  );
}

function WallpapersPage() {
  return (
    <main>
      <PageHero kicker="For your screen" title="Wallpapers" subtitle="Scroll through and press Download. It opens the image page, where you save the full-size file." />
      <div className="mx-auto max-w-4xl space-y-14 px-4 py-12 pb-24 sm:px-6">
        {WALLPAPERS.map((item, index) => (
          <WallpaperCard key={item.id} item={item} index={index} />
        ))}
        <p className="border-t border-border pt-6 text-sm text-subtle">
          These wallpapers were created with AI. Downloads open on ImgBB, a free image host. Questions about using them? See the{" "}
          <Link to="/contact" className="text-gold underline underline-offset-4 hover:text-fg">
            contact page
          </Link>
          . More are coming soon.
        </p>
      </div>
    </main>
  );
}
