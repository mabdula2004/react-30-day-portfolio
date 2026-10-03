create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  home_airport text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.journeys (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  city text not null,
  country text not null,
  eyebrow text,
  description text not null default '',
  price_gbp integer not null check(price_gbp >= 0),
  rating numeric(3,2) not null default 5,
  review_count integer not null default 0,
  nights integer not null check(nights > 0),
  vibe text not null,
  image_url text not null,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.saved_journeys (
  user_id uuid not null references auth.users(id) on delete cascade,
  journey_id uuid not null references public.journeys(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, journey_id)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journey_id uuid not null references public.journeys(id) on delete restrict,
  departure_date date not null,
  travellers integer not null check(travellers between 1 and 12),
  subtotal_gbp integer not null check(subtotal_gbp >= 0),
  service_fee_gbp integer not null default 0 check(service_fee_gbp >= 0),
  total_gbp integer not null check(total_gbp >= 0),
  status text not null default 'requested' check(status in ('requested','confirmed','cancelled','completed')),
  notes text,
  created_at timestamptz not null default now()
);

create index journeys_vibe_idx on public.journeys(vibe);
create index bookings_user_created_idx on public.bookings(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.journeys enable row level security;
alter table public.saved_journeys enable row level security;
alter table public.bookings enable row level security;

create policy "journeys public read" on public.journeys for select using (active = true);
create policy "profile own read" on public.profiles for select using (auth.uid() = id);
create policy "profile own insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profile own update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "saved own read" on public.saved_journeys for select using (auth.uid() = user_id);
create policy "saved own insert" on public.saved_journeys for insert with check (auth.uid() = user_id);
create policy "saved own delete" on public.saved_journeys for delete using (auth.uid() = user_id);
create policy "bookings own read" on public.bookings for select using (auth.uid() = user_id);
create policy "bookings own insert" on public.bookings for insert with check (auth.uid() = user_id);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, full_name)
  values(new.id, coalesce(new.raw_user_meta_data->>'full_name',''));
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

grant usage on schema public to anon, authenticated;
grant select on public.journeys to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, delete on public.saved_journeys to authenticated;
grant select, insert on public.bookings to authenticated;
