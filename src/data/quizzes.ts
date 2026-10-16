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

/** Each play draws this many questions from the quiz's bigger pool, so a replay brings new ones. */
export const QUESTIONS_PER_QUIZ = 8;

function fromRows(rows: Row[]): () => QuizQuestion[] {
  return () =>
    shuffle(rows)
      .slice(0, QUESTIONS_PER_QUIZ)
      .map(([prompt, answer, ...wrong]) => ({ prompt, answer, options: shuffle([answer, ...wrong]) }));
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
      ["Who is the king of the gods?", "Zeus", "Poseidon", "Hades", "Ares"],
      ["Which goddess watches over the harvest and grain?", "Demeter", "Hera", "Artemis", "Aphrodite"],
      ["Who is the god of wine and festivity?", "Dionysus", "Apollo", "Hermes", "Ares"],
      ["Which Olympian is the god of war?", "Ares", "Apollo", "Hephaestus", "Poseidon"],
      ["Which goddess is the goddess of love and beauty?", "Aphrodite", "Hera", "Athena", "Hestia"],
      ["Who is the queen of the gods?", "Hera", "Demeter", "Athena", "Artemis"],
      ["Which god is linked to the lyre, music and prophecy?", "Apollo", "Hermes", "Ares", "Hephaestus"],
      ["Which goddess hunts with a bow and is linked to the moon?", "Artemis", "Athena", "Hera", "Hestia"],
      ["On which mountain did the Olympians live?", "Mount Olympus", "Mount Parnassus", "Mount Ida", "Mount Etna"],
      ["Which Olympian sprang fully grown from Zeus's head?", "Athena", "Artemis", "Aphrodite", "Hera"],
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
      ["What came first in Hesiod's account of creation?", "Chaos", "Gaia", "Uranus", "Tartarus"],
      ["Which primordial being is the Earth itself?", "Gaia", "Rhea", "Nyx", "Eros"],
      ["Who was the sky, and Gaia's partner?", "Uranus", "Cronus", "Pontus", "Hyperion"],
      ["What did Cronus do to his own children?", "Swallowed them", "Exiled them", "Turned them to stone", "Sent them to Tartarus"],
      ["How was Rhea related to Cronus?", "Sister and wife", "Daughter", "Mother", "Niece"],
      ["What was the ten-year war between the Olympians and the Titans called?", "The Titanomachy", "The Gigantomachy", "The Trojan War", "The Argonautica"],
      ["Who is the primordial goddess of night?", "Nyx", "Gaia", "Hemera", "Eris"],
      ["Which Titan was the god of the great river that circles the world?", "Oceanus", "Hyperion", "Atlas", "Coeus"],
      ["Who was Zeus's mother, who saved him from Cronus?", "Rhea", "Hera", "Gaia", "Leto"],
      ["Which Titaness is the mother of Apollo and Artemis?", "Leto", "Hera", "Rhea", "Themis"],
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
      ["Which labour involved a golden-horned deer sacred to Artemis?", "The Ceryneian Hind", "The Erymanthian Boar", "The Cretan Bull", "The Stymphalian Birds"],
      ["Which animal did Heracles have to bring back alive from Mount Erymanthus?", "A boar", "A bull", "A stag", "A lion"],
      ["Which birds with bronze beaks and feathers did he drive from a lake?", "The Stymphalian Birds", "The Harpies", "The Sirens", "The Griffins"],
      ["Which island's bull did Heracles capture for a labour?", "Crete", "Cyprus", "Sicily", "Delos"],
      ["Whose man-eating mares did Heracles have to capture?", "Diomedes", "Eurystheus", "Augeas", "Busiris"],
      ["Whose girdle did he have to fetch from the Amazons?", "Hippolyta", "Penthesilea", "Antiope", "Atalanta"],
      ["Whose herd of red cattle did he drive from the far west?", "Geryon", "Cacus", "Diomedes", "Augeas"],
      ["Whose golden apples did Heracles fetch, guarded by a dragon?", "The Hesperides", "The Fates", "The Graces", "The Muses"],
      ["Which figure did Heracles briefly relieve of holding up the sky?", "Atlas", "Prometheus", "Cronus", "Hyperion"],
      ["Who sent snakes to kill baby Heracles in his cradle?", "Hera", "Athena", "Artemis", "Hades"],
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
      ["Who was the wife of Menelaus, whose departure began the war?", "Helen", "Cassandra", "Andromache", "Penelope"],
      ["Who was the king of Troy during the war?", "Priam", "Hector", "Aeneas", "Laomedon"],
      ["Which Trojan prince was the city's greatest defender?", "Hector", "Paris", "Aeneas", "Troilus"],
      ["Who was Achilles's close friend, killed by Hector?", "Patroclus", "Ajax", "Diomedes", "Nestor"],
      ["Which prophetess was cursed never to be believed?", "Cassandra", "Helen", "Hecuba", "Andromache"],
      ["Which Greek city did Menelaus rule?", "Sparta", "Mycenae", "Athens", "Thebes"],
      ["Which sea goddess was the mother of Achilles?", "Thetis", "Hera", "Athena", "Eos"],
      ["Which Trojan prince escaped the burning city and, in Roman tradition, founded Rome's line?", "Aeneas", "Hector", "Paris", "Helenus"],
      ["Which huge Greek warrior fought Hector to a standstill?", "Ajax", "Diomedes", "Nestor", "Menelaus"],
      ["How long did the war last, in the traditional telling?", "Ten years", "Three years", "Twenty years", "One year"],
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
      ["What name did Odysseus give Polyphemus when asked?", "Nobody", "Zeus", "Ithaca", "Laertes"],
      ["Which god was angry at Odysseus for blinding his son?", "Poseidon", "Zeus", "Apollo", "Ares"],
      ["Who was Odysseus's son?", "Telemachus", "Orestes", "Achilles", "Laertes"],
      ["Which nymph kept Odysseus on her island for years?", "Calypso", "Circe", "Nausicaa", "Penelope"],
      ["Which faithful dog recognized Odysseus when he came home?", "Argos", "Cerberus", "Laelaps", "Orthrus"],
      ["Which goddess helped and guided Odysseus?", "Athena", "Hera", "Aphrodite", "Artemis"],
      ["Which people ate a fruit that made sailors forget their homes?", "The Lotus-eaters", "The Cyclopes", "The Phaeacians", "The Laestrygonians"],
      ["Which two sea hazards did Odysseus have to sail between?", "Scylla and Charybdis", "The Sirens and the Harpies", "The Hydra and the Chimera", "Lotus-eaters and Laestrygonians"],
      ["What did Aeolus give Odysseus to help him sail home?", "A bag of winds", "A golden fleece", "A magic ring", "A map"],
      ["How did Odysseus prove who he was to the suitors?", "He strung his great bow", "He lifted a boulder", "He named his ship", "He recited a prophecy"],
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
      ["Which three-headed dog guarded the gates?", "Cerberus", "Orthrus", "Laelaps", "Argos"],
      ["Who is Hades's wife, queen of the Underworld?", "Persephone", "Demeter", "Hera", "Hecate"],
      ["Which river of the Underworld did the gods swear their oaths by?", "The Styx", "The Lethe", "The Acheron", "The Cocytus"],
      ["What coin was placed with the dead to pay the ferryman?", "An obol", "A drachma", "A talent", "A stater"],
      ["What was the paradise for heroes and the blessed called?", "Elysium", "Tartarus", "The Asphodel Meadows", "Olympus"],
      ["Which deep pit was the place of punishment for the worst offenders?", "Tartarus", "Elysium", "Erebus", "Olympus"],
      ["Who is the god of death?", "Thanatos", "Hypnos", "Hermes", "Charon"],
      ["Which god guided souls down to the Underworld?", "Hermes", "Apollo", "Ares", "Hephaestus"],
      ["Who is the twin brother of Thanatos?", "Hypnos", "Morpheus", "Charon", "Erebus"],
      ["Where did ordinary souls wander in the Underworld?", "The Asphodel Meadows", "Elysium", "Tartarus", "The Styx"],
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
      ["Who killed Medusa?", "Perseus", "Heracles", "Theseus", "Bellerophon"],
      ["Which hero killed the Minotaur?", "Theseus", "Perseus", "Heracles", "Jason"],
      ["Which monster with a hundred serpent heads was the father of many monsters?", "Typhon", "Cerberus", "Python", "Ladon"],
      ["Which snake did Apollo slay at Delphi?", "Python", "Ladon", "The Hydra", "Echidna"],
      ["Which many-headed serpent lived in the swamp of Lerna?", "The Hydra", "Python", "Typhon", "Ladon"],
      ["What were the Sirens known for?", "Singing sailors to their deaths", "Turning people to stone", "Breathing fire", "Guarding gold"],
      ["Which creature was part eagle and part lion?", "The Griffin", "The Chimera", "The Sphinx", "The Harpy"],
      ["Which bird rises reborn from its own ashes?", "The Phoenix", "The Griffin", "The Harpy", "The Stymphalian Bird"],
      ["Which whirlpool opposite Scylla swallowed ships?", "Charybdis", "The Ketos", "Python", "Echidna"],
      ["Which half-human, half-horse beings lived in the mountains?", "Centaurs", "Satyrs", "Giants", "Cyclopes"],
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
      ["Who was the craftsman who built the wings for his son?", "Daedalus", "Hephaestus", "Prometheus", "Pygmalion"],
      ["Who was the god of love and son of Aphrodite?", "Eros", "Hermes", "Apollo", "Dionysus"],
      ["Which lovers died by mistake, each thinking the other was dead?", "Pyramus and Thisbe", "Orpheus and Eurydice", "Hero and Leander", "Daphnis and Chloe"],
      ["Who swam the Hellespont each night to meet his love?", "Leander", "Orpheus", "Paris", "Jason"],
      ["Which nymph turned into a laurel tree to escape Apollo?", "Daphne", "Echo", "Calypso", "Eurydice"],
      ["Who was turned into a flower after Apollo's discus killed him?", "Hyacinthus", "Adonis", "Narcissus", "Orion"],
      ["Which hunter, loved by Aphrodite, died to a boar?", "Adonis", "Orion", "Hippolytus", "Actaeon"],
      ["Which loving couple were turned into kingfishers, the halcyons?", "Alcyone and Ceyx", "Baucis and Philemon", "Orpheus and Eurydice", "Pyramus and Thisbe"],
      ["Which elderly couple was rewarded for sharing their meal with disguised gods?", "Baucis and Philemon", "Ceyx and Alcyone", "Pyramus and Thisbe", "Orpheus and Eurydice"],
      ["Which woman's love for Jason led her to betray her own family?", "Medea", "Ariadne", "Penelope", "Helen"],
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
      ["Who was turned to weeping stone after boasting about her many children?", "Niobe", "Arachne", "Medusa", "Echo"],
      ["Who was torn apart by his own hounds after seeing Artemis bathing?", "Actaeon", "Orion", "Adonis", "Pentheus"],
      ["Who was torn apart by maenads, led by his own mother, for refusing Dionysus?", "Pentheus", "Actaeon", "Orpheus", "Lycurgus"],
      ["Which king was turned into a wolf after testing Zeus with a horrible meal?", "Lycaon", "Tantalus", "Midas", "Ixion"],
      ["Which sisters were forced to carry water in leaking jars forever?", "The Danaids", "The Graces", "The Furies", "The Muses"],
      ["Who was cursed with endless hunger after cutting down Demeter's sacred grove?", "Erysichthon", "Midas", "Tantalus", "Sisyphus"],
      ["What did Apollo give Midas for judging his music badly?", "Donkey's ears", "A donkey's tail", "Blindness", "Silence"],
      ["Who was condemned to forever hold up the sky?", "Atlas", "Prometheus", "Sisyphus", "Tityos"],
      ["Which seer was blinded after seeing Athena bathing, in one tale?", "Tiresias", "Oedipus", "Phineus", "Calchas"],
      ["Which woman's hair was turned to snakes in Ovid's telling?", "Medusa", "Niobe", "Arachne", "Echo"],
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
      ["Who led the Argonauts?", "Jason", "Heracles", "Orpheus", "Theseus"],
      ["Which hero sailed to Crete to end the tribute of youths?", "Theseus", "Perseus", "Jason", "Heracles"],
      ["Which musician sailed with the Argonauts?", "Orpheus", "Apollo", "Linus", "Hermes"],
      ["Who killed the Calydonian Boar?", "Meleager", "Jason", "Theseus", "Peleus"],
      ["Which huntress and runner joined the Calydonian hunt?", "Atalanta", "Ariadne", "Medea", "Penelope"],
      ["Which hero's mother was Danae?", "Perseus", "Theseus", "Jason", "Bellerophon"],
      ["Which uncle sent Jason to fetch the Golden Fleece?", "Pelias", "Aeetes", "Eurystheus", "Minos"],
      ["Who was king of Colchis, keeper of the Fleece?", "Aeetes", "Pelias", "Minos", "Priam"],
      ["Which centaur trained many of the heroes?", "Chiron", "Nessus", "Pholus", "Eurytion"],
      ["Which king of Athens was the father of Theseus?", "Aegeus", "Minos", "Pelias", "Priam"],
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
  ...STATIC.map(({ rows, ...rest }): QuizDef => ({ ...rest, section: "Myth & legend", count: Math.min(QUESTIONS_PER_QUIZ, rows.length), build: fromRows(rows) })),
  ...ARCHIVE.map((quiz): QuizDef => ({ ...quiz, section: "From the archive" })),
];

export function getQuiz(id: string) {
  return QUIZZES.find((quiz) => quiz.id === id) ?? null;
}
