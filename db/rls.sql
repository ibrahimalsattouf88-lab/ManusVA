
-- Enable RLS
alter table public.voice_sessions enable row level security;
alter table public.voice_transcripts enable row level security;
alter table public.voice_commands enable row level security;
alter table public.ops_tasks enable row level security;

-- Basic policies (allow service role; allow user to read their own sessions)
create policy if not exists service_all_voice_sessions on public.voice_sessions
  for all using (true) with check (true);

create policy if not exists service_all_voice_transcripts on public.voice_transcripts
  for all using (true) with check (true);

create policy if not exists service_all_voice_commands on public.voice_commands
  for all using (true) with check (true);

create policy if not exists service_all_ops_tasks on public.ops_tasks
  for all using (true) with check (true);
