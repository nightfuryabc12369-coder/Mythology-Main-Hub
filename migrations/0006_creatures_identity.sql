-- Saves each player's god title (Find who you are), main creature, second creature and creature stars
-- on their account, so other people (and staff) can see them on the profile page and staff can give
-- or remove a creature. Before this they only lived in the browser on one device.
alter table player_profiles add column if not exists extras jsonb not null default '{}'::jsonb;
