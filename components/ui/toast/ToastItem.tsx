// ToastItem.tsx
import { Text } from "@/components/tag/Text";
import { BlurCard } from "@/components/ui/card/BlurCard";
import { CircleLoading } from "@/components/ui/loadig/CircleLoading";
import { ToastInternal } from "@/types/toast.types";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React from "react";
import { Pressable, useColorScheme, View } from "react-native";

const typeStyles: Record<
  ToastInternal["type"],
  { container: string; icon: keyof typeof Ionicons.glyphMap, color: string }
> = {
  success: { container: "bg-emerald-600/90 border-emerald-400", icon: "checkmark-circle-outline", color: "#17c964" },
  error: { container: "bg-red-600/90 border-red-400", icon: "close-circle-outline", color: "#f31260" },
  warning: { container: "bg-amber-600/90 border-amber-400", icon: "warning-outline", color: "#f5a524" },
};

export const ToastItem: React.FC<{ toast: ToastInternal; onClose: () => void; }> = ({ toast, onClose }) => {
   const colorScheme = useColorScheme();
  const { title, message, type, animationIcon = true } = toast;
  const stylePreset = typeStyles[type];
  return (
    <MotiView
      from={{ opacity: 0, translateY: -22, scale: 0.95 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      exit={{ opacity: 0, translateY: -22, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      style={{ zIndex: 9999, flex: 1 }}
    >
      <BlurCard intensity={colorScheme === 'dark' ? 50 : 100} tint={colorScheme === 'dark' ? 'light' : 'dark'} radius="xl" className="w-[28rem] p-0">
        <View
          className={["p-0 flex-row items-start gap-4"].join(" ")}
        >
          <View className="bg-white dark:bg-black shadow shadow-transparent dark:shadow-black/50 rounded-sm p-1 items-center justify-center">
              {animationIcon ? <CircleLoading size={40} isSuccess={type === 'success'} isFailed={type === 'error'} isLoading={type === 'warning'} /> : <Ionicons name={stylePreset.icon} size={23} color={stylePreset.color} />}
          </View>

          <View className="flex-1 gap-1">
            {!!title && <Text className="text-white font-semibold text-lg" >{title}</Text>}
            {!!message && <Text className="text-white/70 text-sm ">{message}</Text>}
          </View>

          <Pressable
            onPress={onClose}
            hitSlop={10}
            className="p-1 rounded-full active:opacity-80"
          >
            <Ionicons name="close" size={18} color="#d4d4d8" />
          </Pressable>
        </View>
      </BlurCard>
    </MotiView>
  );
};
