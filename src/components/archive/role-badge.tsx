import { cn } from "@/lib/utils";
import { Crown, ShieldCheck } from "lucide-react";

export type BadgeRole = "admin" | "moderator" | null | undefined;

const MOD_COLOR = "#7fb4d9";

/** The little title next to a name: gold crown for admins, blue shield for moderators. */
export function RoleBadge({ role, className }: { role: BadgeRole; className?: string }) {
  if (role === "admin") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-gold/60 bg-gold/10 px-2.5 py-0.5 text-[10px] tracking-kicker text-gold uppercase",
          className,
        )}
      >
        <Crown className="size-3" aria-hidden />
        Admin
      </span>
    );
  }
  if (role === "moderator") {
    return (
      <span
        className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] tracking-kicker uppercase", className)}
        style={{ color: MOD_COLOR, borderColor: `${MOD_COLOR}99`, background: `${MOD_COLOR}1a` }}
      >
        <ShieldCheck className="size-3" aria-hidden />
        Moderator
      </span>
    );
  }
  return null;
}
