import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export function successHaptic() {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
