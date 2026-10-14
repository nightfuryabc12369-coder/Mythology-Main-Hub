import { createFileRoute } from "@tanstack/react-router";

/**
 * /api/chat — one public chat room for everyone on the site.
 *
 *   GET  (no params)  -> { dbReady, latest, user }   where "latest" is the newest message id right now.
 *                        A visitor starts from this point, so they only see messages sent after they arrived.
 *   GET  ?after=<id>  -> { dbReady, latest, messages: [...] }   messages newer than <id>
 *   POST { name, body } -> { message }
 *   POST { action: "delete" | "mute", id? }  -> admins and moderators;  "clear" -> admins only
 *
 * Storage stays small: only the newest KEEP_MESSAGES rows are kept, and anything older than MAX_AGE_HOURS is dropped.
 */

const KEEP_MESSAGES = 200;
const MAX_AGE_HOURS = 24;
const MAX_BODY = 300;
const MAX_NAME = 20;
const FETCH_LIMIT = 100;
const MUTE_MINUTES = 60;

async function ipHash(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return null;
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(`aether-chat:${ip}`).digest("hex");
}

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

type Row = { id: number; name: string; body: string; verified: boolean; admin: boolean; role: string | null; created_at: string };

function shape(row: Row) {
  const role = row.role === "moderator" ? "moderator" : row.admin || row.role === "admin" ? "admin" : null;
  return { id: Number(row.id), name: row.name, body: row.body, verified: Boolean(row.verified), admin: role === "admin", role, at: new Date(row.created_at).getTime() };
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
            const { roleOf } = await import("@/lib/staff.server");
            const role = await roleOf(user);
            return json({
              dbReady: true,
              latest: Number(rows[0]?.latest ?? 0),
              user: user ? { name: user.name } : null,
              admin: role === "admin",
              role,
            });
          }

          const after = Math.max(0, Math.floor(Number(afterRaw)) || 0);
          const base = Math.max(0, Math.floor(Number(url.searchParams.get("base"))) || 0);
          const rows = await sql<Row>`
            select id, name, body, verified, admin, role, created_at from chat_messages
            where id > ${after} and not deleted order by id asc limit ${FETCH_LIMIT}`;
          const messages = rows.map(shape);
          const latest = messages.length ? messages[messages.length - 1].id : after;
          // Ids an admin removed since this visitor arrived, so their screen can drop them too.
          const gone = await sql<{ id: number }>`select id from chat_messages where deleted and id > ${base} limit 200`;
          return json({ dbReady: true, latest, messages, removed: gone.map((r) => Number(r.id)) });
        } catch (error) {
          console.error("[chat] GET failed", error);
          return json({ dbReady: false, error: "unavailable" }, 503);
        }
      },

      POST: async ({ request }) => {
        if (!sameSite(request)) return json({ error: "forbidden" }, 403);
        if (!databaseReady()) return json({ dbReady: false }, 503);
        try {
          let payload: { name?: unknown; body?: unknown; action?: unknown; id?: unknown };
          try {
            payload = (await request.json()) as typeof payload;
          } catch {
            return json({ error: "bad-request" }, 400);
          }

          const user = await currentUser(request);
          const { roleOf, banOf } = await import("@/lib/staff.server");
          const role = await roleOf(user);
          const admin = role === "admin";
          const staff = role !== null;
          if (user && !staff && (await banOf(user.id, user.email))) return json({ error: "banned" }, 403);
          const { getSql } = await import("@/lib/db");
          const sql = await getSql();

          // ---- Admin tools (the server checks the account every time) ----
          const action = typeof payload.action === "string" ? payload.action : "send";
          if (action !== "send") {
            if (!staff) return json({ error: "forbidden" }, 403);
            if (action === "clear") {
              if (!admin) return json({ error: "admins-only" }, 403);
              await sql`update chat_messages set deleted = true where not deleted`;
              return json({ ok: true });
            }
            const id = Math.floor(Number(payload.id));
            if (!Number.isFinite(id) || id < 1) return json({ error: "bad-request" }, 400);
            if (action === "delete") {
              await sql`update chat_messages set deleted = true where id = ${id}`;
              return json({ ok: true });
            }
            if (action === "mute") {
              const found = await sql<{ ip_hash: string | null; admin: boolean; role: string | null }>`select ip_hash, admin, role from chat_messages where id = ${id}`;
              const target = found[0];
              if (!target?.ip_hash || target.admin || target.role) return json({ error: "cannot-mute" }, 400);
              await sql`
                insert into chat_mutes (ip_hash, until) values (${target.ip_hash}, now() + make_interval(mins => ${MUTE_MINUTES}))
                on conflict (ip_hash) do update set until = excluded.until`;
              await sql`update chat_messages set deleted = true where ip_hash = ${target.ip_hash} and not deleted`;
              return json({ ok: true });
            }
            return json({ error: "bad-request" }, 400);
          }

          // ---- Sending a message ----
          if (!staff && tooFast(request)) return json({ error: "slow-down" }, 429);

          const body = cleanText(payload.body, MAX_BODY);
          if (!body) return json({ error: "empty" }, 400);
          // Keep the room free of link spam (admins may post links).
          if (!staff && /(https?:\/\/|www\.|\.(com|net|org|io|xyz|ru|cn)\b)/i.test(body)) return json({ error: "no-links" }, 400);

          const hash = await ipHash(request);
          if (!staff && hash) {
            const muted = await sql`select 1 from chat_mutes where ip_hash = ${hash} and until > now()`;
            if (muted.length) return json({ error: "muted" }, 403);
          }

          // Signed-in players always post under their real account name; guests pick a nickname.
          const verified = Boolean(user);
          const name = cleanText(user ? user.name : payload.name, MAX_NAME);
          if (!name) return json({ error: "name-needed" }, 400);

          const rows = await sql<Row>`
            insert into chat_messages (name, body, verified, admin, role, ip_hash) values (${name}, ${body}, ${verified}, ${admin}, ${role}, ${hash})
            returning id, name, body, verified, admin, role, created_at`;

          // Trim: keep the newest KEEP_MESSAGES and nothing older than MAX_AGE_HOURS.
          await sql`
            delete from chat_messages
            where id <= coalesce((select id from chat_messages order by id desc offset ${KEEP_MESSAGES} limit 1), 0)
               or created_at < now() - make_interval(hours => ${MAX_AGE_HOURS})`;
          await sql`delete from chat_mutes where until < now()`;

          return json({ message: shape(rows[0]) });
        } catch (error) {
          console.error("[chat] POST failed", error);
          return json({ dbReady: false, error: "unavailable" }, 503);
        }
      },
    },
  },
});
