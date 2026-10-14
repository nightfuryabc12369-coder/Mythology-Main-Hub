-- Staff, bans and the moderation log.
--
-- staff_roles: who is a moderator. Admins are set by ADMIN_EMAILS (see src/lib/staff.server.ts),
-- not stored here. A role is tied to the player's account id, so nobody can claim it by
-- signing up later with someone else's email address.
create table if not exists staff_roles (
  user_id text primary key references "user" ("id") on delete cascade,
  role text not null check (role in ('moderator')),
  granted_by text,
  granted_at timestamptz not null default now()
);

-- player_bans: banned accounts cannot use the site while signed in.
create table if not exists player_bans (
  user_id text primary key references "user" ("id") on delete cascade,
  reason text not null default '',
  banned_by text,
  banned_at timestamptz not null default now()
);

-- Every staff action, so admins can see what moderators did.
create table if not exists moderation_log (
  id bigserial primary key,
  actor_id text,
  actor_name text not null,
  actor_role text not null,
  target_id text,
  target_name text,
  action text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);

-- Bumped whenever staff change a player's cards, ambrosia or wish timer. A device that has not seen
-- the newest number must take the saved profile instead of pushing its old copy back over it.
alter table player_profiles add column if not exists admin_rev integer not null default 0;

-- Chat messages remember the sender's staff role ('admin' or 'moderator') for the badge.
alter table chat_messages add column if not exists role text;

-- Purge Whale (purgewhale@gmail.com) is a moderator. This only takes effect if she already has an
-- account when this migration runs; otherwise an admin can promote her from her profile page.
insert into staff_roles (user_id, role, granted_by)
select "id", 'moderator', 'migration' from "user" where lower("email") = 'purgewhale@gmail.com'
on conflict (user_id) do nothing;
