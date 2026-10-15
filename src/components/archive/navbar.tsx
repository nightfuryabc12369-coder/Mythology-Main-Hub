import { Avatar } from "@/components/archive/avatar";
import { CodexMark } from "@/components/archive/mark";
import { NAV_ARTICLES } from "@/data/nav-articles";
import { ages, myths } from "@/data/world";
import { useAccountStore, usePlayer } from "@/lib/account";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, ChevronDown, Menu, Search, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const links = [
  { to: "/gods", label: "Gods" },
  { to: "/ages", label: "Ages" },
  { to: "/myths", label: "Myths" },
  { to: "/epithets", label: "Epithets" },
  { to: "/epics", label: "Epics" },
  { to: "/timeline", label: "Time" },
  { to: "/library", label: "Articles" },
  { to: "/players", label: "Players" },
] as const;

const triggerClass = "inline-flex items-center gap-1 rounded-sm px-2.5 py-2 text-xs tracking-kicker uppercase transition-colors duration-150";
const itemClass = "block rounded-sm px-3 py-2 text-xs tracking-kicker text-muted uppercase transition-colors duration-150 hover:bg-fg/5 hover:text-fg";

/** A top-bar link that opens a small menu on hover (or keyboard focus) and still works as a normal link when clicked. */
function NavMenu({ to, label, active, wide, children }: { to: "/ages" | "/myths" | "/library"; label: string; active: boolean; wide?: boolean; children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [shown, setShown] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(timer.current);
    setShown(true);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShown(false), 120);
  };

  useEffect(() => {
    setShown(false);
  }, [pathname]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hide();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setShown(false);
      }}
    >
      <Link to={to} aria-haspopup="menu" aria-expanded={shown} className={cn(triggerClass, active ? "text-primary" : "text-muted hover:text-fg")}>
        {label}
        <ChevronDown className={cn("size-3 transition-transform duration-150", shown && "rotate-180")} />
      </Link>
      <div
        className={cn(
          "absolute top-full left-0 z-50 pt-2 transition-[opacity,transform] duration-150",
          shown ? "translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-1 opacity-0",
        )}
      >
        <div className={cn("rounded-sm border border-border bg-bg/95 p-2 shadow-2xl backdrop-blur-lg", wide ? "w-[22rem]" : "w-60")}>{children}</div>
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const setSearchOpen = useArchiveStore((state) => state.setSearchOpen);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const { player, accountsOn } = usePlayer();
  const avatar = useAccountStore((state) => state.avatar);

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
          {links.map((link) => {
            const active = pathname === link.to || (link.to !== "/" && pathname.startsWith(`${link.to}/`));
            if (link.to === "/ages") {
              return (
                <NavMenu key={link.to} to="/ages" label={link.label} active={active}>
                  {ages.map((age) => (
                    <Link key={age.id} to="/ages/$ageId" params={{ ageId: age.id }} className={itemClass}>
                      {age.name}
                      <span className="mt-0.5 block text-[0.65rem] tracking-normal text-subtle normal-case">{age.years}</span>
                    </Link>
                  ))}
                </NavMenu>
              );
            }
            if (link.to === "/myths") {
              return (
                <NavMenu key={link.to} to="/myths" label={link.label} active={active}>
                  {myths.map((myth) => (
                    <Link key={myth.id} to="/myths/$mythId" params={{ mythId: myth.id }} className={itemClass}>
                      {myth.name}
                    </Link>
                  ))}
                </NavMenu>
              );
            }
            if (link.to === "/library") {
              return (
                <NavMenu key={link.to} to="/library" label={link.label} active={active} wide>
                  <div className="grid grid-cols-2 gap-x-1">
                    {NAV_ARTICLES.map((article) => (
                      <Link key={article.slug} to="/library/$slug" params={{ slug: article.slug }} className={itemClass}>
                        {article.name}
                      </Link>
                    ))}
                  </div>
                  <Link to="/library" className="mt-1 block rounded-sm border-t border-border px-3 pt-3 pb-2 text-xs tracking-kicker text-gold uppercase hover:text-fg">
                    More articles, coming soon →
                  </Link>
                </NavMenu>
              );
            }
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(triggerClass, active ? "text-primary" : "text-muted hover:text-fg")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Link
            to={accountsOn && !player ? "/login" : "/profile"}
            aria-label={player ? "My profile" : accountsOn ? "Sign in or create an account" : "My cards"}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-sm text-muted hover:text-fg",
              (pathname === "/profile" || pathname === "/login") && "text-primary",
            )}
          >
            {player ? (
              <Avatar
                name={player.name}
                src={avatar}
                className={cn("size-8 text-sm", pathname === "/profile" && "ring-2 ring-primary")}
              />
            ) : (
              <UserRound className="size-5" />
            )}
          </Link>
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
