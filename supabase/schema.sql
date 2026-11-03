-- Chạy một lần trong Supabase SQL Editor. Chỉ server (service role) đọc/ghi được.

-- Thiệp do người dùng tạo. `data` là dữ liệu form đã kiểm tra; token quản lý chỉ lưu dạng băm.
create table if not exists public.weddings (
  slug text primary key check (slug ~ '^[a-z0-9-]{3,80}$'),
  data jsonb not null,
  edit_token_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.weddings enable row level security;
revoke all on public.weddings from anon, authenticated;
grant select, insert, update on public.weddings to service_role;

-- Phản hồi xác nhận tham dự.
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

-- Tài khoản (Supabase Auth): mỗi thiệp có thể thuộc một người dùng.
alter table public.weddings add column if not exists owner_id uuid references auth.users (id) on delete set null;
create index if not exists weddings_owner_idx on public.weddings (owner_id, created_at desc);
