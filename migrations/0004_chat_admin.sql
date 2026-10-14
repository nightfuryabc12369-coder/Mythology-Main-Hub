-- Admin tools for the chat: soft-delete, admin badge, and short mutes.
alter table chat_messages add column if not exists admin boolean not null default false;
alter table chat_messages add column if not exists deleted boolean not null default false;
alter table chat_messages add column if not exists ip_hash text;

create table if not exists chat_mutes (
  ip_hash text primary key,
  until timestamptz not null
);
