-- 3.1 start_voice_session يرجّع الـ id صريحًا
create or replace function public.start_voice_session(p_user uuid, p_device text)
returns uuid language plpgsql security definer as $$
declare sid uuid;
begin
  insert into public.voice_sessions (user_id, device_id, started_at)
  values (p_user, p_device, now())
  returning id into sid;
  return sid;
end$$;

-- 3.2 ضبط النسبة [70..80] بدون رفض
create or replace function public.clamp_automation_percentage()
returns trigger language plpgsql as $$
begin
  if new.automation_percentage < 70 then new.automation_percentage := 70;
  elsif new.automation_percentage > 80 then new.automation_percentage := 80; end if;
  return new;
end$$;

drop trigger if exists trg_specializations_clamp on public.specializations;
create trigger trg_specializations_clamp
before insert or update on public.specializations
for each row execute function public.clamp_automation_percentage();

update public.specializations
set automation_percentage = greatest(70, least(automation_percentage, 80))
where automation_percentage is not null
  and (automation_percentage < 70 or automation_percentage > 80);

-- 3.3 ops_tasks table for automated task execution
create table if not exists public.ops_tasks (
  id uuid primary key default gen_random_uuid(),
  type text not null,               -- مثال: accounting.add_purchase
  payload jsonb not null,           -- بيانات العملية
  status text not null default 'queued', -- queued|running|done|failed
  result jsonb,                     -- مخرجات مانوس
  error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_ops_tasks_status on public.ops_tasks(status);

create trigger trg_ops_tasks_updated before update on public.ops_tasks
for each row execute procedure moddatetime (updated_at);

-- Enable row level security for ops_tasks
ALTER TABLE public.ops_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for ops_tasks (adjust as needed for your application's security model)
CREATE POLICY "Allow all for now" ON public.ops_tasks USING (true) WITH CHECK (true);

