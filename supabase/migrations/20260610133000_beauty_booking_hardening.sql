create schema if not exists extensions;
alter extension btree_gist set schema extensions;

create index if not exists beauty_bookings_service_idx
  on public.beauty_bookings (service_id);
