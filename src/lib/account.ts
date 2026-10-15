import { useArchiveStore } from "@/lib/archive-store";
import { authEnabled, getBearerToken, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { emptyExtras, type Extras } from "@/lib/extras";
import { create } from "zustand";

/** Which account the cards on this device belong to (so guest progress is only merged once). */
const MARKER_KEY = "aether-codex-account";

export type SyncState = "idle" | "saving" | "saved" | "error";
export type StaffRole = "admin" | "moderator" | null;

type AccountState = {
  /** null until the first answer from the server. */
  dbReady: boolean | null;
  loaded: boolean;
  avatar: string | null;
  joinedAt: string | null;
  sync: SyncState;
  /** "admin" or "moderator" for staff accounts. */
  role: StaffRole;
  /** Set when staff banned this account. */
  banned: boolean;
  banReason: string;
  /** The newest staff change this device has taken in (see /api/profile). */
  rev: number;
  set: (patch: Partial<Omit<AccountState, "set">>) => void;
};

export const useAccountStore = create<AccountState>()((set) => ({
  dbReady: null,
  loaded: false,
  avatar: null,
  joinedAt: null,
  sync: "idle",
  role: null,
  banned: false,
  banReason: "",
  rev: 0,
  set: (patch) => set(patch),
}));

type ServerProfile = { cards: Record<string, number>; pills: number; nextWishAt: number; avatar: string | null; rev?: number; extras?: Extras };
type ProfileResponse = {
  dbReady?: boolean;
  role?: StaffRole;
  banned?: boolean;
  reason?: string;
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

async function putProfile(body: unknown, keepalive = false): Promise<Response> {
  return fetch("/api/profile", {
    method: "PUT",
    credentials: "same-origin",
    headers: headers({ "content-type": "application/json" }),
    body: JSON.stringify(body),
    keepalive,
  });
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

const REV_KEY = "aether-codex-rev";
function readRev(userId: string): number | null {
  try {
    const raw = window.localStorage.getItem(REV_KEY);
    if (!raw) return null;
    const [id, rev] = raw.split(":");
    return id === userId && Number.isFinite(Number(rev)) ? Number(rev) : null;
  } catch {
    return null;
  }
}
function writeRev(userId: string | null, rev: number | null) {
  try {
    if (userId && rev !== null) window.localStorage.setItem(REV_KEY, `${userId}:${rev}`);
    else window.localStorage.removeItem(REV_KEY);
  } catch {
    /* storage unavailable */
  }
}

let mergedFor: string | null = null;
let pushSuspended = false;
let pushTimer: number | undefined;

function localExtras(): Extras {
  const { identity, creature, secondCreature, creatureStars } = useArchiveStore.getState();
  return { identity, creature, secondCreature, creatureStars };
}

function currentState() {
  const { cards, pills, nextWishAt } = useArchiveStore.getState();
  return { cards, pills, nextWishAt, extras: localExtras() };
}

/** Staff changed this profile (or the account was banned): take what the server has. */
function applyServerProfile(profile: ServerProfile) {
  const extras = profile.extras ?? emptyExtras();
  useArchiveStore.setState({
    cards: profile.cards ?? {},
    pills: profile.pills ?? 0,
    nextWishAt: profile.nextWishAt ?? 0,
    identity: extras.identity,
    creature: extras.creature,
    secondCreature: extras.secondCreature,
    creatureStars: extras.creatureStars,
  });
  const rev = Number(profile.rev ?? 0);
  useAccountStore.getState().set({ rev, avatar: profile.avatar ?? useAccountStore.getState().avatar });
  writeRev(mergedFor, rev);
}

function markBanned(reason: string) {
  pushSuspended = true;
  window.clearTimeout(pushTimer);
  useAccountStore.getState().set({ banned: true, banReason: reason, loaded: true, role: null });
}

export async function pushNow(keepalive = false) {
  if (!mergedFor || pushSuspended) return;
  window.clearTimeout(pushTimer);
  useAccountStore.getState().set({ sync: "saving" });
  try {
    const response = await putProfile({ state: currentState(), rev: useAccountStore.getState().rev }, keepalive);
    if (response.status === 409) {
      const data = (await response.json().catch(() => ({}))) as { profile?: ServerProfile };
      if (data.profile) applyServerProfile(data.profile);
      useAccountStore.getState().set({ sync: "saved" });
      return;
    }
    if (response.status === 403) {
      const data = (await response.json().catch(() => ({}))) as { banned?: boolean; reason?: string };
      if (data.banned) {
        markBanned(data.reason ?? "");
        return;
      }
    }
    if (!response.ok) throw new Error(`profile save failed (${response.status})`);
    useAccountStore.getState().set({ sync: "saved" });
  } catch {
    useAccountStore.getState().set({ sync: "error" });
  }
}

/** Re-check the account now and then, so a staff change or a ban shows up without a reload. */
export async function refreshAccount() {
  if (!mergedFor || pushSuspended) return;
  if (useAccountStore.getState().sync === "saving") return;
  try {
    const { status, data } = await fetchProfile();
    if (status === 403 && data.banned) {
      markBanned(data.reason ?? "");
      return;
    }
    if (status !== 200 || !data.profile) return;
    useAccountStore.getState().set({ role: data.role ?? null });
    if (Number(data.profile.rev ?? 0) !== useAccountStore.getState().rev) applyServerProfile(data.profile);
  } catch {
    /* try again next time */
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
    if (status === 403 && data.banned) {
      markBanned(data.reason ?? "");
      return;
    }
    if (status >= 500 || data.dbReady === false) {
      account.set({ dbReady: false, loaded: true, sync: "error" });
      return;
    }

    const server = data.profile ?? null;
    const local = useArchiveStore.getState();
    const sameDeviceOwner = readMarker() === userId;

    // If staff changed this profile since this device last looked, the saved profile wins outright,
    // so a removed card cannot come back from an old copy on this device.
    const serverRev = Number(server?.rev ?? 0);
    const seenRev = readRev(userId);
    const serverWins = serverRev > 0 && seenRev !== null && seenRev !== serverRev;

    const cards = serverWins ? (server?.cards ?? {}) : unionMax(server?.cards ?? {}, local.cards);
    // Ambrosia earned as a guest joins the account once; after that the account's number is the truth.
    const pills = serverWins ? (server?.pills ?? 0) : server ? server.pills + (sameDeviceOwner ? 0 : local.pills) : local.pills;
    const nextWishAt = serverWins ? (server?.nextWishAt ?? 0) : Math.max(server?.nextWishAt ?? 0, local.nextWishAt);

    // Title and creatures: the saved ones win; a guest's own are kept only if the account has none yet.
    const savedExtras = server?.extras ?? emptyExtras();
    const mine = localExtras();
    const extras: Extras = serverWins
      ? savedExtras
      : {
          identity: savedExtras.identity ?? mine.identity,
          creature: savedExtras.creature ?? mine.creature,
          secondCreature: savedExtras.secondCreature ?? mine.secondCreature,
          creatureStars: {
            main: savedExtras.creature && mine.creature && savedExtras.creature.creatureId !== mine.creature.creatureId ? savedExtras.creatureStars.main : Math.max(savedExtras.creatureStars.main, mine.creatureStars.main),
            second: Math.max(savedExtras.creatureStars.second, mine.creatureStars.second),
          },
        };

    useArchiveStore.setState({ cards, pills, nextWishAt, ...extras });
    writeMarker(userId);
    writeRev(userId, serverRev);
    mergedFor = userId;
    account.set({
      dbReady: true,
      loaded: true,
      rev: serverRev,
      role: data.role ?? null,
      banned: false,
      banReason: "",
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
  pushSuspended = false;
  window.clearTimeout(pushTimer);
  useAccountStore.getState().set({ loaded: false, avatar: null, joinedAt: null, sync: "idle", role: null, banned: false, banReason: "", rev: 0 });
}

/**
 * Sign out and clear this device's copy of the cards (they stay saved on the account),
 * so the next person on this device starts fresh. Saving is paused while clearing so an
 * empty hand can never be written over the account.
 */
export async function signOutAndClear(userId: string) {
  pushSuspended = true;
  window.clearTimeout(pushTimer);
  useArchiveStore.setState({ cards: {}, pills: 0, ...emptyExtras() });
  writeMarker(null);
  writeRev(null, null);
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
  const response = await putProfile({ avatar });
  if (!response.ok) throw new Error(`profile save failed (${response.status})`);
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

