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
CREATE TABLE public.ops_tasks (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    command_id uuid REFERENCES public.voice_commands(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'queued',
    payload jsonb,
    result jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable row level security for ops_tasks
ALTER TABLE public.ops_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for ops_tasks (adjust as needed for your application's security model)
CREATE POLICY "Allow all for now" ON public.ops_tasks USING (true) WITH CHECK (true);

-- Trigger for updated_at column
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.ops_tasks FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

