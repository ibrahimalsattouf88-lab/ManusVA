
-- Core tables
create table if not exists public.voice_sessions(
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  device_id text,
  created_at timestamptz default now(),
  closed_at timestamptz
);

create table if not exists public.voice_transcripts(
  id bigserial primary key,
  session_id uuid references public.voice_sessions(id) on delete cascade,
  content text not null,
  language text default 'ar-SY',
  created_at timestamptz default now()
);

create table if not exists public.voice_commands(
  id bigserial primary key,
  session_id uuid references public.voice_sessions(id) on delete cascade,
  section_slug text,
  matched_phrase text,
  route text,
  handler text,
  status text default 'queued',
  meta jsonb,
  created_at timestamptz default now()
);

create table if not exists public.ops_tasks(
  id bigserial primary key,
  type text not null,
  payload jsonb,
  status text default 'queued',
  result jsonb,
  error text,
  created_at timestamptz default now()
);

-- Functions
create or replace function public.start_voice_session(p_user uuid, p_device text)
returns uuid language plpgsql as $$
declare sid uuid;
begin
  insert into public.voice_sessions(user_id, device_id) values (p_user, p_device) returning id into sid;
  return sid;
end $$;

create or replace function public.resolve_section_route_smart(p_section_slug text, p_phrase text)
returns table(route text, handler text) language plpgsql as $$
begin
  -- naive rule-based routing; replace with AI later
  if p_section_slug = 'accounting' then
    return query select '/acc/issue', 'acc.create_issue';
  else
    return query select '/ops/echo', 'ops.echo';
  end if;
end $$;
