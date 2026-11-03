-- Chạy một lần nếu bạn đã chạy schema.sql trước khi có tính năng tài khoản.
alter table public.weddings add column if not exists owner_id uuid references auth.users (id) on delete set null;
create index if not exists weddings_owner_idx on public.weddings (owner_id, created_at desc);
