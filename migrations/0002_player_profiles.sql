-- One row per signed-up player: their cards, ambrosia, wish cooldown and profile picture.
-- user_id matches the Better Auth "user"."id" (TEXT).
create table if not exists player_profiles (
  user_id text primary key references "user" ("id") on delete cascade,
  cards jsonb not null default '{}'::jsonb,
  pills integer not null default 0,
  next_wish_at bigint not null default 0,
  avatar text,
  updated_at timestamptz not null default now()
);
