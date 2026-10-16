import { PageHero } from "@/components/archive/widgets";
import { MOBILE_WALLPAPERS, WALLPAPERS, type Wallpaper } from "@/data/wallpapers";
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

function MobileCard({ item, index }: { item: Wallpaper; index: number }) {
  const [failed, setFailed] = useState(false);
  const showImage = item.preview && !failed;
  return (
    <article className="space-y-3">
      <div className="overflow-hidden rounded-md bg-surface shadow-border">
        <div className="relative aspect-[5/6] w-full bg-bg-deep">
          {showImage ? (
            <img
              src={item.preview}
              alt={item.title}
              width={1145}
              height={1374}
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              onError={() => setFailed(true)}
              className="size-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-muted">Tap Download to view this wallpaper.</div>
          )}
        </div>
      </div>
      <div>
        <h2 className="font-display text-base text-fg">{item.title}</h2>
        <p className="mt-1 text-xs tracking-kicker text-subtle uppercase">{item.size}</p>
      </div>
      <a
        href={item.page}
        target="_blank"
        rel="noopener noreferrer"
        className="pressable inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-primary px-4 text-sm tracking-kicker text-primary-fg uppercase"
      >
        Download
      </a>
    </article>
  );
}

type Tab = "desktop" | "mobile";

function WallpapersPage() {
  const [tab, setTab] = useState<Tab>("desktop");
  const tabs: Array<{ id: Tab; label: string; count: number }> = [
    { id: "desktop", label: "Desktop wallpapers", count: WALLPAPERS.length },
    { id: "mobile", label: "Mobile wallpapers", count: MOBILE_WALLPAPERS.length },
  ];
  return (
    <main>
      <PageHero kicker="For your screen" title="Wallpapers" subtitle="Scroll through and press Download. It opens the image page, where you save the full-size file." />
      <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 pb-24 sm:px-6">
        <div role="tablist" aria-label="Wallpaper type" className="flex flex-wrap gap-3">
          {tabs.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={tab === entry.id}
              onClick={() => setTab(entry.id)}
              className={`pressable min-h-12 rounded-sm px-5 text-sm tracking-kicker uppercase ${tab === entry.id ? "bg-primary text-primary-fg" : "bg-surface text-fg shadow-border"}`}
            >
              {entry.label} ({entry.count})
            </button>
          ))}
        </div>
        {tab === "desktop" ? (
          <div className="space-y-14">
            {[...WALLPAPERS].reverse().map((item, index) => (
              <WallpaperCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
            {[...MOBILE_WALLPAPERS].reverse().map((item, index) => (
              <MobileCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
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
