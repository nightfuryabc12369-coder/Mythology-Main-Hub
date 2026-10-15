/**
 * "Find your Creature" — two quizzes, both one-shot (no retakes).
 *
 * Quiz A (creature): adaptive length. Every answer carries a rarity (0 common, 1 rare, 2 legendary).
 * Common answers keep the quiz short and end on a common creature; rarer answers keep it going.
 * Checkpoints at 4 / 7 / 10 questions decide whether to continue.
 *
 * Quiz B (age): the creature's rarity caps how old it can be.
 *   common    -> always a baby
 *   rare      -> young or grown ("old enough")
 *   legendary -> 100 years plus
 */

import { gods } from "@/data/gods";
import type { God } from "@/data/types";
import { shuffle, type TraitId, type Weights } from "@/data/identity";

export type Rarity = "common" | "rare" | "legendary";

/** A creature is simply a dossier from the site tagged "creature" (the Creature filter on the Gods page). */
export type Creature = {
  id: string;
  name: string;
  rarity: Rarity;
  god: God;
};

export const RARITIES: Array<{ id: Rarity; label: string; blurb: string }> = [
  { id: "common", label: "Common", blurb: "Beasts and birds of the old stories. Many people met one, and most lived to tell it." },
  { id: "rare", label: "Rare", blurb: "Few people meet one in a lifetime. It chooses who it is seen by." },
  { id: "legendary", label: "Legendary", blurb: "Songs are sung about it. Most people only ever meet it in a story." },
];

const LEGENDARY = ["typhon", "phoenix", "cerberus", "hydra", "chimera", "pegasus", "python", "echidna", "eagle-of-zeus", "ladon", "colchian-dragon", "chrysomallos"];
const RARE = ["medusa", "minotaur", "sphinx", "griffin", "centaurs", "sirens", "scylla", "charybdis", "ketos", "nemean-lion", "arion", "hippocampus"];

export function creatureRarity(id: string): Rarity {
  if (LEGENDARY.includes(id)) return "legendary";
  if (RARE.includes(id)) return "rare";
  return "common";
}

export const CREATURES: Creature[] = gods
  .filter((god) => god.tags.includes("creature"))
  .map((god) => ({ id: god.id, name: god.name, rarity: creatureRarity(god.id), god }));

export function getCreature(id: string | null | undefined) {
  return CREATURES.find((entry) => entry.id === id) ?? null;
}

export function getRarity(id: Rarity) {
  return RARITIES.find((entry) => entry.id === id) ?? RARITIES[0];
}

/** How a dossier's stats read as the quiz traits. */
function traitsOf(god: God): Record<TraitId, number> {
  const s = god.stats;
  return {
    command: s.dominion,
    fury: s.wrath,
    wisdom: s.cunning,
    passion: s.favor,
    craft: s.craft,
    wild: s.might,
    shadow: Math.max(0, s.cunning + s.wrath - s.favor) / 2,
    wit: s.cunning,
    hearth: (s.favor + s.endurance) / 2,
  };
}

// ── Quiz A: which creature ───────────────────────────────────────────────────────

/** [text, rarity 0|1|2, traits] */
type Opt = readonly [string, 0 | 1 | 2, Weights];
export type CreatureQuestion = { id: string; prompt: string; options: Array<{ text: string; r: 0 | 1 | 2; w: Weights }> };

const raw: Array<[string, string, Opt[]]> = [
  ["c1", "You find a path nobody has marked. You...", [
    ["Go back to the road everyone uses", 0, { hearth: 1 }],
    ["Follow it for a little while, then turn back", 0, { wit: 1, wild: 1 }],
    ["Follow it until it ends", 1, { wild: 2 }],
    ["Follow it, and mark it so others never find it", 2, { shadow: 2, wisdom: 1 }],
  ]],
  ["c2", "How do you spend an empty afternoon?", [
    ["With friends, any friends", 0, { passion: 1, hearth: 1 }],
    ["Eating something good", 0, { passion: 1 }],
    ["Learning something no one asked me to learn", 1, { wisdom: 2 }],
    ["Alone, doing something nobody has done before", 2, { wild: 1, craft: 2 }],
  ]],
  ["c3", "Someone offers you a shortcut that costs a small lie. You...", [
    ["Take it. Everyone does", 0, { wit: 1 }],
    ["Ask what the lie is first", 1, { wit: 1, wisdom: 1 }],
    ["Refuse and take the long road", 1, { command: 1, hearth: 1 }],
    ["Refuse, then make the shortcut honest", 2, { craft: 2, command: 1 }],
  ]],
  ["c4", "Pick a place to live.", [
    ["A busy village near the market", 0, { passion: 1, hearth: 1 }],
    ["A farm by a stream", 0, { hearth: 2 }],
    ["A cliffside nobody has climbed", 1, { command: 1, wild: 1 }],
    ["A cave under a mountain, deep and old", 2, { shadow: 2 }],
  ]],
  ["c5", "A stranger is lost and scared. You...", [
    ["Point them in the right direction", 0, { hearth: 1 }],
    ["Walk them to the road", 0, { hearth: 1, passion: 1 }],
    ["Stay with them until morning", 1, { command: 1, hearth: 1 }],
    ["Teach them to read the stars so they are never lost again", 2, { wisdom: 2, command: 1 }],
  ]],
  ["c6", "What do you want people to say about you?", [
    ["That I was great fun", 0, { passion: 1, wit: 1 }],
    ["That I was kind", 0, { hearth: 1 }],
    ["That I was nothing like anyone else", 1, { wild: 1, shadow: 1 }],
    ["Nothing. The story will do it for me", 2, { command: 2, fury: 1 }],
  ]],
  ["c7", "A storm hits in the night. You...", [
    ["Pull the blanket over my head", 0, { hearth: 1 }],
    ["Make tea and wait it out", 0, { hearth: 1, wisdom: 1 }],
    ["Go outside and watch it", 1, { wild: 2 }],
    ["Go out and ask it what it wants", 2, { wisdom: 1, fury: 1, command: 1 }],
  ]],
  ["c8", "How do you handle a big mistake?", [
    ["Laugh and move on", 0, { wit: 1, passion: 1 }],
    ["Say sorry quickly", 0, { hearth: 1 }],
    ["Study exactly how it happened", 1, { wisdom: 2 }],
    ["Turn it into the best thing I ever made", 2, { craft: 2, passion: 1 }],
  ]],
  ["c9", "Which sound do you love most?", [
    ["Pipes and a crowd", 0, { passion: 2 }],
    ["Running water", 0, { hearth: 1, wild: 1 }],
    ["Wind in a very high place", 1, { wild: 1, command: 1 }],
    ["Fire, a long way off", 2, { fury: 1, passion: 1, hearth: 1 }],
  ]],
  ["c10", "Someone dares you to do something nobody has done. You...", [
    ["Decline politely", 0, { hearth: 1 }],
    ["Do it, but with a friend", 0, { passion: 1 }],
    ["Do it alone", 1, { fury: 1, wild: 1 }],
    ["Do it, and then do the next thing nobody has done", 2, { command: 2, wit: 1 }],
  ]],
  ["c11", "What would you keep guarding for a hundred years?", [
    ["A good recipe", 0, { hearth: 1, passion: 1 }],
    ["A friend's secret", 1, { shadow: 1, hearth: 1 }],
    ["A treasure no one else knows exists", 1, { shadow: 1, craft: 1 }],
    ["A truth that would change the world", 2, { wisdom: 2, shadow: 1 }],
  ]],
  ["c12", "If you could have one wish granted tonight...", [
    ["A better day tomorrow", 0, { hearth: 1 }],
    ["A really good party", 0, { passion: 2 }],
    ["Wings", 1, { wild: 2 }],
    ["To never be forgotten", 2, { command: 2, passion: 1 }],
  ]],
];

export const CREATURE_POOL: CreatureQuestion[] = raw.map(([id, prompt, options]) => ({
  id,
  prompt,
  options: options.map(([text, r, w]) => ({ text, r, w })),
}));

/** Question counts at the three checkpoints. */
export const CHECKPOINTS = [4, 7, 10] as const;

export function drawCreatureQuiz(): CreatureQuestion[] {
  return shuffle(CREATURE_POOL)
    .slice(0, CHECKPOINTS[CHECKPOINTS.length - 1])
    .map((question) => ({ ...question, options: shuffle(question.options) }));
}

export type CreatureAnswer = { r: 0 | 1 | 2; w: Weights };

function average(answers: CreatureAnswer[]) {
  return answers.length ? answers.reduce((sum, a) => sum + a.r, 0) / answers.length : 0;
}

export function rarityFromAverage(avg: number): Rarity {
  if (avg < 0.7) return "common";
  if (avg < 1.35) return "rare";
  return "legendary";
}

/** Keep asking only while the answers are leaning rarer than the question count reached so far. */
export function needsMore(answers: CreatureAnswer[]): boolean {
  const n = answers.length;
  const avg = average(answers);
  if (n < CHECKPOINTS[0]) return true;
  if (n >= CHECKPOINTS[2]) return false;
  if (n < CHECKPOINTS[1]) return avg >= 0.7;
  return avg >= 1.35;
}

/** Total questions this run is currently heading for (used for the progress bar). */
export function currentTarget(answers: CreatureAnswer[]): number {
  const n = answers.length;
  const avg = average(answers);
  if (n < CHECKPOINTS[0]) return CHECKPOINTS[0];
  if (n < CHECKPOINTS[1]) return avg >= 0.7 ? CHECKPOINTS[1] : n + 1;
  return CHECKPOINTS[2];
}

export function scoreCreature(answers: CreatureAnswer[]): Creature {
  const rarity = rarityFromAverage(average(answers));
  const total: Partial<Record<TraitId, number>> = {};
  for (const answer of answers) {
    for (const [trait, value] of Object.entries(answer.w)) {
      const key = trait as TraitId;
      total[key] = (total[key] ?? 0) + (value ?? 0);
    }
  }
  const pool = CREATURES.filter((entry) => entry.rarity === rarity);
  let best = pool[0];
  let bestScore = -Infinity;
  for (const entry of pool) {
    const traits = traitsOf(entry.god);
    let dot = 0;
    let norm = 0;
    for (const [trait, value] of Object.entries(traits)) {
      dot += (total[trait as TraitId] ?? 0) * value;
      norm += value * value;
    }
    const score = dot / Math.sqrt(norm || 1) + Math.random() * 0.4;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return best;
}

// ── Quiz B: how old is it ────────────────────────────────────────────────────────

export type AgeStage = "baby" | "young" | "grown" | "ancient";

export type AgeQuestion = { id: string; prompt: string; options: Array<{ text: string; points: 0 | 1 | 2 | 3 }> };

export const AGE_COUNTS: Record<Rarity, number> = { common: 3, rare: 5, legendary: 7 };

const ageRaw: Array<[string, string, [string, 0 | 1 | 2 | 3][]]> = [
  ["a1", "Your creature hears a strange sound in the dark. It...", [["Hides behind you", 0], ["Peeks out and waits", 1], ["Walks toward it", 2], ["Already knows what it is", 3]]],
  ["a2", "When it is hungry, it...", [["Cries until fed", 0], ["Follows the smell of food", 1], ["Hunts, carefully", 2], ["Does not need to eat for weeks", 3]]],
  ["a3", "A stranger comes to its den. It...", [["Runs", 0], ["Growls from far away", 1], ["Stands its ground", 2], ["Asks the stranger a question that makes them leave", 3]]],
  ["a4", "How does it sleep?", [["All the time, in a heap", 0], ["Lightly, one eye open", 1], ["In long, deliberate rests", 2], ["It has not slept in a century", 3]]],
  ["a5", "What does it remember?", [["Today", 0], ["This year", 1], ["Its whole life", 2], ["Things no one else alive has seen", 3]]],
  ["a6", "How does it play?", [["Chasing its own tail", 0], ["With other young ones", 1], ["It does not play. It practices", 2], ["It tells stories now", 3]]],
  ["a7", "How does it speak?", [["Squeaks and chirps", 0], ["A few clear words", 1], ["Sentences, with strong opinions", 2], ["Slowly, and the room goes quiet", 3]]],
  ["a8", "Pick a scar it carries.", [["None yet", 0], ["A small nick", 1], ["A long one from a fight", 2], ["One from a war everyone forgot", 3]]],
];

export const AGE_POOL: AgeQuestion[] = ageRaw.map(([id, prompt, options]) => ({ id, prompt, options: options.map(([text, points]) => ({ text, points })) }));

export function drawAgeQuiz(rarity: Rarity): AgeQuestion[] {
  return shuffle(AGE_POOL)
    .slice(0, AGE_COUNTS[rarity])
    .map((question) => ({ ...question, options: shuffle(question.options) }));
}

export type AgeResult = {
  stage: AgeStage;
  /** Short label for the home window. */
  label: string;
  /** Exact-sounding age. */
  age: string;
  blurb: string;
};

export function scoreAge(creature: Creature, points: number[]): AgeResult {
  const max = points.length * 3;
  const percent = max ? (points.reduce((sum, p) => sum + p, 0) / max) * 100 : 0;
  if (creature.rarity === "common") {
    const weeks = 2 + Math.round(percent / 12);
    return {
      stage: "baby",
      label: "Baby",
      age: `${weeks} weeks old`,
      blurb: `A common creature is only ever met as a baby. Yours is a baby ${creature.name.replace(/^The /, "")}, still learning its own legs. It will not grow up in your story, and that is part of why it is so easy to love.`,
    };
  }
  if (creature.rarity === "rare") {
    const grown = percent >= 50;
    const years = grown ? 18 + Math.round(percent / 4) : 5 + Math.round(percent / 8);
    return {
      stage: grown ? "grown" : "young",
      label: grown ? "Old enough" : "Young",
      age: `${years} years old`,
      blurb: grown
        ? `A rare creature must be old enough to be seen at all. Yours is fully grown, strong and aware of what it is, and it is ready to be known by name.`
        : `A rare creature has to be old enough to be seen, and yours has just reached it. It is young, quick and still deciding what kind of ${creature.name.replace(/^The /, "")} to be.`,
    };
  }
  const years = 100 + Math.round(percent * 9);
  return {
    stage: "ancient",
    label: "100+ years",
    age: `${years.toLocaleString("en-US")} years old`,
    blurb: `Legendary creatures are never young. Yours has seen at least a hundred years of the world and more than likely a lot of its mistakes. It is calm, slow to anger and very, very hard to surprise.`,
  };
}
