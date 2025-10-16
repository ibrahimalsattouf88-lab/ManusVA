
# ManusVA (VA Server + Manos Agent)

- REST endpoints: /va/start-session, /va/append-transcript, /va/end-session
- WebSocket placeholder: /va/realtime (echo minimal)
- Manos Agent: `manos-agent.mjs` polls for ops and logs.

## Environment (.env.example)

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

VA_SIGNING_SECRET=

OPENAI_API_KEY=
ASR_CLOUD_API_KEY=

MANOS_API_URL=https://api.manus.in/v1
MANOS_API_KEY=

BLACK_FX_SOURCES=["sptoday","syrianpound","lirarate","telegram","extra_api"]

PORT=8080
NODE_ENV=production
