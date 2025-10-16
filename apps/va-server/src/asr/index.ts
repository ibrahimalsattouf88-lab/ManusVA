
import { cfg } from '../config';
import { transcribeCloud } from './providers/cloud';
import { transcribeOffline } from './providers/offline';

export function normalizeAr(s: string) {
  const arNums = '٠١٢٣٤٥٦٧٨٩';
  return s
    .replace(/[٠-٩]/g, (d) => String(arNums.indexOf(d)))
    .replace(/\s+/g, ' ')
    .trim();
}

export async function transcribeAndUnderstand(audio: Buffer, locale = 'ar-SY') {
  let text = '';
  if (cfg.providerMode === 'offline_hybrid') {
    try { text = (await transcribeOffline(audio, 'ar')).text; }
    catch { text = (await transcribeCloud(audio, locale)).text; }
  } else {
    text = (await transcribeCloud(audio, locale)).text;
  }
  text = normalizeAr(text);
  return { text, section_slug: 'accounting', matched_phrase: text };
}
