import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { font } from '@/constants/type';
import { HoldButton, MiniVillage, Screen, VillageMark } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { openGrownUp } from '@/navigation';

export default function HomeScreen() {
  const colors = useColors();
  return (
    <Screen>
      <View style={styles.brandRow}>
        <View style={styles.brandLockup}>
          <VillageMark color={colors.forest} background={colors.secondary} />
          <Text style={[styles.brandName, { color: colors.ink }]}>Toy’s Village</Text>
        </View>
        <View style={[styles.prototypePill, { backgroundColor: colors.accent }]}>
          <Text style={[styles.prototypeLabel, { color: colors.accentForeground }]}>PLAY TOGETHER</Text>
        </View>
      </View>

      <View style={styles.heroCopy}>
        <Text style={[styles.heroTitle, { color: colors.ink }]}>The toys are ready to go home.</Text>
        <Text style={[styles.heroBody, { color: colors.mutedForeground }]}>
          Turn tidy-up time into the next little adventure in their village.
        </Text>
      </View>

      <MiniVillage colors={colors} />

      <View style={[styles.storyNote, { backgroundColor: colors.cream }]}>
        <Feather name="music" size={20} color={colors.forest} />
        <Text style={[styles.storyNoteText, { color: colors.ink }]}>
          Listen, play, and help each resident find its house.
        </Text>
      </View>

      <HoldButton
        title="Grown-up: start a session"
        icon="play"
        colors={colors}
        testID="adult-start"
        onHold={() => openGrownUp('home')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandName: { fontFamily: font.bold, fontSize: 18, letterSpacing: -0.3 },
  prototypePill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 30 },
  prototypeLabel: { fontFamily: font.bold, fontSize: 12, letterSpacing: 0.6 },
  heroCopy: { gap: 8 },
  heroTitle: { fontFamily: font.bold, fontSize: 32, lineHeight: 38, letterSpacing: -1.1 },
  heroBody: { fontFamily: font.regular, fontSize: 17, lineHeight: 24 },
  storyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 18,
  },
  storyNoteText: { fontFamily: font.semibold, fontSize: 16, lineHeight: 22, flex: 1 },
});
