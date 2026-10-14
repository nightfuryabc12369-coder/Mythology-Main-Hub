-- Public chat room. The API keeps only the newest ~200 messages (and nothing older than a day),
-- so this table stays tiny.
create table if not exists chat_messages (
  id bigserial primary key,
  name text not null,
  body text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
