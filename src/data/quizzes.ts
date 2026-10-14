/**
 * Play-hall quizzes. These are separate from "Find who you are" / "Find your Creature".
 * Every quiz ends with a title (label) based on the score. The best title per quiz is saved to the profile.
 */

import { gods } from "@/data/gods";
import type { God } from "@/data/types";

export type QuizQuestion = { prompt: string; options: string[]; answer: string };
export type QuizSection = "Myth & legend" | "From the archive";
export type QuizTier = 0 | 1 | 2;

export type QuizDef = {
  id: string;
  title: string;
  blurb: string;
  section: QuizSection;
  count: number;
  /** Titles for low / middle / high scores. */
  titles: [string, string, string];
  build: () => QuizQuestion[];
};

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** [prompt, correct, wrong, wrong, wrong] */
type Row = [string, string, string, string, string];

function fromRows(rows: Row[]): () => QuizQuestion[] {
  return () =>
    shuffle(rows).map(([prompt, answer, ...wrong]) => ({ prompt, answer, options: shuffle([answer, ...wrong]) }));
}

export function tierFor(score: number, total: number): QuizTier {
  const ratio = total ? score / total : 0;
  if (ratio >= 0.8) return 2;
  if (ratio >= 0.5) return 1;
  return 0;
}

const STATIC: Array<Omit<QuizDef, "build" | "count" | "section"> & { rows: Row[] }> = [
  {
    id: "olympian-101", title: "Olympian 101", blurb: "The twelve and what they rule. Start here.",
    titles: ["Temple Visitor", "Initiate of Olympus", "Cupbearer to the Gods"],
    rows: [
      ["How many gods sit on the council of Olympus?", "Twelve", "Ten", "Nine", "Fourteen"],
      ["Which goddess is the goddess of wisdom?", "Athena", "Hera", "Artemis", "Demeter"],
      ["Who rules the sea?", "Poseidon", "Hades", "Zeus", "Apollo"],
      ["Who is the god of the forge?", "Hephaestus", "Ares", "Apollo", "Hermes"],
      ["Which god carries messages between gods and mortals?", "Hermes", "Apollo", "Ares", "Dionysus"],
      ["Who is Apollo's twin sister?", "Artemis", "Athena", "Hestia", "Hecate"],
    ],
  },
  {
    id: "titans-and-origins", title: "Titans & Origins", blurb: "Before Olympus: the war for the sky.",
    titles: ["Cronus's Page", "Warden of Othrys", "Titan-Breaker"],
    rows: [
      ["Which Titan led the Titans against the Olympians?", "Cronus", "Atlas", "Oceanus", "Hyperion"],
      ["Who was punished by holding up the sky?", "Atlas", "Prometheus", "Epimetheus", "Cronus"],
      ["What did Rhea give Cronus to swallow instead of baby Zeus?", "A stone wrapped in cloth", "A lamb", "A golden apple", "A thunderbolt"],
      ["Which Titan, whose name means forethought, stole fire for humankind?", "Prometheus", "Epimetheus", "Iapetus", "Coeus"],
      ["Where were the defeated Titans imprisoned?", "Tartarus", "Elysium", "Olympus", "The Asphodel Fields"],
      ["What are the hundred-handed giants who helped Zeus called?", "Hecatoncheires", "Cyclopes", "Telchines", "Curetes"],
    ],
  },
  {
    id: "labours-of-heracles", title: "Labours of Heracles", blurb: "Twelve tasks, one very tired hero.",
    titles: ["Water-Bearer", "Club-Bearer", "Twelve-Labour Champion"],
    rows: [
      ["Whose skin did Heracles wear as a cloak?", "The Nemean Lion", "The Erymanthian Boar", "The Cretan Bull", "The Hydra"],
      ["How many labours was Heracles set?", "Twelve", "Ten", "Seven", "Nine"],
      ["Which monster grew two heads for each one that was cut off?", "The Lernaean Hydra", "The Chimera", "Python", "Ladon"],
      ["How did Heracles clean the Augean stables in a day?", "He diverted two rivers through them", "He asked Athena to sweep them", "He burned them down", "He hired a hundred herdsmen"],
      ["Which guard of the Underworld did he bring up to the surface?", "Cerberus", "Orthrus", "Laelaps", "Ladon"],
      ["Which king set Heracles his labours?", "Eurystheus", "Minos", "Laomedon", "Pelias"],
    ],
  },
  {
    id: "trojan-war", title: "The Trojan War", blurb: "Ten years, a horse and a golden apple.",
    titles: ["Camp Follower", "Veteran of Troy", "Strategist of Ilion"],
    rows: [
      ["Which Trojan prince carried Helen off to Troy?", "Paris", "Hector", "Aeneas", "Priam"],
      ["Which Greek hero was said to be vulnerable only in the heel?", "Achilles", "Ajax", "Odysseus", "Diomedes"],
      ["Who devised the wooden horse?", "Odysseus", "Agamemnon", "Nestor", "Menelaus"],
      ["Who commanded the whole Greek army?", "Agamemnon", "Menelaus", "Ajax", "Patroclus"],
      ["Who killed the Trojan prince Hector?", "Achilles", "Ajax", "Paris", "Diomedes"],
      ["Which goddess did Paris choose as the fairest?", "Aphrodite", "Hera", "Athena", "Artemis"],
    ],
  },
  {
    id: "the-odyssey", title: "The Odyssey", blurb: "Twenty years from home, and the people on the way.",
    titles: ["Deckhand", "Navigator of Ithaca", "Odysseus's Equal"],
    rows: [
      ["How many years was Odysseus away from home?", "Twenty", "Ten", "Five", "Thirty"],
      ["What was the name of Odysseus's island home?", "Ithaca", "Crete", "Sparta", "Delos"],
      ["Which one-eyed giant did Odysseus blind?", "Polyphemus", "Brontes", "Talos", "Argus"],
      ["Who turned Odysseus's crew into pigs?", "Circe", "Calypso", "Athena", "Medea"],
      ["Whose song did Odysseus hear while tied to the mast?", "The Sirens", "The Harpies", "The Muses", "The Nereids"],
      ["Who waited for him, weaving and unweaving a shroud?", "Penelope", "Helen", "Andromache", "Clytemnestra"],
    ],
  },
  {
    id: "the-underworld", title: "The Underworld", blurb: "Rivers, ferrymen and the rules of the dead.",
    titles: ["Shade", "Guest of Asphodel", "Judge of the Dead"],
    rows: [
      ["Who rules the Underworld?", "Hades", "Thanatos", "Charon", "Hermes"],
      ["Who ferries the dead across the river?", "Charon", "Hermes", "Thanatos", "Hypnos"],
      ["Which river made the dead forget their lives?", "Lethe", "Styx", "Acheron", "Cocytus"],
      ["Which fruit bound Persephone to the Underworld?", "A pomegranate", "A fig", "An apple", "A grape"],
      ["Who lost Eurydice by looking back at her?", "Orpheus", "Odysseus", "Perseus", "Jason"],
      ["Which of these was a judge of the dead?", "Rhadamanthus", "Nestor", "Priam", "Cadmus"],
    ],
  },
  {
    id: "monsters-and-beasts", title: "Monsters & Beasts", blurb: "Things you do not want to meet on a road.",
    titles: ["Frightened Villager", "Monster Hunter", "Master of the Menagerie"],
    rows: [
      ["Whose gaze turned people to stone?", "Medusa", "Scylla", "Echidna", "Charybdis"],
      ["Which creature has a man's body and a bull's head?", "The Minotaur", "A Centaur", "A Satyr", "Typhon"],
      ["Which creature asked a deadly riddle at Thebes?", "The Sphinx", "The Chimera", "A Gorgon", "A Harpy"],
      ["Which winged horse sprang from Medusa?", "Pegasus", "Arion", "Xanthus", "Balius"],
      ["Which creature had a lion's head, a goat's body and a serpent's tail?", "The Chimera", "The Hydra", "The Griffin", "The Manticore"],
      ["Which six-headed monster lived on one side of a narrow strait, opposite Charybdis?", "Scylla", "Ladon", "Echidna", "Typhon"],
    ],
  },
  {
    id: "love-and-tragedy", title: "Love & Tragedy", blurb: "Gifts, mirrors and mistakes.",
    titles: ["Lovesick Poet", "Singer of Sorrows", "Muse's Favourite"],
    rows: [
      ["What did Pygmalion fall in love with?", "A statue he had carved", "A river nymph", "A mirror", "A star"],
      ["What did Narcissus fall in love with?", "His own reflection in a pool", "A shadow", "A nymph named Echo", "A statue"],
      ["Who was Eros's mortal wife?", "Psyche", "Semele", "Io", "Callisto"],
      ["Whose wax wings melted when he flew too close to the sun?", "Icarus", "Daedalus", "Phaethon", "Bellerophon"],
      ["Who lost control of the sun's chariot and fell?", "Phaethon", "Icarus", "Helios", "Ganymede"],
      ["Which nymph faded until only her voice was left?", "Echo", "Daphne", "Syrinx", "Arethusa"],
    ],
  },
  {
    id: "famous-punishments", title: "Famous Punishments", blurb: "What happens when you annoy a god.",
    titles: ["Warned Mortal", "Student of Hubris", "Judge of Offenders"],
    rows: [
      ["Who was condemned to roll a boulder uphill forever?", "Sisyphus", "Tantalus", "Ixion", "Tityos"],
      ["Who stood in water he could never drink, under fruit he could never reach?", "Tantalus", "Sisyphus", "Ixion", "Midas"],
      ["Who was bound to a burning wheel that never stopped turning?", "Ixion", "Sisyphus", "Prometheus", "Atlas"],
      ["Who was chained to a rock for stealing fire, with an eagle sent each day?", "Prometheus", "Atlas", "Epimetheus", "Cronus"],
      ["Whose touch turned everything to gold?", "Midas", "Croesus", "Tantalus", "Pelops"],
      ["Who was turned into a spider after boasting she out-wove Athena?", "Arachne", "Niobe", "Medusa", "Daphne"],
    ],
  },
  {
    id: "heroes-and-quests", title: "Heroes & Quests", blurb: "Perseus, Theseus, Jason and friends.",
    titles: ["Squire", "Questing Hero", "Founder of Cities"],
    rows: [
      ["What was the name of Jason's ship?", "The Argo", "The Nostos", "The Thalassa", "The Pegasus"],
      ["What did Jason set out to win?", "The Golden Fleece", "The apples of the Hesperides", "Hippolyta's girdle", "The cattle of Geryon"],
      ["Who helped Theseus escape the Labyrinth?", "Ariadne", "Medea", "Phaedra", "Atalanta"],
      ["Which Gorgon did Perseus slay?", "Medusa", "Stheno", "Euryale", "Echidna"],
      ["Which hero tamed Pegasus and defeated the Chimera?", "Bellerophon", "Perseus", "Theseus", "Cadmus"],
      ["Which sorceress helped Jason win the Fleece?", "Medea", "Circe", "Hecate", "Calypso"],
    ],
  },
];

// ── Quizzes built from the archive itself ────────────────────────────────────────

function others(exclude: God, pool: God[], n: number): God[] {
  return shuffle(pool.filter((g) => g.id !== exclude.id)).slice(0, n);
}

function unique(pick: (god: God) => string): Map<string, number> {
  const map = new Map<string, number>();
  for (const god of gods) map.set(pick(god), (map.get(pick(god)) ?? 0) + 1);
  return map;
}

function nameQuestions(pool: God[], prompt: (god: God) => string | null, count: number): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (const god of shuffle(pool)) {
    if (out.length >= count) break;
    const text = prompt(god);
    if (!text) continue;
    out.push({ prompt: text, answer: god.name, options: shuffle([god.name, ...others(god, pool, 3).map((g) => g.name)]) });
  }
  return out;
}

const REALM_LABEL: Record<string, string> = {
  olympus: "Olympus",
  sky: "The Sky",
  sea: "The Sea",
  earth: "The Earth",
  underworld: "The Underworld",
  tartarus: "Tartarus",
  wild: "The Wild",
};

const STATS = ["might", "cunning", "wrath", "favor", "dominion", "endurance"] as const;

const ARCHIVE: Array<Omit<QuizDef, "section">> = [
  {
    id: "whos-who", title: "Who's Who", blurb: "Match the office to the figure. Different questions every time.", count: 8,
    titles: ["Court Gossip", "Herald of the Archive", "Keeper of the Codex"],
    build: () => {
      const offices = unique((g) => g.office);
      return nameQuestions(gods, (g) => (g.office && offices.get(g.office) === 1 ? `Who is known as "${g.office}"?` : null), 8);
    },
  },
  {
    id: "symbol-spotter", title: "Symbol Spotter", blurb: "Whose symbols are these?", count: 8,
    titles: ["Votive Seeker", "Reader of Signs", "Augur of the Codex"],
    build: () => {
      const symbols = unique((g) => g.symbols.join(", "));
      return nameQuestions(
        gods,
        (g) => (g.symbols.length >= 2 && symbols.get(g.symbols.join(", ")) === 1 ? `Whose symbols are: ${g.symbols.join(", ")}?` : null),
        8,
      );
    },
  },
  {
    id: "realm-runner", title: "Realm Runner", blurb: "Which realm does each figure belong to?", count: 8,
    titles: ["Wanderer", "Realm Runner", "Cartographer of Worlds"],
    build: () =>
      shuffle(gods)
        .slice(0, 8)
        .map((god) => {
          const answer = REALM_LABEL[god.realm] ?? god.realm;
          const wrong = shuffle(Object.values(REALM_LABEL).filter((label) => label !== answer)).slice(0, 3);
          return { prompt: `Which realm does ${god.name} belong to?`, answer, options: shuffle([answer, ...wrong]) };
        }),
  },
  {
    id: "power-rankings", title: "Power Rankings", blurb: "Who has the higher stat? Judge by the Codex.", count: 8,
    titles: ["Spectator", "Arena Judge", "Measurer of Gods"],
    build: () => {
      const out: QuizQuestion[] = [];
      let guard = 0;
      while (out.length < 8 && guard < 400) {
        guard += 1;
        const [a, b] = shuffle(gods);
        const stat = STATS[Math.floor(Math.random() * STATS.length)];
        const diff = a.stats[stat] - b.stats[stat];
        if (Math.abs(diff) < 12) continue;
        if (out.some((q) => q.options.includes(a.name) || q.options.includes(b.name))) continue;
        const winner = diff > 0 ? a : b;
        out.push({ prompt: `Who has the higher ${stat}: ${a.name} or ${b.name}?`, answer: winner.name, options: [a.name, b.name] });
      }
      return out;
    },
  },
  {
    id: "creature-feature", title: "Creature Feature", blurb: "Name the beast from its line in the archive.", count: 8,
    titles: ["Beast-Watcher", "Tamer of Monsters", "Lord of the Menagerie"],
    build: () => {
      const creatures = gods.filter((g) => g.tags.includes("creature"));
      return nameQuestions(creatures, (g) => (g.line ? `Which creature? "${g.line}"` : null), 8);
    },
  },
];

export const QUIZZES: QuizDef[] = [
  ...STATIC.map(({ rows, ...rest }): QuizDef => ({ ...rest, section: "Myth & legend", count: rows.length, build: fromRows(rows) })),
  ...ARCHIVE.map((quiz): QuizDef => ({ ...quiz, section: "From the archive" })),
];

export function getQuiz(id: string) {
  return QUIZZES.find((quiz) => quiz.id === id) ?? null;
}
