import React, { useCallback, useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AudioPlayer, useAudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import {
  InstrumentId,
  TOY_RESIDENTS,
  ToyColor,
  ToyResident,
} from '@/gameData';

type AppScreen = 'home' | 'parent' | 'games' | 'time' | 'color';
type FeatherName = keyof typeof Feather.glyphMap;

type ColorTokens = ReturnType<typeof useColors>;
type ColorTokenName = Exclude<keyof ColorTokens, 'radius'>;

const ICON_FOR_TOY: Record<string, FeatherName> = {
  duck: 'sun',
  train: 'truck',
  blocks: 'grid',
  bear: 'heart',
  ball: 'circle',
  truck: 'truck',
};

const COLOR_TOKENS: Record<
  ToyColor,
  { name: string; strong: ColorTokenName; wash: ColorTokenName }
> = {
  sunshine: { name: 'yellow', strong: 'sunshine', wash: 'sunshineWash' },
  lagoon: { name: 'blue', strong: 'lagoon', wash: 'lagoonWash' },
  tomato: { name: 'red', strong: 'tomato', wash: 'tomatoWash' },
  lilac: { name: 'purple', strong: 'lilac', wash: 'lilacWash' },
  mint: { name: 'green', strong: 'mint', wash: 'mintWash' },
  peach: { name: 'orange', strong: 'peach', wash: 'peachWash' },
};

function colorFor(toyColor: ToyColor, colors: ColorTokens) {
  const tokens = COLOR_TOKENS[toyColor];
  return {
    label: tokens.name,
    strong: colors[tokens.strong],
    wash: colors[tokens.wash],
  };
}

function VillageMark({
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
      style={[
        styles.villageMark,
        { width: size + 17, height: size + 17, backgroundColor: background },
      ]}
    >
      <Feather name="home" size={size} color={color} />
      <View style={[styles.markWindow, { backgroundColor: background }]} />
    </View>
  );
}

function PageHeader({
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
  return (
    <View style={styles.pageHeader}>
      <View style={styles.pageHeading}>
        <Text style={[styles.eyebrow, { color: colors.forest }]}>{title}</Text>
        <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.headerActions}>
        {onReplay ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hear the instructions again"
            onPress={onReplay}
            style={({ pressed }) => [
              styles.iconButton,
              { backgroundColor: colors.secondary },
              pressed && styles.pressed,
            ]}
            testID="replay-audio"
          >
            <Feather name="volume-2" size={19} color={colors.forest} />
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open grown-up controls"
          onPress={onParent}
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: colors.secondary },
            pressed && styles.pressed,
          ]}
          testID="grown-up-controls"
        >
          <Feather name="shield" size={18} color={colors.forest} />
        </Pressable>
      </View>
    </View>
  );
}

function PrimaryButton({
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
        <Feather
          name={icon}
          size={19}
          color={secondary ? colors.forest : colors.primaryForeground}
        />
      ) : null}
      <Text
        style={[
          styles.primaryButtonText,
          { color: secondary ? colors.forest : colors.primaryForeground },
        ]}
      >
        {title}
      </Text>
      {!secondary ? (
        <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
      ) : null}
    </Pressable>
  );
}

function ToyAvatar({
  toy,
  colors,
  size = 50,
}: {
  toy: ToyResident;
  colors: ColorTokens;
  size?: number;
}) {
  const tint = colorFor(toy.color, colors);
  return (
    <View
      style={[
        styles.toyAvatar,
        { width: size, height: size, backgroundColor: tint.wash },
      ]}
    >
      <Feather
        name={ICON_FOR_TOY[toy.id]}
        size={size * 0.46}
        color={tint.strong}
      />
    </View>
  );
}

function MiniVillage({ colors }: { colors: ColorTokens }) {
  const homes = TOY_RESIDENTS.slice(0, 3);
  return (
    <View style={[styles.villageScene, { backgroundColor: colors.sky }]}>
      <View style={[styles.sunDot, { backgroundColor: colors.accent }]} />
      <View style={[styles.cloud, styles.cloudOne, { backgroundColor: colors.cream }]} />
      <View style={[styles.cloud, styles.cloudTwo, { backgroundColor: colors.cream }]} />
      <View style={[styles.villageHill, { backgroundColor: colors.meadow }]} />
      <View style={styles.villageHouses}>
        {homes.map((toy, index) => {
          const tint = colorFor(toy.color, colors);
          return (
            <View
              key={toy.id}
              style={[
                styles.miniHome,
                index === 1 && styles.centerHome,
                { backgroundColor: colors.cream },
              ]}
            >
              <View style={[styles.miniHomeRoof, { backgroundColor: tint.strong }]} />
              <View style={[styles.miniHomeDoor, { backgroundColor: tint.strong }]}>
                <Feather name="home" size={19} color={colors.cream} />
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.sceneResidents}>
        {homes.map((toy) => (
          <ToyAvatar key={toy.id} toy={toy} colors={colors} size={34} />
        ))}
      </View>
      <Text style={[styles.sceneCaption, { color: colors.forest }]}>
        Every toy has a little home
      </Text>
    </View>
  );
}

function HomeScreen({
  colors,
  onGrownUp,
}: {
  colors: ColorTokens;
  onGrownUp: () => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        Platform.OS === 'web' && styles.webInsets,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.brandRow}>
        <View style={styles.brandLockup}>
          <VillageMark color={colors.forest} background={colors.secondary} />
          <Text style={[styles.brandName, { color: colors.ink }]}>
            Toy’s Village
          </Text>
        </View>
        <View style={[styles.prototypePill, { backgroundColor: colors.accent }]}>
          <Text style={[styles.prototypeLabel, { color: colors.accentForeground }]}>
            PLAY TOGETHER
          </Text>
        </View>
      </View>

      <View style={styles.heroCopy}>
        <Text style={[styles.heroTitle, { color: colors.ink }]}>
          The toys are ready to go home.
        </Text>
        <Text style={[styles.heroBody, { color: colors.mutedForeground }]}>
          Turn tidy-up time into the next little adventure in their village.
        </Text>
      </View>

      <MiniVillage colors={colors} />

      <View style={[styles.storyNote, { backgroundColor: colors.cream }]}>
        <Feather name="music" size={19} color={colors.forest} />
        <Text style={[styles.storyNoteText, { color: colors.ink }]}>
          Listen, play, and help each resident find its house.
        </Text>
      </View>

      <View style={styles.homeActions}>
        <PrimaryButton
          title="Grown-up: start a session"
          icon="play"
          onPress={onGrownUp}
          colors={colors}
          testID="adult-start"
        />
        <Text style={[styles.supervisionNote, { color: colors.mutedForeground }]}>
          A grown-up starts the game and stays nearby.
        </Text>
      </View>

    </ScrollView>
  );
}

function ParentScreen({
  colors,
  audioOn,
  onToggleAudio,
  onChooseGame,
  onResume,
  onFinish,
  canResume,
}: {
  colors: ColorTokens;
  audioOn: boolean;
  onToggleAudio: () => void;
  onChooseGame: () => void;
  onResume: () => void;
  onFinish: () => void;
  canResume: boolean;
}) {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        Platform.OS === 'web' && styles.webInsets,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.parentKicker, { color: colors.forest }]}>
        GROWN-UP CORNER
      </Text>
      <Text style={[styles.heroTitle, { color: colors.ink }]}>
        Set up a little play.
      </Text>
      <Text style={[styles.heroBody, { color: colors.mutedForeground }]}>
        Choose when a session begins, and stay close while your child plays.
      </Text>

      <View style={[styles.noticeCard, { backgroundColor: colors.accent }]}>
        <Feather name="info" size={20} color={colors.accentForeground} />
        <View style={styles.noticeCopy}>
          <Text style={[styles.noticeTitle, { color: colors.accentForeground }]}>
            This is a sensing prototype
          </Text>
          <Text style={[styles.noticeBody, { color: colors.accentForeground }]}>
            Tapping a toy simulates putting it away or scanning it. No camera
            or box sensor is connected. The music speeds up gently, so check
            pacing and volume with a grown-up before any child trial.
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: audioOn }}
        accessibilityLabel="Spoken prompts and music"
        onPress={onToggleAudio}
        style={[styles.settingRow, { backgroundColor: colors.cream }]}
        testID="audio-toggle"
      >
        <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
          <Feather
            name={audioOn ? 'volume-2' : 'volume-x'}
            size={20}
            color={colors.forest}
          />
        </View>
        <View style={styles.settingCopy}>
          <Text style={[styles.settingTitle, { color: colors.ink }]}>
            Spoken prompts and music
          </Text>
          <Text style={[styles.settingSubtitle, { color: colors.mutedForeground }]}>
            {audioOn ? 'On' : 'Off'}
          </Text>
        </View>
        <View
          style={[
            styles.toggleTrack,
            { backgroundColor: audioOn ? colors.forest : colors.border },
          ]}
        >
          <View
            style={[
              styles.toggleKnob,
              { backgroundColor: colors.cream },
              audioOn && styles.toggleKnobOn,
            ]}
          />
        </View>
      </Pressable>

      <Text style={[styles.sectionHeading, { color: colors.ink }]}>
        The village residents
      </Text>
      <View style={styles.associationList}>
        {TOY_RESIDENTS.map((toy) => {
          const tint = colorFor(toy.color, colors);
          return (
            <View
              key={toy.id}
              style={[styles.associationRow, { backgroundColor: colors.cream }]}
            >
              <ToyAvatar toy={toy} colors={colors} size={43} />
              <View style={styles.associationCopy}>
                <Text style={[styles.associationName, { color: colors.ink }]}>
                  {toy.name}
                </Text>
                <Text style={[styles.associationSubtitle, { color: colors.mutedForeground }]}>
                  {tint.label} house · {toy.instrumentLabel}
                </Text>
              </View>
              <Feather name="home" size={17} color={tint.strong} />
            </View>
          );
        })}
      </View>

      <View style={[styles.privacyNote, { backgroundColor: colors.secondary }]}>
        <Feather name="lock" size={17} color={colors.forest} />
        <Text style={[styles.privacyText, { color: colors.secondaryForeground }]}>
          No names, recordings, or session results are saved by this prototype.
          It is not a safety test for unsupervised play.
        </Text>
      </View>

      {canResume ? (
        <PrimaryButton
          title="Resume the game"
          icon="play"
          onPress={onResume}
          colors={colors}
          testID="resume-session"
        />
      ) : null}
      <PrimaryButton
        title={canResume ? 'Choose another game' : 'Choose a game'}
        icon="compass"
        onPress={onChooseGame}
        colors={colors}
        secondary={canResume}
        testID="choose-game"
      />
      {canResume ? (
        <Pressable
          accessibilityRole="button"
          onPress={onFinish}
          style={({ pressed }) => [styles.finishButton, pressed && styles.pressed]}
          testID="finish-session"
        >
          <Text style={[styles.finishText, { color: colors.destructive }]}>
            Finish this session and return home
          </Text>
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={onFinish}
          style={({ pressed }) => [styles.secondaryTextButton, pressed && styles.pressed]}
          testID="return-home"
        >
          <Text style={[styles.secondaryText, { color: colors.mutedForeground }]}>
            Return to the village
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

function GameSelectScreen({
  colors,
  onParent,
  onTime,
  onColor,
}: {
  colors: ColorTokens;
  onParent: () => void;
  onTime: () => void;
  onColor: () => void;
}) {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        Platform.OS === 'web' && styles.webInsets,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <PageHeader
        title="Choose an adventure"
        subtitle="Which game shall we play together?"
        onParent={onParent}
        colors={colors}
      />
      <MiniVillage colors={colors} />

      <Pressable
        accessibilityRole="button"
        onPress={onTime}
        style={({ pressed }) => [
          styles.gameCard,
          { backgroundColor: colors.cream },
          pressed && styles.pressed,
        ]}
        testID="start-time-game"
      >
        <View style={[styles.gameIcon, { backgroundColor: colors.sunshineWash }]}>
          <Feather name="music" size={25} color={colors.forest} />
        </View>
        <View style={styles.gameCopy}>
          <Text style={[styles.gameTitle, { color: colors.ink }]}>Time Game</Text>
          <Text style={[styles.gameDescription, { color: colors.mutedForeground }]}>
            Each toy adds an instrument to the village song.
          </Text>
        </View>
        <Feather name="arrow-right" size={19} color={colors.forest} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onColor}
        style={({ pressed }) => [
          styles.gameCard,
          { backgroundColor: colors.cream },
          pressed && styles.pressed,
        ]}
        testID="start-color-game"
      >
        <View style={[styles.gameIcon, { backgroundColor: colors.lagoonWash }]}>
          <Feather name="search" size={24} color={colors.lagoon} />
        </View>
        <View style={styles.gameCopy}>
          <Text style={[styles.gameTitle, { color: colors.ink }]}>Color Game</Text>
          <Text style={[styles.gameDescription, { color: colors.mutedForeground }]}>
            Hear a color, then find a toy that matches.
          </Text>
        </View>
        <Feather name="arrow-right" size={19} color={colors.forest} />
      </Pressable>

      <View style={[styles.prototypeFootnote, { backgroundColor: colors.secondary }]}>
        <Feather name="info" size={16} color={colors.forest} />
        <Text style={[styles.prototypeFootnoteText, { color: colors.secondaryForeground }]}>
          The toy taps in both games stand in for physical sensing.
        </Text>
      </View>
    </ScrollView>
  );
}

function ProgressBar({
  count,
  colors,
}: {
  count: number;
  colors: ColorTokens;
}) {
  return (
    <View style={styles.progressWrap}>
      <View style={styles.progressTextRow}>
        <Text style={[styles.progressTitle, { color: colors.ink }]}>
          {count === TOY_RESIDENTS.length
            ? 'Everyone is home'
            : `${count} of ${TOY_RESIDENTS.length} toys home`}
        </Text>
        <Text style={[styles.progressCount, { color: colors.forest }]}>
          {count}/{TOY_RESIDENTS.length}
        </Text>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: colors.secondary }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.forest,
              width: `${(count / TOY_RESIDENTS.length) * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

function ToyActionRow({
  toy,
  colors,
  isHome,
  onPress,
}: {
  toy: ToyResident;
  colors: ColorTokens;
  isHome: boolean;
  onPress: () => void;
}) {
  const tint = colorFor(toy.color, colors);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${toy.name}, ${isHome ? 'inside the box' : 'outside the box'}. Tap to change simulated placement.`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.toyActionRow,
        {
          backgroundColor: isHome ? colors.cream : tint.wash,
          borderColor: isHome ? colors.border : tint.strong,
        },
        pressed && styles.pressed,
      ]}
      testID={`toggle-${toy.id}`}
    >
      <ToyAvatar toy={toy} colors={colors} size={49} />
      <View style={styles.toyActionCopy}>
        <Text style={[styles.toyActionName, { color: colors.ink }]}>
          {toy.name}
        </Text>
        <Text style={[styles.toyActionSub, { color: colors.mutedForeground }]}>
          Adds {toy.instrumentLabel}
        </Text>
      </View>
      <View style={styles.toyActionState}>
        <Feather
          name={isHome ? 'check-circle' : 'circle'}
          size={21}
          color={isHome ? colors.forest : colors.mutedForeground}
        />
        <Text
          style={[
            styles.toyStateText,
            { color: isHome ? colors.forest : colors.mutedForeground },
          ]}
        >
          {isHome ? 'Home' : 'Out'}
        </Text>
      </View>
    </Pressable>
  );
}

function CompletionCard({
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
        <Feather name="star" size={25} color={colors.forest} />
      </View>
      <Text style={[styles.completionTitle, { color: colors.ink }]}>{title}</Text>
      <Text style={[styles.completionDetail, { color: colors.secondaryForeground }]}>
        {detail}
      </Text>
      <PrimaryButton
        title="Play again"
        icon="rotate-ccw"
        onPress={onPlayAgain}
        colors={colors}
        secondary
        testID="play-again"
      />
    </View>
  );
}

function TimeGameScreen({
  colors,
  homeIds,
  audioOn,
  onToggleToy,
  onParent,
  onSpeak,
  onPlayAgain,
}: {
  colors: ColorTokens;
  homeIds: string[];
  audioOn: boolean;
  onToggleToy: (toy: ToyResident) => void;
  onParent: () => void;
  onSpeak: (message: string) => void;
  onPlayAgain: () => void;
}) {
  const chime = useAudioPlayer(require('../assets/audio/chime.wav'));
  const strings = useAudioPlayer(require('../assets/audio/strings.wav'));
  const wood = useAudioPlayer(require('../assets/audio/wood.wav'));
  const bell = useAudioPlayer(require('../assets/audio/bell.wav'));
  const drum = useAudioPlayer(require('../assets/audio/drum.wav'));
  const piano = useAudioPlayer(require('../assets/audio/piano.wav'));
  const victory = useAudioPlayer(require('../assets/audio/victory.wav'));
  const players: Record<InstrumentId, AudioPlayer> = {
    chime,
    strings,
    wood,
    bell,
    drum,
    piano,
  };
  const [celebrated, setCelebrated] = useState(false);
  const count = homeIds.length;

  useEffect(() => {
    const complete = count === TOY_RESIDENTS.length;
    const tempo = Math.min(1.18, 0.92 + Math.max(0, count - 1) * 0.052);

    if (!audioOn) {
      Object.values(players).forEach((player) => player.pause());
      victory.pause();
      return;
    }

    if (complete) {
      Object.values(players).forEach((player) => player.pause());
      if (!celebrated) {
        victory.loop = false;
        void victory.seekTo(0);
        victory.play();
        onSpeak('All six toys are home. What a lovely village song.');
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCelebrated(true);
      }
      return;
    }

    if (celebrated) setCelebrated(false);
    victory.pause();
    TOY_RESIDENTS.forEach((toy) => {
      const player = players[toy.instrument];
      if (homeIds.includes(toy.id)) {
        player.loop = true;
        player.volume = 0.12;
        player.playbackRate = tempo;
        if (!player.playing) player.play();
      } else {
        player.pause();
      }
    });
  }, [audioOn, celebrated, count, homeIds, onSpeak, victory]);

  useEffect(
    () => () => {
      Object.values(players).forEach((player) => player.pause());
      victory.pause();
    },
    [victory],
  );

  const instruction =
    count === 0
      ? 'Place a toy in its box, then tap its card to welcome it home.'
      : `${count} ${count === 1 ? 'instrument is' : 'instruments are'} playing. Help another toy find its house.`;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        Platform.OS === 'web' && styles.webInsets,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <PageHeader
        title="Time Game"
        subtitle="Every toy brings a new sound."
        onParent={onParent}
        onReplay={() => onSpeak(instruction)}
        colors={colors}
      />
      <View style={[styles.timeScene, { backgroundColor: colors.sky }]}>
        <View style={[styles.timeSceneSun, { backgroundColor: colors.accent }]} />
        <View style={[styles.timeHill, { backgroundColor: colors.meadow }]} />
        <View style={styles.timeHomes}>
          {TOY_RESIDENTS.map((toy) => {
            const tint = colorFor(toy.color, colors);
            const isHome = homeIds.includes(toy.id);
            return (
              <View
                key={toy.id}
                style={[
                  styles.timeHouse,
                  { backgroundColor: isHome ? colors.cream : colors.secondary },
                ]}
              >
                <View style={[styles.timeRoof, { backgroundColor: tint.strong }]} />
                <Feather
                  name="home"
                  size={21}
                  color={isHome ? tint.strong : colors.mutedForeground}
                />
              </View>
            );
          })}
        </View>
        <Text style={[styles.timeSceneCaption, { color: colors.forest }]}>
          {count === 0 ? 'A quiet village, waiting' : 'The village is singing'}
        </Text>
      </View>

      <ProgressBar count={count} colors={colors} />
      <View style={[styles.instructionBand, { backgroundColor: colors.secondary }]}>
        <Feather name="music" size={18} color={colors.forest} />
        <Text style={[styles.instructionText, { color: colors.secondaryForeground }]}>
          {instruction}
        </Text>
      </View>
      <Text style={[styles.simulationCaption, { color: colors.mutedForeground }]}>
        Prototype input: tap a resident after moving its toy in or out of the box.
      </Text>

      {count === TOY_RESIDENTS.length ? (
        <CompletionCard
          colors={colors}
          title="The whole village is home."
          detail="Six toys came home and made a song together."
          onPlayAgain={onPlayAgain}
        />
      ) : (
        <View style={styles.toyList}>
          {TOY_RESIDENTS.map((toy) => (
            <ToyActionRow
              key={toy.id}
              toy={toy}
              colors={colors}
              isHome={homeIds.includes(toy.id)}
              onPress={() => onToggleToy(toy)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function ColorGameScreen({
  colors,
  homeIds,
  targetColor,
  onTargetChange,
  onAccept,
  onParent,
  onSpeak,
  onPlayAgain,
}: {
  colors: ColorTokens;
  homeIds: string[];
  targetColor: ToyColor;
  onTargetChange: (color: ToyColor) => void;
  onAccept: (toy: ToyResident) => void;
  onParent: () => void;
  onSpeak: (message: string) => void;
  onPlayAgain: () => void;
}) {
  const [feedback, setFeedback] = useState(
    'Listen for the color, then choose a toy to scan.',
  );
  const [feedbackKind, setFeedbackKind] = useState<'neutral' | 'match' | 'try'>(
    'neutral',
  );
  const [celebrated, setCelebrated] = useState(false);
  const target = colorFor(targetColor, colors);
  const count = homeIds.length;
  const available = TOY_RESIDENTS.filter((toy) => !homeIds.includes(toy.id));

  useEffect(() => {
    onSpeak(`Find a ${target.label} toy and scan it.`);
  }, [onSpeak]);

  useEffect(() => {
    if (count === TOY_RESIDENTS.length && !celebrated) {
      onSpeak('Every resident found a home. Well done, village helpers.');
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCelebrated(true);
    }
    if (count < TOY_RESIDENTS.length && celebrated) setCelebrated(false);
  }, [celebrated, count, onSpeak]);

  const scanToy = (toy: ToyResident) => {
    const tint = colorFor(toy.color, colors);
    if (toy.color !== targetColor) {
      const message = `This toy is ${tint.label}. This house is ${target.label}. Try another toy.`;
      setFeedback(
        `This toy is ${tint.label}. The house is ${target.label}. Try another toy.`,
      );
      setFeedbackKind('try');
      onSpeak(message);
      return;
    }

    onAccept(toy);
    const remaining = available.filter((resident) => resident.id !== toy.id);
    setFeedback(`A match. The ${toy.name.toLowerCase()} found a home.`);
    setFeedbackKind('match');
    if (remaining.length > 0) {
      const next = remaining[0];
      onTargetChange(next.color);
      onSpeak(
        `A match. The ${toy.name.toLowerCase()} is home. Now find a ${colorFor(next.color, colors).label} toy.`,
      );
    } else {
      onSpeak(`A match. All six toys are home.`);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        Platform.OS === 'web' && styles.webInsets,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <PageHeader
        title="Color Game"
        subtitle="Listen, look, then find a match."
        onParent={onParent}
        onReplay={() => onSpeak(`Find a ${target.label} toy and scan it.`)}
        colors={colors}
      />

      {count === TOY_RESIDENTS.length ? (
        <>
          <ProgressBar count={count} colors={colors} />
          <CompletionCard
            colors={colors}
            title="Every resident found a home."
            detail="You sorted all six toys by color."
            onPlayAgain={onPlayAgain}
          />
        </>
      ) : (
        <>
          <View style={[styles.colorTargetCard, { backgroundColor: target.wash }]}>
            <View style={styles.colorTargetTop}>
              <View style={[styles.colorTargetIcon, { backgroundColor: colors.cream }]}>
                <Feather name="home" size={26} color={target.strong} />
              </View>
              <View style={styles.colorTargetCopy}>
                <Text style={[styles.colorTargetKicker, { color: colors.forest }]}>
                  LISTEN FOR THIS COLOR
                </Text>
                <Text style={[styles.colorTargetName, { color: colors.ink }]}>
                  {target.label}
                </Text>
                <Text style={[styles.colorTargetHint, { color: colors.mutedForeground }]}>
                  Find a toy that looks this color.
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => onSpeak(`Find a ${target.label} toy.`)}
              style={({ pressed }) => [
                styles.listenAgain,
                { backgroundColor: colors.cream },
                pressed && styles.pressed,
              ]}
              testID="repeat-color-prompt"
            >
              <Feather name="volume-2" size={17} color={colors.forest} />
              <Text style={[styles.listenAgainText, { color: colors.forest }]}>
                Say it again
              </Text>
            </Pressable>
          </View>

          <View style={styles.colorHouseGrid}>
            {TOY_RESIDENTS.map((toy) => {
              const tint = colorFor(toy.color, colors);
              const active = toy.color === targetColor;
              return (
                <View
                  key={`house-${toy.id}`}
                  style={[
                    styles.colorHouseTile,
                    {
                      backgroundColor: active ? tint.wash : colors.cream,
                      borderColor: active ? tint.strong : colors.border,
                    },
                  ]}
                >
                  <Feather
                    name="home"
                    size={17}
                    color={active ? tint.strong : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.colorHouseLabel,
                      { color: active ? colors.ink : colors.mutedForeground },
                    ]}
                  >
                    {tint.label}
                  </Text>
                </View>
              );
            })}
          </View>

          <ProgressBar count={count} colors={colors} />
          <View style={[styles.feedbackCard, {
            backgroundColor:
              feedbackKind === 'match'
                ? colors.successWash
                : feedbackKind === 'try'
                  ? colors.errorWash
                  : colors.secondary,
          }]} accessibilityLiveRegion="polite">
            <Feather
              name={feedbackKind === 'match' ? 'check-circle' : feedbackKind === 'try' ? 'refresh-cw' : 'search'}
              size={18}
              color={feedbackKind === 'try' ? colors.destructive : colors.forest}
            />
            <Text style={[styles.feedbackText, { color: colors.ink }]}>{feedback}</Text>
          </View>

          <View style={styles.scanHeading}>
            <Text style={[styles.sectionHeading, { color: colors.ink }]}>
              Scan a toy
            </Text>
            <Text style={[styles.scanSubheading, { color: colors.mutedForeground }]}>
              Choose one resident to try
            </Text>
          </View>
          <View style={styles.scanList}>
            {available.map((toy) => {
              const tint = colorFor(toy.color, colors);
              return (
                <View
                  key={toy.id}
                  style={[styles.scanRow, { backgroundColor: colors.cream }]}
                >
                  <ToyAvatar toy={toy} colors={colors} size={46} />
                  <View style={styles.scanToyCopy}>
                    <Text style={[styles.scanToyName, { color: colors.ink }]}>
                      {toy.name}
                    </Text>
                    <Text style={[styles.scanToyColor, { color: tint.strong }]}>
                      {tint.label}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Simulate scanning the ${tint.label} ${toy.name}`}
                    onPress={() => scanToy(toy)}
                    style={({ pressed }) => [
                      styles.scanButton,
                      { backgroundColor: colors.secondary },
                      pressed && styles.pressed,
                    ]}
                    testID={`scan-${toy.id}`}
                  >
                    <Feather name="camera" size={15} color={colors.forest} />
                    <Text style={[styles.scanButtonText, { color: colors.forest }]}>
                      Scan
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
          <Text style={[styles.simulationCaption, { color: colors.mutedForeground }]}>
            Prototype input: selecting a toy simulates a color scan. The result
            uses this sample toy’s preset color.
          </Text>
        </>
      )}
    </ScrollView>
  );
}

export default function ToyVillageApp() {
  const colors = useColors();
  const [screen, setScreen] = useState<AppScreen>('home');
  const [parentOrigin, setParentOrigin] = useState<AppScreen>('home');
  const [audioOn, setAudioOn] = useState(true);
  const [timeHomeIds, setTimeHomeIds] = useState<string[]>([]);
  const [colorHomeIds, setColorHomeIds] = useState<string[]>([]);
  const [targetColor, setTargetColor] = useState<ToyColor>(TOY_RESIDENTS[0].color);

  const speak = useCallback(
    (message: string) => {
      if (!audioOn) return;
      Speech.stop();
      Speech.speak(message, {
        language: 'en-US',
        pitch: 1.05,
        rate: 0.83,
      });
    },
    [audioOn],
  );

  const openParent = useCallback(() => {
    setParentOrigin(screen);
    setScreen('parent');
  }, [screen]);

  const finishSession = useCallback(() => {
    setTimeHomeIds([]);
    setColorHomeIds([]);
    setTargetColor(TOY_RESIDENTS[0].color);
    Speech.stop();
    setParentOrigin('home');
    setScreen('home');
  }, []);

  const startTimeGame = () => {
    setTimeHomeIds([]);
    setScreen('time');
    speak('Welcome to the Time Game. Place each toy in its box, then tap its card when it is inside. Every toy adds an instrument to the village song.');
  };

  const startColorGame = () => {
    setColorHomeIds([]);
    setTargetColor(TOY_RESIDENTS[0].color);
    setScreen('color');
  };

  const parentCanResume = parentOrigin === 'time' || parentOrigin === 'color';
  const safeContent = [
    styles.app,
    { backgroundColor: colors.background },
  ];

  return (
    <SafeAreaView style={safeContent} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {screen === 'home' ? (
        <HomeScreen
          colors={colors}
          onGrownUp={openParent}
        />
      ) : null}
      {screen === 'parent' ? (
        <ParentScreen
          colors={colors}
          audioOn={audioOn}
          onToggleAudio={() => setAudioOn((value) => !value)}
          onChooseGame={() => setScreen('games')}
          onResume={() => setScreen(parentOrigin)}
          onFinish={finishSession}
          canResume={parentCanResume}
        />
      ) : null}
      {screen === 'games' ? (
        <GameSelectScreen
          colors={colors}
          onParent={() => {
            setParentOrigin('games');
            setScreen('parent');
          }}
          onTime={startTimeGame}
          onColor={startColorGame}
        />
      ) : null}
      {screen === 'time' ? (
        <TimeGameScreen
          colors={colors}
          homeIds={timeHomeIds}
          audioOn={audioOn}
          onToggleToy={(toy) => {
            setTimeHomeIds((ids) =>
              ids.includes(toy.id)
                ? ids.filter((id) => id !== toy.id)
                : [...ids, toy.id],
            );
          }}
          onParent={openParent}
          onSpeak={speak}
          onPlayAgain={() => {
            setTimeHomeIds([]);
            speak('A new song is ready. Help the toys find their homes.');
          }}
        />
      ) : null}
      {screen === 'color' ? (
        <ColorGameScreen
          colors={colors}
          homeIds={colorHomeIds}
          targetColor={targetColor}
          onTargetChange={setTargetColor}
          onAccept={(toy) => {
            setColorHomeIds((ids) =>
              ids.includes(toy.id) ? ids : [...ids, toy.id],
            );
          }}
          onParent={openParent}
          onSpeak={speak}
          onPlayAgain={() => {
            setColorHomeIds([]);
            setTargetColor(TOY_RESIDENTS[0].color);
            speak('Let us sort the village toys again.');
          }}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 15,
    paddingBottom: 38,
    gap: 18,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  webInsets: {
    paddingTop: 67,
    paddingBottom: 34,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandLockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  villageMark: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#E5EDE0',
    position: 'relative',
  },
  markWindow: {
    position: 'absolute',
    width: 5,
    height: 7,
    borderRadius: 2,
    backgroundColor: '#E5EDE0',
    bottom: 8,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  prototypePill: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 30,
  },
  prototypeLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroCopy: {
    gap: 9,
    marginTop: 5,
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -1.1,
    fontWeight: '700',
  },
  heroBody: {
    fontSize: 16,
    lineHeight: 23,
  },
  villageScene: {
    minHeight: 222,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 15,
  },
  sunDot: {
    position: 'absolute',
    top: 24,
    right: 39,
    width: 38,
    height: 38,
    borderRadius: 20,
  },
  cloud: {
    position: 'absolute',
    height: 12,
    width: 39,
    borderRadius: 12,
  },
  cloudOne: {
    top: 47,
    left: 35,
  },
  cloudTwo: {
    top: 75,
    right: 82,
    width: 29,
    height: 9,
  },
  villageHill: {
    position: 'absolute',
    height: 103,
    bottom: -36,
    left: -25,
    right: -25,
    borderRadius: 120,
  },
  villageHouses: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    marginBottom: 18,
  },
  miniHome: {
    width: 63,
    height: 79,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
    overflow: 'hidden',
  },
  centerHome: {
    width: 75,
    height: 96,
  },
  miniHomeRoof: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 12,
  },
  miniHomeDoor: {
    width: 36,
    height: 48,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sceneResidents: {
    position: 'absolute',
    bottom: 26,
    right: 20,
    flexDirection: 'row',
    gap: 3,
  },
  sceneCaption: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginTop: 0,
  },
  toyAvatar: {
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 15,
    borderRadius: 18,
  },
  storyNoteText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    flex: 1,
  },
  homeActions: {
    gap: 10,
  },
  primaryButton: {
    minHeight: 56,
    paddingHorizontal: 17,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  primaryButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.985 }],
  },
  supervisionNote: {
    textAlign: 'center',
    fontSize: 12,
  },
  secondaryTextButton: {
    minHeight: 42,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pageHeader: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 2,
  },
  pageHeading: {
    flex: 1,
    gap: 3,
  },
  eyebrow: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 9,
  },
  iconButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentKicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 7,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 20,
    padding: 16,
  },
  noticeCopy: {
    flex: 1,
    gap: 5,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  noticeBody: {
    fontSize: 13,
    lineHeight: 19,
  },
  settingRow: {
    minHeight: 72,
    borderRadius: 18,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingCopy: {
    flex: 1,
    gap: 3,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingSubtitle: {
    fontSize: 12,
  },
  toggleTrack: {
    width: 45,
    height: 26,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 11,
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: -8,
  },
  associationList: {
    gap: 8,
  },
  associationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 9,
    borderRadius: 16,
  },
  associationCopy: {
    flex: 1,
    gap: 3,
  },
  associationName: {
    fontSize: 14,
    fontWeight: '700',
  },
  associationSubtitle: {
    fontSize: 12,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 14,
    borderRadius: 16,
  },
  privacyText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  finishButton: {
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  finishText: {
    fontSize: 13,
    fontWeight: '700',
  },
  gameCard: {
    minHeight: 109,
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  gameIcon: {
    width: 53,
    height: 53,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameCopy: {
    flex: 1,
    gap: 5,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  gameDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
  prototypeFootnote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 13,
    borderRadius: 15,
  },
  prototypeFootnoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  timeScene: {
    height: 172,
    overflow: 'hidden',
    borderRadius: 24,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 15,
  },
  timeSceneSun: {
    position: 'absolute',
    top: 19,
    right: 28,
    width: 31,
    height: 31,
    borderRadius: 17,
  },
  timeHill: {
    position: 'absolute',
    height: 77,
    bottom: -30,
    left: -10,
    right: -10,
    borderRadius: 70,
  },
  timeHomes: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 15,
    marginBottom: 15,
  },
  timeHouse: {
    width: 51,
    height: 65,
    borderRadius: 12,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 11,
  },
  timeRoof: {
    position: 'absolute',
    top: 0,
    height: 9,
    left: 0,
    right: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  timeSceneCaption: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressWrap: {
    gap: 8,
  },
  progressTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  progressCount: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  instructionBand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 13,
    borderRadius: 16,
  },
  instructionText: {
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
    fontWeight: '600',
  },
  simulationCaption: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: -10,
  },
  toyList: {
    gap: 9,
  },
  toyActionRow: {
    minHeight: 68,
    padding: 9,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  toyActionCopy: {
    flex: 1,
    gap: 3,
  },
  toyActionName: {
    fontSize: 15,
    fontWeight: '700',
  },
  toyActionSub: {
    fontSize: 12,
  },
  toyActionState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minWidth: 48,
  },
  toyStateText: {
    fontSize: 10,
    fontWeight: '700',
  },
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
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '700',
    textAlign: 'center',
  },
  completionDetail: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 3,
  },
  colorTargetCard: {
    borderRadius: 23,
    padding: 17,
    gap: 14,
  },
  colorTargetTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  colorTargetIcon: {
    width: 59,
    height: 59,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorTargetCopy: {
    flex: 1,
    gap: 3,
  },
  colorTargetKicker: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  colorTargetName: {
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  colorTargetHint: {
    fontSize: 13,
  },
  listenAgain: {
    minHeight: 42,
    borderRadius: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  listenAgainText: {
    fontSize: 13,
    fontWeight: '700',
  },
  feedbackCard: {
    minHeight: 57,
    padding: 13,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  feedbackText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  scanHeading: {
    gap: 2,
    marginBottom: -5,
  },
  scanSubheading: {
    fontSize: 12,
  },
  scanList: {
    gap: 8,
  },
  scanRow: {
    minHeight: 65,
    padding: 9,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scanToyCopy: {
    flex: 1,
    gap: 2,
  },
  scanToyName: {
    fontSize: 14,
    fontWeight: '700',
  },
  scanToyColor: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  scanButton: {
    minHeight: 40,
    minWidth: 72,
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
  },
  scanButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  colorHouseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  colorHouseTile: {
    width: '31.5%',
    minHeight: 49,
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  colorHouseLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});
