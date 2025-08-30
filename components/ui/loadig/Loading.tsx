import { useThemeColor } from '@/utils/theme';
import { useIsFocused } from '@react-navigation/native';
import { MotiView, SafeAreaView } from 'moti';
import type { FC } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text } from 'react-native';

interface LoadingProps {
  isLoading: boolean;
}

export const Loading: FC<LoadingProps> = ({ isLoading }) => {
  const theme = useThemeColor()
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  if (!isLoading) return null; 

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">

      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: isFocused ? 1 : 0,
          scale: isFocused ? 1 : 0.9,
        }}
        transition={{ type: 'timing', duration: 200 }}
        className="flex-1 justify-center items-center gap-1"
      >
        <ActivityIndicator size="small" color={theme === "dark" ? "#fff" : "#a1a1a1"} />
        <Text className="text-zinc-500 dark:text-zinc-300 font-mregular text-base">
          {t('loading')}
        </Text>
      </MotiView>
    </SafeAreaView>
  );
};
