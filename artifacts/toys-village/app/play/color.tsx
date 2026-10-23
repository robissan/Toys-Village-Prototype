import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { font } from '@/constants/type';
import { successHaptic } from '@/components/haptics';
import { ColorMark } from '@/components/ToyArt';
import {
  CompletionCard,
  MIN_CONTROL,
  PageHeader,
  ProgressBar,
  Screen,
  ToyAvatar,
  colorFor,
} from '@/components/ui';
import { usePlaySession } from '@/context/PlaySession';
import { TOY_RESIDENTS, labelForColor, type ToyResident } from '@/gameData';
import { SimulatedSensor } from '@/game/sensor';
import { useColors } from '@/hooks/useColors';
import { openGrownUp } from '@/navigation';

let spokenColorNonce = -1;

export default function ColorGameScreen() {
  const colors = useColors();
  const {
    colorHomeIds,
    targetColor,
    colorPromptNonce,
    speak,
    applyEvent,
    playAgain,
  } = usePlaySession();
  const [feedback, setFeedback] = useState('Listen, then choose a toy.');
  const [feedbackKind, setFeedbackKind] = useState<'neutral' | 'match' | 'try'>('neutral');
  const target = colorFor(targetColor, colors);
  const count = colorHomeIds.length;
  const available = TOY_RESIDENTS.filter((toy) => !colorHomeIds.includes(toy.id));
  const prompt = `Find a ${labelForColor(targetColor)} toy and scan it.`;

  useEffect(() => {
    if (colorPromptNonce === 0 || spokenColorNonce === colorPromptNonce) return;
    spokenColorNonce = colorPromptNonce;
    if (count === TOY_RESIDENTS.length) return;
    speak(prompt);
  }, [colorPromptNonce, count, prompt, speak]);

  const scan = (toy: ToyResident) => {
    const result = applyEvent(SimulatedSensor.scan(toy.id, toy.color));
    if (result.mismatch) {
      setFeedback('Not this one. Try another toy.');
      setFeedbackKind('try');
      speak(`This toy is ${toy.colorLabel}. Listen for ${labelForColor(targetColor)}, and try another toy.`);
      return;
    }
    setFeedback(`${toy.name} found a home.`);
    setFeedbackKind('match');
    if (result.nextColor) {
      speak(`A match. The ${toy.name.toLowerCase()} is home. Now find a ${labelForColor(result.nextColor)} toy.`);
    } else {
      speak('A match. All six toys are home.');
      successHaptic();
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Color Game"
        subtitle="Listen, then find that color."
        onParent={() => openGrownUp('play')}
        onReplay={() => speak(prompt)}
        colors={colors}
      />
      <ProgressBar count={count} colors={colors} />
      {count === TOY_RESIDENTS.length ? (
        <CompletionCard
          colors={colors}
          title="Every resident found a home."
          detail="You sorted all six toys."
          onPlayAgain={() => {
            setFeedback('Listen, then choose a toy.');
            setFeedbackKind('neutral');
            playAgain();
          }}
        />
      ) : (
        <>
          <View
            accessibilityRole="image"
            accessibilityLabel={`Listen for ${labelForColor(targetColor)}. Match this color and pattern.`}
            style={[styles.target, { backgroundColor: target.wash }]}
            testID="color-swatch"
          >
            <ColorMark wash={colors.cream} strong={target.strong} pattern={target.pattern} size={112} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Say the color again"
              onPress={() => speak(`Find a ${labelForColor(targetColor)} toy.`)}
              style={({ pressed }) => [styles.listen, { backgroundColor: colors.cream }, pressed && styles.pressed]}
              testID="repeat-color-prompt"
            >
              <Feather name="volume-2" size={22} color={colors.forest} />
              <Text style={[styles.listenText, { color: colors.forest }]}>Say it again</Text>
            </Pressable>
          </View>

          <View style={styles.houses}>
            {TOY_RESIDENTS.map((toy) => {
              const tint = colorFor(toy.color, colors);
              const active = toy.color === targetColor;
              return (
                <View
                  key={toy.id}
                  style={[
                    styles.house,
                    {
                      backgroundColor: active ? tint.wash : colors.cream,
                      borderColor: active ? tint.strong : colors.border,
                      borderWidth: active ? 3 : 1,
                    },
                  ]}
                >
                  <ColorMark wash={tint.wash} strong={tint.strong} pattern={tint.pattern} size={40} />
                </View>
              );
            })}
          </View>

          <View
            style={[
              styles.feedback,
              {
                backgroundColor:
                  feedbackKind === 'match'
                    ? colors.successWash
                    : feedbackKind === 'try'
                      ? colors.errorWash
                      : colors.secondary,
              },
            ]}
            accessibilityLiveRegion="polite"
            testID="color-feedback"
          >
            <Feather
              name={feedbackKind === 'match' ? 'check-circle' : feedbackKind === 'try' ? 'refresh-cw' : 'search'}
              size={22}
              color={feedbackKind === 'try' ? colors.destructive : colors.forest}
            />
            <Text style={[styles.feedbackText, { color: colors.ink }]}>{feedback}</Text>
          </View>

          <View style={styles.list}>
            {available.map((toy) => (
              <View key={toy.id} style={[styles.row, { backgroundColor: colors.cream }]}>
                <ToyAvatar toy={toy} colors={colors} />
                <Text style={[styles.name, { color: colors.ink }]}>{toy.name}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Choose ${toy.name}`}
                  onPress={() => scan(toy)}
                  style={({ pressed }) => [styles.scan, { backgroundColor: colors.secondary }, pressed && styles.pressed]}
                  testID={`scan-${toy.id}`}
                >
                  <Text style={[styles.scanText, { color: colors.forest }]}>This one</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  target: {
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    gap: 14,
  },
  listen: {
    minHeight: MIN_CONTROL,
    minWidth: 160,
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listenText: { fontFamily: font.bold, fontSize: 16 },
  houses: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  house: {
    width: '31%',
    minHeight: MIN_CONTROL,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 6,
  },
  feedback: {
    minHeight: MIN_CONTROL,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  feedbackText: { flex: 1, fontFamily: font.semibold, fontSize: 16, lineHeight: 22 },
  list: { gap: 10 },
  row: {
    minHeight: 72,
    borderRadius: 18,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: { flex: 1, fontFamily: font.bold, fontSize: 18 },
  scan: {
    minHeight: MIN_CONTROL,
    minWidth: 96,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  scanText: { fontFamily: font.bold, fontSize: 16 },
  pressed: { opacity: 0.75 },
});
