-- Run once in the Supabase SQL editor. Only the server service role can access replies.
create table if not exists public.rsvps (
 id uuid primary key,
 name text not null check (char_length(name) between 2 and 150),
 attendance text not null check (attendance in ('yes','no')),
 shuttle text not null check (shuttle in ('yes','no')),
 diet text not null default '' check (char_length(diet) <= 1000),
 message text not null default '' check (char_length(message) <= 2000),
 created_at timestamptz not null default now()
);
alter table public.rsvps enable row level security;
revoke all on public.rsvps from anon, authenticated;
grant select, insert on public.rsvps to service_role;
