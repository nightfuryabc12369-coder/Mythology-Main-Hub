import { GodCard } from "@/components/archive/cards";
import { FilterChip, PageHero } from "@/components/archive/widgets";
import { gods } from "@/data/gods";
import type { RealmId } from "@/data/types";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/gods")({ component: GodsPage });

const realms: Array<RealmId | "all"> = ["all", "olympus", "sky", "sea", "earth", "underworld", "tartarus", "wild"];
const tags = ["all", "olympian", "chthonic", "titan", "primordial", "hero", "creature", "wild", "hearth"] as const;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function GodsPage() {
  const [letter, setLetter] = useState("all");
  const [realm, setRealm] = useState<(typeof realms)[number]>("all");
  const [tag, setTag] = useState<(typeof tags)[number]>("all");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return gods.filter((god) => {
      if (letter !== "all" && !god.name.toLowerCase().startsWith(letter.toLowerCase())) return false;
      if (realm !== "all" && god.realm !== realm) return false;
      if (tag !== "all" && !god.tags.includes(tag)) return false;
      if (!needle) return true;
      return (
        god.name.toLowerCase().includes(needle) ||
        god.aliases.some((alias) => alias.toLowerCase().includes(needle)) ||
        god.domain.toLowerCase().includes(needle)
      );
    });
  }, [letter, realm, tag, query]);

  return (
    <main>
      <PageHero kicker="Pantheon" title="Gods" subtitle="Filter by letter, realm, or the role the poets would not let them leave." />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, title, or domain"
          className="h-12 w-full rounded-sm border border-border bg-surface px-4 text-sm text-fg outline-none placeholder:text-subtle"
        />
        <div className="mt-4 flex gap-1 overflow-x-auto pb-2">
          <FilterChip on={letter === "all"} onClick={() => setLetter("all")}>
            All
          </FilterChip>
          {letters.map((item) => (
            <FilterChip key={item} on={letter === item} onClick={() => setLetter(item)}>
              {item}
            </FilterChip>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {realms.map((item) => (
            <FilterChip key={item} on={realm === item} onClick={() => setRealm(item)}>
              {item}
            </FilterChip>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((item) => (
            <FilterChip key={item} on={tag === item} onClick={() => setTag(item)}>
              {item}
            </FilterChip>
          ))}
        </div>
        <p className="mt-6 text-xs tracking-kicker text-muted uppercase">{list.length} dossiers</p>
        {list.length === 0 ? <p className="mt-8 text-sm text-muted">No god under that seal. Clear a filter.</p> : null}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((god, index) => (
            <GodCard key={god.id} god={god} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
