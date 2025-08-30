import { LecturerTabs, StudentTabs } from '@/constants/IconTab';
import { MaterialIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import TabButton from './TabButton';

type TabBarProps = BottomTabBarProps & { tab: 'student' | 'lecturer' };

const TabBar = ({ state, descriptors, navigation, tab }: TabBarProps) => {
  const { colors } = useTheme();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const buttonWidth = dimensions.width / state.routes.length;
  const scanIndex = Math.floor(state.routes.length / 2);
  const tabPositionX = useSharedValue(0);

  const onTabbarLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
    tabPositionX.value = withSpring(state.index * (width / state.routes.length));
  };

  useEffect(() => {
    if (dimensions.width > 0) {
      tabPositionX.value = withSpring(state.index * buttonWidth, {
        damping: 15,
        stiffness: 120,
      });
    }
  }, [state.index, buttonWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <BlurView intensity={50} tint="default" className="absolute bottom-0  h-[5rem] left-0 right-0" >
      <View
        onLayout={onTabbarLayout}
        className="flex-row items-center justify-between"
      >
        {dimensions.width > 0 && (
          <Animated.View
            style={[
              {
                width: buttonWidth - 20,
                height: dimensions.height - 40,
                backgroundColor: '#f43f5e',
              },
              animatedStyle,
            ]}
            className="absolute left-4 top-0 rounded-b-full"
          />
        )}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key] || {};
          const label = options?.tabBarLabel ?? options?.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            if (dimensions.width > 0) {
              tabPositionX.value = withSpring(index * buttonWidth, {
                damping: 15,
                stiffness: 120,
              });
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const styles = StyleSheet.create({
            tabBar: {
              width: 60,
              height: 60,
              borderRadius: 20,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 4,
              borderColor: 'transparent',
            }
          });

          // Center QR Button
          if ((route.name === 'scan' || route.name === 'generate') && index === scanIndex) {
            return (
              <View
                key={route.key}
                style={{ marginTop: -30, width: buttonWidth, alignItems: 'center' }}
              >
                <LinearGradient
                  colors={["#DA4453", "#89216B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[{ width: 64, height: 64, borderRadius: 32 }, styles.tabBar]}
                >
                  <TouchableOpacity
                    onPress={onPress}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 32,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <MaterialIcons name="qr-code" size={32} color="#fff" />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            );
          }

          return (
            <TabButton
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              tabInterface={tab === 'student' ? StudentTabs : LecturerTabs}
              routeName={route.name}
              color={colors.primary || '#000'}
              label={typeof label === 'string' ? label : String(label || '')}
              width={buttonWidth}
              height={dimensions.height - 15}
            />
          );
        })}
      </View>
    </BlurView>
  );
};

export default TabBar;
