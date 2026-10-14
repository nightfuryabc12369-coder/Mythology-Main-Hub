import { createFileRoute } from "@tanstack/react-router";

/**
 * /api/chat — one public chat room for everyone on the site.
 *
 *   GET  (no params)  -> { dbReady, latest, user }   where "latest" is the newest message id right now.
 *                        A visitor starts from this point, so they only see messages sent after they arrived.
 *   GET  ?after=<id>  -> { dbReady, latest, messages: [...] }   messages newer than <id>
 *   POST { name, body } -> { message }
 *
 * Storage stays small: only the newest KEEP_MESSAGES rows are kept, and anything older than MAX_AGE_HOURS is dropped.
 */

const KEEP_MESSAGES = 200;
const MAX_AGE_HOURS = 24;
const MAX_BODY = 300;
const MAX_NAME = 20;
const FETCH_LIMIT = 100;

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

/** Best-effort slow-down per visitor (resets when the server restarts, which is fine). */
const recent = new Map<string, number[]>();
function tooFast(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (hits.length >= 12 || (hits.length > 0 && now - hits[hits.length - 1] < 1500)) {
    recent.set(ip, hits);
    return true;
  }
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return false;
}

function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

type Row = { id: number; name: string; body: string; verified: boolean; created_at: string };

function shape(row: Row) {
  return { id: Number(row.id), name: row.name, body: row.body, verified: Boolean(row.verified), at: new Date(row.created_at).getTime() };
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!databaseReady()) return json({ dbReady: false }, 503);
        try {
          const { getSql } = await import("@/lib/db");
          const sql = await getSql();
          const url = new URL(request.url);
          const afterRaw = url.searchParams.get("after");

          if (afterRaw === null) {
            const rows = await sql<{ latest: number | null }>`select max(id) as latest from chat_messages`;
            const user = await currentUser(request);
            return json({ dbReady: true, latest: Number(rows[0]?.latest ?? 0), user: user ? { name: user.name } : null });
          }

          const after = Math.max(0, Math.floor(Number(afterRaw)) || 0);
          const rows = await sql<Row>`
            select id, name, body, verified, created_at from chat_messages
            where id > ${after} order by id asc limit ${FETCH_LIMIT}`;
          const messages = rows.map(shape);
          const latest = messages.length ? messages[messages.length - 1].id : after;
          return json({ dbReady: true, latest, messages });
        } catch (error) {
          console.error("[chat] GET failed", error);
          return json({ dbReady: false, error: "unavailable" }, 503);
        }
      },

      POST: async ({ request }) => {
        if (!sameSite(request)) return json({ error: "forbidden" }, 403);
        if (!databaseReady()) return json({ dbReady: false }, 503);
        if (tooFast(request)) return json({ error: "slow-down" }, 429);
        try {
          let payload: { name?: unknown; body?: unknown };
          try {
            payload = (await request.json()) as typeof payload;
          } catch {
            return json({ error: "bad-request" }, 400);
          }

          const body = cleanText(payload.body, MAX_BODY);
          if (!body) return json({ error: "empty" }, 400);
          // Keep the room free of link spam.
          if (/(https?:\/\/|www\.|\.(com|net|org|io|xyz|ru|cn)\b)/i.test(body)) return json({ error: "no-links" }, 400);

          // Signed-in players always post under their real account name; guests pick a nickname.
          const user = await currentUser(request);
          const verified = Boolean(user);
          const name = cleanText(user ? user.name : payload.name, MAX_NAME);
          if (!name) return json({ error: "name-needed" }, 400);

          const { getSql } = await import("@/lib/db");
          const sql = await getSql();
          const rows = await sql<Row>`
            insert into chat_messages (name, body, verified) values (${name}, ${body}, ${verified})
            returning id, name, body, verified, created_at`;

          // Trim: keep the newest KEEP_MESSAGES and nothing older than MAX_AGE_HOURS.
          await sql`
            delete from chat_messages
            where id <= coalesce((select id from chat_messages order by id desc offset ${KEEP_MESSAGES} limit 1), 0)
               or created_at < now() - make_interval(hours => ${MAX_AGE_HOURS})`;

          return json({ message: shape(rows[0]) });
        } catch (error) {
          console.error("[chat] POST failed", error);
          return json({ dbReady: false, error: "unavailable" }, 503);
        }
      },
    },
  },
});
