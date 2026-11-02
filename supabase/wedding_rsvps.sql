-- Chạy một lần trong Supabase SQL Editor. Chỉ server (service role) đọc/ghi được.
create table if not exists public.wedding_rsvps (
  id uuid primary key,
  wedding text not null,
  guest_key text not null default '',
  name text not null check (char_length(name) between 2 and 150),
  attendance text not null check (attendance in ('yes', 'no')),
  party_size int not null default 0 check (party_size between 0 and 10),
  side text not null default '' check (side in ('', 'Nhà trai', 'Nhà gái')),
  message text not null default '' check (char_length(message) <= 2000),
  created_at timestamptz not null default now()
);
create index if not exists wedding_rsvps_wedding_idx on public.wedding_rsvps (wedding, created_at desc);
alter table public.wedding_rsvps enable row level security;
revoke all on public.wedding_rsvps from anon, authenticated;
grant select, insert on public.wedding_rsvps to service_role;
