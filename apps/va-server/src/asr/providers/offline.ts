export async function transcribeOffline(audioChunk: Buffer, lang: string): Promise<{ text: string, section_slug?: string, matched_phrase?: string }> {
  // Placeholder for actual offline ASR/NLU integration (e.g., whisper.cpp or Vosk)
  console.log(`Transcribing audio chunk (${audioChunk.length} bytes) using offline provider for language ${lang}`);
  // Simulate a response
  const simulatedText = "هذا نص محول من وضع عدم الاتصال";
  return { text: simulatedText, section_slug: "general", matched_phrase: simulatedText };
}
