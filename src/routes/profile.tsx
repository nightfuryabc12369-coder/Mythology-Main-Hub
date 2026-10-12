import { Avatar } from "@/components/archive/avatar";
import { CardTile } from "@/components/archive/wish";
import { PageHero } from "@/components/archive/widgets";
import { MAX_LEVEL, godPower, rarityOf } from "@/data/cards";
import { gods } from "@/data/gods";
import { imageFileToAvatar, saveAvatar, signOutAndClear, useAccountStore, usePlayer } from "@/lib/account";
import { useArchiveStore } from "@/lib/archive-store";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Camera, Lock } from "lucide-react";
import { useRef, useState } from "react";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

const rarityRank = { legendary: 0, epic: 1, rare: 2, common: 3 } as const;

const SYNC_TEXT = {
  idle: "",
  saving: "Saving to your account…",
  saved: "Saved to your account",
  error: "Could not reach your account. Your progress is kept on this device.",
} as const;

function ProfilePage() {
  const hydrated = useArchiveStore((state) => state.hydrated);
  const cards = useArchiveStore((state) => state.cards);
  const pills = useArchiveStore((state) => state.pills);
  const upgradeCard = useArchiveStore((state) => state.upgradeCard);
  const { player, isPending, accountsOn } = usePlayer();

  const owned = hydrated
    ? gods
        .filter((god) => cards[god.id])
        .sort((a, b) => rarityRank[rarityOf(a.id)] - rarityRank[rarityOf(b.id)] || godPower(b) - godPower(a))
    : [];

  return (
    <main>
      <PageHero
        kicker="Profile"
        title={player ? player.name : "My cards"}
        subtitle="Every figure the Fates have given you, and the ambrosia to raise them."
      />
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6">
        {player ? <AccountPanel name={player.name} email={player.email} id={player.id} /> : null}

        {!player && !isPending && accountsOn ? (
          <div className="flex flex-col gap-4 rounded-md bg-surface p-6 shadow-border sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl text-fg">Keep your profile safe</h2>
              <p className="mt-1 max-w-xl text-sm text-muted">
                You are playing as a guest, so your cards live only on this device. Create an account with your email to save them for good.
              </p>
            </div>
            <Link
              to="/login"
              className="pressable inline-flex min-h-11 shrink-0 items-center justify-center rounded-sm bg-primary px-5 text-xs tracking-kicker text-primary-fg uppercase"
            >
              Sign up or sign in
            </Link>
          </div>
        ) : null}

        <section>
          <h2 className="font-display text-3xl text-fg">My cards</h2>
          <p className="mt-1 text-sm text-muted">
            {owned.length} of {gods.length} owned
          </p>
          {!hydrated ? <p className="mt-6 text-sm text-muted">Opening your hand…</p> : null}
          {hydrated && owned.length === 0 ? (
            <p className="mt-6 text-sm text-muted">
              No cards yet. Ask the Pantheon for a wish on the{" "}
              <Link to="/" hash="wish" className="text-primary underline">
                home page
              </Link>
              .
            </p>
          ) : null}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {owned.map((god) => {
              const level = cards[god.id];
              return (
                <CardTile key={god.id} god={god} level={level}>
                  <button
                    type="button"
                    disabled={pills < 1 || level >= MAX_LEVEL}
                    onClick={() => upgradeCard(god.id)}
                    className="pressable mt-2 min-h-10 w-full rounded-sm border border-border text-[11px] tracking-kicker text-primary uppercase disabled:opacity-40"
                  >
                    {level >= MAX_LEVEL ? "Max level" : "Use ambrosia"}
                  </button>
                </CardTile>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl text-fg">My inventory</h2>
          <p className="mt-1 text-sm text-muted">Upgrade materials and other treasures are kept here.</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-md bg-surface p-5 shadow-border">
              <h3 className="font-display text-xl text-fg">Ambrosia</h3>
              <p className="mt-2 font-display text-5xl text-primary">x{hydrated ? pills : 0}</p>
              <p className="mt-3 text-sm text-muted">Raises one card by a level (up to Level {MAX_LEVEL}).</p>
            </div>
            {[0, 1, 2].map((slot) => (
              <div
                key={slot}
                className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border p-5 text-center"
              >
                <Lock className="size-5 text-subtle" />
                <p className="text-xs tracking-kicker text-subtle uppercase">Empty slot</p>
                <p className="text-xs text-subtle">New materials will appear here.</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted">
            Card art is a placeholder for now. Add an image named after each figure, like <code>public/cards/zeus.jpg</code>, and it appears here.
          </p>
        </section>
      </div>
    </main>
  );
}

function AccountPanel({ name, email, id }: { name: string; email: string; id: string }) {
  const avatar = useAccountStore((state) => state.avatar);
  const joinedAt = useAccountStore((state) => state.joinedAt);
  const sync = useAccountStore((state) => state.sync);
  const cards = useArchiveStore((state) => state.cards);
  const hydrated = useArchiveStore((state) => state.hydrated);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ownedCount = hydrated ? Object.keys(cards).length : 0;
  const joined = joinedAt
    ? new Date(joinedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : null;

  async function change(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      await saveAvatar(await imageFileToAvatar(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "The picture could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await saveAvatar(null);
    } catch {
      setError("The picture could not be removed.");
    } finally {
      setBusy(false);
    }
  }

  async function leave() {
    setBusy(true);
    try {
      await signOutAndClear(id);
    } catch {
      setError("Sign-out did not go through. Try again.");
      setBusy(false);
    }
  }

  return (
    <section className="flex flex-col gap-6 rounded-md bg-surface p-6 shadow-border sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        aria-label="Change profile picture"
        className="group relative size-28 shrink-0 self-start rounded-full sm:self-center"
      >
        <Avatar name={name} src={avatar} className="size-28 text-5xl" />
        <span className="absolute inset-0 grid place-items-center rounded-full bg-black/50 text-fg opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Camera className="size-6" />
        </span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          void change(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-display text-3xl text-fg">{name}</h2>
        <p className="truncate text-sm text-muted">{email}</p>
        {joined ? <p className="mt-1 text-xs text-subtle">Member since {joined}</p> : null}
        <p className="mt-3 text-sm text-muted">
          {ownedCount} {ownedCount === 1 ? "card" : "cards"} collected
        </p>
        {SYNC_TEXT[sync] ? (
          <p className="mt-1 text-xs text-subtle" role="status">
            {SYNC_TEXT[sync]}
          </p>
        ) : null}
        {error ? (
          <p className="mt-2 text-sm text-fg" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 sm:flex-col">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="pressable min-h-11 rounded-sm border border-border px-4 text-xs tracking-kicker text-primary uppercase disabled:opacity-50"
        >
          {avatar ? "Change photo" : "Add photo"}
        </button>
        {avatar ? (
          <button
            type="button"
            onClick={() => void remove()}
            disabled={busy}
            className="pressable min-h-11 rounded-sm border border-border px-4 text-xs tracking-kicker text-muted uppercase disabled:opacity-50"
          >
            Remove photo
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => void leave()}
          disabled={busy}
          className="pressable min-h-11 rounded-sm border border-border px-4 text-xs tracking-kicker text-muted uppercase disabled:opacity-50"
        >
          Sign out
        </button>
      </div>
    </section>
  );
}
