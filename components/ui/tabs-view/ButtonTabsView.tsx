import { useThemeStore } from '@/stores/useThemeStore';
import { MotiView } from 'moti';
import React, { ReactNode, useEffect, useState } from 'react';
import { LayoutChangeEvent, Text, TouchableOpacity, View } from 'react-native';

interface TabsViewProps {
  tabs: { key: string; label?: ReactNode }[];
  value?: string;
  onChange?: (value: string) => void;
}

export const ButtonTabsView = ({ tabs, value, onChange }: TabsViewProps) => {
  const theme = useThemeStore((state) => state.theme);
  const [activeTab, setActiveTab] = useState(value || tabs[0]?.key);
  const [containerWidth, setContainerWidth] = useState(0);

  // Keep activeTab synced with parent value
  useEffect(() => {
    if (value) setActiveTab(value);
  }, [value]);

  const getTabIndex = (tabKey: string) =>
    tabs.findIndex((tab) => tab.key === tabKey);

  const activeIndex = getTabIndex(activeTab);
  const tabWidth = containerWidth / tabs.length;

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      className="flex-row bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 relative"
      onLayout={handleLayout}
    >
      {containerWidth > 0 && (
        <MotiView
          className={[
            'absolute top-1 bottom-1 rounded-xl z-0',
            theme === '1' ? 'bg-theme1-primary' : 'bg-theme2-primary',
          ].join(' ')}
          animate={{
            translateX: activeIndex * tabWidth,
            width: tabWidth,
          }}
          style={{ left: 0 }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 300,
            mass: 0.8,
          }}
        />
      )}

      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <View key={tab.key} className="flex-1">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setActiveTab(tab.key);
                onChange?.(tab.key);
              }}
              className="flex-1 z-10"
            >
              <View className="rounded-lg py-2 items-center justify-center">
                <MotiView
                  animate={{ scale: isActive ? 1 : 0.95 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                >
                  <Text
                    className={`font-semibold text-base ${
                      isActive
                        ? 'text-white'
                        : 'text-zinc-700 dark:text-zinc-200'
                    }`}
                  >
                    {tab.label}
                  </Text>
                </MotiView>
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};
