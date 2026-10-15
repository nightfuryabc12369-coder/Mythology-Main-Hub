import { getGod } from "../gods";
import { ARTICLES } from "./index";

/** Names for relatives who are not cards in the game. They still get a "coming soon" page. */
export const EXTRA_NAMES: Record<string, string> = {
  amphitrite: "Amphitrite",
  metis: "Metis",
  maia: "Maia",
  semele: "Semele",
  danae: "Danae",
  alcmene: "Alcmene",
  coeus: "Coeus",
  phoebe: "Phoebe",
  hyperion: "Hyperion",
  theia: "Theia",
  eos: "Eos",
  nyx: "Nyx",
  styx: "Styx",
  pallas: "Pallas",
  calliope: "Calliope",
  eurydice: "Eurydice",
  penelope: "Penelope",
  telemachus: "Telemachus",
  laertes: "Laertes",
  anticleia: "Anticleia",
  minos: "Minos",
  pasiphae: "Pasiphae",
  aegeus: "Aegeus",
  hippolytus: "Hippolytus",
  andromeda: "Andromeda",
  euryale: "Euryale",
  iapetus: "Iapetus",
  epimetheus: "Epimetheus",
  perses: "Perses",
  asteria: "Asteria",
  coronis: "Coronis",
  hygieia: "Hygieia",
  panacea: "Panacea",
  phaethon: "Phaethon",
  endymion: "Endymion",
  harmonia: "Harmonia",
  phobos: "Phobos",
  deimos: "Deimos",
  polyphemus: "Polyphemus",
  aeneas: "Aeneas",
  megara: "Megara",
  deianira: "Deianira",
  moirai: "The Fates",
  pasithea: "Pasithea",
  zelus: "Zelus",
  kratos: "Kratos",
  bia: "Bia",
  phorcys: "Phorcys",
  ceto: "Ceto",
  stheno: "Stheno",
};

export type Family = {
  parents?: string[];
  spouse?: string[];
  partners?: string[];
  children?: string[];
  siblings?: string[];
};

const OLYMPIAN_SIBLINGS = ["zeus", "hera", "poseidon", "hades", "demeter", "hestia"];
const without = (id: string) => OLYMPIAN_SIBLINGS.filter((s) => s !== id);

export const RELATIONS: Record<string, Family> = {
  zeus: {
    parents: ["cronus", "rhea"],
    spouse: ["hera"],
    partners: ["metis", "leto", "maia", "semele", "danae", "alcmene", "demeter"],
    children: ["athena", "apollo", "artemis", "ares", "hephaestus", "hermes", "dionysus", "persephone", "heracles", "perseus", "hebe"],
    siblings: without("zeus"),
  },
  hera: { parents: ["cronus", "rhea"], spouse: ["zeus"], children: ["ares", "hebe", "hephaestus"], siblings: without("hera") },
  poseidon: {
    parents: ["cronus", "rhea"],
    spouse: ["amphitrite"],
    children: ["theseus", "orion", "pegasus", "polyphemus"],
    siblings: without("poseidon"),
  },
  hades: { parents: ["cronus", "rhea"], spouse: ["persephone"], siblings: without("hades") },
  demeter: { parents: ["cronus", "rhea"], partners: ["zeus"], children: ["persephone"], siblings: without("demeter") },
  hestia: { parents: ["cronus", "rhea"], siblings: without("hestia") },
  athena: { parents: ["zeus", "metis"] },
  apollo: { parents: ["zeus", "leto"], siblings: ["artemis"], children: ["asclepius", "orpheus"] },
  artemis: { parents: ["zeus", "leto"], siblings: ["apollo"] },
  ares: { parents: ["zeus", "hera"], partners: ["aphrodite"], children: ["harmonia", "phobos", "deimos", "eros"], siblings: ["hephaestus", "hebe"] },
  aphrodite: { parents: ["uranus"], spouse: ["hephaestus"], partners: ["ares"], children: ["eros", "harmonia", "aeneas"] },
  hephaestus: { parents: ["hera", "zeus"], spouse: ["aphrodite"], siblings: ["ares", "hebe"] },
  hermes: { parents: ["zeus", "maia"], children: ["pan"] },
  dionysus: { parents: ["zeus", "semele"], spouse: ["ariadne"] },
  persephone: { parents: ["demeter", "zeus"], spouse: ["hades"] },
  hecate: { parents: ["perses", "asteria"] },
  prometheus: { parents: ["iapetus"], siblings: ["epimetheus"] },
  gaia: { spouse: ["uranus"], children: ["uranus", "cronus", "rhea", "typhon"] },
  uranus: { parents: ["gaia"], spouse: ["gaia"], children: ["cronus", "rhea"] },
  cronus: { parents: ["uranus", "gaia"], spouse: ["rhea"], children: ["zeus", "poseidon", "hades", "hera", "demeter", "hestia"], siblings: ["rhea"] },
  rhea: { parents: ["uranus", "gaia"], spouse: ["cronus"], children: ["zeus", "poseidon", "hades", "hera", "demeter", "hestia"], siblings: ["cronus"] },
  leto: { parents: ["coeus", "phoebe"], partners: ["zeus"], children: ["apollo", "artemis"] },
  eros: { parents: ["aphrodite", "ares"] },
  pan: { parents: ["hermes"] },
  helios: { parents: ["hyperion", "theia"], siblings: ["selene", "eos"], children: ["phaethon"] },
  selene: { parents: ["hyperion", "theia"], siblings: ["helios", "eos"], partners: ["endymion"] },
  nike: { parents: ["pallas", "styx"], siblings: ["zelus", "kratos", "bia"] },
  nemesis: { parents: ["nyx"], siblings: ["thanatos", "hypnos", "moirai"] },
  hypnos: { parents: ["nyx"], spouse: ["pasithea"], siblings: ["thanatos", "nemesis"] },
  thanatos: { parents: ["nyx"], siblings: ["hypnos", "nemesis"] },
  asclepius: { parents: ["apollo", "coronis"], children: ["hygieia", "panacea"] },
  hebe: { parents: ["zeus", "hera"], spouse: ["heracles"], siblings: ["ares", "hephaestus"] },
  heracles: { parents: ["zeus", "alcmene"], spouse: ["hebe"], partners: ["megara", "deianira"] },
  odysseus: { parents: ["laertes", "anticleia"], spouse: ["penelope"], children: ["telemachus"] },
  orion: { parents: ["poseidon", "euryale"] },
  ariadne: { parents: ["minos", "pasiphae"], spouse: ["dionysus"], partners: ["theseus"], siblings: ["minotaur"] },
  orpheus: { parents: ["calliope", "apollo"], spouse: ["eurydice"] },
  theseus: { parents: ["aegeus", "poseidon"], partners: ["ariadne"], children: ["hippolytus"] },
  perseus: { parents: ["zeus", "danae"], spouse: ["andromeda"] },
  medusa: { parents: ["phorcys", "ceto"], siblings: ["stheno", "euryale"], children: ["pegasus"] },
};

export type ResolvedRef = {
  id: string;
  name: string;
  /** The article slug when an article exists, otherwise the plain id (which opens the Coming soon page). */
  slug: string;
  written: boolean;
};

export function nameOf(id: string): string | undefined {
  return getGod(id)?.name ?? EXTRA_NAMES[id];
}

export function resolveRef(id: string): ResolvedRef | null {
  const name = nameOf(id);
  if (!name) return null;
  const article = ARTICLES.find((a) => a.godId === id);
  return { id, name, slug: article ? article.slug : id, written: Boolean(article) };
}

const LABELS: [keyof Family, string][] = [
  ["parents", "Parents"],
  ["spouse", "Spouse"],
  ["partners", "Other unions"],
  ["children", "Children"],
  ["siblings", "Siblings"],
];

export type FamilyGroup = { label: string; items: ResolvedRef[] };

export function getFamily(godId: string): FamilyGroup[] {
  const family = RELATIONS[godId];
  if (!family) return [];
  const groups: FamilyGroup[] = [];
  for (const [key, label] of LABELS) {
    const items = (family[key] ?? []).map(resolveRef).filter((ref): ref is ResolvedRef => ref !== null);
    if (items.length > 0) groups.push({ label, items });
  }
  return groups;
}
