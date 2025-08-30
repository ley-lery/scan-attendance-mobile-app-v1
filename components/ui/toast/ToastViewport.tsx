// ToastViewport.tsx
import { ToastInternal, ToastPosition } from "@/types/toast.types";
import React from "react";
import { View } from "react-native";
import { ToastItem } from "./ToastItem";

export const ToastViewport: React.FC<{
  toasts: ToastInternal[];
  position: ToastPosition;
  onDismiss: (id: string) => void;
}> = ({ toasts, position, onDismiss }) => {
  return (
    <View
      pointerEvents="box-none"
      className={[
        "absolute left-0 right-0 px-4",
        position === "top" ? "top-7" : "bottom-4",
      ].join(" ")}
      style={{ zIndex: 9999 }}
    >
      <View className={["w-full items-center gap-2"].join(" ")}>
        {toasts.map((t, i) => (
          <ToastItem
            key={t.id}
            toast={t}
            onClose={() => onDismiss(t.id)}
          />
        ))}
      </View>
    </View>
  );
};
