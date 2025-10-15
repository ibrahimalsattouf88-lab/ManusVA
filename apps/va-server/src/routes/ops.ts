import { FastifyInstance } from 'fastify';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cfg } from '../config';

let supa: SupabaseClient;

export default async function opsRoutes(fastify: FastifyInstance) {
  if (!supa) {
    supa = createClient(cfg.supabaseUrl, cfg.supabaseServiceKey);
  }

  fastify.post('/task/create', async (request, reply) => {
    const { command_id, payload } = request.body as any;
    const { data, error } = await supa.from('ops_tasks').insert({ command_id, payload }).select().single();
    if (error) {
      fastify.log.error(`Error creating ops_task: ${error.message}`);
      return reply.code(500).send({ error: error.message });
    }
    return { taskId: data.id, status: data.status };
  });

  fastify.post('/task/update', async (request, reply) => {
    const { task_id, status, result } = request.body as any;
    const { data, error } = await supa.from('ops_tasks').update({ status, result }).eq('id', task_id).select().single();
    if (error) {
      fastify.log.error(`Error updating ops_task ${task_id}: ${error.message}`);
      return reply.code(500).send({ error: error.message });
    }
    return { taskId: data.id, status: data.status, result: data.result };
  });

  fastify.get('/task/pending', async (request, reply) => {
    const { data, error } = await supa.from('ops_tasks').select('*').eq('status', 'queued');
    if (error) {
      fastify.log.error(`Error fetching pending ops_tasks: ${error.message}`);
      return reply.code(500).send({ error: error.message });
    }
    return { tasks: data };
  });
}

