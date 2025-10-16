
import { FastifyInstance } from 'fastify';
import { cfg } from '../config';
import { createClient } from '@supabase/supabase-js';

export default async function (app: FastifyInstance) {
  const supa = createClient(cfg.supabaseUrl, cfg.supabaseServiceKey);

  app.addHook('onRequest', async (req, reply) => {
    if (!req.url.startsWith('/ops')) return;
    const auth = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    if (!auth || auth !== cfg.manos.token) return reply.code(401).send({ error: 'unauthorized' });
  });

  app.post('/ops/next', async (_req, reply) => {
    const { data, error } = await supa.from('ops_tasks').select('*').eq('status', 'queued').order('created_at', { ascending: true }).limit(1);
    if (error) return reply.code(500).send({ error: error.message });
    const task = data?.[0] || null;
    if (!task) return { task: null };
    await supa.from('ops_tasks').update({ status: 'running' }).eq('id', task.id);
    return { task };
  });

  app.post('/ops/complete', async (req, reply) => {
    const { id, ok, result, error } = (req.body as any) || {};
    const upd = ok ? { status: 'done', result } : { status: 'failed', error: String(error || 'unknown') };
    const { error: e } = await supa.from('ops_tasks').update(upd).eq('id', id);
    if (e) return reply.code(500).send({ error: e.message });
    return { ok: true };
  });
}
