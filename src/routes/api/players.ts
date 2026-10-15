import { sanitizeExtras } from "@/lib/extras";
import { createFileRoute } from "@tanstack/react-router";

/**
 * /api/players — public, read-only player profiles.
 *
 *   GET            -> { players: [...] }            (?q=<name> to search)
 *   GET ?id=<id>   -> { viewer, player: {...} }
 *
 * Emails are never public. Staff (admin / moderator) also see the email, ambrosia, wish timer and ban details.
 */

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function databaseReady() {
  return Boolean(process.env.DATABASE_URL?.trim()) || process.env.NODE_ENV !== "production";
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

type Row = {
  id: string;
  name: string;
  email: string;
  created_at: string | Date;
  cards: Record<string, number> | string | null;
  pills: number | null;
  next_wish_at: number | null;
  has_avatar: boolean | null;
  banned: boolean | null;
  ban_reason: string | null;
  staff_role: string | null;
  extras: unknown;
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

const SELECT = `
  select u."id", u."name", u."email", u."createdAt" as created_at,
         p.cards, p.pills, p.next_wish_at, p.extras, (p.avatar is not null) as has_avatar,
         (b.user_id is not null) as banned, b.reason as ban_reason, s.role as staff_role
  from "user" u
  left join player_profiles p on p.user_id = u."id"
  left join player_bans b on b.user_id = u."id"
  left join staff_roles s on s.user_id = u."id"`;

export const Route = createFileRoute("/api/players")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!databaseReady()) return json({ dbReady: false }, 503);
        try {
          const { getSql } = await import("@/lib/db");
          const { roleOf, isAdminEmail } = await import("@/lib/staff.server");
          const sql = await getSql();
          const viewer = await currentUser(request);
          const viewerRole = await roleOf(viewer);
          const staff = viewerRole !== null;
          const url = new URL(request.url);
          const id = url.searchParams.get("id");

          const roleFor = (row: Row) => (isAdminEmail(row.email) ? "admin" : row.staff_role === "moderator" ? "moderator" : null);

          if (id) {
            const rows = await sql.query<Row>(`${SELECT} where u."id" = $1`, [id.slice(0, 80)]);
            const row = rows[0];
            if (!row) return json({ error: "not-found" }, 404);
            const banned = Boolean(row.banned) && !isAdminEmail(row.email);
            if (banned && !staff) return json({ viewer: { id: viewer?.id ?? null, role: viewerRole }, player: { id: row.id, name: row.name, banned: true } });
            return json({
              viewer: { id: viewer?.id ?? null, role: viewerRole },
              player: {
                id: row.id,
                name: row.name,
                joinedAt: new Date(row.created_at).toISOString(),
                role: roleFor(row),
                hasAvatar: Boolean(row.has_avatar),
                cards: parseCards(row.cards),
                ...sanitizeExtras(row.extras),
                banned,
                ...(staff
                  ? {
                      email: row.email,
                      pills: Number(row.pills ?? 0),
                      nextWishAt: Number(row.next_wish_at ?? 0),
                      banReason: banned ? (row.ban_reason ?? "") : null,
                    }
                  : {}),
              },
            });
          }

          const q = (url.searchParams.get("q") ?? "").replace(/[%_\\]/g, " ").trim().slice(0, 40);
          const rows = q
            ? await sql.query<Row>(`${SELECT} where u."name" ilike $1 order by u."createdAt" asc limit 80`, [`%${q}%`])
            : await sql.query<Row>(`${SELECT} order by u."createdAt" asc limit 80`, []);
          const players = rows
            .filter((row) => staff || !row.banned || isAdminEmail(row.email))
            .map((row) => ({
              id: row.id,
              name: row.name,
              joinedAt: new Date(row.created_at).toISOString(),
              role: roleFor(row),
              hasAvatar: Boolean(row.has_avatar),
              cardCount: Object.keys(parseCards(row.cards)).length,
              banned: staff ? Boolean(row.banned) && !isAdminEmail(row.email) : false,
            }));
          return json({ viewer: { id: viewer?.id ?? null, role: viewerRole }, players });
        } catch (error) {
          console.error("[players] GET failed", error);
          return json({ dbReady: false, error: "unavailable" }, 503);
        }
      },
    },
  },
});
