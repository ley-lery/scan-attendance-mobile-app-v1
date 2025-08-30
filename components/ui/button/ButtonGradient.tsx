import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type ButtonGradientProps = TouchableOpacityProps & {
  label: string;
  colors?: string[];
  className?: string;
  textClassName?: string;
};

const ButtonGradient: React.FC<ButtonGradientProps> = ({
  label,
  onPress,
  colors = ["#ec4899", "#a21caf"],
  className = "",
  textClassName = "",
  ...props
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    className={`rounded-full overflow-hidden ${className}`}
    {...props}
  >
    <LinearGradient
      colors={colors as any}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      className="w-full  rounded-full items-center justify-center"
      style={{paddingVertical: 12}}
    >
      <Text className={`text-white text-lg font-semibold text-center ${textClassName}`}>
        {label}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default ButtonGradient;
