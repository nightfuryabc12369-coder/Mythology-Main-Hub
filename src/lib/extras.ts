import { MAX_STARS } from "@/data/cards";
import { creatureRarity, getCreature, type AgeStage, type Rarity } from "@/data/creatures";
import { getArchetype, getLevel, type LevelId } from "@/data/identity";

/** What lives on the account besides cards / ambrosia: the god title and the creatures. */
export type Extras = {
  identity: { godId: string; level: LevelId | null; at: number } | null;
  creature: { creatureId: string; rarity: Rarity; at: number; age: { stage: AgeStage; label: string; text: string } | null } | null;
  secondCreature: { creatureId: string; rarity: Rarity; at: number } | null;
  creatureStars: { main: number; second: number };
  /** Chosen once at sign-up and never changed. Decides "God of" or "Goddess of". */
  gender: "male" | "female" | null;
};

export const emptyExtras = (): Extras => ({ identity: null, creature: null, secondCreature: null, creatureStars: { main: 0, second: 0 }, gender: null });

const STAGES: AgeStage[] = ["baby", "young", "grown", "ancient"];
const num = (value: unknown, fallback = 0) => (Number.isFinite(Number(value)) ? Number(value) : fallback);
const stars = (value: unknown) => Math.min(Math.max(Math.floor(num(value)), 0), MAX_STARS);

/** Turns anything (a database value, a request body) into a safe Extras. Unknown ids are dropped. */
export function sanitizeExtras(value: unknown): Extras {
  let raw: unknown = value;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = null;
    }
  }
  const out = emptyExtras();
  if (!raw || typeof raw !== "object") return out;
  const r = raw as Record<string, any>;

  if (r.identity && typeof r.identity.godId === "string" && getArchetype(r.identity.godId)) {
    out.identity = {
      godId: r.identity.godId,
      level: getLevel(r.identity.level)?.id ?? null,
      at: num(r.identity.at, Date.now()),
    };
  }
  if (r.creature && typeof r.creature.creatureId === "string" && getCreature(r.creature.creatureId)) {
    const age = r.creature.age;
    out.creature = {
      creatureId: r.creature.creatureId,
      rarity: creatureRarity(r.creature.creatureId),
      at: num(r.creature.at, Date.now()),
      age:
        age && STAGES.includes(age.stage) && typeof age.label === "string" && typeof age.text === "string"
          ? { stage: age.stage, label: age.label.slice(0, 60), text: age.text.slice(0, 200) }
          : null,
    };
  }
  if (r.secondCreature && typeof r.secondCreature.creatureId === "string" && getCreature(r.secondCreature.creatureId)) {
    out.secondCreature = {
      creatureId: r.secondCreature.creatureId,
      rarity: creatureRarity(r.secondCreature.creatureId),
      at: num(r.secondCreature.at, Date.now()),
    };
  }
  if (r.creatureStars && typeof r.creatureStars === "object") {
    out.creatureStars = { main: stars(r.creatureStars.main), second: stars(r.creatureStars.second) };
  }
  if (r.gender === "male" || r.gender === "female") out.gender = r.gender;
  if (!out.creature) out.creatureStars.main = 0;
  if (!out.secondCreature) out.creatureStars.second = 0;
  return out;
}
