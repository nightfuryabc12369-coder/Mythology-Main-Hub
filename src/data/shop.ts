import { isUltra, type Rarity as CardRarity } from "@/data/cards";
import type { Rarity as CreatureRarity } from "@/data/creatures";

/** The coin of the play hall. */
export const CURRENCY = "Drachmas";
export const CURRENCY_ONE = "Drachma";

/** Drachmas earned for every correct answer in a play-hall quiz. */
export const DRACHMAS_PER_CORRECT = 10;

const CARD_PRICE: Record<CardRarity, number> = { common: 60, rare: 180, epic: 450, legendary: 1200 };
export const ULTRA_PRICE = 3000;

export function cardPrice(id: string, rarity: CardRarity) {
  return isUltra(id) ? ULTRA_PRICE : CARD_PRICE[rarity];
}

export const AMBROSIA_PRICE = 40;
export const FEED_PRICE = 30;

export const CREATURE_PRICE: Record<CreatureRarity, number> = { common: 400, rare: 900, legendary: 2000 };

/** A creature earns its next star for this many pieces of feed. */
export function feedForStar(stars: number) {
  return stars + 1;
}
