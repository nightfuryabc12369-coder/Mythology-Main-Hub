import type { FavoriteKind } from "@/data/types";
import type { LevelId } from "@/data/identity";
import type { AgeStage, Rarity } from "@/data/creatures";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_STARS, STAR_COPIES } from "@/data/cards";
import { feedForStar } from "@/data/shop";

export type Favorites = Record<FavoriteKind, string[]>;

/** Result of the "Find who you are" quizzes. Saved on this device. */
export type Identity = { godId: string; level: LevelId | null; at: number };

/** Result of the "Find your Creature" quizzes. One shot only, saved on this device. */
export type CreatureResult = {
  creatureId: string;
  rarity: Rarity;
  at: number;
  /** Set once the age quiz is done. */
  age: { stage: AgeStage; label: string; text: string } | null;
};

/** One-time "change my result" wishes. 0 = not wished, 1 = granted (one retake available), 2 = used up. */
export type ChangeState = 0 | 1 | 2;
export type ChangeWishes = { identity: ChangeState; creature: ChangeState };

/** Best result for a play-hall quiz. The label is the title earned. */
export type QuizResult = { score: number; total: number; tier: 0 | 1 | 2; label: string; at: number };

export type SecondCreature = { creatureId: string; rarity: Rarity; at: number };

export type Overlay =
  | { type: "god"; id: string }
  | { type: "myth"; id: string }
  | { type: "epithet"; id: string }
  | { type: "epic"; id: string }
  | { type: "age"; id: string }
  | null;

type ArchiveState = {
  hydrated: boolean;
  searchOpen: boolean;
  searchQuery: string;
  overlay: Overlay;
  seated: string[];
  councilOpen: boolean;
  compareLeft: string;
  compareRight: string;
  sound: boolean;
  volume: number;
  oracleBest: number;
  favorites: Favorites;
  cards: Record<string, number>;
  pills: number;
  nextWishAt: number;
  identity: Identity | null;
  changes: ChangeWishes;
  /** The play-hall coin, earned from correct quiz answers. */
  drachmas: number;
  /** Creature feed in the inventory. */
  feed: number;
  /** How many of each card you hold (a card from a wish counts as 1). */
  copies: Record<string, number>;
  /** Golden stars on each card. */
  stars: Record<string, number>;
  /** The second creature, bought in the shop. One only, for good. */
  secondCreature: SecondCreature | null;
  creatureStars: { main: number; second: number };
  /** Chosen once at sign-up. It can be set only while empty. */
  gender: "male" | "female" | null;
  setGender: (gender: "male" | "female") => void;
  earn: (amount: number) => void;
  buyCard: (id: string, price: number) => boolean;
  buyPills: (count: number, price: number) => boolean;
  buyFeed: (count: number, price: number) => boolean;
  buySecondCreature: (creatureId: string, rarity: Rarity, price: number) => boolean;
  starUpCard: (id: string) => void;
  feedCreature: (slot: "main" | "second") => void;
  quizResults: Record<string, QuizResult>;
  recordQuiz: (id: string, result: QuizResult) => void;
  grantChange: (kind: keyof ChangeWishes) => void;
  creature: CreatureResult | null;
  setCreature: (creatureId: string, rarity: Rarity) => void;
  setCreatureAge: (age: NonNullable<CreatureResult["age"]>) => void;
  setIdentity: (godId: string) => void;
  setIdentityLevel: (level: LevelId) => void;
  clearIdentity: () => void;
  setHydrated: (value: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  openOverlay: (overlay: Overlay) => void;
  closeOverlay: () => void;
  toggleSeat: (id: string) => void;
  resetSeats: () => void;
  setCouncilOpen: (open: boolean) => void;
  setCompare: (side: "left" | "right", id: string) => void;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
  setOracleBest: (score: number) => void;
  isFavorite: (kind: FavoriteKind, id: string) => boolean;
  toggleFavorite: (kind: FavoriteKind, id: string) => void;
  grantCard: (id: string) => void;
  addPills: (count: number) => void;
  upgradeCard: (id: string) => void;
  startRest: (ms: number) => void;
};

const emptyFavorites: Favorites = { god: [], myth: [], epithet: [], epic: [] };

export const useArchiveStore = create<ArchiveState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      searchOpen: false,
      searchQuery: "",
      overlay: null,
      seated: [],
      councilOpen: false,
      compareLeft: "zeus",
      compareRight: "hades",
      sound: false,
      volume: 0.5,
      oracleBest: 0,
      favorites: emptyFavorites,
      cards: {},
      pills: 0,
      nextWishAt: 0,
      identity: null,
      drachmas: 0,
      feed: 0,
      copies: {},
      stars: {},
      secondCreature: null,
      creatureStars: { main: 0, second: 0 },
      gender: null,
      setGender: (gender) => {
        if (get().gender) return;
        set({ gender });
      },
      earn: (amount) => set({ drachmas: get().drachmas + Math.max(0, Math.floor(amount)) }),
      buyCard: (id, price) => {
        const { drachmas, cards, copies } = get();
        if (drachmas < price) return false;
        if (!cards[id]) {
          set({ drachmas: drachmas - price, cards: { ...cards, [id]: 1 }, copies: { ...copies, [id]: 1 } });
        } else {
          set({ drachmas: drachmas - price, copies: { ...copies, [id]: (copies[id] ?? 1) + 1 } });
        }
        return true;
      },
      buyPills: (count, price) => {
        const { drachmas, pills } = get();
        if (drachmas < price) return false;
        set({ drachmas: drachmas - price, pills: pills + count });
        return true;
      },
      buyFeed: (count, price) => {
        const { drachmas, feed } = get();
        if (drachmas < price) return false;
        set({ drachmas: drachmas - price, feed: feed + count });
        return true;
      },
      buySecondCreature: (creatureId, rarity, price) => {
        const { drachmas, secondCreature, creature } = get();
        // One only, and it cannot be the same as the main creature.
        if (secondCreature || drachmas < price || creature?.creatureId === creatureId) return false;
        set({ drachmas: drachmas - price, secondCreature: { creatureId, rarity, at: Date.now() } });
        return true;
      },
      starUpCard: (id) => {
        const { cards, copies, stars } = get();
        if (!cards[id]) return;
        const have = copies[id] ?? 1;
        const level = stars[id] ?? 0;
        if (have < STAR_COPIES || level >= MAX_STARS) return;
        set({ copies: { ...copies, [id]: have - (STAR_COPIES - 1) }, stars: { ...stars, [id]: level + 1 } });
      },
      feedCreature: (slot) => {
        const { feed, creatureStars, creature, secondCreature } = get();
        if (slot === "main" ? !creature : !secondCreature) return;
        const level = creatureStars[slot];
        const cost = feedForStar(level);
        if (level >= MAX_STARS || feed < cost) return;
        set({ feed: feed - cost, creatureStars: { ...creatureStars, [slot]: level + 1 } });
      },
      quizResults: {},
      recordQuiz: (id, result) => {
        const best = get().quizResults[id];
        if (best && (best.tier > result.tier || (best.tier === result.tier && best.score >= result.score))) return;
        set({ quizResults: { ...get().quizResults, [id]: result } });
      },
      creature: null,
      changes: { identity: 0, creature: 0 },
      grantChange: (kind) => {
        const changes = get().changes;
        if (changes[kind] !== 0) return;
        set({ changes: { ...changes, [kind]: 1 } });
      },
      setCreature: (creatureId, rarity) => {
        // One shot: a creature can only be replaced once, and only after the "change my creature" wish.
        const { creature, changes } = get();
        if (creature && changes.creature !== 1) return;
        set({
          creature: { creatureId, rarity, at: Date.now(), age: null },
          creatureStars: { ...get().creatureStars, main: 0 },
          changes: creature ? { ...changes, creature: 2 } : changes,
        });
      },
      setCreatureAge: (age) => {
        const current = get().creature;
        if (current && !current.age) set({ creature: { ...current, age } });
      },
      setIdentity: (godId) => {
        const { identity, changes } = get();
        if (identity && changes.identity !== 1) return;
        set({
          identity: { godId, level: null, at: Date.now() },
          changes: identity ? { ...changes, identity: 2 } : changes,
        });
      },
      setIdentityLevel: (level) => {
        const current = get().identity;
        if (current) set({ identity: { ...current, level } });
      },
      clearIdentity: () => set({ identity: null }),
      setHydrated: (hydrated) => set({ hydrated }),
      setSearchOpen: (searchOpen) => set({ searchOpen, searchQuery: searchOpen ? get().searchQuery : "" }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      openOverlay: (overlay) => set({ overlay, searchOpen: false }),
      closeOverlay: () => set({ overlay: null }),
      toggleSeat: (id) => {
        const seated = get().seated;
        const next = seated.includes(id) ? seated.filter((seat) => seat !== id) : [...seated, id];
        set({ seated: next, councilOpen: next.length === 12 });
      },
      resetSeats: () => set({ seated: [], councilOpen: false }),
      setCouncilOpen: (councilOpen) => set({ councilOpen }),
      setCompare: (side, id) => {
        const other = side === "left" ? get().compareRight : get().compareLeft;
        if (other === id) {
          set(
            side === "left"
              ? { compareLeft: id, compareRight: get().compareLeft }
              : { compareRight: id, compareLeft: get().compareRight },
          );
          return;
        }
        set(side === "left" ? { compareLeft: id } : { compareRight: id });
      },
      toggleSound: () => set({ sound: !get().sound }),
      setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
      setOracleBest: (score) => set({ oracleBest: Math.max(get().oracleBest, score) }),
      isFavorite: (kind, id) => get().favorites[kind].includes(id),
      toggleFavorite: (kind, id) => {
        const current = get().favorites[kind];
        const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
        set({ favorites: { ...get().favorites, [kind]: next } });
      },
      grantCard: (id) => {
        const cards = get().cards;
        if (cards[id]) return;
        set({ cards: { ...cards, [id]: 1 } });
      },
      addPills: (count) => set({ pills: get().pills + count }),
      upgradeCard: (id) => {
        const level = get().cards[id];
        if (!level || level >= 10 || get().pills < 1) return;
        set({ cards: { ...get().cards, [id]: level + 1 }, pills: get().pills - 1 });
      },
      startRest: (ms) => set({ nextWishAt: Date.now() + ms }),
    }),
    {
      name: "aether-codex-v1",
      skipHydration: true,
      partialize: (state) => ({
        seated: state.seated,
        compareLeft: state.compareLeft,
        compareRight: state.compareRight,
        sound: state.sound,
        volume: state.volume,
        oracleBest: state.oracleBest,
        favorites: state.favorites,
        cards: state.cards,
        pills: state.pills,
        nextWishAt: state.nextWishAt,
        identity: state.identity,
        creature: state.creature,
        changes: state.changes,
        quizResults: state.quizResults,
        drachmas: state.drachmas,
        feed: state.feed,
        copies: state.copies,
        stars: state.stars,
        secondCreature: state.secondCreature,
        creatureStars: state.creatureStars,
        gender: state.gender,
      }),
    },
  ),
);
