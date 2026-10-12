import { CodexMark } from "@/components/archive/mark";
import { playTone } from "@/lib/audio";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, Menu, Search, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { to: "/gods", label: "Gods" },
  { to: "/ages", label: "Ages" },
  { to: "/myths", label: "Myths" },
  { to: "/epithets", label: "Epithets" },
  { to: "/epics", label: "Epics" },
  { to: "/timeline", label: "Time" },
  { to: "/compare", label: "Measure" },
] as const;

export function Navbar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const setSearchOpen = useArchiveStore((state) => state.setSearchOpen);
  const sound = useArchiveStore((state) => state.sound);
  const toggleSound = useArchiveStore((state) => state.toggleSound);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-200",
        compact || open ? "border-border bg-bg/80 backdrop-blur-lg" : "border-transparent bg-transparent",
      )}
    >
      <div className="scroll-seal absolute inset-x-0 bottom-0 h-px bg-primary" id="scroll-seal" />
      <div className={cn("mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6", compact ? "h-14" : "h-16")}>
        <Link to="/" className="flex min-h-11 items-center gap-2 text-gold">
          <CodexMark />
          <span className="font-display text-sm tracking-kicker text-fg uppercase sm:text-base">Aether Codex</span>
        </Link>
        <nav className="ml-4 hidden items-center gap-1 xl:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "rounded-sm px-2.5 py-2 text-xs tracking-kicker uppercase transition-colors duration-150",
                pathname === link.to ? "text-primary" : "text-muted hover:text-fg",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-pressed={sound}
            aria-label={sound ? "Mute the lyre" : "Enable the lyre"}
            onClick={() => {
              toggleSound();
              if (!sound) playTone(494, 0.12, 0.04);
            }}
            className="inline-flex size-11 items-center justify-center rounded-sm text-muted hover:text-fg"
          >
            {sound ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
          </button>
          <Link
            to="/votive"
            aria-label="Votive shelf"
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-sm text-muted hover:text-fg",
              pathname === "/votive" && "text-primary",
            )}
          >
            <Bookmark className="size-5" />
          </Link>
          <button
            type="button"
            aria-label="Search the codex"
            onClick={() => setSearchOpen(true)}
            className="inline-flex size-11 items-center justify-center rounded-sm text-muted hover:text-fg"
          >
            <Search className="size-5" />
          </button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-sm text-muted xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      <div className={cn("grid transition-[grid-template-rows,opacity] duration-200 xl:hidden", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <nav className="flex flex-col gap-1 border-t border-border bg-bg/95 px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex min-h-11 items-center rounded-sm px-3 text-sm tracking-kicker uppercase",
                  pathname === link.to ? "text-primary" : "text-fg",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/about" className="flex min-h-11 items-center rounded-sm px-3 text-sm tracking-kicker text-fg uppercase">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function ScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById("scroll-seal");
    if (!bar) return;
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? window.scrollY / height : 0;
      bar.style.setProperty("--p", String(progress));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
