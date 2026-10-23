import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { font } from '@/constants/type';
import { useColors } from '@/hooks/useColors';

export default function NotFoundScreen() {
  const colors = useColors();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          This screen does not exist.
        </Text>

        <Link href="/" style={styles.link} accessibilityRole="button" accessibilityLabel="Back to the village">
          <Text style={[styles.linkText, { color: colors.primary }]}>
            Back to the village
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: font.bold,
    fontSize: 20,
  },
  link: {
    marginTop: 15,
    minHeight: 56,
    justifyContent: 'center',
  },
  linkText: {
    fontFamily: font.semibold,
    fontSize: 16,
  },
});
