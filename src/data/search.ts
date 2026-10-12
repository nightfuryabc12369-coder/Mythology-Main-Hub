import { gods } from "./gods";
import type { SearchHit, SearchKind } from "./types";
import { ages, epics, epithets, myths } from "./world";

const kindLabel: Record<SearchKind, string> = {
  god: "God",
  myth: "Myth",
  epithet: "Epithet",
  epic: "Epic",
  age: "Age",
};

export function searchLabel(kind: SearchKind) {
  return kindLabel[kind];
}

function hit(partial: Omit<SearchHit, "keywords"> & { keywords: string }): SearchHit {
  return { ...partial, keywords: partial.keywords.toLowerCase() };
}

export const searchIndex: SearchHit[] = [
  ...gods.map((god) =>
    hit({
      id: god.id,
      kind: "god",
      title: god.name,
      subtitle: god.office,
      keywords: [god.name, god.epithet, god.domain, god.realm, ...god.aliases, ...god.tags, god.line].join(" "),
    }),
  ),
  ...myths.map((myth) =>
    hit({
      id: myth.id,
      kind: "myth",
      title: myth.name,
      subtitle: myth.age,
      keywords: [myth.name, myth.age, myth.logline, ...myth.mortals, ...myth.beats].join(" "),
    }),
  ),
  ...epithets.map((epithet) =>
    hit({
      id: epithet.id,
      kind: "epithet",
      title: epithet.name,
      subtitle: epithet.meaning,
      keywords: [epithet.name, epithet.line, epithet.meaning, epithet.description, epithet.god].join(" "),
    }),
  ),
  ...epics.map((epic) =>
    hit({
      id: epic.id,
      kind: "epic",
      title: epic.title,
      subtitle: epic.voice,
      keywords: [epic.title, epic.voice, epic.synopsis, epic.year].join(" "),
    }),
  ),
  ...ages.map((age) =>
    hit({
      id: age.id,
      kind: "age",
      title: age.name,
      subtitle: age.years,
      keywords: [age.name, age.tag, age.summary, age.years].join(" "),
    }),
  ),
];

export function searchArchive(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return searchIndex.slice(0, 8);
  return searchIndex.filter((item) => item.title.toLowerCase().includes(needle) || item.keywords.includes(needle)).slice(0, 14);
}
