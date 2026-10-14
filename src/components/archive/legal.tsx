import { PageHero } from "@/components/archive/widgets";
import { LEGAL_UPDATED } from "@/data/site";
import type { ReactNode } from "react";

export function LegalPage({ kicker, title, subtitle, children }: { kicker: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <main>
      <PageHero kicker={kicker} title={title} subtitle={subtitle} />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 text-sm leading-relaxed text-muted sm:px-6">
        <p className="text-xs tracking-kicker text-subtle uppercase">Last updated {LEGAL_UPDATED}</p>
        {children}
      </div>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg tracking-kicker text-gold uppercase">{title}</h2>
      {children}
    </section>
  );
}
