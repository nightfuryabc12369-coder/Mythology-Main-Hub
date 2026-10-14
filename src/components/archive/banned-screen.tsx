import { signOutAndClear, useAccountStore, usePlayer } from "@/lib/account";
import { useState } from "react";

/** Covers the whole site for an account that staff banned. */
export function BannedScreen() {
  const banned = useAccountStore((state) => state.banned);
  const reason = useAccountStore((state) => state.banReason);
  const { player } = usePlayer();
  const [busy, setBusy] = useState(false);
  if (!banned) return null;
  return (
    <div role="alertdialog" aria-modal="true" aria-label="Banned" className="fixed inset-0 z-[200] flex items-center justify-center bg-bg-deep p-6 text-center">
      <div className="max-w-md">
        <p className="text-xs tracking-kicker text-wine uppercase">Account banned</p>
        <h1 className="mt-3 font-display text-4xl text-fg sm:text-5xl">You cannot enter</h1>
        <p className="mt-4 text-sm text-muted">The staff of Aether Codex have banned this account from the site.</p>
        {reason ? <p className="mt-3 text-sm text-fg">Reason: {reason}</p> : null}
        <button
          type="button"
          disabled={busy || !player}
          onClick={() => {
            if (!player) return;
            setBusy(true);
            signOutAndClear(player.id)
              .catch(() => undefined)
              .finally(() => setBusy(false));
          }}
          className="pressable mt-8 min-h-12 rounded-sm border border-border px-6 text-xs tracking-kicker text-fg uppercase disabled:opacity-60"
        >
          {busy ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );
}
