import { useArchiveStore } from "@/lib/archive-store";
import { authEnabled, getBearerToken, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { create } from "zustand";

/** Which account the cards on this device belong to (so guest progress is only merged once). */
const MARKER_KEY = "aether-codex-account";

export type SyncState = "idle" | "saving" | "saved" | "error";

type AccountState = {
  /** null until the first answer from the server. */
  dbReady: boolean | null;
  loaded: boolean;
  avatar: string | null;
  joinedAt: string | null;
  sync: SyncState;
  set: (patch: Partial<Omit<AccountState, "set">>) => void;
};

export const useAccountStore = create<AccountState>()((set) => ({
  dbReady: null,
  loaded: false,
  avatar: null,
  joinedAt: null,
  sync: "idle",
  set: (patch) => set(patch),
}));

type ServerProfile = { cards: Record<string, number>; pills: number; nextWishAt: number; avatar: string | null };
type ProfileResponse = {
  dbReady?: boolean;
  user?: { name: string; email: string; createdAt: string };
  profile?: ServerProfile | null;
};

function headers(extra?: Record<string, string>) {
  const token = getBearerToken();
  return { ...(extra ?? {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

/** Ask the server for the profile. `signedIn: false` means nobody is signed in on the server side. */
export async function fetchProfile(): Promise<{ status: number; data: ProfileResponse }> {
  const response = await fetch("/api/profile", { credentials: "same-origin", headers: headers(), cache: "no-store" });
  let data: ProfileResponse = {};
  try {
    data = (await response.json()) as ProfileResponse;
  } catch {
    /* empty body */
  }
  return { status: response.status, data };
}

async function putProfile(body: unknown, keepalive = false) {
  const response = await fetch("/api/profile", {
    method: "PUT",
    credentials: "same-origin",
    headers: headers({ "content-type": "application/json" }),
    body: JSON.stringify(body),
    keepalive,
  });
  if (!response.ok) throw new Error(`profile save failed (${response.status})`);
}

// ── Merging what is on this device with what is saved on the account ─────────────

function unionMax(a: Record<string, number>, b: Record<string, number>) {
  const out: Record<string, number> = { ...a };
  for (const [id, level] of Object.entries(b)) out[id] = Math.max(out[id] ?? 0, level);
  return out;
}

function readMarker() {
  try {
    return window.localStorage.getItem(MARKER_KEY);
  } catch {
    return null;
  }
}
function writeMarker(value: string | null) {
  try {
    if (value) window.localStorage.setItem(MARKER_KEY, value);
    else window.localStorage.removeItem(MARKER_KEY);
  } catch {
    /* storage unavailable */
  }
}

let mergedFor: string | null = null;
let pushSuspended = false;
let pushTimer: number | undefined;

function currentState() {
  const { cards, pills, nextWishAt } = useArchiveStore.getState();
  return { cards, pills, nextWishAt };
}

export async function pushNow(keepalive = false) {
  if (!mergedFor || pushSuspended) return;
  window.clearTimeout(pushTimer);
  useAccountStore.getState().set({ sync: "saving" });
  try {
    await putProfile({ state: currentState() }, keepalive);
    useAccountStore.getState().set({ sync: "saved" });
  } catch {
    useAccountStore.getState().set({ sync: "error" });
  }
}

export function schedulePush() {
  if (!mergedFor || pushSuspended) return;
  window.clearTimeout(pushTimer);
  useAccountStore.getState().set({ sync: "saving" });
  pushTimer = window.setTimeout(() => void pushNow(), 800);
}

/** Load the account's saved profile and merge it with this device. Called once per sign-in. */
export async function loadAccount(userId: string): Promise<void> {
  const account = useAccountStore.getState();
  try {
    const { status, data } = await fetchProfile();
    if (status === 401) return; // not signed in on the server — nothing to load
    if (status >= 500 || data.dbReady === false) {
      account.set({ dbReady: false, loaded: true, sync: "error" });
      return;
    }

    const server = data.profile ?? null;
    const local = useArchiveStore.getState();
    const sameDeviceOwner = readMarker() === userId;

    const cards = unionMax(server?.cards ?? {}, local.cards);
    // Ambrosia earned as a guest joins the account once; after that the account's number is the truth.
    const pills = server ? server.pills + (sameDeviceOwner ? 0 : local.pills) : local.pills;
    const nextWishAt = Math.max(server?.nextWishAt ?? 0, local.nextWishAt);

    useArchiveStore.setState({ cards, pills, nextWishAt });
    writeMarker(userId);
    mergedFor = userId;
    account.set({
      dbReady: true,
      loaded: true,
      avatar: server?.avatar ?? useAccountStore.getState().avatar,
      joinedAt: data.user?.createdAt ?? null,
    });
    await pushNow();
  } catch {
    account.set({ loaded: true, sync: "error" });
  }
}

/** Forget the signed-in account in memory (the saved profile on the server is untouched). */
export function resetAccountMemory() {
  mergedFor = null;
  window.clearTimeout(pushTimer);
  useAccountStore.getState().set({ loaded: false, avatar: null, joinedAt: null, sync: "idle" });
}

/**
 * Sign out and clear this device's copy of the cards (they stay saved on the account),
 * so the next person on this device starts fresh. Saving is paused while clearing so an
 * empty hand can never be written over the account.
 */
export async function signOutAndClear(userId: string) {
  pushSuspended = true;
  window.clearTimeout(pushTimer);
  useArchiveStore.setState({ cards: {}, pills: 0 });
  writeMarker(null);
  try {
    await signOut("/");
  } catch (error) {
    // Still signed in: bring the saved cards back and allow saving again.
    pushSuspended = false;
    mergedFor = null;
    void loadAccount(userId);
    throw error;
  }
}

// ── Profile picture ─────────────────────────────────────────────────────────────

/** Shrink and square-crop a chosen photo to a small JPEG data URL. */
export async function imageFileToAvatar(file: File, size = 256): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("That image could not be read."));
      img.src = url;
    });
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    const sx = (image.naturalWidth - side) / 2;
    const sy = (image.naturalHeight - side) / 2;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not process the image.");
    context.fillStyle = "#1c1712";
    context.fillRect(0, 0, size, size);
    context.drawImage(image, sx, sy, side, side, 0, 0, size, size);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function saveAvatar(avatar: string | null) {
  await putProfile({ avatar });
  useAccountStore.getState().set({ avatar });
}

// ── Reading the signed-in player in components ──────────────────────────────────

export type Player = { id: string; name: string; email: string };

/** The signed-in player (never the built-in dev user), whether the session is still loading, and whether accounts are on. */
export function usePlayer(): { player: Player | null; isPending: boolean; accountsOn: boolean } {
  const { user, isPending } = useCurrentUserState();
  if (!authEnabled || !user || user.isDevFallback) return { player: null, isPending: authEnabled ? isPending : false, accountsOn: authEnabled };
  return {
    player: { id: user.id, name: user.displayName ?? "Traveler", email: user.primaryEmail ?? "" },
    isPending,
    accountsOn: true,
  };
}

