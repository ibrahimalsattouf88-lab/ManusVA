
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { WebSocketServer } from 'ws';

const app = express();
app.use(cors());
app.use(express.json({limit:'2mb'}));
app.use(morgan('tiny'));

app.get('/health', (_,res)=>res.json({ok:true, ts: Date.now()}));

// Minimal VA endpoints (placeholders)
app.post('/va/start-session', (req,res)=>{
  const { userId, deviceId, meta } = req.body || {};
  // In real server we would call Supabase RPC start_voice_session
  res.json({ sessionId: cryptoRandom() , userId, deviceId, meta: meta||{} });
});
app.post('/va/append-transcript', (req,res)=>{
  const { sessionId, content, language } = req.body || {};
  res.json({ ok:true, sessionId, content, language: language||'ar' });
});
app.post('/va/end-session', (req,res)=>{
  const { sessionId } = req.body || {};
  res.json({ ok:true, sessionId, closed: true });
});

const server = app.listen(process.env.PORT || 8080, ()=>{
  console.log('VA server on', server.address().port);
});

// WebSocket echo placeholder
const wss = new WebSocketServer({ server, path: '/va/realtime' });
wss.on('connection', ws => {
  ws.on('message', msg => {
    ws.send(JSON.stringify({ echo: msg.toString() }));
  });
  ws.send(JSON.stringify({ hello: 'realtime ok' }));
});

function cryptoRandom(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c=>{
    const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}
