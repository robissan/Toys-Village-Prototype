import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { font } from '@/constants/type';
import { TOY_RESIDENTS, type ToyColor, type ToyResident } from '@/gameData';
import { useColors, type ColorTokens } from '@/hooks/useColors';
import { ColorMark, PATTERN_FOR_COLOR, ToyArt } from '@/components/ToyArt';

export const MIN_CONTROL = 56;

type FeatherName = keyof typeof Feather.glyphMap;

const COLOR_TOKENS: Record<ToyColor, { strong: keyof ColorTokens; wash: keyof ColorTokens }> = {
  sunshine: { strong: 'sunshine', wash: 'sunshineWash' },
  lagoon: { strong: 'lagoon', wash: 'lagoonWash' },
  tomato: { strong: 'tomato', wash: 'tomatoWash' },
  lilac: { strong: 'lilac', wash: 'lilacWash' },
  mint: { strong: 'mint', wash: 'mintWash' },
  peach: { strong: 'peach', wash: 'peachWash' },
};

export function colorFor(toyColor: ToyColor, colors: ColorTokens) {
  const tokens = COLOR_TOKENS[toyColor];
  return {
    strong: colors[tokens.strong] as string,
    wash: colors[tokens.wash] as string,
    pattern: PATTERN_FOR_COLOR[toyColor],
  };
}

export function Screen({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function VillageMark({
  size = 29,
  color,
  background,
}: {
  size?: number;
  color: string;
  background: string;
}) {
  return (
    <View
      accessibilityLabel="Toy's Village"
      style={[styles.villageMark, { width: size + 17, height: size + 17, backgroundColor: background }]}
    >
      <Feather name="home" size={size} color={color} />
    </View>
  );
}

export function ToyAvatar({
  toy,
  colors,
  size = 56,
}: {
  toy: ToyResident;
  colors: ColorTokens;
  size?: number;
}) {
  const tint = colorFor(toy.color, colors);
  const badge = Math.max(16, Math.round(size * 0.34));
  return (
    <View style={[styles.toyAvatar, { width: size, height: size, backgroundColor: tint.wash }]}>
      <ToyArt toyId={toy.id} color={tint.strong} size={size * 0.68} />
      <View style={styles.patternBadge}>
        <ColorMark wash={tint.wash} strong={tint.strong} pattern={tint.pattern} size={badge} />
      </View>
    </View>
  );
}

export function MiniVillage({ colors }: { colors: ColorTokens }) {
  return (
    <View style={[styles.villageScene, { backgroundColor: colors.sky }]}>
      <View style={[styles.sunDot, { backgroundColor: colors.accent }]} />
      <View style={[styles.cloud, styles.cloudOne, { backgroundColor: colors.cream }]} />
      <View style={[styles.cloud, styles.cloudTwo, { backgroundColor: colors.cream }]} />
      <View style={[styles.villageHill, { backgroundColor: colors.meadow }]} />
      <View style={styles.villageHouses}>
        {TOY_RESIDENTS.map((toy) => {
          const tint = colorFor(toy.color, colors);
          return (
            <View key={toy.id} style={[styles.miniHome, { backgroundColor: colors.cream }]}>
              <View style={[styles.miniHomeRoof, { backgroundColor: tint.strong }]} />
              <ToyArt toyId={toy.id} color={tint.strong} size={26} />
            </View>
          );
        })}
      </View>
      <Text style={[styles.sceneCaption, { color: colors.forest }]}>All six residents have a little home</Text>
    </View>
  );
}

export function PageHeader({
  title,
  subtitle,
  onParent,
  onReplay,
  colors,
}: {
  title: string;
  subtitle: string;
  onParent: () => void;
  onReplay?: () => void;
  colors: ColorTokens;
}) {
  const [hint, setHint] = useState('');
  return (
    <View style={styles.pageHeader}>
      <View style={styles.pageHeading}>
        <Text style={[styles.eyebrow, { color: colors.forest }]}>{title}</Text>
        <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
        {hint ? <Text style={[styles.holdHint, { color: colors.forest }]}>{hint}</Text> : null}
      </View>
      <View style={styles.headerActions}>
        {onReplay ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hear the instructions again"
            onPress={onReplay}
            style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.secondary }, pressed && styles.pressed]}
            testID="replay-audio"
          >
            <Feather name="volume-2" size={22} color={colors.forest} />
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Grown-up controls"
          accessibilityHint="Press and hold. A grown-up opens this."
          delayLongPress={700}
          onLongPress={() => {
            setHint('');
            onParent();
          }}
          onPress={() => setHint('Hold the shield a little longer.')}
          style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.secondary }, pressed && styles.pressed]}
          testID="grown-up-controls"
        >
          <Feather name="shield" size={22} color={colors.forest} />
        </Pressable>
      </View>
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  icon,
  colors,
  testID,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  icon?: FeatherName;
  colors: ColorTokens;
  testID?: string;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        {
          backgroundColor: secondary ? colors.secondary : colors.primary,
          borderColor: secondary ? colors.border : colors.primary,
        },
        pressed && styles.pressed,
      ]}
      testID={testID}
    >
      {icon ? (
        <Feather name={icon} size={20} color={secondary ? colors.forest : colors.primaryForeground} />
      ) : null}
      <Text style={[styles.primaryButtonText, { color: secondary ? colors.forest : colors.primaryForeground }]}>
        {title}
      </Text>
      {!secondary ? <Feather name="arrow-right" size={18} color={colors.primaryForeground} /> : null}
    </Pressable>
  );
}

export function HoldButton({
  title,
  onHold,
  icon,
  colors,
  testID,
}: {
  title: string;
  onHold: () => void;
  icon?: FeatherName;
  colors: ColorTokens;
  testID?: string;
}) {
  const [hint, setHint] = useState('Press and hold. A grown-up opens this.');
  return (
    <View style={styles.holdWrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint="Press and hold. A grown-up opens this."
        delayLongPress={700}
        onLongPress={() => onHold()}
        onPress={() => setHint('Hold a little longer.')}
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: colors.primary, borderColor: colors.primary },
          pressed && styles.pressed,
        ]}
        testID={testID}
      >
        {icon ? <Feather name={icon} size={20} color={colors.primaryForeground} /> : null}
        <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>{title}</Text>
        <Feather name="shield" size={18} color={colors.primaryForeground} />
      </Pressable>
      <Text style={[styles.holdHint, { color: colors.mutedForeground, textAlign: 'center' }]}>{hint}</Text>
    </View>
  );
}

export function ProgressBar({ count, colors }: { count: number; colors: ColorTokens }) {
  const total = TOY_RESIDENTS.length;
  const label = `${count} of ${total} toys home`;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: total, now: count }}
      style={styles.progressWrap}
    >
      <View style={styles.progressTextRow}>
        <Text style={[styles.progressTitle, { color: colors.ink }]}>{label}</Text>
        <Text style={[styles.progressCount, { color: colors.forest }]}>
          {count}/{total}
        </Text>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: colors.secondary }]}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: colors.forest, width: `${(count / total) * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}

export function SettingSwitch({
  title,
  subtitle,
  on,
  onPress,
  icon,
  colors,
  testID,
}: {
  title: string;
  subtitle: string;
  on: boolean;
  onPress: () => void;
  icon: FeatherName;
  colors: ColorTokens;
  testID?: string;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={title}
      onPress={onPress}
      style={[styles.settingRow, { backgroundColor: colors.cream }]}
      testID={testID}
    >
      <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={22} color={colors.forest} />
      </View>
      <View style={styles.settingCopy}>
        <Text style={[styles.settingTitle, { color: colors.ink }]}>{title}</Text>
        <Text style={[styles.settingSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
      </View>
      <View style={[styles.toggleTrack, { backgroundColor: on ? colors.forest : colors.border }]}>
        <View style={[styles.toggleKnob, { backgroundColor: colors.cream }, on && styles.toggleKnobOn]} />
      </View>
    </Pressable>
  );
}

export function CompletionCard({
  colors,
  title,
  detail,
  onPlayAgain,
}: {
  colors: ColorTokens;
  title: string;
  detail: string;
  onPlayAgain: () => void;
}) {
  return (
    <View style={[styles.completionCard, { backgroundColor: colors.successWash }]}>
      <View style={[styles.completionIcon, { backgroundColor: colors.cream }]}>
        <Feather name="star" size={26} color={colors.forest} />
      </View>
      <Text style={[styles.completionTitle, { color: colors.ink }]}>{title}</Text>
      <Text style={[styles.completionDetail, { color: colors.secondaryForeground }]}>{detail}</Text>
      <PrimaryButton title="Play again" icon="rotate-ccw" onPress={onPlayAgain} colors={colors} secondary testID="play-again" />
    </View>
  );
}

export function swatchFor(toy: ToyResident, colors: ColorTokens, size: number) {
  const tint = colorFor(toy.color, colors);
  return <ColorMark wash={tint.wash} strong={tint.strong} pattern={tint.pattern} size={size} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 36,
    gap: 16,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  villageMark: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  toyAvatar: {
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
  },
  villageScene: {
    minHeight: 248,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 14,
    paddingHorizontal: 8,
  },
  sunDot: {
    position: 'absolute',
    top: 18,
    right: 28,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  cloud: { position: 'absolute', height: 12, width: 39, borderRadius: 12 },
  cloudOne: { top: 36, left: 24 },
  cloudTwo: { top: 58, right: 70, width: 28, height: 9 },
  villageHill: {
    position: 'absolute',
    height: 90,
    bottom: -28,
    left: -20,
    right: -20,
    borderRadius: 120,
  },
  villageHouses: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 8,
    width: '100%',
  },
  miniHome: {
    flex: 1,
    maxWidth: 52,
    height: 64,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
    overflow: 'hidden',
  },
  miniHomeRoof: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
  },
  sceneCaption: {
    fontFamily: font.bold,
    fontSize: 13,
    marginTop: 4,
  },
  pageHeader: {
    minHeight: MIN_CONTROL,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  pageHeading: { flex: 1, gap: 3 },
  eyebrow: {
    fontFamily: font.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontFamily: font.regular,
    fontSize: 15,
    lineHeight: 21,
  },
  holdHint: {
    fontFamily: font.semibold,
    fontSize: 13,
    lineHeight: 18,
  },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconButton: {
    width: MIN_CONTROL,
    height: MIN_CONTROL,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    minHeight: MIN_CONTROL,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  primaryButtonText: {
    flex: 1,
    fontFamily: font.bold,
    fontSize: 16,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.985 }] },
  holdWrap: { gap: 8 },
  progressWrap: { gap: 8 },
  progressTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  progressTitle: { fontFamily: font.bold, fontSize: 16, flex: 1 },
  progressCount: { fontFamily: font.bold, fontSize: 15 },
  progressTrack: { height: 10, borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 6 },
  settingRow: {
    minHeight: 72,
    borderRadius: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: MIN_CONTROL,
    height: MIN_CONTROL,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingCopy: { flex: 1, gap: 2 },
  settingTitle: { fontFamily: font.bold, fontSize: 16 },
  settingSubtitle: { fontFamily: font.regular, fontSize: 14, lineHeight: 19 },
  toggleTrack: {
    width: 52,
    height: 32,
    borderRadius: 16,
    padding: 3,
    justifyContent: 'center',
  },
  toggleKnob: { width: 26, height: 26, borderRadius: 13 },
  toggleKnobOn: { alignSelf: 'flex-end' },
  completionCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  completionIcon: {
    width: 58,
    height: 58,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionTitle: {
    fontFamily: font.bold,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  completionDetail: {
    fontFamily: font.regular,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});
