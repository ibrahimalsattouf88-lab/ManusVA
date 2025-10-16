
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';

export async function transcribeOffline(buf: Buffer, locale = 'ar') {
  const bin = process.env.WHISPER_CPP_BIN || './bin/whisper';
  const model = process.env.WHISPER_MODEL || './models/ggml-base.bin';
  const wav = join(tmpdir(), `va_${Date.now()}.wav`);
  writeFileSync(wav, buf);
  const args = ['-m', model, '-l', locale, '-f', wav, '--print-timestamps', '1'];
  const out = await new Promise<string>((resolve, reject) => {
    const p = spawn(bin, args);
    let o = '', e = '';
    p.stdout.on('data', d => (o += d));
    p.stderr.on('data', d => (e += d));
    p.on('close', code => (code === 0 ? resolve(o) : reject(new Error(e || `exit ${code}`))));
  });
  const text = out.replace(/\[[^\]]+\]/g, '').replace(/\s+/g, ' ').trim();
  return { text };
}
