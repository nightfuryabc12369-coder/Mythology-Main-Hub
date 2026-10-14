import { createFileRoute } from "@tanstack/react-router";

/** /api/avatar?id=<player id> — a player's profile picture as a real image (so lists stay light). */
export const Route = createFileRoute("/api/avatar")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const notFound = () => new Response(null, { status: 404, headers: { "cache-control": "no-store" } });
        try {
          const id = new URL(request.url).searchParams.get("id");
          if (!id || id.length > 80) return notFound();
          const { getSql } = await import("@/lib/db");
          const sql = await getSql();
          const rows = await sql<{ avatar: string | null }>`select avatar from player_profiles where user_id = ${id}`;
          const avatar = rows[0]?.avatar;
          const match = avatar ? /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(avatar) : null;
          if (!match) return notFound();
          const bytes = Buffer.from(match[2], "base64");
          return new Response(bytes, {
            headers: { "content-type": match[1], "cache-control": "public, max-age=60, stale-while-revalidate=300" },
          });
        } catch {
          return notFound();
        }
      },
    },
  },
});
