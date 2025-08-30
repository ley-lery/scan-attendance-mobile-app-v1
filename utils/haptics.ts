import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function useHaptic() {
  const trigger = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(style);
    }
  };

  return { trigger };
}
