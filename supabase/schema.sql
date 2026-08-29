-- Run this once in your Supabase project's SQL editor (Database -> SQL Editor -> New query).

create table if not exists stash_data (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table stash_data enable row level security;

-- Each signed-in user can only ever read their own row.
create policy "Users can read their own data"
  on stash_data for select
  using (auth.uid() = user_id);

-- Each signed-in user can only ever create their own row.
create policy "Users can insert their own data"
  on stash_data for insert
  with check (auth.uid() = user_id);

-- Each signed-in user can only ever update their own row.
create policy "Users can update their own data"
  on stash_data for update
  using (auth.uid() = user_id);

-- Turn on Realtime for this table so changes on one device
-- (phone) push live to another (Mac) without a manual refresh.
-- If this line errors because the publication already includes the table, that's fine — skip it.
alter publication supabase_realtime add table stash_data;
