
import 'dotenv/config';

function req(k: string) {
  const v = process.env[k];
  if (!v || !String(v).trim()) throw new Error(`Missing ${k}`);
  return v;
}

export const cfg = {
  supabaseUrl: req('SUPABASE_URL'),
  supabaseServiceKey: req('SUPABASE_SERVICE_ROLE_KEY'),
  supabaseAnon: req('SUPABASE_ANON_KEY'),

  providerMode: process.env.PROVIDER_MODE ?? 'realtime_cloud',
  vaSecret: req('VA_SIGNING_SECRET'),

  port: Number(process.env.PORT ?? 8080),
  nodeEnv: process.env.NODE_ENV ?? 'production',
  sentryDsn: process.env.SENTRY_DSN ?? '',

  openai: process.env.OPENAI_API_KEY ?? '',
  azure: {
    key: process.env.AZURE_SPEECH_KEY ?? '',
    region: process.env.AZURE_SPEECH_REGION ?? '',
  },
  asrCloudKey: process.env.ASR_CLOUD_API_KEY ?? '',

  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN ?? '',
    chatId: process.env.TELEGRAM_CHAT_ID ?? '',
  },

  fxSources: JSON.parse(process.env.BLACK_FX_SOURCES ?? '[]'),

  manos: {
    token: req('MANOS_TOKEN'),
  },
  manus: {
    url: process.env.MANUS_API_URL ?? 'https://api.manus.im/v1',
    key: process.env.MANUS_API_KEY ?? process.env.MANOS_API_KEY ?? '',
  },
};
