
import * as speechSdk from 'microsoft-cognitiveservices-speech-sdk';
import { cfg } from '../../config';

export async function transcribeCloud(buf: Buffer, locale = 'ar-SY') {
  if (!cfg.azure.key || !cfg.azure.region) {
    throw new Error('Azure Speech not configured');
  }
  const audioFormat = speechSdk.AudioStreamFormat.getDefaultInputFormat();
  const pushStream = speechSdk.AudioInputStream.createPushStream(audioFormat);
  pushStream.write(buf);
  pushStream.close();

  const config = speechSdk.SpeechConfig.fromSubscription(cfg.azure.key, cfg.azure.region);
  config.speechRecognitionLanguage = locale;
  config.setProperty('SpeechServiceResponse_PostProcessingOption', 'TrueText');
  config.setServiceProperty('wordLevelTimestampsEnabled', 'true', speechSdk.ServicePropertyChannel.UriQueryParameter);

  const audioConfig = speechSdk.AudioConfig.fromStreamInput(pushStream);
  const recognizer = new speechSdk.SpeechRecognizer(config, audioConfig);

  const text: string = await new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync((r) => {
      if (r.errorDetails) reject(new Error(r.errorDetails));
      else resolve(r.text ?? '');
    });
  });

  return { text };
}
