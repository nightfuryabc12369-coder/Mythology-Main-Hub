import { createFileRoute } from "@tanstack/react-router";

/**
 * /api/profile — the signed-in player's saved profile.
 *
 *   GET  -> { dbReady, profile, user }   (401 + { dbReady } when signed out)
 *   PUT  -> body { state: { cards, pills, nextWishAt } }  or  { avatar: dataUrl | null }
 *
 * Every query is scoped to the user id of the verified session — never to an id sent by the browser.
 */

const MAX_LEVEL = 10;
const MAX_PILLS = 100000;
const MAX_AVATAR_CHARS = 150000;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

/** Accounts need a real database when the site is live. Local development may use the built-in one. */
function databaseReady() {
  return Boolean(process.env.DATABASE_URL?.trim()) || process.env.NODE_ENV !== "production";
}

async function currentUser(request: Request) {
  const { auth } = await import("@/lib/auth/server");
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}

/** Scripted requests from other sites are refused (browsers label them with Sec-Fetch-Site). */
function sameSite(request: Request) {
  const site = request.headers.get("sec-fetch-site");
  return !site || site === "same-origin" || site === "none";
}

type Row = {
  cards: Record<string, number> | string;
  pills: number;
  next_wish_at: number;
  avatar: string | null;
};

function parseCards(value: Row["cards"]): Record<string, number> {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as Record<string, number>;
    } catch {
      return {};
    }
  }
  return value ?? {};
}

export const Route = createFileRoute("/api/profile")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!databaseReady()) return json({ dbReady: false }, 503);
        try {
          const user = await currentUser(request);
          if (!user) return json({ dbReady: true, error: "signed-out" }, 401);
          const { getSql } = await import("@/lib/db");
          const sql = await getSql();
          const rows = await sql<Row>`select cards, pills, next_wish_at, avatar from player_profiles where user_id = ${user.id}`;
          const row = rows[0];
          return json({
            dbReady: true,
            user: { name: user.name, email: user.email, createdAt: new Date(user.createdAt).toISOString() },
            profile: row
              ? { cards: parseCards(row.cards), pills: Number(row.pills), nextWishAt: Number(row.next_wish_at), avatar: row.avatar }
              : null,
          });
        } catch (error) {
          console.error("[profile] GET failed", error);
          return json({ dbReady: false, error: "unavailable" }, 503);
        }
      },

      PUT: async ({ request }) => {
        if (!sameSite(request)) return json({ error: "forbidden" }, 403);
        if (!databaseReady()) return json({ dbReady: false }, 503);
        try {
          const user = await currentUser(request);
          if (!user) return json({ error: "signed-out" }, 401);

          let body: { state?: unknown; avatar?: unknown };
          try {
            body = (await request.json()) as typeof body;
          } catch {
            return json({ error: "bad-request" }, 400);
          }

          const { getSql } = await import("@/lib/db");
          const sql = await getSql();

          // Profile picture: a small image stored as text, or null to remove it.
          if ("avatar" in body) {
            const avatar = body.avatar;
            if (avatar !== null) {
              if (
                typeof avatar !== "string" ||
                avatar.length > MAX_AVATAR_CHARS ||
                !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(avatar)
              ) {
                return json({ error: "bad-image" }, 400);
              }
            }
            await sql`
              insert into player_profiles (user_id, avatar) values (${user.id}, ${avatar})
              on conflict (user_id) do update set avatar = excluded.avatar, updated_at = now()`;
            return json({ ok: true });
          }

          // Cards, ambrosia and wish cooldown.
          const state = body.state as { cards?: unknown; pills?: unknown; nextWishAt?: unknown } | undefined;
          if (!state || typeof state !== "object") return json({ error: "bad-request" }, 400);

          const { gods } = await import("@/data/gods");
          const known = new Set(gods.map((god) => god.id));

          const incoming: Record<string, number> = {};
          if (state.cards && typeof state.cards === "object") {
            for (const [id, level] of Object.entries(state.cards as Record<string, unknown>)) {
              if (!known.has(id)) continue;
              const n = Math.floor(Number(level));
              if (Number.isFinite(n) && n >= 1) incoming[id] = Math.min(n, MAX_LEVEL);
            }
          }
          const pills = Math.min(Math.max(Math.floor(Number(state.pills) || 0), 0), MAX_PILLS);
          const nextWishAt = Math.max(Math.floor(Number(state.nextWishAt) || 0), 0);

          // Cards are never taken away: keep the higher level of what is saved and what arrives.
          const existing = await sql<Row>`select cards from player_profiles where user_id = ${user.id}`;
          const saved = existing[0] ? parseCards(existing[0].cards) : {};
          const cards: Record<string, number> = { ...saved };
          for (const [id, level] of Object.entries(incoming)) cards[id] = Math.max(cards[id] ?? 0, level);

          await sql`
            insert into player_profiles (user_id, cards, pills, next_wish_at)
            values (${user.id}, ${JSON.stringify(cards)}::jsonb, ${pills}, ${nextWishAt})
            on conflict (user_id) do update set
              cards = excluded.cards,
              pills = excluded.pills,
              next_wish_at = excluded.next_wish_at,
              updated_at = now()`;
          return json({ ok: true, cards });
        } catch (error) {
          console.error("[profile] PUT failed", error);
          return json({ error: "unavailable" }, 503);
        }
      },
    },
  },
});
