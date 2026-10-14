import { DISCLAIMER } from "@/data";
import { AI_ART_NOTICE } from "@/data/site";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display tracking-kicker text-gold uppercase">Aether Codex</p>
          <div className="flex flex-wrap gap-4 text-xs tracking-kicker text-muted uppercase">
            <Link to="/gods" className="min-h-11 inline-flex items-center hover:text-fg">
              Gods
            </Link>
            <Link to="/myths" className="min-h-11 inline-flex items-center hover:text-fg">
              Myths
            </Link>
            <Link to="/compare" className="min-h-11 inline-flex items-center hover:text-fg">
              Measure
            </Link>
            <Link to="/about" className="min-h-11 inline-flex items-center hover:text-fg">
              About
            </Link>
          </div>
        </div>
        <p className="max-w-3xl text-sm text-subtle">{DISCLAIMER}</p>
        <p className="max-w-3xl text-sm text-subtle">{AI_ART_NOTICE}</p>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-5 border-t border-border pt-4 text-xs tracking-kicker text-muted uppercase">
          <Link to="/privacy" className="min-h-11 inline-flex items-center hover:text-fg">
            Privacy Policy
          </Link>
          <Link to="/terms" className="min-h-11 inline-flex items-center hover:text-fg">
            Terms &amp; Conditions
          </Link>
          <Link to="/contact" className="min-h-11 inline-flex items-center hover:text-fg">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
