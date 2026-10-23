import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { useLocalSearchParams } from 'expo-router';
import { font } from '@/constants/type';
import {
  MIN_CONTROL,
  PrimaryButton,
  Screen,
  SettingSwitch,
  ToyAvatar,
  colorFor,
} from '@/components/ui';
import { usePlaySession } from '@/context/PlaySession';
import { MUSIC_VOLUMES } from '@/game/audio';
import { TOY_RESIDENTS } from '@/gameData';
import { rateFor } from '@/game/rules';
import { gameLabel, type StoryUnderstood } from '@/game/session';
import { voiceStatus } from '@/game/voice';
import { useColors } from '@/hooks/useColors';
import { leaveToVillage, openGame, resumeGame } from '@/navigation';

function clock(iso: string): string {
  const date = new Date(iso);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const suffix = hours >= 12 ? 'pm' : 'am';
  const hour = hours % 12 || 12;
  return `${hour}:${minutes} ${suffix}`;
}

function durationLabel(startIso: string, endMs: number): string {
  const seconds = Math.max(0, Math.round((endMs - new Date(startIso).getTime()) / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min ${seconds % 60} sec`;
}

export default function GrownUpScreen() {
  const colors = useColors();
  const params = useLocalSearchParams();
  const from = Array.isArray(params.from) ? params.from[0] : params.from;
  const fromPlay = from === 'play';
  const {
    speechOn,
    setSpeechOn,
    musicVolume,
    setMusicVolume,
    steadyTempo,
    setSteadyTempo,
    active,
    completed,
    voice,
    previewVoice,
    startGame,
    iPrompted,
    finish,
    setStory,
  } = usePlaySession();
  const [now, setNow] = useState(Date.now());
  const latest = completed[0] ?? null;

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);

  const choose = (game: 'time' | 'color') => {
    startGame(game);
    openGame(game);
  };

  return (
    <Screen>
      <Text style={[styles.kicker, { color: colors.forest }]}>GROWN-UP CORNER</Text>
      <Text style={[styles.title, { color: colors.ink }]}>Set up a little play.</Text>
      <Text style={[styles.body, { color: colors.mutedForeground }]}>
        Press and hold brought you here. Stay close while your child plays.
      </Text>

      <View
        accessibilityLiveRegion="polite"
        testID={active ? 'session-live' : latest ? 'session-summary' : 'session-empty'}
      >
        {active ? (
          <LiveSheet
            now={now}
            onPrompt={iPrompted}
            onFinish={finish}
          />
        ) : latest ? (
          <Summary sheetStarted={latest.startedAt} onStory={setStory} />
        ) : (
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            Totals appear here after you finish a game. They stay on this device.
          </Text>
        )}
      </View>

      <SettingSwitch
        title="Spoken prompts"
        subtitle={speechOn ? 'On' : 'Off'}
        on={speechOn}
        onPress={() => setSpeechOn(!speechOn)}
        icon={speechOn ? 'volume-2' : 'volume-x'}
        colors={colors}
        testID="speech-toggle"
      />
      <View style={[styles.card, { backgroundColor: colors.cream }]}>
        <Text style={[styles.cardTitle, { color: colors.ink }]}>Voice preview</Text>
        <Text style={[styles.body, { color: colors.mutedForeground }]} testID="voice-status">
          {voiceStatus(voice)}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Preview the speaking voice"
          onPress={previewVoice}
          style={({ pressed }) => [styles.wideButton, { backgroundColor: colors.secondary }, pressed && styles.pressed]}
          testID="preview-voice"
        >
          <Feather name="volume-2" size={20} color={colors.forest} />
          <Text style={[styles.wideLabel, { color: colors.forest }]}>Preview voice</Text>
        </Pressable>
      </View>

      <View style={styles.volumeBlock}>
        <Text style={[styles.cardTitle, { color: colors.ink }]}>Music volume</Text>
        <View style={styles.volumeRow}>
          {MUSIC_VOLUMES.map((step) => {
            const selected = step.value === musicVolume;
            return (
              <Pressable
                key={step.id}
                accessibilityRole="button"
                accessibilityLabel={`Music ${step.label}`}
                accessibilityState={{ selected }}
                onPress={() => setMusicVolume(step.value)}
                style={({ pressed }) => [
                  styles.volumeButton,
                  { backgroundColor: selected ? colors.forest : colors.secondary },
                  pressed && styles.pressed,
                ]}
                testID={`music-${step.id}`}
              >
                <Text style={[styles.volumeLabel, { color: selected ? colors.cream : colors.forest }]}>
                  {step.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <SettingSwitch
        title="Steady tempo"
        subtitle={steadyTempo ? 'Locked at a steady pace' : 'The song speeds up a little as toys come home'}
        on={steadyTempo}
        onPress={() => setSteadyTempo(!steadyTempo)}
        icon="clock"
        colors={colors}
        testID="steady-tempo"
      />

      {fromPlay && active?.gameId === 'time' ? (
        <Text style={[styles.body, { color: colors.mutedForeground }]}>
          The Time Game is still playing under this screen. Volume and tempo change it live.
        </Text>
      ) : (
        <MusicPreview />
      )}

      <View style={[styles.notice, { backgroundColor: colors.accent }]}>
        <Feather name="info" size={20} color={colors.accentForeground} />
        <View style={styles.noticeCopy}>
          <Text style={[styles.cardTitle, { color: colors.accentForeground }]}>This is a sensing prototype</Text>
          <Text style={[styles.noticeBody, { color: colors.accentForeground }]}>
            Tapping a toy stands in for putting it in the box or scanning it. No camera and no box sensor
            is connected. The child Color Game shows a color swatch and speaks the color. It does not print
            the color name. Check the voice, volume, and tempo before any child trial.
          </Text>
        </View>
      </View>

      <View style={[styles.notice, { backgroundColor: colors.secondary }]}>
        <Feather name="lock" size={18} color={colors.forest} />
        <Text style={[styles.noticeBody, { color: colors.secondaryForeground }]}>
          Session totals stay on this device: game, times, toys accepted, color mismatches, and how often
          you tap I prompted. No names, no voice recordings, and no photos. Nothing is sent to a server.
        </Text>
      </View>

      <Text style={[styles.cardTitle, { color: colors.ink }]}>The village residents</Text>
      <View style={styles.list}>
        {TOY_RESIDENTS.map((toy) => {
          const tint = colorFor(toy.color, colors);
          return (
            <View key={toy.id} style={[styles.resident, { backgroundColor: colors.cream }]}>
              <ToyAvatar toy={toy} colors={colors} size={48} />
              <View style={styles.noticeCopy}>
                <Text style={[styles.residentName, { color: colors.ink }]}>{toy.name}</Text>
                <Text style={[styles.body, { color: colors.mutedForeground }]}>
                  {toy.colorLabel} house · {toy.instrumentLabel}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <Text style={[styles.cardTitle, { color: colors.ink }]}>
        {active ? 'Choose another game' : 'Choose a game'}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Time Game"
        onPress={() => choose('time')}
        style={({ pressed }) => [styles.gameCard, { backgroundColor: colors.cream }, pressed && styles.pressed]}
        testID="start-time-game"
      >
        <View style={[styles.gameIcon, { backgroundColor: colors.sunshineWash }]}>
          <Feather name="music" size={26} color={colors.forest} />
        </View>
        <View style={styles.noticeCopy}>
          <Text style={[styles.gameTitle, { color: colors.ink }]}>Time Game</Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            Each toy adds an instrument. Toys stay home once they return.
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Color Game"
        onPress={() => choose('color')}
        style={({ pressed }) => [styles.gameCard, { backgroundColor: colors.cream }, pressed && styles.pressed]}
        testID="start-color-game"
      >
        <View style={[styles.gameIcon, { backgroundColor: colors.lagoonWash }]}>
          <Feather name="search" size={24} color={colors.lagoon} />
        </View>
        <View style={styles.noticeCopy}>
          <Text style={[styles.gameTitle, { color: colors.ink }]}>Color Game</Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            Hear a color, then find a toy that looks like it.
          </Text>
        </View>
      </Pressable>

      {active ? (
        <PrimaryButton
          title="Resume the game"
          icon="play"
          colors={colors}
          testID="resume-session"
          onPress={() => resumeGame(active.gameId, fromPlay)}
        />
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Return to the village"
        onPress={leaveToVillage}
        style={({ pressed }) => [styles.returnButton, pressed && styles.pressed]}
        testID="return-home"
      >
        <Text style={[styles.returnText, { color: colors.forest }]}>Return to the village</Text>
      </Pressable>
    </Screen>
  );
}

function LiveSheet({ now, onPrompt, onFinish }: { now: number; onPrompt: () => void; onFinish: () => void }) {
  const colors = useColors();
  const { active } = usePlaySession();
  if (!active) return null;
  return (
    <View style={[styles.card, { backgroundColor: colors.cream }]}>
      <Text style={[styles.cardTitle, { color: colors.ink }]}>{gameLabel(active.gameId)} in progress</Text>
      <Text style={[styles.body, { color: colors.mutedForeground }]} testID="session-elapsed">
        Started {clock(active.startedAt)} · {durationLabel(active.startedAt, now)}
      </Text>
      <Text style={[styles.metric, { color: colors.ink }]} testID="session-toys">
        Toys accepted: {active.toysAccepted.length}
      </Text>
      <Text style={[styles.metric, { color: colors.ink }]} testID="session-mismatches">
        Color mismatches: {active.colorMismatches}
      </Text>
      <Text style={[styles.metric, { color: colors.ink }]} testID="session-prompts">
        Adult prompts: {active.adultPrompts}
      </Text>
      <Text style={[styles.body, { color: colors.mutedForeground }]}>
        Tempo: {active.steadyTempo ? 'steady' : 'rising'}. Play again keeps this session and adds to the totals.
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="I prompted"
        onPress={onPrompt}
        style={({ pressed }) => [styles.wideButton, { backgroundColor: colors.secondary }, pressed && styles.pressed]}
        testID="adult-prompted"
      >
        <Text style={[styles.wideLabel, { color: colors.forest }]}>I prompted</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Finish this session"
        onPress={onFinish}
        style={({ pressed }) => [styles.wideButton, { backgroundColor: colors.errorWash }, pressed && styles.pressed]}
        testID="finish-session"
      >
        <Text style={[styles.wideLabel, { color: colors.destructive }]}>Finish this session</Text>
      </Pressable>
    </View>
  );
}

function Summary({
  sheetStarted,
  onStory,
}: {
  sheetStarted: string;
  onStory: (value: StoryUnderstood) => void;
}) {
  const colors = useColors();
  const { completed } = usePlaySession();
  const sheet = completed.find((item) => item.startedAt === sheetStarted) ?? completed[0];
  if (!sheet || !sheet.endedAt) return null;
  const home = sheet.homeAtFinish.length;
  const percent = Math.round((home / TOY_RESIDENTS.length) * 100);
  const options: { id: StoryUnderstood; label: string }[] = [
    { id: 'yes', label: 'Yes' },
    { id: 'not-sure', label: 'Not sure' },
    { id: 'no', label: 'No' },
  ];
  return (
    <View style={[styles.card, { backgroundColor: colors.cream }]}>
      <Text style={[styles.cardTitle, { color: colors.ink }]}>{gameLabel(sheet.gameId)} totals</Text>
      <Text style={[styles.body, { color: colors.mutedForeground }]}>
        {clock(sheet.startedAt)} to {clock(sheet.endedAt)} · {durationLabel(sheet.startedAt, new Date(sheet.endedAt).getTime())}
      </Text>
      <Text style={[styles.metric, { color: colors.ink }]} testID="summary-home">
        Toys home at the end: {home} of {TOY_RESIDENTS.length} ({percent}%)
      </Text>
      <Text style={[styles.metric, { color: colors.ink }]} testID="summary-accepted">
        Accepted placements: {sheet.toysAccepted.length}
      </Text>
      <Text style={[styles.metric, { color: colors.ink }]} testID="summary-mismatches">
        Color mismatches: {sheet.colorMismatches}
      </Text>
      <Text style={[styles.metric, { color: colors.ink }]} testID="summary-prompts">
        Adult prompts: {sheet.adultPrompts}
      </Text>
      <Text style={[styles.body, { color: colors.mutedForeground }]}>
        Tempo was {sheet.steadyTempo ? 'steady' : 'rising'}. Sessions kept on this device: {completed.length}.
      </Text>
      <Text style={[styles.metric, { color: colors.ink }]}>Draft targets for a later trial</Text>
      <Text style={[styles.body, { color: colors.mutedForeground }]}>
        At least 70% of the six toys home. This session ended at {percent}%. No more than 2 adult prompts.
        This session had {sheet.adultPrompts}. Detection accuracy is not measured, because sensing is still simulated.
        The draft baseline is 3 sessions. This device has {completed.length}.
      </Text>
      <Text style={[styles.cardTitle, { color: colors.ink }]}>Did the story seem clear?</Text>
      <View style={styles.volumeRow}>
        {options.map((option) => {
          const selected = sheet.storyUnderstood === option.id;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              accessibilityState={{ selected }}
              onPress={() => onStory(option.id)}
              style={({ pressed }) => [
                styles.volumeButton,
                { backgroundColor: selected ? colors.forest : colors.secondary },
                pressed && styles.pressed,
              ]}
              testID={`story-${option.id}`}
            >
              <Text style={[styles.volumeLabel, { color: selected ? colors.cream : colors.forest }]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function MusicPreview() {
  const colors = useColors();
  const { musicVolume, steadyTempo } = usePlaySession();
  const chime = useAudioPlayer(require('../assets/audio/chime.wav'));
  const strings = useAudioPlayer(require('../assets/audio/strings.wav'));
  const wood = useAudioPlayer(require('../assets/audio/wood.wav'));
  const bell = useAudioPlayer(require('../assets/audio/bell.wav'));
  const drum = useAudioPlayer(require('../assets/audio/drum.wav'));
  const piano = useAudioPlayer(require('../assets/audio/piano.wav'));
  const [playing, setPlaying] = useState(false);

  useEffect(
    () => () => {
      chime.pause();
      strings.pause();
      wood.pause();
      bell.pause();
      drum.pause();
      piano.pause();
    },
    [bell, chime, drum, piano, strings, wood],
  );

  const preview = () => {
    if (musicVolume <= 0) return;
    const rate = rateFor(TOY_RESIDENTS.length, steadyTempo);
    const players = [chime, strings, wood, bell, drum, piano];
    players.forEach((player) => {
      player.loop = true;
      player.volume = musicVolume;
      player.playbackRate = rate;
      void player.seekTo(0);
      player.play();
    });
    setPlaying(true);
    setTimeout(() => {
      players.forEach((player) => player.pause());
      setPlaying(false);
    }, 4000);
  };

  return (
    <View style={styles.volumeBlock}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Preview six layers"
        onPress={preview}
        disabled={musicVolume <= 0}
        style={({ pressed }) => [
          styles.wideButton,
          { backgroundColor: colors.secondary, opacity: musicVolume <= 0 ? 0.5 : 1 },
          pressed && styles.pressed,
        ]}
        testID="preview-music"
      >
        <Feather name="music" size={20} color={colors.forest} />
        <Text style={[styles.wideLabel, { color: colors.forest }]}>
          {musicVolume <= 0 ? 'Music is off' : playing ? 'Playing six layers…' : 'Preview six layers'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  kicker: { fontFamily: font.bold, fontSize: 13, letterSpacing: 1.1 },
  title: { fontFamily: font.bold, fontSize: 32, lineHeight: 38, letterSpacing: -1 },
  body: { fontFamily: font.regular, fontSize: 15, lineHeight: 22 },
  card: { borderRadius: 20, padding: 16, gap: 10 },
  cardTitle: { fontFamily: font.bold, fontSize: 18 },
  metric: { fontFamily: font.semibold, fontSize: 16, lineHeight: 22 },
  wideButton: {
    minHeight: MIN_CONTROL,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  wideLabel: { fontFamily: font.bold, fontSize: 16 },
  volumeBlock: { gap: 8 },
  volumeRow: { flexDirection: 'row', gap: 8 },
  volumeButton: {
    flex: 1,
    minHeight: MIN_CONTROL,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  volumeLabel: { fontFamily: font.bold, fontSize: 14 },
  notice: { flexDirection: 'row', gap: 10, borderRadius: 18, padding: 14, alignItems: 'flex-start' },
  noticeCopy: { flex: 1, gap: 4 },
  noticeBody: { fontFamily: font.regular, fontSize: 15, lineHeight: 21, flex: 1 },
  list: { gap: 8 },
  resident: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, borderRadius: 16 },
  residentName: { fontFamily: font.bold, fontSize: 16 },
  gameCard: {
    minHeight: 96,
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gameIcon: {
    width: MIN_CONTROL,
    height: MIN_CONTROL,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameTitle: { fontFamily: font.bold, fontSize: 18 },
  returnButton: { minHeight: MIN_CONTROL, alignItems: 'center', justifyContent: 'center' },
  returnText: { fontFamily: font.bold, fontSize: 16 },
  pressed: { opacity: 0.75 },
});
