
# ManusVA
VA Server (Node/TS) + Manos Agent + SQL tools.
- Build: `npm --prefix apps/va-server ci && npm --prefix apps/va-server run build`
- Run: `node apps/va-server/dist/server.js`
- Agent: `MANOS_TOKEN=... VA_BASE=http://127.0.0.1:8080 node manos-agent.mjs`
