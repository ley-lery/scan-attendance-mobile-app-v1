import { MotiView } from 'moti';
import React from 'react';
import { SafeAreaView as SafeAreaViewNative, ViewStyle } from 'react-native';

interface SafeAreaViewProps {
  children: React.ReactNode;
  isFocused?: boolean;
  className?: string;
  style?: ViewStyle;
  delay?: number;
}

export const SafeAreaView = ({
  children,
  isFocused = true,
  className,
  style,
  delay = 400,
}: SafeAreaViewProps) => {
  return (
    <SafeAreaViewNative className={[className].join(' ')} style={style}>
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isFocused ? 1 : 0,
          scale: isFocused ? 1 : 0.95,
        }}
        transition={{
          type: 'spring',
          delay,
          stiffness: 300,
          damping: 12,
        }}
        className="flex-1"
      >
        {children}
      </MotiView>
    </SafeAreaViewNative>
  );
};
