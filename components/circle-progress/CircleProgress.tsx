import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircleProgressProps {
  size?: number;
  strokeWidth?: number;
  progress?: number;       // Final progress value (0–100)
  strokeColor?: string;    // Initial color
  successColor?: string;   // Final color on success
  isLoading?: boolean;     // Whether animation is running
  isSuccess?: boolean;     // Whether to show check icon
  duration?: number;       // Animation duration
}

export default function CircleProgress({
  size = 70,
  strokeWidth = 4,
  progress = 100,
  strokeColor = '#007AFF',
  successColor = '#4CD964',
  isLoading = true,
  isSuccess = false,
  duration = 3000,
}: CircleProgressProps) {
  const animatedProgress = useSharedValue(0);
  const animatedStroke = useSharedValue(strokeColor);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (isLoading) {
      animatedProgress.value = withTiming(progress, { duration, easing: Easing.linear }, () => {
        if (isSuccess) {
          animatedStroke.value = withTiming(successColor, { duration: 500 });
        }
      });
    }
  }, [isLoading, progress, isSuccess]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value / 100),
    stroke: animatedStroke.value,
  }));

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <AnimatedCircle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
        />
      </Svg>
      {isSuccess && animatedProgress.value >= 100 && (
        <Ionicons name="checkmark-outline" size={size / 2} color={successColor} style={styles.icon} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
  },
});
