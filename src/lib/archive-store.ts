import type { FavoriteKind } from "@/data/types";
import type { LevelId } from "@/data/identity";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Favorites = Record<FavoriteKind, string[]>;

/** Result of the "Choose who you are" quizzes. Saved on this device. */
export type Identity = { godId: string; level: LevelId | null; at: number };

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
      setIdentity: (godId) => set({ identity: { godId, level: null, at: Date.now() } }),
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
      }),
    },
  ),
);
