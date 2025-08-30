import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated as RNAnimated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircleLoadingProps {
  size?: number;
  strokeWidth?: number;
  progress?: number;       // Progress value (0–100) for success/failed state
  color?: string;          // Loading color
  successColor?: string;   // Success color
  failedColor?: string;    // Failed color
  backgroundColor?: string; // Background circle color
  isLoading?: boolean;     // Show spinning loader
  isSuccess?: boolean;     // Show progress animation and success
  isFailed?: boolean;      // Show failed state
  duration?: number;       // Duration for progress animation
  loadingDuration?: number; // Duration for spinning animation
  style?: StyleProp<ViewStyle>;
  onAnimationComplete?: () => void; // Callback when animation completes
}

export function CircleLoading({
  size = 40,
  strokeWidth = 2,
  progress = 100,
  color = '#007AFF',
  successColor = '#4CD964',
  failedColor = '#FF6B6B',
  backgroundColor = '#E5E5E5',
  isLoading = true,
  isSuccess = false,
  isFailed = false,
  duration = 2000,
  loadingDuration = 1000,
  style,
  onAnimationComplete,
}: CircleLoadingProps) {
  // Spinning animation for loading state
  const spinValue = useRef(new RNAnimated.Value(0)).current;
  const spinAnimation = useRef<RNAnimated.CompositeAnimation | null>(null);
  
  // Progress animation for success/failed state
  const animatedProgress = useSharedValue(0);
  const animatedStroke = useSharedValue(color);
  const showIcon = useSharedValue(false);
  
  const radius = (size * 0.7) / 2; // 70% of size for better proportion
  const circumference = 2 * Math.PI * radius;

  // Cleanup spinning animation
  const stopSpinning = () => {
    if (spinAnimation.current) {
      spinAnimation.current.stop();
      spinAnimation.current = null;
    }
  };

  // Start spinning animation
  const startSpinning = () => {
    stopSpinning();
    spinValue.setValue(0);
    
    spinAnimation.current = RNAnimated.loop(
      RNAnimated.timing(spinValue, {
        toValue: 1,
        duration: loadingDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    
    spinAnimation.current.start();
  };

  // Handle spinning animation
  useEffect(() => {
    if (isLoading && !isSuccess && !isFailed) {
      startSpinning();
    } else {
      stopSpinning();
    }

    return () => stopSpinning();
  }, [isLoading, isSuccess, isFailed, loadingDuration]);

  // Handle progress animation for success/failed states
  useEffect(() => {
    if (isSuccess || isFailed) {
      const targetColor = isFailed ? failedColor : successColor;
      
      // Reset values
      animatedProgress.value = 0;
      animatedStroke.value = color;
      showIcon.value = false;
      
      // Start progress animation
      animatedProgress.value = withTiming(
        progress, 
        { 
          duration, 
          easing: Easing.out(Easing.cubic) 
        }, 
        (finished) => {
          if (finished) {
            // Change color and show icon
            animatedStroke.value = withTiming(targetColor, { 
              duration: 300 
            }, (colorFinished) => {
              if (colorFinished) {
                showIcon.value = true;
                // Call completion callback
                if (onAnimationComplete) {
                  runOnJS(onAnimationComplete)();
                }
              }
            });
          }
        }
      );
    } else {
      // Reset when going back to loading state
      animatedProgress.value = 0;
      animatedStroke.value = color;
      showIcon.value = false;
    }
  }, [isSuccess, isFailed, progress, color, successColor, failedColor, duration, onAnimationComplete]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value / 100),
    stroke: animatedStroke.value,
  }));

  const getIconName = () => {
    if (isFailed) return 'close-circle-outline';
    if (isSuccess) return 'checkmark-circle-outline';
    return 'checkmark-circle-outline';
  };

  const getIconColor = () => {
    if (isFailed) return failedColor;
    if (isSuccess) return successColor;
    return successColor;
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {isLoading && !isSuccess && !isFailed ? (
        // Loading state - spinning circle
        <RNAnimated.View
          style={[
            styles.spinningCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: `${color}30`, // 30% opacity for base
              borderTopColor: color,
              borderRightColor: `${color}70`, // 70% opacity for gradient effect
              transform: [{ rotate: spin }],
            },
          ]}
        />
      ) : (
        // Success/Failed state - progress circle with SVG
        <>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              stroke={backgroundColor}
              opacity={0.3}
            />
            {/* Animated progress circle */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              animatedProps={animatedProps}
            />
          </Svg>
          
          {/* Icon - only show when animation is complete */}
          {showIcon.value && (isSuccess || isFailed) && (
            <Animated.View style={styles.iconContainer}>
              <Ionicons 
                name={getIconName()} 
                size={size / 2.2} 
                color={getIconColor()}
                style={styles.icon} 
              />
            </Animated.View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinningCircle: {
    borderStyle: 'solid',
  },
  iconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
  },
});