import { useIsFocused } from '@react-navigation/native';

export const animate = (
  duration: number = 200,
  delay: number = 0,
  isFocused = useIsFocused() 
) => ({
  from: {
    opacity: isFocused ? 1 : 0,
    scale: isFocused ? 1 : 0.9,
    translateY: isFocused ? 0 : 10,
  },
  animate: {
    opacity: isFocused ? 1 : 0,
    scale: isFocused ? 1 : 0.9,
    translateY: isFocused ? 0 : 10,
  },
  transition: {
    type: 'timing',
    duration,
    delay,
  },
});

// animations.ts
import { MotiProps } from 'moti';

export const fadeScaleAnimation = (
  duration: number = 250,
  delay: number = 0
): MotiProps => ({
  from: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    type: 'timing',
    duration,
    delay,
  },
});
