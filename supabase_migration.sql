-- CivicPulse AI Database Migration
-- Run this in the Supabase SQL Editor

-- 1. Issues Table
create table if not exists public.issues (
  id uuid default gen_random_uuid() primary key,
  issue_code text unique,
  user_id uuid references auth.users(id),
  title text not null,
  description text,
  category text,
  severity text,
  department text,
  ai_summary text,
  ai_confidence double precision,
  estimated_resolution_days integer,
  priority_score integer,
  status text default 'open',
  upvotes integer default 0,
  image_url text,
  latitude double precision,
  longitude double precision,
  area_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Area Scores Table
create table if not exists public.area_scores (
  id uuid default gen_random_uuid() primary key,
  area_name text unique,
  score double precision default 70.0,
  open_count integer default 0,
  resolved_count integer default 0,
  updated_at timestamp with time zone default now()
);

-- 3. Row Level Security
alter table public.issues enable row level security;

-- 4. Civic Health Score Logic (Automatic Trigger)
create or replace function calculate_civic_health()
returns trigger as $$
declare
  o_count integer;
  r_count integer;
  total_count integer;
  new_score double precision;
begin
  -- Get counts for the specific area
  select count(*) into o_count from issues where area_name = NEW.area_name and status != 'resolved';
  select count(*) into r_count from issues where area_name = NEW.area_name and status = 'resolved';
  
  total_count := coalesce(o_count, 0) + coalesce(r_count, 0);
  if total_count = 0 then
    new_score := 75.0; -- baseline
  else
    new_score := (r_count::double precision / total_count::double precision) * 100.0;
  end if;

  -- Upsert into area_scores
  insert into area_scores (area_name, score, open_count, resolved_count, updated_at)
  values (NEW.area_name, new_score, o_count, r_count, now())
  on conflict (area_name) do update
  set score = excluded.score,
      open_count = excluded.open_count,
      resolved_count = excluded.resolved_count,
      updated_at = now();
      
  return NEW;
end;
$$ language plpgsql;

-- Trigger for Civic Health Score updates
drop trigger if exists update_health_score on issues;
create trigger update_health_score
after insert or update of status on issues
for each row execute function calculate_civic_health();
