import { TOY_RESIDENTS, type ToyColor } from '../gameData';
import { coerceVolume, type MusicVolume } from './audio';

export type GameId = 'time' | 'color';
export type StoryUnderstood = 'yes' | 'not-sure' | 'no';

/** On-device adult record. Toy ids only: no child name, voice, or photo. */
export interface SessionSheet {
  gameId: GameId;
  startedAt: string;
  endedAt: string | null;
  toysAccepted: string[];
  colorMismatches: number;
  adultPrompts: number;
  steadyTempo: boolean;
  storyUnderstood: StoryUnderstood | null;
  homeAtFinish: string[];
}

export interface DeviceSessions {
  active: SessionSheet | null;
  completed: SessionSheet[];
}

export interface PersistedPlay {
  speechOn: boolean;
  musicVolume: MusicVolume;
  steadyTempo: boolean;
  timeHomeIds: string[];
  colorHomeIds: string[];
  targetColor: ToyColor;
  active: SessionSheet | null;
  completed: SessionSheet[];
}

const TOY_IDS = new Set(TOY_RESIDENTS.map((toy) => toy.id));
const COLORS = new Set(TOY_RESIDENTS.map((toy) => toy.color));
const GAMES = new Set<GameId>(['time', 'color']);
const STORIES = new Set<StoryUnderstood>(['yes', 'not-sure', 'no']);
const SESSION_LIMIT = 12;

export function startSession(
  gameId: GameId,
  steadyTempo: boolean,
  now = Date.now(),
): SessionSheet {
  return {
    gameId,
    startedAt: new Date(now).toISOString(),
    endedAt: null,
    toysAccepted: [],
    colorMismatches: 0,
    adultPrompts: 0,
    steadyTempo,
    storyUnderstood: null,
    homeAtFinish: [],
  };
}

export function acceptToy(sheet: SessionSheet, toyId: string): SessionSheet {
  return { ...sheet, toysAccepted: [...sheet.toysAccepted, toyId] };
}

export function recordMismatch(sheet: SessionSheet): SessionSheet {
  return { ...sheet, colorMismatches: sheet.colorMismatches + 1 };
}

export function recordAdultPrompt(sheet: SessionSheet): SessionSheet {
  return { ...sheet, adultPrompts: sheet.adultPrompts + 1 };
}

export function withSteadyTempo(sheet: SessionSheet, steadyTempo: boolean): SessionSheet {
  return { ...sheet, steadyTempo };
}

export function withStoryUnderstood(
  sheet: SessionSheet,
  storyUnderstood: StoryUnderstood,
): SessionSheet {
  return { ...sheet, storyUnderstood };
}

export function finishSession(
  sheet: SessionSheet,
  homeIds: readonly string[],
  now = Date.now(),
): SessionSheet {
  return {
    ...sheet,
    endedAt: new Date(now).toISOString(),
    homeAtFinish: homeIds.filter((id) => TOY_IDS.has(id)),
  };
}

export function rememberSession(log: DeviceSessions, finished: SessionSheet): DeviceSessions {
  return {
    active: null,
    completed: [finished, ...log.completed].slice(0, SESSION_LIMIT),
  };
}

export function archiveIfUsed(log: DeviceSessions, homeIds: readonly string[]): DeviceSessions {
  if (!log.active) return log;
  const used =
    log.active.toysAccepted.length > 0 ||
    log.active.colorMismatches > 0 ||
    log.active.adultPrompts > 0;
  if (!used) return { ...log, active: null };
  return rememberSession(log, finishSession(log.active, homeIds));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null;
  return value as Record<string, unknown>;
}

function knownIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === 'string' && TOY_IDS.has(id));
}

function sanitizeSheet(value: unknown): SessionSheet | null {
  const record = asRecord(value);
  if (!record) return null;
  if (record.gameId !== 'time' && record.gameId !== 'color') return null;
  if (typeof record.startedAt !== 'string') return null;
  const story = STORIES.has(record.storyUnderstood as StoryUnderstood)
    ? (record.storyUnderstood as StoryUnderstood)
    : null;
  return {
    gameId: record.gameId,
    startedAt: record.startedAt,
    endedAt: typeof record.endedAt === 'string' ? record.endedAt : null,
    toysAccepted: knownIds(record.toysAccepted),
    colorMismatches:
      typeof record.colorMismatches === 'number' && record.colorMismatches > 0
        ? Math.floor(record.colorMismatches)
        : 0,
    adultPrompts:
      typeof record.adultPrompts === 'number' && record.adultPrompts > 0
        ? Math.floor(record.adultPrompts)
        : 0,
    steadyTempo: record.steadyTempo === true,
    storyUnderstood: story,
    homeAtFinish: knownIds(record.homeAtFinish),
  };
}

export function sanitizePersisted(value: unknown): PersistedPlay | null {
  const record = asRecord(value);
  if (!record) return null;
  const target = COLORS.has(record.targetColor as ToyColor)
    ? (record.targetColor as ToyColor)
    : TOY_RESIDENTS[0].color;
  const completed = Array.isArray(record.completed)
    ? record.completed
        .map(sanitizeSheet)
        .filter((sheet): sheet is SessionSheet => sheet !== null)
        .slice(0, SESSION_LIMIT)
    : [];
  return {
    speechOn: record.speechOn !== false,
    musicVolume: coerceVolume(record.musicVolume),
    steadyTempo: record.steadyTempo === true,
    timeHomeIds: knownIds(record.timeHomeIds),
    colorHomeIds: knownIds(record.colorHomeIds),
    targetColor: target,
    active: sanitizeSheet(record.active),
    completed,
  };
}

export function gameLabel(gameId: GameId): string {
  return gameId === 'time' ? 'Time Game' : 'Color Game';
}

export function isGameId(value: string): value is GameId {
  return GAMES.has(value as GameId);
}
