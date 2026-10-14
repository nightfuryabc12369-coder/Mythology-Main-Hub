import { getSql } from "@/lib/db";

export type Role = "admin" | "moderator" | null;

/** Admin accounts. Set ADMIN_EMAILS (comma separated) in Vercel to change this without touching code. */
const DEFAULT_ADMINS = ["nightfuryabc12369@gmail.com"];

export function adminEmails() {
  const fromEnv = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return fromEnv && fromEnv.length ? fromEnv : DEFAULT_ADMINS;
}

export function isAdminEmail(email?: string | null) {
  const clean = email?.trim().toLowerCase();
  return Boolean(clean && adminEmails().includes(clean));
}

/** The staff role of an account: admins come from ADMIN_EMAILS, moderators from the staff_roles table. */
export async function roleOf(user: { id: string; email?: string | null } | null | undefined): Promise<Role> {
  if (!user) return null;
  if (isAdminEmail(user.email)) return "admin";
  try {
    const sql = await getSql();
    const rows = await sql<{ role: string }>`select role from staff_roles where user_id = ${user.id}`;
    return rows[0]?.role === "moderator" ? "moderator" : null;
  } catch {
    return null;
  }
}

/** The ban on an account, or null. Admins can never be banned. */
export async function banOf(userId: string, email?: string | null): Promise<{ reason: string } | null> {
  if (isAdminEmail(email)) return null;
  try {
    const sql = await getSql();
    const rows = await sql<{ reason: string }>`select reason from player_bans where user_id = ${userId}`;
    return rows[0] ? { reason: rows[0].reason ?? "" } : null;
  } catch {
    return null;
  }
}

export async function logAction(entry: {
  actorId: string;
  actorName: string;
  actorRole: string;
  targetId?: string | null;
  targetName?: string | null;
  action: string;
  detail?: string;
}) {
  try {
    const sql = await getSql();
    await sql`
      insert into moderation_log (actor_id, actor_name, actor_role, target_id, target_name, action, detail)
      values (${entry.actorId}, ${entry.actorName}, ${entry.actorRole}, ${entry.targetId ?? null}, ${entry.targetName ?? null}, ${entry.action}, ${(entry.detail ?? "").slice(0, 300)})`;
  } catch (error) {
    console.error("[staff] log failed", error);
  }
}
