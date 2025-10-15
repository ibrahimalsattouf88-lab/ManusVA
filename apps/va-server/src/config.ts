import 'dotenv/config';
function req(name: string){ const v = process.env[name]; if(!v) throw new Error(`Missing ${name}`); return v; }
export const cfg = {
  supabaseUrl: req('SUPABASE_URL'),
  supabaseServiceKey: req('SUPABASE_SERVICE_ROLE_KEY'),
  supabaseAnon: req('SUPABASE_ANON_KEY'),
  providerMode: process.env.PROVIDER_MODE ?? 'realtime_cloud',
  vaSecret: req('VA_SIGNING_SECRET'),
  telegram: { token: req('TELEGRAM_BOT_TOKEN'), chatId: req('TELEGRAM_CHAT_ID') },
  fxSources: JSON.parse(process.env.BLACK_FX_SOURCES ?? '[]'),
  port: Number(process.env.PORT ?? 8080),
  openai: process.env.OPENAI_API_KEY,
  asrCloudKey: process.env.ASR_CLOUD_API_KEY,
};
