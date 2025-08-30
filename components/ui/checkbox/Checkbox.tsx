import { useThemeStore } from "@/stores/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React, { useState } from "react";
import { Pressable, Text } from "react-native";

interface CheckboxProps {
  label?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  size?: "sm" | "md" | "lg";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  value?: boolean;
  isDisabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  onChange,
  color = "primary",
  radius = "md",
  size = "md",
  value,
  isDisabled = false,
}) => {
  const theme = useThemeStore((state) => state.theme)
  const [checked, setChecked] = useState(value || false);

  const toggleCheckbox = () => {
    setChecked(!checked);
    onChange?.(!checked);
  };

  // Color mappings for checked state
  const colorMaps: Record<string, { border: string; background: string; }> = {
    default: {
      border: "#9ca3af",
      background: "#9ca3af",
    },
    primary: {
      border: theme === "1" ? "#db2777" : "#008ded",
      background: theme === "1" ? "#db2777" : "#008ded",
    },
    secondary: {
      border: "#7828c8",
      background: "#7828c8",
    },
    success: {
      border: "#17c964",
      background: "#17c964",
    },
    warning: {
      border: "#f5a524",
      background: "#f5a524",
    },
    danger: {
      border: "#f31260",
      background: "#f31260",
    },
  };

  // Tailwind radius classes
  const radiusMaps: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-[6px]",
    md: "rounded-[8px]",
    lg: "rounded-[10px]",
    full: "rounded-full",
  };

  // Tailwind size classes
  const sizeMaps: Record<string, string> = {
    sm: "w-6 h-6",
    md: "w-7 h-7",
    lg: "w-8 h-8",
  };

  return (
    <Pressable onPress={isDisabled ? undefined : toggleCheckbox} className="flex-row items-center gap-1.5">
      <MotiView
        className={`${sizeMaps[size]} ${radiusMaps[radius]} border justify-center items-center ${isDisabled ? "opacity-50 cursor-auto pointer-events-none select-none" : ""}`}
        animate={{
          backgroundColor: checked ? colorMaps[color].background : "transparent",
          borderColor: checked ? colorMaps[color].border : "#71717a",
        }}
        transition={{ type: "timing", duration: 300 }}
      >
        {checked && (
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            <Ionicons name="checkmark" size={size === "sm" ? 12 : size === "lg" ? 20 : 16} color="white" />
          </MotiView>
        )}
      </MotiView>
      {label && <Text className={isDisabled ? "text-zinc-400 opacity-50 cursor-auto pointer-events-none select-none" : "text-zinc-400"}>{label}</Text>}
    </Pressable>
  );
};
