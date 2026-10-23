import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { TOY_RESIDENTS, type ToyColor } from '@/gameData';
import { DEFAULT_MUSIC_VOLUME, type MusicVolume } from '@/game/audio';
import { nextTarget } from '@/game/rules';
import {
  acceptToy,
  archiveIfUsed,
  finishSession,
  recordAdultPrompt,
  recordMismatch,
  rememberSession,
  sanitizePersisted,
  startSession,
  withSteadyTempo,
  withStoryUnderstood,
  type DeviceSessions,
  type GameId,
  type PersistedPlay,
  type SessionSheet,
  type StoryUnderstood,
} from '@/game/session';
import { applyInput, type InputResult, type SensorEvent } from '@/game/sensor';
import { speechProsody, type VoiceChoice } from '@/game/voice';
import { detectVoice, subscribeVoices } from '@/context/speech';

const STORAGE_KEY = 'toys-village.device-session.v1';

interface State {
  ready: boolean;
  speechOn: boolean;
  musicVolume: MusicVolume;
  steadyTempo: boolean;
  timeHomeIds: string[];
  colorHomeIds: string[];
  targetColor: ToyColor;
  colorPromptNonce: number;
  log: DeviceSessions;
  voice: VoiceChoice;
}

const initialState: State = {
  ready: false,
  speechOn: true,
  musicVolume: DEFAULT_MUSIC_VOLUME,
  steadyTempo: false,
  timeHomeIds: [],
  colorHomeIds: [],
  targetColor: TOY_RESIDENTS[0].color,
  colorPromptNonce: 0,
  log: { active: null, completed: [] },
  voice: { voice: null, roboticOnly: true },
};

interface PlayApi {
  ready: boolean;
  speechOn: boolean;
  musicVolume: MusicVolume;
  steadyTempo: boolean;
  timeHomeIds: string[];
  colorHomeIds: string[];
  targetColor: ToyColor;
  colorPromptNonce: number;
  active: SessionSheet | null;
  completed: SessionSheet[];
  voice: VoiceChoice;
  setSpeechOn: (on: boolean) => void;
  setMusicVolume: (value: MusicVolume) => void;
  setSteadyTempo: (on: boolean) => void;
  speak: (message: string, force?: boolean) => void;
  previewVoice: () => void;
  startGame: (game: GameId) => void;
  applyEvent: (event: SensorEvent) => InputResult;
  playAgain: () => void;
  iPrompted: () => void;
  finish: () => void;
  setStory: (value: StoryUnderstood) => void;
}

const PlayContext = createContext<PlayApi | null>(null);

export function PlaySessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);
  const ref = useRef(initialState);

  const commit = useCallback((next: State) => {
    ref.current = next;
    setState(next);
  }, []);

  const speak = useCallback((message: string, force = false) => {
    const current = ref.current;
    if (!force && !current.speechOn) return;
    const prosody = speechProsody(current.voice.roboticOnly);
    const options = {
      language: current.voice.voice?.language ?? 'en-US',
      pitch: prosody.pitch,
      rate: prosody.rate,
    };
    const voiceId = current.voice.voice?.identifier;
    Speech.stop();
    if (!voiceId) {
      Speech.speak(message, options);
      return;
    }
    Speech.speak(message, {
      ...options,
      voice: voiceId,
      onError: () => {
        Speech.speak(message, options);
      },
    });
  }, []);

  const previewVoice = useCallback(() => {
    speak('Hello. I am here with you. Let’s help the toys find their homes.', true);
  }, [speak]);

  const setSpeechOn = useCallback((on: boolean) => {
    if (!on) Speech.stop();
    const current = ref.current;
    commit({ ...current, speechOn: on });
  }, [commit]);

  const setMusicVolume = useCallback((musicVolume: MusicVolume) => {
    commit({ ...ref.current, musicVolume });
  }, [commit]);

  const setSteadyTempo = useCallback((steadyTempo: boolean) => {
    const current = ref.current;
    commit({
      ...current,
      steadyTempo,
      log: {
        ...current.log,
        active: current.log.active ? withSteadyTempo(current.log.active, steadyTempo) : null,
      },
    });
  }, [commit]);

  const startGame = useCallback((game: GameId) => {
    const current = ref.current;
    const homeIds = current.log.active?.gameId === 'color' ? current.colorHomeIds : current.timeHomeIds;
    const archived = archiveIfUsed(current.log, homeIds);
    const target = nextTarget(TOY_RESIDENTS)?.color ?? TOY_RESIDENTS[0].color;
    commit({
      ...current,
      log: { ...archived, active: startSession(game, current.steadyTempo) },
      timeHomeIds: game === 'time' ? [] : current.timeHomeIds,
      colorHomeIds: game === 'color' ? [] : current.colorHomeIds,
      targetColor: game === 'color' ? target : current.targetColor,
      colorPromptNonce: game === 'color' ? current.colorPromptNonce + 1 : current.colorPromptNonce,
    });
  }, [commit]);

  const applyEvent = useCallback((event: SensorEvent): InputResult => {
    const current = ref.current;
    const result = applyInput(
      {
        timeHomeIds: current.timeHomeIds,
        colorHomeIds: current.colorHomeIds,
        targetColor: current.targetColor,
      },
      event,
    );
    let active = current.log.active;
    if (active && result.mismatch) active = recordMismatch(active);
    else if (active && result.acceptedToyId) active = acceptToy(active, result.acceptedToyId);
    commit({
      ...current,
      timeHomeIds: result.boards.timeHomeIds,
      colorHomeIds: result.boards.colorHomeIds,
      targetColor: result.boards.targetColor,
      log: { ...current.log, active },
    });
    return result;
  }, [commit]);

  const playAgain = useCallback(() => {
    const current = ref.current;
    if (current.log.active?.gameId === 'color') {
      const target = nextTarget(TOY_RESIDENTS)?.color ?? TOY_RESIDENTS[0].color;
      commit({
        ...current,
        colorHomeIds: [],
        targetColor: target,
        colorPromptNonce: current.colorPromptNonce + 1,
      });
      return;
    }
    commit({ ...current, timeHomeIds: [] });
  }, [commit]);

  const iPrompted = useCallback(() => {
    const current = ref.current;
    if (!current.log.active) return;
    commit({
      ...current,
      log: { ...current.log, active: recordAdultPrompt(current.log.active) },
    });
  }, [commit]);

  const finish = useCallback(() => {
    const current = ref.current;
    if (!current.log.active) return;
    const homeIds = current.log.active.gameId === 'time' ? current.timeHomeIds : current.colorHomeIds;
    Speech.stop();
    commit({
      ...current,
      log: rememberSession(current.log, finishSession(current.log.active, homeIds)),
      timeHomeIds: [],
      colorHomeIds: [],
    });
  }, [commit]);

  const setStory = useCallback((value: StoryUnderstood) => {
    const current = ref.current;
    const [latest, ...rest] = current.log.completed;
    if (!latest) return;
    commit({
      ...current,
      log: { ...current.log, completed: [withStoryUnderstood(latest, value), ...rest] },
    });
  }, [commit]);

  useEffect(() => {
    let cancelled = false;
    const pull = () => {
      void detectVoice().then((voice) => {
        if (!cancelled) commit({ ...ref.current, voice });
      });
    };
    pull();
    const unsubscribe = subscribeVoices(pull);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [commit]);

  useEffect(() => {
    let cancelled = false;
    void AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        let stored: PersistedPlay | null = null;
        if (raw) {
          try {
            stored = sanitizePersisted(JSON.parse(raw));
          } catch {
            stored = null;
          }
        }
        const current = ref.current;
        if (current.log.active || current.timeHomeIds.length > 0 || current.colorHomeIds.length > 0) {
          commit({ ...current, ready: true });
          return;
        }
        if (!stored) {
          commit({ ...current, ready: true });
          return;
        }
        commit({
          ...current,
          speechOn: stored.speechOn,
          musicVolume: stored.musicVolume,
          steadyTempo: stored.steadyTempo,
          timeHomeIds: stored.timeHomeIds,
          colorHomeIds: stored.colorHomeIds,
          targetColor: stored.targetColor,
          log: { active: stored.active, completed: stored.completed },
          colorPromptNonce: stored.active?.gameId === 'color' ? 1 : 0,
          ready: true,
        });
      })
      .catch(() => {
        if (!cancelled) commit({ ...ref.current, ready: true });
      });
    return () => {
      cancelled = true;
    };
  }, [commit]);

  useEffect(() => {
    if (!state.ready) return;
    const payload: PersistedPlay = {
      speechOn: state.speechOn,
      musicVolume: state.musicVolume,
      steadyTempo: state.steadyTempo,
      timeHomeIds: state.timeHomeIds,
      colorHomeIds: state.colorHomeIds,
      targetColor: state.targetColor,
      active: state.log.active,
      completed: state.log.completed,
    };
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [state]);

  const api: PlayApi = {
    ready: state.ready,
    speechOn: state.speechOn,
    musicVolume: state.musicVolume,
    steadyTempo: state.steadyTempo,
    timeHomeIds: state.timeHomeIds,
    colorHomeIds: state.colorHomeIds,
    targetColor: state.targetColor,
    colorPromptNonce: state.colorPromptNonce,
    active: state.log.active,
    completed: state.log.completed,
    voice: state.voice,
    setSpeechOn,
    setMusicVolume,
    setSteadyTempo,
    speak,
    previewVoice,
    startGame,
    applyEvent,
    playAgain,
    iPrompted,
    finish,
    setStory,
  };

  return <PlayContext.Provider value={api}>{children}</PlayContext.Provider>;
}

export function usePlaySession(): PlayApi {
  const value = useContext(PlayContext);
  if (!value) throw new Error('usePlaySession must be used inside PlaySessionProvider');
  return value;
}
