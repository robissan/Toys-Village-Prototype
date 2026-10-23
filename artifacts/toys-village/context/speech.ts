import * as Speech from 'expo-speech';
import { chooseSpeakingVoice, type ListedVoice, type VoiceChoice } from '@/game/voice';

type WebVoice = { name: string; lang: string; voiceURI: string };
type WebSynth = {
  getVoices: () => WebVoice[];
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

function webSynth(): WebSynth | null {
  const host = globalThis as { speechSynthesis?: WebSynth };
  return host.speechSynthesis ?? null;
}

function mapVoice(voice: {
  identifier?: string;
  name?: string;
  language?: string;
  quality?: string | null;
  voiceURI?: string;
  lang?: string;
}): ListedVoice | null {
  const name = voice.name ?? '';
  const language = voice.language ?? voice.lang ?? '';
  const identifier = voice.identifier ?? voice.voiceURI ?? name;
  if (!name || !language) return null;
  return { identifier, name, language, quality: voice.quality ?? null };
}

export async function detectVoice(): Promise<VoiceChoice> {
  let listed: ListedVoice[] = [];
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    listed = voices.map((voice) => mapVoice(voice)).filter((voice): voice is ListedVoice => voice !== null);
  } catch {
    listed = [];
  }
  if (listed.length === 0) {
    const synth = webSynth();
    if (synth) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      listed = synth
        .getVoices()
        .map((voice) => mapVoice({ name: voice.name, language: voice.lang, identifier: voice.voiceURI }))
        .filter((voice): voice is ListedVoice => voice !== null);
    }
  }
  return chooseSpeakingVoice(listed);
}

export function subscribeVoices(onChange: () => void): () => void {
  const synth = webSynth();
  synth?.addEventListener?.('voiceschanged', onChange);
  return () => synth?.removeEventListener?.('voiceschanged', onChange);
}
