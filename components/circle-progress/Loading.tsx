import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export const CircleLoading = ({ 
  size = 50, 
  color = '#3498db', 
  strokeWidth = 4, 
  duration = 1000,
  style 
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      }).start(() => startAnimation());
    };

    startAnimation();
  }, [spinValue, duration]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: 'transparent',
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </View>
  );
};

// Alternative SVG-based version (requires react-native-svg)
export const CircleLoadingSVG = ({ 
  size = 50, 
  color = '#3498db', 
  strokeWidth = 4, 
  duration = 1000,
  style 
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      }).start(() => startAnimation());
    };

    startAnimation();
  }, [spinValue, duration]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size, transform: [{ rotate: spin }] },
        style,
      ]}
    >
      {/* For SVG version, you would need to install react-native-svg */}
      {/* 
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${Math.PI * (size - strokeWidth) * 0.7} ${Math.PI * (size - strokeWidth) * 0.3}`}
          fill="transparent"
          strokeLinecap="round"
        />
      </Svg>
      */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: 'transparent',
            borderTopColor: color,
            borderRightColor: color,
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    borderStyle: 'solid',
  },
});

export default CircleLoading;

// Usage examples:
/*
import CircleLoading from './CircleLoading';

// Basic usage
<CircleLoading />

// Custom size and color
<CircleLoading size={80} color="#e74c3c" />

// Custom stroke width and duration
<CircleLoading 
  size={60} 
  color="#2ecc71" 
  strokeWidth={6} 
  duration={1500}
/>

// With custom styling
<CircleLoading 
  size={40} 
  color="#9b59b6" 
  style={{ marginVertical: 20 }}
/>
*/