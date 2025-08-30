import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { Easing, interpolate, runOnJS, useAnimatedProps, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ScanningProps {
  size?: number;
  strokeWidth?: number;
  progress?: number;
  color?: string;
  successColor?: string;
  failedColor?: string;
  backgroundColor?: string;
  isLoading?: boolean;
  isSuccess?: boolean;
  isFailed?: boolean;
  duration?: number;
  loadingDuration?: number;
  style?: StyleProp<ViewStyle>;
  onAnimationComplete?: () => void;
  icons?: {
    success?: string;
    failed?: string;
  };
  // New prop to sync with scan state
  scanState?: 'idle' | 'scanning' | 'processing' | 'success' | 'failed' | 'error';
}

export function Scanning({
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
  icons = {
    success: 'checkmark-outline',
    failed: 'close-outline',
  },
  scanState,
}: ScanningProps) {
  
  const [iconVisible, setIconVisible] = useState(false);
  const [currentState, setCurrentState] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');
  const AnimatedPath = Animated.createAnimatedComponent(Path);

  // Enhanced shared values for App Store-like animation
  const progressValue = useSharedValue(0);
  const strokeColor = useSharedValue(color);
  const backgroundOpacity = useSharedValue(0.3);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // State management based on scanState prop
  useEffect(() => {
    if (scanState) {
      switch (scanState) {
        case 'idle':
          setCurrentState('idle');
          break;
        case 'scanning':
        case 'processing':
          setCurrentState('loading');
          break;
        case 'success':
          setCurrentState('success');
          break;
        case 'failed':
        case 'error':
          setCurrentState('failed');
          break;
      }
    } else {
      // Fallback to props-based state
      if (isSuccess && !isFailed) {
        setCurrentState('success');
      } else if (isFailed && !isSuccess) {
        setCurrentState('failed');
      } else if (isLoading) {
        setCurrentState('loading');
      } else {
        setCurrentState('idle');
      }
    }
  }, [scanState, isLoading, isSuccess, isFailed]);

  // App Store-like loading animation
  useEffect(() => {
    if (currentState === 'loading') {
      setIconVisible(false);
      
      // Reset all values
      progressValue.value = 0;
      strokeColor.value = color;
      backgroundOpacity.value = 0.3;
      pulseScale.value = 1;
      glowOpacity.value = 0;
      
      // Start the smooth loading animation
      if (scanState === 'scanning') {
        // Scanning phase - gentle pulse and slow progress
        pulseScale.value = withRepeat(
          withSequence(
            withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        );
        
        progressValue.value = withTiming(30, { 
          duration: 1500, 
          easing: Easing.out(Easing.quad) 
        });
        
        glowOpacity.value = withRepeat(
          withSequence(
            withTiming(0.3, { duration: 1000 }),
            withTiming(0, { duration: 1000 })
          ),
          -1,
          false
        );
        
      } else if (scanState === 'processing') {
        // Processing phase - faster animation and more progress
        pulseScale.value = 1;
        glowOpacity.value = 0.5;
        
        progressValue.value = withTiming(85, { 
          duration: 800, 
          easing: Easing.out(Easing.cubic) 
        });
        
        // Subtle breathing effect
        backgroundOpacity.value = withRepeat(
          withSequence(
            withTiming(0.2, { duration: 600 }),
            withTiming(0.4, { duration: 600 })
          ),
          -1,
          true
        );
      }
      
    } else if (currentState === 'success' || currentState === 'failed') {
      // Complete the loading and transition to result
      const targetColor = currentState === 'failed' ? failedColor : successColor;
      
      // Stop pulse animations
      pulseScale.value = withTiming(1, { duration: 200 });
      backgroundOpacity.value = withTiming(0.3, { duration: 200 });
      
      // Quick completion of progress
      progressValue.value = withTiming(100, { 
        duration: 300, 
        easing: Easing.out(Easing.cubic) 
      }, (finished) => {
        if (finished) {
          // Smooth color transition
          strokeColor.value = withTiming(targetColor, { 
            duration: 400,
            easing: Easing.inOut(Easing.ease)
          });
          
          // Glow effect for success/failed
          glowOpacity.value = withSequence(
            withTiming(0.8, { duration: 200 }),
            withTiming(0.2, { duration: 600 })
          );
          
          // Show icon with bounce
          runOnJS(setIconVisible)(true);
          if (onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        }
      });
      
    } else {
      // Idle state - reset everything
      progressValue.value = withTiming(0, { duration: 300 });
      strokeColor.value = withTiming(color, { duration: 300 });
      backgroundOpacity.value = withTiming(0.3, { duration: 300 });
      pulseScale.value = withTiming(1, { duration: 300 });
      glowOpacity.value = withTiming(0, { duration: 300 });
      setIconVisible(false);
    }
  }, [currentState, scanState, color, successColor, failedColor, progress, onAnimationComplete]);

  // Animated props for the progress circle
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progressValue.value / 100),
    stroke: strokeColor.value,
  }));

  // Animated background circle
  const backgroundAnimatedProps = useAnimatedProps(() => ({
    stroke: backgroundColor,
    opacity: backgroundOpacity.value,
  }));

  // Container animation style for pulse effect
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  // Glow effect style
  const glowAnimatedStyle = useAnimatedStyle(() => {
    const currentColor = strokeColor.value;
    return {
      shadowColor: currentColor,
      shadowOpacity: glowOpacity.value,
      shadowRadius: interpolate(glowOpacity.value, [0, 1], [0, 8]),
      elevation: interpolate(glowOpacity.value, [0, 1], [0, 8]),
    };
  });

  const getCurrentIconName = () => {
    switch (currentState) {
      case 'failed':
        return icons.failed || 'close-outline';
      case 'success':
        return icons.success || 'checkmark-outline';
      default:
        return icons.success || 'checkmark-outline';
    }
  };

  const getCurrentIconColor = () => {
    switch (currentState) {
      case 'failed':
        return failedColor;
      case 'success':
        return successColor;
      default:
        return successColor;
    }
  };

  return (
    <Animated.View style={[
      styles.container, 
      { width: size, height: size }, 
      containerAnimatedStyle,
      glowAnimatedStyle,
      style
    ]}>
      {currentState === 'idle' ? (
        // Idle state - simple static circle
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            stroke={backgroundColor}
            opacity={0.3}
          />
        </Svg>
      ) : (
        // Active states - animated circle
        <>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Animated background circle */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              animatedProps={backgroundAnimatedProps}
            />
            
            {/* Main progress circle */}
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
          
          {/* Icon with enhanced animation */}
          {iconVisible && (currentState === 'success' || currentState === 'failed') && (
            <MotiView
              from={{ scale: 0, opacity: 0, rotate: '180deg' }}
              animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 12,
                mass: 0.8
              }}
              style={styles.iconContainer}
            >
              <Ionicons
                name={getCurrentIconName() as keyof typeof Ionicons.glyphMap}  
                size={size / 2.2} 
                color={getCurrentIconColor()} 
              />
            </MotiView>
          )}
          


          {/* Loading dots for processing state */}
          {currentState === 'loading' && scanState === 'processing' && (
            <View style={styles.dotsContainer}>
              {[0, 1, 2].map((index) => (
                <MotiView
                  key={index}
                  from={{ scale: 0.6, opacity: 0.3 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'timing',
                    duration: 600,
                    delay: index * 200,
                    loop: true,
                    repeatReverse: true,
                    easing: Easing.inOut(Easing.ease),
                  }}
                  style={[
                    styles.dot,
                    { backgroundColor: strokeColor.value || color }
                  ]}
                />
              ))}
            </View>
          )}
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});