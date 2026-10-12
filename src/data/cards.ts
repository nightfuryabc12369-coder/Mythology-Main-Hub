import { gods } from "./gods";
import { STAT_KEYS, type God, type StatKey } from "./types";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export const RARITIES: Rarity[] = ["common", "rare", "epic", "legendary"];
export const MAX_LEVEL = 10;
export const REST_HOURS = 6;
export const PILLS_PER_WISH = 3;
export const LEGENDARY_UNLOCK_CARDS = 3;

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export const RARITY_COLOR: Record<Rarity, string> = {
  common: "#b9a88f",
  rare: "#7fb4d9",
  epic: "#b98ae0",
  legendary: "#e4c98a",
};

/** Share of all pulls each rarity gets, before dropping tiers you have already emptied. */
const RARITY_WEIGHT: Record<Rarity, number> = { common: 56, rare: 30, epic: 11, legendary: 3 };

const POWER_WEIGHTS: Record<StatKey, number> = {
  might: 0.3,
  wrath: 0.15,
  cunning: 0.15,
  endurance: 0.2,
  dominion: 0.1,
  craft: 0.05,
  favor: 0.05,
};

/** The same weighting the Measure page battle uses, so strong cards feel strong. */
export function godPower(god: God) {
  return Math.round(STAT_KEYS.reduce((sum, [key]) => sum + god.stats[key as StatKey] * POWER_WEIGHTS[key as StatKey], 0));
}

/** A level 1 card shows 40% of its power. Level 10 shows all of it. */
export function cardPower(god: God, level: number) {
  const clamped = Math.min(MAX_LEVEL, Math.max(1, level));
  return Math.round(godPower(god) * (0.4 + (0.6 * (clamped - 1)) / (MAX_LEVEL - 1)));
}

const ranked = [...gods].sort((a, b) => godPower(b) - godPower(a));

/** Top 7 legendary, next 10 epic, next 13 rare, everyone else common. */
const rarityById: Record<string, Rarity> = Object.fromEntries(
  ranked.map((god, index) => [god.id, (index < 7 ? "legendary" : index < 17 ? "epic" : index < 30 ? "rare" : "common") as Rarity]),
);

export function rarityOf(id: string): Rarity {
  return rarityById[id] ?? "common";
}

export type PullRow = { god: God; rarity: Rarity; pct: number };

export type WishKind = "warrior" | "power" | "legend";

/** Every card a wish could still give you, with its exact chance. Owned cards are skipped. */
export function pullTable(owned: string[], pool: "any" | "legendary"): PullRow[] {
  const have = new Set(owned);
  const available = gods.filter((god) => !have.has(god.id) && (pool === "any" || rarityOf(god.id) === "legendary"));
  const tiers = RARITIES.filter((tier) => available.some((god) => rarityOf(god.id) === tier));
  const totalWeight = tiers.reduce((sum, tier) => sum + RARITY_WEIGHT[tier], 0);
  const rows: PullRow[] = [];
  for (const tier of tiers) {
    const members = available.filter((god) => rarityOf(god.id) === tier);
    // Inside a tier the weaker figures turn up slightly more often.
    const inner = members.map((god) => 100 - godPower(god) + 20);
    const innerTotal = inner.reduce((a, b) => a + b, 0);
    const tierShare = (RARITY_WEIGHT[tier] / totalWeight) * 100;
    members.forEach((god, i) => rows.push({ god, rarity: tier, pct: (inner[i] / innerTotal) * tierShare }));
  }
  return rows.sort((a, b) => b.pct - a.pct);
}

export function rarityRates(rows: PullRow[]) {
  return RARITIES.map((tier) => {
    const members = rows.filter((row) => row.rarity === tier);
    return { tier, count: members.length, pct: members.reduce((sum, row) => sum + row.pct, 0) };
  }).filter((row) => row.count > 0);
}

export function rollCard(rows: PullRow[]): God | null {
  if (rows.length === 0) return null;
  let roll = Math.random() * rows.reduce((sum, row) => sum + row.pct, 0);
  for (const row of rows) {
    roll -= row.pct;
    if (roll <= 0) return row.god;
  }
  return rows[rows.length - 1].god;
}
