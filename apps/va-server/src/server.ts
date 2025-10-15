import fastify from 'fastify';
import websocket from '@fastify/websocket';
import { cfg } from './config';
import { createClient } from '@supabase/supabase-js';
import { transcribeAndUnderstand } from './asr';
import opsRoutes from './routes/ops';

const app = fastify({ logger: true });
app.register(websocket);
app.register(opsRoutes, { prefix: '/ops' });

const supa = createClient(cfg.supabaseUrl, cfg.supabaseServiceKey);

app.post('/va/start-session', async (req, reply) => {
  const { user_id, device_id } = (req.body as any) ?? {};
  const { data, error } = await supa.rpc('start_voice_session', { p_user: user_id, p_device: device_id });
  if(error) return reply.code(500).send({ error: error.message });
  return { sessionId: data };
});

app.post('/va/append-transcript', async (req, reply) => {
  const { session_id, content, language='ar-SY' } = (req.body as any) ?? {};
  await supa.from('voice_transcripts').insert({ session_id, content, language });
  return { ok: true };
});

app.post('/va/resolve', async (req, reply) => {
  const { session_id, audio_b64 } = (req.body as any) ?? {};
  const audio = Buffer.from(audio_b64, 'base64');
  const nlu = await transcribeAndUnderstand(audio, 'ar-SY'); // {text, section_slug, matched_phrase}
  const { data, error } = await supa.rpc('resolve_section_route_smart', {
    p_section_slug: nlu.section_slug, p_phrase: nlu.text
  });
  if(error) return reply.code(500).send({ error: error.message });
  return { route: data?.route, handler: data?.handler, matched: nlu.matched_phrase };
});

app.post('/va/issue', async (req, reply) => {
  const { session_id, route, handler, meta } = (req.body as any) ?? {};
  const ins = await supa.from('voice_commands')
     .insert({ session_id, section_slug: meta?.section, matched_phrase: meta?.phrase, route, handler, status: 'queued', meta })
     .select('id').single();
  if(ins.error) return reply.code(500).send({ error: ins.error.message });
  return { commandId: ins.data.id, status: 'queued' };
});

app.post('/va/end-session', async (req, reply) => {
  const { session_id } = (req.body as any) ?? {};
  await supa.from('voice_sessions').update({ closed_at: new Date().toISOString() }).eq('id', session_id);
  return { ok: true };
});

app.register(async (fast) => {
  fast.get('/va/realtime', { websocket: true }, (conn) => {
    conn.socket.on('message', async (msg: Buffer) => {
      const { session_id, chunk_b64 } = JSON.parse(msg.toString());
      const text = (await transcribeAndUnderstand(Buffer.from(chunk_b64, 'base64'))).text;
      conn.socket.send(JSON.stringify({ partial: text }));
    });
  });
});

app.listen({ port: cfg.port, host: '0.0.0.0' });

