
import fetch from "node-fetch";

const BASE = process.env.VA_BASE || "http://127.0.0.1:8080";
const HEAD = { "Authorization": `Bearer ${process.env.MANOS_TOKEN}`, "Content-Type":"application/json" };

async function execTask(task){
  const { type, payload } = task;
  // TODO: call Manus API using MANUS_API_URL + MANUS_API_KEY if needed
  if (type === 'fx.refresh') return { ok:true, info:'fx refreshed (stub)' };
  if (type === 'asr.install_models') return { ok:true, info:'models installed (stub)' };
  return { ok:true, echo: { type, payload } };
}

async function loop(){
  while(true){
    try{
      const next = await fetch(`${BASE}/ops/next`, { method:'POST', headers: HEAD });
      const { task } = await next.json();
      if(!task){ await new Promise(r=>setTimeout(r, 1500)); continue; }
      const res = await execTask(task);
      await fetch(`${BASE}/ops/complete`, { method:'POST', headers: HEAD,
        body: JSON.stringify({ id: task.id, ok: !!res.ok, result: res, error: res.error })
      });
    }catch(e){
      // backoff
      await new Promise(r=>setTimeout(r, 3000));
    }
  }
}
loop();
