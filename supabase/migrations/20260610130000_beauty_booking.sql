create extension if not exists btree_gist;

create table if not exists public.beauty_profiles (
  telegram_id bigint primary key,
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (char_length(phone) between 10 and 24),
  avatar_url text,
  username text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists beauty_single_admin
  on public.beauty_profiles ((role)) where role = 'admin';

create table if not exists public.beauty_services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price integer not null check (price >= 0),
  duration_minutes integer not null check (duration_minutes between 15 and 720),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.beauty_settings (
  id boolean primary key default true check (id),
  studio_name text not null default 'Студия Nails & Beauty',
  master_name text not null default 'Валерия',
  short_description text not null default 'Премиальный маникюр и бережный уход.',
  about_text text not null default 'Сертифицированный мастер ногтевого сервиса.',
  address text not null default 'ул. Элегантная, д. 15, офис 302',
  phone text not null default '',
  timezone text not null default 'Europe/Moscow',
  booking_horizon_days integer not null default 60 check (booking_horizon_days between 7 and 365),
  updated_at timestamptz not null default now()
);

create table if not exists public.beauty_work_schedule (
  weekday smallint primary key check (weekday between 0 and 6),
  is_working boolean not null default true,
  start_time time not null default '10:00',
  end_time time not null default '22:00',
  slot_interval_minutes integer not null default 30 check (slot_interval_minutes between 15 and 240),
  check (end_time > start_time)
);

create table if not exists public.beauty_blocked_dates (
  blocked_date date primary key,
  reason text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.beauty_bookings (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint references public.beauty_profiles(telegram_id) on delete cascade,
  service_id uuid not null references public.beauty_services(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'completed', 'cancelled')),
  source text not null default 'mini_app' check (source in ('mini_app', 'admin')),
  client_name text not null,
  client_phone text not null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

alter table public.beauty_bookings
  add constraint beauty_bookings_no_overlap
  exclude using gist (tstzrange(starts_at, ends_at, '[)') with &&)
  where (status = 'confirmed');

create index if not exists beauty_bookings_user_idx
  on public.beauty_bookings (telegram_id, starts_at desc);

create table if not exists public.beauty_portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.beauty_settings (id) values (true) on conflict (id) do nothing;

insert into public.beauty_work_schedule (weekday, is_working, start_time, end_time, slot_interval_minutes)
select weekday, true, '10:00', '22:00', 30 from generate_series(0, 6) weekday
on conflict (weekday) do nothing;

insert into public.beauty_services (name, description, price, duration_minutes, sort_order)
select * from (values
  ('Комби-маникюр без покрытия', 'Аккуратная обработка и уход', 1200, 60, 10),
  ('Маникюр + гель-лак', 'Однотонное покрытие', 1800, 90, 20),
  ('Маникюр + дизайн', 'Френч, фольга или простой дизайн', 2200, 120, 30),
  ('Наращивание ногтей', 'Длина до тройки', 3000, 180, 40)
) seed(name, description, price, duration_minutes, sort_order)
where not exists (select 1 from public.beauty_services);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('beauty-portfolio', 'beauty-portfolio', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true;

alter table public.beauty_profiles enable row level security;
alter table public.beauty_services enable row level security;
alter table public.beauty_settings enable row level security;
alter table public.beauty_work_schedule enable row level security;
alter table public.beauty_blocked_dates enable row level security;
alter table public.beauty_bookings enable row level security;
alter table public.beauty_portfolio enable row level security;

revoke all on public.beauty_profiles, public.beauty_services, public.beauty_settings,
  public.beauty_work_schedule, public.beauty_blocked_dates, public.beauty_bookings,
  public.beauty_portfolio from anon, authenticated;
