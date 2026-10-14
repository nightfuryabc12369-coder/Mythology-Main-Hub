import { createFileRoute } from "@tanstack/react-router";

/**
 * /api/staff — moderation tools. Every call re-checks the signed-in account on the server.
 *
 *   GET   -> { role, log: [...] }                            staff only
 *   POST  { action, userId, ... }
 *
 *   Moderator + admin:  remove-card { godId }
 *   Admin only:         give-card { godId }, give-pills { amount }, reset-wish,
 *                       ban { reason }, unban, set-role { role: "moderator" | null }
 *
 * Moderators can only act on ordinary players. Nobody can act on themselves or on another admin.
 */

const MAX_PILLS_GIFT = 50;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function databaseReady() {
  return Boolean(process.env.DATABASE_URL?.trim()) || process.env.NODE_ENV !== "production";
}

function sameSite(request: Request) {
  const site = request.headers.get("sec-fetch-site");
  return !site || site === "same-origin" || site === "none";
}

async function currentUser(request: Request) {
  try {
    const { auth } = await import("@/lib/auth/server");
    const session = await auth.api.getSession({ headers: request.headers });
    return session?.user ?? null;
  } catch {
    return null;
  }
}

function parseCards(value: unknown): Record<string, number> {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as Record<string, number>;
    } catch {
      return {};
    }
  }
  return (value as Record<string, number> | null) ?? {};
}

const ADMIN_ONLY = new Set(["give-card", "give-pills", "reset-wish", "ban", "unban", "set-role"]);
const ALL_ACTIONS = new Set(["remove-card", ...ADMIN_ONLY]);

export const Route = createFileRoute("/api/staff")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!databaseReady()) return json({ dbReady: false }, 503);
        try {
          const { getSql } = await import("@/lib/db");
          const { roleOf } = await import("@/lib/staff.server");
          const user = await currentUser(request);
          const role = await roleOf(user);
          if (!role) return json({ error: "forbidden" }, 403);
          const sql = await getSql();
          const rows = await sql<{
            id: number;
            actor_name: string;
            actor_role: string;
            target_id: string | null;
            target_name: string | null;
            action: string;
            detail: string;
            created_at: string;
          }>`select id, actor_name, actor_role, target_id, target_name, action, detail, created_at from moderation_log order by id desc limit 60`;
          return json({
            role,
            log: rows.map((row) => ({
              id: Number(row.id),
              actorName: row.actor_name,
              actorRole: row.actor_role,
              targetId: row.target_id,
              targetName: row.target_name,
              action: row.action,
              detail: row.detail,
              at: new Date(row.created_at).getTime(),
            })),
          });
        } catch (error) {
          console.error("[staff] GET failed", error);
          return json({ error: "unavailable" }, 503);
        }
      },

      POST: async ({ request }) => {
        if (!sameSite(request)) return json({ error: "forbidden" }, 403);
        if (!databaseReady()) return json({ dbReady: false }, 503);
        try {
          let body: { action?: unknown; userId?: unknown; godId?: unknown; amount?: unknown; reason?: unknown; role?: unknown };
          try {
            body = (await request.json()) as typeof body;
          } catch {
            return json({ error: "bad-request" }, 400);
          }
          const action = typeof body.action === "string" ? body.action : "";
          const userId = typeof body.userId === "string" ? body.userId.slice(0, 80) : "";
          if (!ALL_ACTIONS.has(action) || !userId) return json({ error: "bad-request" }, 400);

          const { getSql } = await import("@/lib/db");
          const { gods } = await import("@/data/gods");
          const { roleOf, logAction } = await import("@/lib/staff.server");
          const sql = await getSql();

          const actor = await currentUser(request);
          const actorRole = await roleOf(actor);
          if (!actor || !actorRole) return json({ error: "forbidden" }, 403);
          if (ADMIN_ONLY.has(action) && actorRole !== "admin") return json({ error: "admins-only" }, 403);

          const found = await sql<{ id: string; name: string; email: string }>`select "id", "name", "email" from "user" where "id" = ${userId}`;
          const target = found[0];
          if (!target) return json({ error: "not-found" }, 404);
          if (target.id === actor.id) return json({ error: "not-yourself" }, 400);
          const targetRole = await roleOf(target);
          if (targetRole === "admin") return json({ error: "cannot-target-admin" }, 403);
          if (actorRole === "moderator" && targetRole !== null) return json({ error: "cannot-target-staff" }, 403);

          const log = (act: string, detail = "") =>
            logAction({ actorId: actor.id, actorName: actor.name, actorRole, targetId: target.id, targetName: target.name, action: act, detail });

          // The profile row may not exist yet for a brand-new account.
          await sql`insert into player_profiles (user_id) values (${target.id}) on conflict (user_id) do nothing`;
          const profile = await sql<{ cards: unknown; pills: number }>`select cards, pills from player_profiles where user_id = ${target.id}`;
          const cards = parseCards(profile[0]?.cards);

          const godName = (id: string) => gods.find((g) => g.id === id)?.name ?? id;
          const godId = typeof body.godId === "string" ? body.godId : "";

          if (action === "remove-card") {
            if (!cards[godId]) return json({ error: "not-owned" }, 404);
            const level = cards[godId];
            const next = { ...cards };
            delete next[godId];
            // If their picture is not a card this does nothing; admin_rev makes their device take this result.
            await sql`update player_profiles set cards = ${JSON.stringify(next)}::jsonb, admin_rev = admin_rev + 1, updated_at = now() where user_id = ${target.id}`;
            await log("remove-card", `${godName(godId)} (level ${level})`);
            return json({ ok: true });
          }

          if (action === "give-card") {
            if (!gods.some((g) => g.id === godId)) return json({ error: "unknown-card" }, 400);
            if (cards[godId]) return json({ error: "already-owned" }, 409);
            const next = { ...cards, [godId]: 1 };
            await sql`update player_profiles set cards = ${JSON.stringify(next)}::jsonb, admin_rev = admin_rev + 1, updated_at = now() where user_id = ${target.id}`;
            await log("give-card", godName(godId));
            return json({ ok: true });
          }

          if (action === "give-pills") {
            const amount = Math.floor(Number(body.amount));
            if (!Number.isFinite(amount) || amount < 1 || amount > MAX_PILLS_GIFT) return json({ error: "bad-amount" }, 400);
            await sql`update player_profiles set pills = pills + ${amount}, admin_rev = admin_rev + 1, updated_at = now() where user_id = ${target.id}`;
            await log("give-pills", `${amount} ambrosia`);
            return json({ ok: true });
          }

          if (action === "reset-wish") {
            await sql`update player_profiles set next_wish_at = 0, admin_rev = admin_rev + 1, updated_at = now() where user_id = ${target.id}`;
            await log("reset-wish", "wish timer reset");
            return json({ ok: true });
          }

          if (action === "ban") {
            const reason = typeof body.reason === "string" ? body.reason.replace(/\s+/g, " ").trim().slice(0, 200) : "";
            await sql`
              insert into player_bans (user_id, reason, banned_by) values (${target.id}, ${reason}, ${actor.id})
              on conflict (user_id) do update set reason = excluded.reason, banned_by = excluded.banned_by, banned_at = now()`;
            // Sign them out everywhere right now.
            await sql`delete from "session" where "userId" = ${target.id}`;
            await sql`delete from staff_roles where user_id = ${target.id}`;
            await log("ban", reason || "no reason given");
            return json({ ok: true });
          }

          if (action === "unban") {
            await sql`delete from player_bans where user_id = ${target.id}`;
            await log("unban");
            return json({ ok: true });
          }

          if (action === "set-role") {
            if (body.role === "moderator") {
              const banned = await sql`select 1 from player_bans where user_id = ${target.id}`;
              if (banned.length) return json({ error: "banned" }, 409);
              await sql`
                insert into staff_roles (user_id, role, granted_by) values (${target.id}, 'moderator', ${actor.id})
                on conflict (user_id) do update set role = 'moderator', granted_by = excluded.granted_by, granted_at = now()`;
              await log("make-moderator");
            } else {
              await sql`delete from staff_roles where user_id = ${target.id}`;
              await log("remove-moderator");
            }
            return json({ ok: true });
          }

          return json({ error: "bad-request" }, 400);
        } catch (error) {
          console.error("[staff] POST failed", error);
          return json({ error: "unavailable" }, 503);
        }
      },
    },
  },
});
