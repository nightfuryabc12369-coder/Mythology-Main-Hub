import { Avatar } from "@/components/archive/avatar";
import { GenderChoice, type Gender } from "@/components/archive/gender-pick";
import { fetchProfile, imageFileToAvatar, saveAvatar, useAccountStore, usePlayer } from "@/lib/account";
import { authClient } from "@/lib/auth/client";
import { useArchiveStore } from "@/lib/archive-store";
import { cn } from "@/lib/utils";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

export const Route = createFileRoute("/login")({ component: LoginPage });

type Mode = "signup" | "signin";

const inputClass =
  "h-12 w-full rounded-sm border border-border bg-bg px-3 text-base text-fg outline-none placeholder:text-subtle focus:border-primary";
const labelClass = "mb-1.5 block text-xs tracking-kicker text-muted uppercase";

function LoginPage() {
  const navigate = useNavigate();
  const { player, isPending, accountsOn } = usePlayer();
  const dbReady = useAccountStore((state) => state.dbReady);
  const setAccount = useAccountStore((state) => state.set);

  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Find out whether the site is connected to its account database.
  useEffect(() => {
    if (!accountsOn) return;
    let cancelled = false;
    void fetchProfile()
      .then(({ status, data }) => {
        if (cancelled) return;
        setAccount({ dbReady: status < 500 && data.dbReady !== false });
      })
      .catch(() => {
        if (!cancelled) setAccount({ dbReady: false });
      });
    return () => {
      cancelled = true;
    };
  }, [accountsOn, setAccount]);

  async function choosePhoto(file: File | undefined) {
    if (!file) return;
    setMessage(null);
    try {
      setPhoto(await imageFileToAvatar(file));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "That image could not be used.");
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setMessage(null);

    const cleanEmail = email.trim();
    if (mode === "signup") {
      if (!name.trim()) return setMessage("Choose a name for your profile.");
      if (name.trim().length > 40) return setMessage("Keep your name under 40 characters.");
      if (!gender) return setMessage("Choose male or female. It cannot be changed later.");
    }
    if (!cleanEmail) return setMessage("Enter your email.");
    if (password.length < 8) return setMessage("Your password needs at least 8 characters.");

    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await authClient.signUp.email({ name: name.trim(), email: cleanEmail, password });
        if (error) {
          setMessage(error.message ?? "We could not create your account.");
          return;
        }
        if (gender) useArchiveStore.getState().setGender(gender);
        if (photo) {
          try {
            await saveAvatar(photo);
          } catch {
            /* the account exists; the picture can be added from the profile page */
          }
        }
      } else {
        const { error } = await authClient.signIn.email({ email: cleanEmail, password });
        if (error) {
          setMessage(error.message ?? "Email or password is not right.");
          return;
        }
      }
      await navigate({ to: "/profile" });
    } catch {
      setMessage("We could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const unavailable = !accountsOn || dbReady === false;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <p className="text-xs tracking-kicker text-gold uppercase">Aether Codex</p>
        <h1 className="mt-2 font-display text-4xl text-fg">{mode === "signup" ? "Keep your profile safe" : "Welcome back"}</h1>
        <p className="mt-3 text-sm text-muted">
          {mode === "signup"
            ? "Create an account with your email. Your cards and ambrosia are saved to it, so they follow you to any device."
            : "Sign in to open your saved cards and inventory."}
        </p>

        {!isPending && player ? (
          <div className="mt-8 rounded-md bg-surface p-6 shadow-border">
            <p className="text-sm text-muted">You are signed in as</p>
            <p className="mt-1 font-display text-2xl text-fg">{player.name}</p>
            <Link
              to="/profile"
              className="pressable mt-5 inline-flex min-h-11 items-center rounded-sm bg-primary px-5 text-xs tracking-kicker text-primary-fg uppercase"
            >
              Open my profile
            </Link>
          </div>
        ) : (
          <div className="mt-8 rounded-md bg-surface p-6 shadow-border">
            <div className="grid grid-cols-2 gap-1 rounded-sm bg-bg p-1" role="tablist">
              {(["signup", "signin"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={mode === value}
                  onClick={() => {
                    setMode(value);
                    setMessage(null);
                  }}
                  className={cn(
                    "min-h-11 rounded-sm text-xs tracking-kicker uppercase transition-colors",
                    mode === value ? "bg-elevated text-primary" : "text-muted hover:text-fg",
                  )}
                >
                  {value === "signup" ? "Create account" : "Sign in"}
                </button>
              ))}
            </div>

            {unavailable ? (
              <p className="mt-5 rounded-sm border border-border bg-bg p-3 text-sm text-muted" role="status">
                {accountsOn
                  ? "Accounts are not connected to a database yet, so sign-up is paused. Your cards still save on this device."
                  : "Accounts are switched off in this build. Your cards still save on this device."}
              </p>
            ) : null}

            <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
              {mode === "signup" ? (
                <>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      aria-label="Choose a profile picture"
                      className="group relative size-20 shrink-0 rounded-full"
                    >
                      <Avatar name={name || "?"} src={photo} className="size-20 text-3xl" />
                      <span className="absolute inset-0 grid place-items-center rounded-full bg-black/45 text-fg opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                        <Camera className="size-5" />
                      </span>
                    </button>
                    <div className="text-sm text-muted">
                      <p className="text-fg">Profile picture</p>
                      <p>Optional. It shows as a circle in the top bar.</p>
                      {photo ? (
                        <button type="button" onClick={() => setPhoto(null)} className="mt-1 inline-flex items-center gap-1 text-xs text-primary underline">
                          <X className="size-3" /> Remove
                        </button>
                      ) : null}
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(event) => {
                        void choosePhoto(event.target.files?.[0]);
                        event.target.value = "";
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Name
                    </label>
                    <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="nickname" maxLength={40} placeholder="What should we call you?" className={inputClass} />
                  </div>

                  <GenderChoice value={gender} onChange={setGender} />
                </>
              ) : null}

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" placeholder="you@example.com" className={inputClass} />
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder="At least 8 characters"
                  className={inputClass}
                />
              </div>

              {message ? (
                <p role="alert" className="rounded-sm border border-wine/60 bg-wine/10 px-3 py-2 text-sm text-fg">
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={busy || unavailable}
                className="pressable min-h-12 w-full rounded-sm bg-primary text-xs tracking-kicker text-primary-fg uppercase disabled:opacity-50"
              >
                {busy ? "One moment…" : mode === "signup" ? "Create my account" : "Sign in"}
              </button>
            </form>

            <p className="mt-5 text-xs text-subtle">
              Cards you already won on this device are added to your account when you sign up.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
