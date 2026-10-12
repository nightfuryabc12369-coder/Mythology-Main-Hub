import type { FavoriteKind } from "@/data/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Favorites = Record<FavoriteKind, string[]>;

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
  oracleBest: number;
  favorites: Favorites;
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
  setOracleBest: (score: number) => void;
  isFavorite: (kind: FavoriteKind, id: string) => boolean;
  toggleFavorite: (kind: FavoriteKind, id: string) => void;
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
      oracleBest: 0,
      favorites: emptyFavorites,
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
      setOracleBest: (score) => set({ oracleBest: Math.max(get().oracleBest, score) }),
      isFavorite: (kind, id) => get().favorites[kind].includes(id),
      toggleFavorite: (kind, id) => {
        const current = get().favorites[kind];
        const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
        set({ favorites: { ...get().favorites, [kind]: next } });
      },
    }),
    {
      name: "aether-codex-v1",
      skipHydration: true,
      partialize: (state) => ({
        seated: state.seated,
        compareLeft: state.compareLeft,
        compareRight: state.compareRight,
        sound: state.sound,
        oracleBest: state.oracleBest,
        favorites: state.favorites,
      }),
    },
  ),
);
