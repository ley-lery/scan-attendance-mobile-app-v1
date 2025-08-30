import { useThemeStore } from '@/stores/useThemeStore';
import React, { JSX, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type TabButtonProps = {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  tabInterface: Record<string, (props: { color: string; size: number; focused: boolean }) => JSX.Element>;
  routeName: string;
  color: string;
  label: string;
  width: number;
  height: number;
};

const TabButton: React.FC<TabButtonProps> = ({
  onPress,
  onLongPress,
  isFocused,
  tabInterface,
  routeName,
  color,
  label,
  width,
  height,
}) => {
  const { t } = useTranslation();
  const scale = useSharedValue(isFocused ? 1 : 0);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, {
      damping: 12,
      stiffness: 120,
    });
  }, [isFocused, scale]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const top = interpolate(scale.value, [0, 1], [9, 0]);
    const scaleVal = interpolate(scale.value, [0, 1], [1, 1]);
    return {
      transform: [{ scale: scaleVal }],
      top,
      position: 'relative',
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [0.7, 1]); // keep visible
    const scaleText = interpolate(scale.value, [0, 1], [1, 1.1]); // optional scaling
    return {
      opacity,
      transform: [{ scale: scaleText }],
    };
  });
  

  const IconComponent = tabInterface[routeName];

  if (!IconComponent) return null;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="items-center justify-center"
      style={{
        width,
        flex: 1,
      }}
    >
      <Animated.View style={animatedIconStyle}>
        {IconComponent({ color: isFocused ? theme === "1" ? '#F31260' : '#006FEE' : '#999', size: 24, focused: isFocused })}
      </Animated.View>

        <Animated.Text
          style={[
            {
              color: isFocused ? theme === "1" ? '#F31260' : '#006FEE' : '#999',
              fontSize: 12,
              marginTop: 10,
              height: 14, 
            } as TextStyle,
            animatedTextStyle,
          ]}
        >
          {t(label)}
        </Animated.Text>
    </Pressable>
  );
};

export default TabButton;
