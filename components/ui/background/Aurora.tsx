import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export  function AuroraBackground() {
  return (
    <View style={styles.container}>
      {/* Linear Gradient Background */}
      <LinearGradient
        colors={['#f7eaff', '#fde2ea']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Radial Gradients */}
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="grad1"
            cx="5%"
            cy="40%"
            rx="80%"
            ry="60%"
            fx="5%"
            fy="40%"
          >
            <Stop offset="0%" stopColor="rgba(175, 109, 255, 0.48)" />
            <Stop offset="67%" stopColor="transparent" />
          </RadialGradient>

          <RadialGradient
            id="grad2"
            cx="45%"
            cy="45%"
            rx="70%"
            ry="60%"
            fx="45%"
            fy="45%"
          >
            <Stop offset="0%" stopColor="rgba(255, 100, 180, 0.41)" />
            <Stop offset="67%" stopColor="transparent" />
          </RadialGradient>

          <RadialGradient
            id="grad3"
            cx="83%"
            cy="76%"
            rx="62%"
            ry="52%"
            fx="83%"
            fy="76%"
          >
            <Stop offset="0%" stopColor="rgba(255, 235, 170, 0.44)" />
            <Stop offset="63%" stopColor="transparent" />
          </RadialGradient>

          <RadialGradient
            id="grad4"
            cx="75%"
            cy="20%"
            rx="60%"
            ry="48%"
            fx="75%"
            fy="20%"
          >
            <Stop offset="0%" stopColor="rgba(120, 190, 255, 0.36)" />
            <Stop offset="66%" stopColor="transparent" />
          </RadialGradient>
        </Defs>

        {/* Overlay Rects with Gradients */}
        <Rect width="100%" height="100%" fill="url(#grad1)" />
        <Rect width="100%" height="100%" fill="url(#grad2)" />
        <Rect width="100%" height="100%" fill="url(#grad3)" />
        <Rect width="100%" height="100%" fill="url(#grad4)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
