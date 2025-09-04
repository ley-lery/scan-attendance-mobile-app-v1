import { Button } from "@/components/ui/button/Button";
import { BlurCard } from "@/components/ui/card/BlurCard";
import { MotiView } from "moti";
import React from "react";
import { Dimensions, Modal, Platform, ScrollView, View } from "react-native";

interface NotificationProps {
  children?: React.ReactNode;
  visible: boolean;
  onClose?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Notification: React.FC<NotificationProps> = ({
  visible,
  children,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", duration: 250 }}
        className="flex-1 items-center"
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      >

        <MotiView
          from={{ scale: 0.95, opacity: 0, translateY: -40 }}
          animate={{ scale: 1, opacity: 1, translateY: 0 }}
          exit={{ scale: 0.95, opacity: 0, translateY: -40 }}
          transition={{ type: "spring", damping: 18, stiffness: 200 }}
          className="w-full max-w-xl rounded-lg shadow-2xl px-4 pt-6"
        >
          <BlurCard
            tint="light"
            radius="lg"
            classNames={{ wrapper: "w-full", blur: Platform.OS === 'ios' ? Platform.Version > '16' ? 'pt-20' : 'pt-6' : 'pt-10' }}
          >
            <ScrollView 
              className="w-full"
              style={{ maxHeight: 200 }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {children}
            </ScrollView>
            <View className="mt-4 flex-row gap-2">
              <Button label="Close" onPress={onClose} color="primary" size="sm" className="flex-1" radius="full"/>
              <Button label="Clear All" onPress={onClose} color="primary" size="sm" className="flex-1" variant="flat" radius="full"/>
            </View>
          </BlurCard>
        </MotiView>
      </MotiView>
    </Modal>
  );
};
