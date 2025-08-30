import React from "react";
import { Pressable, Text, View } from "react-native";

type BadgeVariant = "solid" | "soft" | "outline";
type BadgeColor = "primary" | "success" | "danger" | "warning" | "info" | "zinc";
type BadgeSize = "sm" | "md" | "lg";
type BadgeRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface BadgeProps {
  children?: React.ReactNode;
  /**
   * Visual style
   */
  variant?: BadgeVariant;
  /**
   * Color palette token
   */
  color?: BadgeColor;
  /**
   * Size (padding + font size)
   */
  size?: BadgeSize;
  /**
   * Corner radius
   */
  radius?: BadgeRadius;
  /**
   * Optional leading content (icon/avatar)
   */
  startContent?: React.ReactNode;
  /**
   * Optional trailing content (icon)
   */
  endContent?: React.ReactNode;
  /**
   * Show a small dot at the start
   */
  dot?: boolean;
  /**
   * Makes badge pressable
   */
  onPress?: () => void;
  /**
   * Show an “×” button; you can also pass onClose to handle press
   */
  closable?: boolean;
  onClose?: () => void;
  /**
   * Extra classes (NativeWind)
   */
  className?: string;
  /**
   * Disable interactions (only affects Pressable state)
   */
  disabled?: boolean;
  /**
   * Accessibility label override
   */
  accessibilityLabel?: string;
  /**
   * Optional content (number)
   */
  content?: React.ReactNode;
}

/**
 * Tailwind/NativeWind class maps
 * NOTE: These assume you have color tokens like `bg-primary`, `text-primary`, etc.
 * If you use different tokens (e.g. `bg-blue-600`), swap the strings below accordingly.
 */
const radiusMap: Record<BadgeRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

const sizeMap: Record<BadgeSize, { container: string; text: string; gap: string; icon: number }> = {
  sm: { container: "px-2 py-0.5", text: "text-xs", gap: "gap-1.5", icon: 12 },
  md: { container: "px-2.5 py-1", text: "text-sm", gap: "gap-2", icon: 14 },
  lg: { container: "px-3 py-1.5", text: "text-base", gap: "gap-2", icon: 16 },
};

// per-color classes for each variant (explicit to play nicely with NativeWind)
const colorClasses: Record<
  BadgeVariant,
  Record<
    BadgeColor,
    { container: string; text: string; border?: string; dot: string }
  >
> = {
  solid: {
    primary: { container: "bg-primary", text: "text-white", border: "border-transparent", dot: "bg-white" },
    success: { container: "bg-emerald-600", text: "text-white", border: "border-transparent", dot: "bg-white" },
    danger:  { container: "bg-danger-600", text: "text-white", border: "border-transparent", dot: "bg-white" },
    warning: { container: "bg-amber-600", text: "text-white", border: "border-transparent", dot: "bg-white" },
    info:    { container: "bg-blue-600", text: "text-white", border: "border-transparent", dot: "bg-white" },
    zinc:    { container: "bg-zinc-700", text: "text-white", border: "border-transparent", dot: "bg-white" },
  },
  soft: {
    primary: { container: "bg-primary/15", text: "text-primary", border: "border-primary/20", dot: "bg-primary" },
    success: { container: "bg-emerald-500/15", text: "text-emerald-500", border: "border-emerald-500/20", dot: "bg-emerald-500" },
    danger:  { container: "bg-danger-500/15", text: "text-danger-500", border: "border-danger-500/20", dot: "bg-danger-500" },
    warning: { container: "bg-amber-500/15", text: "text-amber-600", border: "border-amber-500/20", dot: "bg-amber-500" },
    info:    { container: "bg-blue-500/15", text: "text-blue-500", border: "border-blue-500/20", dot: "bg-blue-500" },
    zinc:    { container: "bg-zinc-500/15", text: "text-zinc-300", border: "border-zinc-500/20", dot: "bg-zinc-400" },
  },
  outline: {
    primary: { container: "bg-transparent", text: "text-primary", border: "border border-primary/60", dot: "bg-primary" },
    success: { container: "bg-transparent", text: "text-emerald-500", border: "border border-emerald-500/60", dot: "bg-emerald-500" },
    danger:  { container: "bg-transparent", text: "text-danger-500", border: "border border-danger-500/60", dot: "bg-danger-500" },
    warning: { container: "bg-transparent", text: "text-amber-600", border: "border border-amber-600/60", dot: "bg-amber-600" },
    info:    { container: "bg-transparent", text: "text-blue-500", border: "border border-blue-500/60", dot: "bg-blue-500" },
    zinc:    { container: "bg-transparent", text: "text-zinc-300", border: "border border-zinc-400/60", dot: "bg-zinc-300" },
  },
};

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = "soft",
    color = "zinc",
    size = "md",
    radius = "full",
    startContent,
    endContent,
    dot = false,
    onPress,
    closable = false,
    onClose,
    className = "",
    disabled = false,
    accessibilityLabel,
    content, // number or string
  }) => {
    const s = sizeMap[size];
    const palette = colorClasses[variant][color];
    const Container = onPress ? Pressable : View;
    const radiusClass = radiusMap[radius];
  
    return (
      <Container
        accessibilityRole={onPress ? "button" : "text"}
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        disabled={disabled}
        className={[
          "flex-row items-center relative",
          radiusClass,
          s.container,
          s.gap,
          palette.border ?? "",
          className,
        ].join(" ")}
        style={{ opacity: disabled ? 0.6 : 1 }}
      >
        {/* Main icon or content */}
        {children}
  
        {/* Number badge overlay */}
        {content !== undefined && (
          <View className={[
            "absolute -top-1 -right-1 rounded-full px-1 min-w-[16px] h-[16px] items-center justify-center",
            palette.container,
          ].join(" ")}
          >
            <Text className="text-white text-xs font-bold">{content}</Text>
          </View>
        )}
      </Container>
    );
  };
  

export default Badge;
