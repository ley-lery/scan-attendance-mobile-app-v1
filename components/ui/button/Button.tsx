import { useThemeStore } from '@/stores/useThemeStore';
import { useThemeColor } from '@/utils/theme';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  children?: React.ReactNode;
  label?: string;
  onPress?: () => void;
  className?: string;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  size?: "sm" | "md" | "lg";
  color?: "foreground" | "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "shadow";
  variant?: "solid" | "flat" | "light" | "bordered";
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isLoading?: boolean;
  isIconOnly?: boolean;
}


const radiusMaps: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const sizeMaps: Record<string, {size: string, text: string}> = {
  sm: {
    size: "py-2 px-4 max-h-10 min-h-10 items-center justify-center",
    text: "text-sm"
  },
  md: {
    size: "py-3 px-6 max-h-[45px] min-h-[45px] items-center justify-center",
    text: "text-base"
  },
  lg: {
    size: "py-4 px-8 max-h-[50px] min-h-[50px] items-center justify-center",
    text: "text-lg"
  },
};

export const Button = ({
  children,
  label,
  onPress,
  className = "",
  radius = "md",
  size = "md",
  color = "default",
  startContent,
  endContent,
  isLoading = false,
  variant = "solid",
  isIconOnly = false,
}: Props) => {
  const theme = useThemeStore((state) => state.theme);
  const themeColor = useThemeColor();
  const disabledClass =
  isLoading || !onPress
  ? "opacity-50 pointer-events-none select-none"
  : "";
  
  const variantMaps: Record<string, Record<string, {bg: string, text: string}>> = {
    solid: {
      foreground: {
        bg: "bg-black",
        text: "text-white",
      },
      default: {
        bg: "bg-default",
        text: "text-white",
      },
      primary: {
        bg: theme === "1" ? "bg-theme1-primary" : "bg-theme2-primary",
        text: "text-white",
      },
      secondary: {
        bg: "bg-secondary",
        text: "text-white",
      },
      success: {
        bg: "bg-success",
        text: "text-white",
      },
      warning: {
        bg: "bg-warning",
        text: "text-white",
      },
      danger: {
        bg: "bg-danger",
        text: "text-white",
      },
    },
    flat: {
      foreground: {
        bg: "bg-black/20",
        text: "text-white",
      },
      default: {
        bg: "bg-default/20",
        text: "text-default",
      },
      primary: {
        bg: theme === "1" ? "bg-theme1-primary/20" : "bg-theme2-primary/20",
        text: theme === "1" ? "text-theme1-primary" : "text-theme2-primary",
      },
      secondary: {
        bg: "bg-secondary/20",
        text: "text-secondary",
      },
      success: {
        bg: "bg-success/20",
        text: "text-success",
      },
      warning: {
        bg: "bg-warning/20",
        text: "text-warning",
      },
      danger: {
        bg: "bg-danger/20",
        text: "text-danger",
      },
    },
    light: {
      foreground: {
        bg: "bg-transparent",
        text: "text-white",
      },
      default: {
        bg: "bg-transparent",
        text: "text-default",
      },
      primary: {
        bg: "bg-transparent",
        text: theme === "1" ? "text-theme1-primary" : "text-theme2-primary",
      },
      secondary: {
        bg: "bg-transparent",
        text: "text-secondary",
      },
      success: {
        bg: "bg-transparent",
        text: "text-success",
      },
      warning: {
        bg: "bg-transparent",
        text: "text-warning",
      },
      danger: {
        bg: "bg-transparent",
        text: "text-danger",
      },
    },
    bordered: {
      foreground: {
        bg: "bg-transparent",
        text: "text-white",
      },
      default: {
        bg: "bg-transparent",
        text: "text-default",
      },
      primary: {
        bg: "bg-transparent",
        text: theme === "1" ? "text-theme1-primary" : "text-theme2-primary",
      },
      secondary: {
        bg: "bg-transparent",
        text: "text-secondary",
      },
      success: {
        bg: "bg-transparent",
        text: "text-success",
      },
      warning: {
        bg: "bg-transparent",
        text: "text-warning",
      },
      danger: {
        bg: "bg-transparent",
        text: "text-danger",
      },
    },
  };
  const variantClass = variantMaps[variant]?.[color] || variantMaps.solid.default;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || !onPress}
      className={`overflow-hidden ${radiusMaps[radius]} ${variantClass.bg} ${sizeMaps[size].size} ${className} ${disabledClass}`}
    >
      <View className="flex-row justify-center items-center gap-2 ">
        {isLoading ? (
          <ActivityIndicator size="small" color={themeColor === 'dark' ? '#fff' : '#a1a1aa'} />
        ) : (
          startContent
        )}
        {!label && children}
        {!isIconOnly && !children && label && (
          <Text className={
            [
              variantClass.text,
              "text-center",
              sizeMaps[size].text
            ].join(" ")
          }>
            {label}
          </Text>
        )}
        {endContent}
      </View>
    </TouchableOpacity>
  );
};
