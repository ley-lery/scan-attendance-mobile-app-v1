import { MotiText, MotiView } from 'moti'
import React from 'react'
import { View } from 'react-native'
import { Circle, Defs, LinearGradient, Stop, Svg } from 'react-native-svg'

const SplashScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-gradient-to-b from-blue-900 to-blue-600 dark:from-zinc-900 dark:to-zinc-800">
      {/* Animated Logo */}
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 900,
        }}
        className="mb-8"
      >
        <Svg height={120} width={120} viewBox="0 0 120 120">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="120" y2="120">
              <Stop offset="0" stopColor="#2563eb" stopOpacity="1" />
              <Stop offset="1" stopColor="#38bdf8" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Circle
            cx="60"
            cy="60"
            r="50"
            fill="url(#grad)"
            stroke="#fff"
            strokeWidth={4}
          />
          {/* You can add more SVG elements here for a custom logo */}
        </Svg>
      </MotiView>
      {/* Animated App Name */}
      <MotiText
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 700,
          delay: 400,
        }}
        className="text-3xl font-extrabold text-white tracking-wide"
      >
        MySchool
      </MotiText>
      {/* Animated Tagline */}
      <MotiText
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 600,
          delay: 900,
        }}
        className="text-base text-blue-100 dark:text-zinc-300 mt-2"
      >
        Smart Attendance &amp; Learning
      </MotiText>
    </View>
  )
}

export default SplashScreen