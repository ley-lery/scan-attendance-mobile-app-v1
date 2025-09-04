import { BlurView } from "expo-blur";
import React from "react";
import { Platform, View } from "react-native";

interface Props {
  children: React.ReactNode;
  className?: string;
  classNames?: {
    wrapper?: string;
    blur?: string;
    content?: string;
  };
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  intensity?: number;
  tint?: "light" | "dark" | "default";
  placementRadius?: "all" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  style?: any;
}

export const BlurCard = ({
  children,
  className,
  classNames,
  radius = "md",
  intensity = 50,
  tint = "default",
  placementRadius = "all",
  style,
}: Props) => {

  const placementRadiusMap: Record<NonNullable<Props["placementRadius"]>, string> = {
    all: `rounded-${radius}`,
    "top-left": `rounded-tl-${radius}`,
    "top-right": `rounded-tr-${radius}`,
    "bottom-left": `rounded-bl-${radius}`,
    "bottom-right": `rounded-br-${radius}`,
  };
  return (
    <View
      className={[
        "overflow-hidden ",
        Platform.OS === 'ios' ? 'dark:bg-black/30' : 'bg-zinc-50 dark:bg-zinc-900',
        placementRadiusMap[placementRadius],
        classNames?.wrapper,
      ].join(" ")}
      style={style}
    >
      <BlurView intensity={intensity} tint={tint} className={`${classNames?.blur || ""} p-4 ${className || ""}`}>
        <View className={`${classNames?.content || ""}`}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};
