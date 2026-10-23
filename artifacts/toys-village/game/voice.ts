export interface ListedVoice {
  identifier: string;
  name: string;
  language: string;
  quality?: string | null;
}

export interface VoiceChoice {
  voice: ListedVoice | null;
  roboticOnly: boolean;
}

const ROBOTIC =
  /espeak|mbrola|festival|robot|compact|zarvox|whisper|bad news|bells|boing|cellos|trinoids|superstar|bahh|albert|fred|jester|organ|junior|ralph|whistle|pipe|novelty|klatt|pico|kal|cmu|slt|awb/i;

const WARM =
  /natural|premium|enhanced|neural|siri|samantha|karen|moira|fiona|daniel|kate|serena|allison|ava|susan|nicky|aaron|victoria|google .*english/i;

export function voiceScore(voice: ListedVoice): number {
  const language = voice.language.toLowerCase().replace('_', '-');
  if (!language.startsWith('en')) return -100;
  let score = 20;
  if (language.startsWith('en-us')) score += 8;
  else if (language.startsWith('en-gb')) score += 6;
  const quality = (voice.quality ?? '').toLowerCase();
  if (quality === 'premium') score += 30;
  else if (quality === 'enhanced') score += 24;
  if (WARM.test(voice.name) || WARM.test(quality)) score += 16;
  if (ROBOTIC.test(voice.name) || ROBOTIC.test(quality)) score -= 40;
  return score;
}

export function chooseSpeakingVoice(voices: readonly ListedVoice[]): VoiceChoice {
  const english = voices.filter((voice) => voice.language.toLowerCase().startsWith('en'));
  const pool = english.length > 0 ? english : [...voices];
  if (pool.length === 0) return { voice: null, roboticOnly: true };
  const ranked = [...pool].sort(
    (a, b) => voiceScore(b) - voiceScore(a) || a.name.localeCompare(b.name),
  );
  const voice = ranked[0] ?? null;
  if (!voice) return { voice: null, roboticOnly: true };
  const roboticOnly = ROBOTIC.test(voice.name) || voiceScore(voice) < 24;
  return { voice, roboticOnly };
}

/**
 * The previous demo voice used pitch 1.05 and rate 0.83, which sounded high and slow.
 * Warm system voices stay just under a natural pitch. Robotic ones sit lower still.
 * Rates stay near conversational speech, under 1 so a preschooler can follow.
 */
export function speechProsody(roboticOnly: boolean): { pitch: number; rate: number } {
  if (roboticOnly) return { pitch: 0.86, rate: 0.94 };
  return { pitch: 0.94, rate: 0.97 };
}

export function voiceStatus(choice: VoiceChoice): string {
  if (!choice.voice) {
    return 'No system voice was listed. Speech uses the device default, with a lower pitch and a natural rate.';
  }
  if (choice.roboticOnly) {
    return `This device only has robotic system voices. Using ${choice.voice.name}, the least robotic one, with a lower pitch.`;
  }
  return `Voice: ${choice.voice.name}. Pitch is lower than the old demo, and the rate is closer to natural speech.`;
}
