import { MotiView } from 'moti';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  transparent?: boolean;
  animation?: {
    type?: 'timing' | 'spring';
    delay?: number;
    duration?: number;
    isFocused?: boolean;
  };
  className?: string; 
  classNames?:{
    wrapper?: string;
    content?: string;
  }
  style?: StyleProp<ViewStyle>;
  isShadow?: boolean;
}

const radiusMap: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

export const Card = ({
  children,
  radius = 'md',
  transparent = false,
  animation = { type: 'timing', delay: 0, duration: 200, isFocused: true},
  classNames,
  style,
  isShadow = false
}: Props) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: animation?.isFocused ? 1 : 0, scale: animation?.isFocused ? 1 : 0.9 }}
      transition={{
        type: animation?.type,
        duration: animation?.duration,
        delay: animation?.delay,
      }}
    >
      <View 
        className={[
          'p-4 ',
          transparent ? 'bg-transparent ' : 'bg-white dark:bg-black ',
          isShadow && "shadow-lg shadow-white dark:shadow-black",
          radiusMap[radius],
          classNames?.wrapper,
        ].join(' ')
        }
        style={[
          
          style
        ]}
      >
        <View className={classNames?.content} >{children}</View>
      </View>
    </MotiView>
  );
};

