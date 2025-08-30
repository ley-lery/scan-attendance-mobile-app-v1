import { LecturerTabs, StudentTabs } from '@/constants/IconTab';
import { useThemeStore } from '@/stores/useThemeStore';
import { MaterialIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import TabButton from './TabButton';

type TabBarProps = BottomTabBarProps & { tab: 'student' | 'lecturer' };

const styles = StyleSheet.create({
  tabBarButton: {
    width: 60,
    height: 60,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'transparent',
  },
});

const MemoTabButton = React.memo(TabButton, (prev, next) => prev.isFocused === next.isFocused);


const TabBar = ({ state, descriptors, navigation, tab }: TabBarProps) => {
  const theme = useThemeStore((state) => state.theme);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const buttonWidth = dimensions.width / state.routes.length;
  const scanIndex = Math.floor(state.routes.length / 2);

  const onTabbarLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  }, []);

  const renderTabButton = useCallback((route: any, index: number) => {
    const { options } = descriptors[route.key] || {};
    const label = options?.tabBarLabel ?? options?.title ?? route.name;
    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
    };

    const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });
    

    if ((route.name === 'scan' || route.name === 'generate') && index === scanIndex) {
      return (
        <View key={route.key} style={{ marginTop: -30, width: buttonWidth, alignItems: 'center' }}>
          <LinearGradient
            colors={['#000', theme === "1" ? '#F31260' : '#006FEE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[{ width: 64, height: 64, borderRadius: 32, shadowColor: '#000', shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.25, shadowRadius: 3.84 }, styles.tabBarButton]}
          >
            <TouchableOpacity onPress={onPress} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialIcons name="qr-code" size={32} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      );
    }

    return (
      <MemoTabButton
        key={route.key}
        onPress={onPress}
        onLongPress={onLongPress}
        isFocused={isFocused}
        tabInterface={tab === 'student' ? StudentTabs : LecturerTabs}
        routeName={route.name}
        color={theme === "1" ? '#F31260' : '#006FEE'}
        label={typeof label === 'string' ? label : String(label || '')}
        width={buttonWidth}
        height={dimensions.height - 15}
      />
    );
  }, [state.index, dimensions.width, dimensions.height, descriptors, navigation, tab]);

  return (
    <BlurView intensity={100} tint="default" className="absolute bottom-0 left-0 right-0 h-[5rem]">
      <View onLayout={onTabbarLayout} className="flex-row items-center justify-between mt-2">
        {state.routes.map(renderTabButton)}
      </View>
    </BlurView>
  );
};

export default TabBar;