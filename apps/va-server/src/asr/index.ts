import { cfg } from '../config';
import { transcribeCloud } from './providers/cloud';
import { transcribeOffline } from './providers/offline';

export async function transcribeAndUnderstand(audioChunk: Buffer, lang='ar-SY'){
  if(cfg.providerMode === 'offline_hybrid'){
    try { return await transcribeOffline(audioChunk, lang); }
    catch { return await transcribeCloud(audioChunk, lang); }
  }
  return await transcribeCloud(audioChunk, lang);
}
