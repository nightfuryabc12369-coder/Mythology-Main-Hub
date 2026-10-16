import { loadAccount, refreshAccount, resetAccountMemory, schedulePush, pushNow, usePlayer } from "@/lib/account";
import { useArchiveStore } from "@/lib/archive-store";
import { useEffect, useRef } from "react";

/**
 * Invisible helper mounted once in the app shell.
 * - When a player signs in, it loads their saved profile and merges it with this device.
 * - While they play, every change to cards / ambrosia / wish cooldown / god title / creatures is saved to their account.
 */
export function AccountSync() {
  const { player } = usePlayer();
  const hydrated = useArchiveStore((state) => state.hydrated);
  const playerId = player?.id ?? null;
  const loadedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!playerId) {
      if (loadedFor.current) {
        loadedFor.current = null;
        resetAccountMemory();
      }
      return;
    }
    if (loadedFor.current === playerId) return;
    loadedFor.current = playerId;
    void loadAccount(playerId);
  }, [hydrated, playerId]);

  useEffect(() => {
    if (!playerId) return;
    const unsubscribe = useArchiveStore.subscribe((state, previous) => {
      if (
        state.cards !== previous.cards ||
        state.pills !== previous.pills ||
        state.nextWishAt !== previous.nextWishAt ||
        state.identity !== previous.identity ||
        state.creature !== previous.creature ||
        state.secondCreature !== previous.secondCreature ||
        state.creatureStars !== previous.creatureStars ||
        state.gender !== previous.gender
      ) {
        schedulePush();
      }
    });
    const onVisibility = () => {
      if (document.visibilityState === "hidden") void pushNow(true);
      else void refreshAccount();
    };
    document.addEventListener("visibilitychange", onVisibility);
    // Pick up staff changes and bans without a reload.
    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") void refreshAccount();
    }, 60_000);
    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(poll);
    };
  }, [playerId]);

  return null;
}
