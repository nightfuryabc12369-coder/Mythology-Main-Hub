import { cn } from "@/lib/utils";

/** A round profile picture. Without a photo it shows the player's first letter on a gold-tinted disc. */
export function Avatar({ name, src, className }: { name: string; src?: string | null; className?: string }) {
  const letter = (name.trim().charAt(0) || "?").toUpperCase();
  return src ? (
    <img src={src} alt="" className={cn("shrink-0 rounded-full object-cover ring-1 ring-primary/70", className)} />
  ) : (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-display text-fg ring-1 ring-primary/70",
        className,
      )}
      style={{ background: "radial-gradient(circle at 50% 30%, color-mix(in oklab, var(--color-primary) 38%, #1c1712), #0c0a08 80%)" }}
    >
      {letter}
    </span>
  );
}
