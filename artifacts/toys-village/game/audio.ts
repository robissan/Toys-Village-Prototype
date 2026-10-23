export const MUSIC_VOLUMES = [
  { id: 'off', value: 0, label: 'Off' },
  { id: 'soft', value: 0.06, label: 'Soft' },
  { id: 'usual', value: 0.12, label: 'Usual' },
  { id: 'full', value: 0.22, label: 'Full' },
] as const;

export type MusicVolume = (typeof MUSIC_VOLUMES)[number]['value'];

export const DEFAULT_MUSIC_VOLUME: MusicVolume = 0.12;

export function coerceVolume(value: unknown): MusicVolume {
  const found = MUSIC_VOLUMES.find((step) => step.value === value);
  return found ? found.value : DEFAULT_MUSIC_VOLUME;
}
