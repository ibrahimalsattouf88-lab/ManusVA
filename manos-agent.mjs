// manos-agent.mjs
// تشغيل: node manos-agent.mjs

const fetch = globalThis.fetch ?? (await import('node-fetch')).default;

const ENV = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  VA_BASE: (process.env.VA_BASE || '').replace(/\/+$/, ''),
  MANUS_API_URL: (process.env.MANUS_API_URL || '').replace(/\/+$/, ''), // <-- مهم
  MANOS_API_KEY: process.env.MANOS_API_KEY,
  MANOS_TOKEN: process.env.MANOS_TOKEN, // إن كنت تستعمله أيضاً
};

function need(name) {
  if (!ENV[name]) {
    throw new Error(`${name} environment variable is required`);
  }
  return ENV[name];
}

function log(...args) {
  console.log(...args);
}

async function fetchJSON(url, init = {}) {
  // رؤوس افتراضية + تعريف User-Agent لتجنب حجب من بعض الشبكات
  const headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    'user-agent': 'ManosAgent/1.0 (+github actions)',
    ...(init.headers || {}),
  };
  const res = await fetch(url, { ...init, headers });

  const text = await res.text();
  if (!res.ok) {
    // اطبع أوّل 200 حرف لفهم المشكلة
    throw new Error(`HTTP ${res.status} ${res.statusText} from ${url}\n${text.slice(0, 200)}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Non-JSON response from ${url}\n${text.slice(0, 200)}`);
  }
}

function apiUrl(path) {
  return `${need('MANUS_API_URL')}${path.startsWith('/') ? '' : '/'}${path}`;
}

async function pollOnce() {
  // مثال نقطة سحب مهام — عدّل المسار حسب APIك إن لزم:
  const url = apiUrl('/ops/poll');

  const headers = {
    'x-api-key': need('MANOS_API_KEY'),
  };
  if (ENV.MANOS_TOKEN) headers['authorization'] = `Bearer ${ENV.MANOS_TOKEN}`;

  log('Polling:', url);
  const data = await fetchJSON(url, { method: 'GET', headers });
  return data; // توقع { tasks: [...] }
}

async function execTask(task) {
  // مثال تنفيذ — عدّل المسار/البودي حسب APIك
  const url = apiUrl('/ops/exec');
  const headers = {
    'x-api-key': need('MANOS_API_KEY'),
  };
  if (ENV.MANOS_TOKEN) headers['authorization'] = `Bearer ${ENV.MANOS_TOKEN}`;

  const body = JSON.stringify({ id: task.id });
  log('Exec:', task.id, url);
  const out = await fetchJSON(url, { method: 'POST', headers, body });
  return out;
}

async function main() {
  need('MANUS_API_URL');
  need('MANOS_API_KEY');

  log('========================================');
  log('Manos Agent started.');
  log('VA Server URL:', ENV.VA_BASE || '(not set)');
  log('MANUS API URL:', ENV.MANUS_API_URL);
  log('Authorization: ', ENV.MANOS_TOKEN ? 'Bearer token present' : 'No bearer');
  log('MANUS API KEY: ', 'Configured');
  log('========================================');

  try {
    const polled = await pollOnce(); // { tasks: [...] } متوقعة
    const tasks = polled?.tasks ?? [];
    log(`Fetched ${tasks.length} task(s).`);

    for (const t of tasks) {
      try {
        const res = await execTask(t);
        log('Task done:', t.id, res?.status || 'ok');
      } catch (e) {
        console.error('Task failed:', t.id, e.message);
      }
    }
  } catch (e) {
    console.error('Polling error:', e.message);
  }
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
