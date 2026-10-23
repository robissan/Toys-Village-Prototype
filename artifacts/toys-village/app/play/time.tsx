import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { font } from '@/constants/type';
import { successHaptic } from '@/components/haptics';
import {
  CompletionCard,
  PageHeader,
  ProgressBar,
  Screen,
  ToyAvatar,
  colorFor,
} from '@/components/ui';
import { usePlaySession } from '@/context/PlaySession';
import { TOY_RESIDENTS, type InstrumentId, type ToyResident } from '@/gameData';
import { rateFor } from '@/game/rules';
import { SimulatedSensor } from '@/game/sensor';
import { useColors } from '@/hooks/useColors';
import { openGrownUp } from '@/navigation';

export default function TimeGameScreen() {
  const colors = useColors();
  const {
    timeHomeIds,
    musicVolume,
    steadyTempo,
    speak,
    applyEvent,
    playAgain,
    active,
  } = usePlaySession();
  const chime = useAudioPlayer(require('../../assets/audio/chime.wav'));
  const strings = useAudioPlayer(require('../../assets/audio/strings.wav'));
  const wood = useAudioPlayer(require('../../assets/audio/wood.wav'));
  const bell = useAudioPlayer(require('../../assets/audio/bell.wav'));
  const drum = useAudioPlayer(require('../../assets/audio/drum.wav'));
  const piano = useAudioPlayer(require('../../assets/audio/piano.wav'));
  const victory = useAudioPlayer(require('../../assets/audio/victory.wav'));
  const homeKey = timeHomeIds.join('|');
  const count = timeHomeIds.length;
  const victoryPlayed = useRef(false);
  const celebrated = useRef(false);
  const welcomedFor = useRef<string | null>(null);

  const playerFor = (instrument: InstrumentId) => {
    switch (instrument) {
      case 'chime':
        return chime;
      case 'strings':
        return strings;
      case 'wood':
        return wood;
      case 'bell':
        return bell;
      case 'drum':
        return drum;
      case 'piano':
        return piano;
    }
  };

  useEffect(() => {
    const tempo = rateFor(count, steadyTempo);
    const players = [chime, strings, wood, bell, drum, piano];
    if (musicVolume <= 0) {
      players.forEach((player) => player.pause());
      victory.pause();
      return;
    }
    if (count === TOY_RESIDENTS.length) {
      players.forEach((player) => player.pause());
      victory.loop = false;
      victory.volume = Math.min(0.8, musicVolume * 3.5);
      if (!victoryPlayed.current) {
        victoryPlayed.current = true;
        void victory.seekTo(0);
        victory.play();
      }
      return;
    }
    victoryPlayed.current = false;
    victory.pause();
    TOY_RESIDENTS.forEach((toy) => {
      const player = playerFor(toy.instrument);
      if (timeHomeIds.includes(toy.id)) {
        player.loop = true;
        player.volume = musicVolume;
        player.playbackRate = tempo;
        if (!player.playing) player.play();
      } else {
        player.pause();
      }
    });
  }, [bell, chime, count, drum, homeKey, musicVolume, piano, steadyTempo, strings, timeHomeIds, victory, wood]);

  useEffect(() => {
    if (count === TOY_RESIDENTS.length) {
      if (!celebrated.current) {
        celebrated.current = true;
        speak('All six toys are home. What a lovely village song.');
        successHaptic();
      }
      return;
    }
    celebrated.current = false;
  }, [count, speak]);

  useEffect(() => {
    const startedAt = active?.gameId === 'time' ? active.startedAt : null;
    if (!startedAt || welcomedFor.current === startedAt) return;
    welcomedFor.current = startedAt;
    if (count === TOY_RESIDENTS.length) return;
    speak('Welcome to the Time Game. Put a toy in the box, then tap its picture.');
  }, [active, count, speak]);

  useEffect(
    () => () => {
      chime.pause();
      strings.pause();
      wood.pause();
      bell.pause();
      drum.pause();
      piano.pause();
      victory.pause();
    },
    [bell, chime, drum, piano, strings, victory, wood],
  );

  const place = (toy: ToyResident) => {
    applyEvent(SimulatedSensor.placement(toy.id, true));
  };

  return (
    <Screen>
      <PageHeader
        title="Time Game"
        subtitle="Every toy brings a new sound."
        onParent={() => openGrownUp('play')}
        onReplay={() => speak('Put a toy in the box, then tap its picture.')}
        colors={colors}
      />
      <ProgressBar count={count} colors={colors} />
      {count === TOY_RESIDENTS.length ? (
        <CompletionCard
          colors={colors}
          title="The whole village is home."
          detail="Six toys came home and made a song together."
          onPlayAgain={() => {
            playAgain();
            speak('A new song is ready. Put a toy in the box, then tap it.');
          }}
        />
      ) : (
        <View style={styles.list}>
          {TOY_RESIDENTS.map((toy) => {
            const home = timeHomeIds.includes(toy.id);
            const tint = colorFor(toy.color, colors);
            if (home) {
              return (
                <View
                  key={toy.id}
                  accessibilityLabel={`${toy.name} is home`}
                  style={[styles.row, { backgroundColor: colors.cream, borderColor: colors.border }]}
                >
                  <ToyAvatar toy={toy} colors={colors} />
                  <View style={styles.copy}>
                    <Text style={[styles.name, { color: colors.ink }]}>{toy.name}</Text>
                    <Text style={[styles.sub, { color: colors.mutedForeground }]}>Home</Text>
                  </View>
                  <Feather name="check-circle" size={26} color={colors.forest} />
                </View>
              );
            }
            return (
              <Pressable
                key={toy.id}
                accessibilityRole="button"
                accessibilityLabel={`Bring ${toy.name} home`}
                onPress={() => place(toy)}
                style={({ pressed }) => [
                  styles.row,
                  { backgroundColor: tint.wash, borderColor: tint.strong },
                  pressed && styles.pressed,
                ]}
                testID={`toggle-${toy.id}`}
              >
                <ToyAvatar toy={toy} colors={colors} />
                <View style={styles.copy}>
                  <Text style={[styles.name, { color: colors.ink }]}>{toy.name}</Text>
                  <Text style={[styles.sub, { color: colors.mutedForeground }]}>Tap when it is in the box</Text>
                </View>
                <Feather name="arrow-right" size={22} color={tint.strong} />
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  row: {
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 2,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  copy: { flex: 1, gap: 2 },
  name: { fontFamily: font.bold, fontSize: 18 },
  sub: { fontFamily: font.regular, fontSize: 14 },
  pressed: { opacity: 0.75 },
});
